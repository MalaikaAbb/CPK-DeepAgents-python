import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { type Page } from 'playwright';
import { promptsFor, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { captureConsole, findEntries } from '../core/console-capture';
import { sleep } from '../core/overlays/cursor';
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';
import { markServerLogs } from './error-evidence';
import { evidenceThenIssueNote, glideClick, glideTo, waitForText } from './glide-click';

/**
 * Markdown Rendering -- the published block first, then the HTML it produces.
 *
 * Three passes.
 *
 * 1. The page's own block, nothing added. Its `<CopilotChat>` carries no agent
 *    id, so it asks for `"default"`, which a Deep Agents runtime does not
 *    register, and it throws as soon as `/info` answers. Same defect as
 *    Frontend-Driven Cards, on a second page. The demo prints the thrown
 *    message where the chat was; the take rests on it.
 *
 * 2. The same block plus `agentId="sample_agent"`, which is the only change
 *    the rest of the page needs. A reply containing a link, an `h2` and a
 *    `<reference-chip>` is asked for, and the probe's anchor row is read. That
 *    row is the page's three claims in one string: `class="my-link"` says the
 *    override ran, `rel="noopener noreferrer"` says the hardening survived the
 *    spread, and the absent `data-streamdown` says the override replaced
 *    rather than extended.
 *
 * 3. The baseline tab, no override, same prompt. The anchor row now carries
 *    `data-streamdown="link"` and Streamdown's own classes, which is what pass
 *    2 is missing and the only way to see that it is missing.
 *
 * The `node` row is checked on both: the page's first warning is that spreading
 * `node` writes `node="[object Object]"` into the document, and the published
 * block destructures it out, so the count must be zero. A non-zero count there
 * would mean the page's advice does not work, which is a bigger finding than
 * anything else on the route.
 */

const RELEVANT = /markdown|\/agent\/[^/]+\/run|custom-look-and-feel/;

const ANCHOR = '[data-testid=markdown-anchor]';
const NODE_ATTRS = '[data-testid=markdown-node-attributes]';

export const runMarkdownRenderingAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  rootPath: string,
  ctx: ActionContext,
) => {
  const logs = markServerLogs(rootPath);
  const [first, second] = promptsFor(config);
  const capture = captureConsole(page);

  // Pass 1 -- the published block.
  console.log('   [Markdown] 1/3: the page block, verbatim...');
  await glideClick(page, page.locator('[data-testid=markdown-tab-published]'));
  const thrown = page.locator('[data-testid=markdown-tab-error]');
  let thrownText = '';
  if (await thrown.waitFor({ state: 'visible', timeout: 30_000 }).then(() => true).catch(() => false)) {
    thrownText = ((await thrown.textContent().catch(() => '')) ?? '').trim();
    console.log(`   [Markdown] the published block threw: ${thrownText.slice(0, 120)}`);
    await glideTo(page, thrown, 3500);
  } else {
    ctx.warn(
      'The published block did not throw -- a `default` agent may be registered now. ' +
        'Re-check the finding here and on /generative-ui/frontend-cards.',
    );
  }

  // Pass 2 -- the same block with an agent id.
  console.log('   [Markdown] 2/3: + agentId="sample_agent"...');
  await glideClick(page, page.locator('[data-testid=markdown-tab-components]'));
  await sleep(800);

  const anchor = page.locator(ANCHOR);
  const nodeAttrs = page.locator(NODE_ATTRS);

  let msgCount = await sendPrompt(page, first);
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, msgCount);

  const overridden = await waitForText(anchor, (t) => t.startsWith('<a'), 15_000);
  if (!overridden.startsWith('<a')) {
    ctx.warn('No link rendered in the reply, so none of the three claims could be read off the HTML');
  } else {
    if (!overridden.includes('my-link')) {
      ctx.fail(`The components override did not run: the anchor is "${overridden}"`);
    }
    if (!overridden.includes('noopener noreferrer')) {
      ctx.fail(
        `Link hardening did not survive the override: the page promises target="_blank" ` +
          `rel="noopener noreferrer", the anchor is "${overridden}"`,
      );
    }
    if (overridden.includes('data-streamdown')) {
      ctx.warn(
        'The overridden anchor still carries data-streamdown, which contradicts the page\'s ' +
          '"you are replacing, not extending".',
      );
    }
    await glideTo(page, anchor, 3000);
  }

  const nodeCount = ((await nodeAttrs.textContent().catch(() => '')) ?? '').trim();
  if (nodeCount !== '0') {
    ctx.fail(
      `${nodeCount} element(s) carry a literal node attribute after destructuring it out -- ` +
        "the page's own remedy did not work",
    );
  }
  await glideTo(page, nodeAttrs, 1500);

  // Pass 3 -- the baseline, for the comparison the page describes but cannot show.
  console.log('   [Markdown] 3/3: no override, for comparison...');
  await glideClick(page, page.locator('[data-testid=markdown-tab-none]'));
  await sleep(800);

  msgCount = await sendPrompt(page, second ?? first);
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, msgCount);

  const baseline = await waitForText(anchor, (t) => t.startsWith('<a'), 15_000);
  if (baseline.startsWith('<a') && !baseline.includes('data-streamdown')) {
    ctx.warn(
      'The default anchor carries no data-streamdown either, so the page\'s "your component ' +
        'supplies neither" has nothing to be measured against on this version.',
    );
  }
  await glideTo(page, anchor, 3000);

  // The published block's throw: on the page (the demo's error boundary prints
  // it) or in the console. Either is the defect, observed.
  const consoleThrow = findEntries(capture, DEFAULT_AGENT_MISSING, 1)[0];
  capture.stop();
  const thrownSeen = DEFAULT_AGENT_MISSING.test(thrownText) ? thrownText : consoleThrow?.text ?? '';
  if (thrownText && !DEFAULT_AGENT_MISSING.test(thrownText)) {
    ctx.warn(`The published block threw something else: "${thrownText.slice(0, 160)}"`);
  }

  // The headline example's classes, looked up in every stylesheet the page
  // loaded. None defining them is the impact's "changes nothing a reader can
  // see", observed rather than asserted.
  const undefinedClasses = await classesWithNoRule(page, ['my-link', 'my-heading']);

  if (thrownSeen) {
    ctx.reproduced(
      `published block (no agent id) threw: ${thrownSeen.split(' Known agents')[0].slice(0, 160)}` +
        (consoleThrow && thrownText ? ' (on the page and in the console)' : thrownText ? ' (on the page)' : ' (console only)'),
    );
  }

  // NOT observable from a take: that no block carries "use client". That is a
  // fact about the doc's source; the demo has to add it to compile at all.
  await evidenceThenIssueNote(page, config, logs, RELEVANT, {
    note: () =>
      noteFor({
        thrown: thrownSeen,
        overridden,
        nodeCount,
        baseline,
        undefinedClasses,
        versions: installedVersions(rootPath),
      }),
    writeNote: Boolean(thrownSeen),
    extraLines: () => {
      const lines: string[] = [];
      if (thrownSeen) lines.push(`thrown: ${thrownSeen.split(' Known agents')[0]}`);
      if (overridden.startsWith('<a')) lines.push(`overridden: ${overridden.slice(0, 160)}`);
      if (baseline.startsWith('<a')) lines.push(`default:    ${baseline.slice(0, 160)}`);
      return lines;
    },
  });
};

