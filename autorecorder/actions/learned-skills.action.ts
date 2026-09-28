import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { type Page, type Response } from 'playwright';
import { runStandardAction } from '../core/actions';
import { writeIssueNote } from '../core/issue-note';
import { type PageActionHandler } from '../core/types';
import { excerpt, latestReplyText } from './reply-text';

/**
 * Skill delivery -- the prompt, then what the run actually did with it.
 *
 * The page is in SKIP_RECORDING, so today this never films. It exists so that
 * taking the page off that list films the defect rather than a bare prompt,
 * and reports whether the defect was there.
 *
 * What a take can observe:
 *   - the run's own AG-UI event stream: whether the agent ever called
 *     `copilotkit_load_skill` / `copilotkit_read_skill_file`, the two tools the
 *     adapter would register. A reply with neither is the knownIssue's "the
 *     agent answers from its own instructions".
 *   - the backend's installed packages: whether any `copilotkit_intelligence*`
 *     module is present in backend/.venv, i.e. whether an adapter could have
 *     registered those tools at all.
 *
 * What it cannot: the packages being absent from PyPI (404). That is an
 * install-time fact that needs the network, and a take runs against servers
 * that are already up. The demo page prints the `uv pip install` failure as
 * static text; reading that text back would be quoting the harness, not
 * observing anything, so it is deliberately not used as evidence. Nor can it
 * observe the BuiltInAgent compile history (TS2353/TS2339/TS2724 on 1.71.0),
 * which is about a runtime version this repo no longer installs.
 */

const RESERVED_TOOL_CALL = /"toolCallName"\s*:\s*"(copilotkit_load_skill|copilotkit_read_skill_file)"/;

/** Collects the bodies of the runtime's streamed responses during the turn. */
function watchRunStreams(page: Page): { stop: () => Promise<{ read: number; bodies: string[] }> } {
  const pending: Promise<string | null>[] = [];
  const onResponse = (res: Response) => {
    const req = res.request();
    if (req.method() !== 'POST' || !/\/api\/copilotkit/.test(res.url())) return;
    if (!/event-stream/i.test(res.headers()['content-type'] ?? '')) return;
    pending.push(res.text().catch(() => null));
  };
  page.on('response', onResponse);
  return {
    stop: async () => {
      page.off('response', onResponse);
      const settled = await Promise.race([
        Promise.all(pending),
        new Promise<(string | null)[]>((r) => setTimeout(() => r([]), 10_000)),
      ]);
      const bodies = settled.filter((b): b is string => typeof b === 'string');
      return { read: bodies.length, bodies };
    },
  };
}

/** `copilotkit_intelligence*` modules in the backend venv, on Windows or POSIX layouts. */
function installedIntelligencePackages(rootPath: string): string[] | null {
  const venv = join(rootPath, 'backend', '.venv');
  const candidates: string[] = [join(venv, 'Lib', 'site-packages')];
  const lib = join(venv, 'lib');
  if (existsSync(lib)) {
    for (const d of readdirSync(lib)) candidates.push(join(lib, d, 'site-packages'));
  }
  const dirs = candidates.filter((d) => existsSync(d));
  if (dirs.length === 0) return null;
  return dirs.flatMap((d) => readdirSync(d).filter((n) => /^copilotkit[_-]intelligence/i.test(n)));
}

export const runLearnedSkillsAction: PageActionHandler = async (page, config, rootPath, ctx) => {
  const streams = watchRunStreams(page);
  await runStandardAction(page, config, rootPath, ctx);
  const { read, bodies } = await streams.stop();

  const reply = await latestReplyText(page);
  const called = bodies.some((b) => RESERVED_TOOL_CALL.test(b));
  const installed = installedIntelligencePackages(rootPath);

  console.log(
    `   [Learned Skills] run streams read: ${read}; reserved tool called: ${called}; ` +
      `backend copilotkit_intelligence* packages: ${installed === null ? '(no venv found)' : installed.join(', ') || 'none'}`,
  );

  if (called) {
    ctx.warn('The agent called a reserved skill tool -- an adapter is registering them now. Re-check the finding.');
    return;
  }

  const seen: string[] = [];
  if (read > 0) seen.push(`${read} run stream(s) carry no copilotkit_load_skill/read_skill_file call; reply: "${excerpt(reply, 90)}"`);
  if (installed !== null && installed.length === 0) seen.push('no copilotkit_intelligence* package in backend/.venv');

  if (read === 0) {
    ctx.warn('Could not read the run event stream, so whether a reserved skill tool was called is unknown.');
  }
  // Both halves, or nothing: an absent package with an unread stream says the
  // adapter is missing but not that the agent went without it, and a stream
  // with no tool call over an installed adapter would be a different bug.
  if (read > 0 && installed !== null && installed.length === 0) {
    ctx.reproduced(seen.join('; '));
    if (config.knownIssue) {
      await writeIssueNote(page, config.id, config.knownIssue, { extraLines: seen });
    }
  }
};