const DEFAULT_AGENT_MISSING = /Agent 'default' not found/;

/** Of `classes`, those no CSS rule in any readable stylesheet selects. */
async function classesWithNoRule(page: Page, classes: string[]): Promise<string[]> {
  // tsx's keepNames wraps the named `walk` below in `__name(...)`, which the
  // page does not define (see take.ts).
  await page.evaluate('window.__name = window.__name || function (f) { return f; }').catch(() => {});
  return page
    .evaluate((names) => {
      const found = new Set<string>();
      const walk = (rules: CSSRuleList) => {
        for (const rule of Array.from(rules)) {
          const sel = (rule as CSSStyleRule).selectorText;
          if (sel) for (const n of names) if (sel.includes(`.${n}`)) found.add(n);
          const inner = (rule as CSSGroupingRule).cssRules;
          if (inner) walk(inner);
        }
      };
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          walk(sheet.cssRules);
        } catch {
          // cross-origin sheet: unreadable, and not the page's own CSS
        }
      }
      return names.filter((n) => !found.has(n));
    }, classes)
    .catch(() => []);
}

/** "react-core 1.73.3, streamdown 1.6.11", read from what this run installed. */
function installedVersions(rootPath: string): string {
  const read = (pkg: string) => {
    try {
      const file = join(rootPath, 'frontend', 'node_modules', ...pkg.split('/'), 'package.json');
      return (JSON.parse(readFileSync(file, 'utf8')) as { version?: string }).version ?? '?';
    } catch {
      return '?';
    }
  };
  return `react-core ${read('@copilotkit/react-core')}, streamdown ${read('streamdown')}`;
}

/** The note, one block per thing this take showed. Written only when the throw was seen. */
function noteFor(s: {
  thrown: string;
  overridden: string;
  nodeCount: string;
  baseline: string;
  undefinedClasses: string[];
  versions: string;
}): string {
  const lines = [
    'markdown rendering - published blocks crash the route',
    '',
    'tab 1 = the page block exactly, no agent id',
    "so CopilotChat asks for 'default'. deep agents registers sample_agent, no default",
    `-> ${s.thrown.split(' Known agents')[0].slice(0, 120)}`,
  ];
  if (s.overridden.startsWith('<a')) {
    lines.push('', 'tab 2 = same + agentId="sample_agent":', `anchor: ${s.overridden.slice(0, 140)}`);
    if (s.nodeCount === '0') lines.push('node attribute count 0, so "drop node" works');
  }
  if (s.baseline.startsWith('<a')) lines.push(`tab 3 (no override): ${s.baseline.slice(0, 140)}`);
  if (s.undefinedClasses.length > 0) {
    lines.push(
      '',
      `no stylesheet on the page defines ${s.undefinedClasses.map((c) => `.${c}`).join(' / ')}`,
      'so the headline example is a no-op visually',
    );
  }
  lines.push('and no block has "use client", which app router needs for these', '', `installed ${s.versions}`);
  return lines.join('\n');
}
