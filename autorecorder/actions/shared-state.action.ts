import { type Page } from 'playwright';
import { sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { showWorkingVariant } from '../core/compare';
import { writeIssueNote } from '../core/issue-note';
import { beat, humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';
import { excerpt, latestReplyText, looksSpanish } from './reply-text';

/**
 * The two shared-state defects, each recorded as a pair.
 *
 * Both takes have the same shape, because both findings have the same shape:
 * run the doc's code, show it not working, then run the identical page against
 * a graph carrying `CopilotKitMiddleware(expose_state=["language"])` and show
 * it working. The second half is what turns "this demo is broken" into "this
 * page is missing a line", which is the difference between a bug report someone
 * can act on and one they cannot.
 *
 * The failing route is left exactly as the doc prints it. Nothing here should
 * ever "just fix" it -- it is the evidence.
 */

/**
 * Clicks the language toggle, with the cursor visibly travelling to it.
 *
 * Shared between the two halves of the writing pair on purpose: the fixed route
 * has to be driven the same way the failing one was, or the comparison is
 * between two different experiments.
 */
async function clickLanguageToggle(ctx: ActionContext, page: Page): Promise<void> {
  const toggle = page.locator('button:has-text("Toggle Language")').first();
  if (!(await toggle.isVisible({ timeout: 8000 }).catch(() => false))) {
    ctx.warn(`No "Toggle Language" button found -- the demo page may have changed.`);
    return;
  }

  const box = await toggle.boundingBox();
  if (!box) return;

  await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
  await sleep(400);
  await humanClick(page);
  console.log(`   ✓ Toggled the language.`);
}

/**
 * Clicks the toggle and confirms the label actually ends up reading Spanish.
 *
 * Two separate things made a bare click unreliable. The demo page had drifted
 * from the doc -- its fallback was `"Not set"` where the doc prints `"english"`
 * -- so the first click evaluated `"Not set" === "english"` as false and wrote
 * *english*, leaving the take one click short of Spanish. That is fixed in the
 * page. What cannot be fixed from here is a Turbopack recompile landing
 * mid-take: it remounts the component, `agent.state` comes back empty and the
 * label falls back underneath a click that has already happened.
 *
 * So the click is verified rather than assumed. The whole finding is "the label
 * says Spanish and the agent answers in English" -- if the label is not
 * actually on Spanish when the prompt goes out, an English reply is the honest
 * answer to English state and the clip proves nothing.
 */
async function toggleToSpanish(ctx: ActionContext, page: Page): Promise<boolean> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await clickLanguageToggle(ctx, page);
    await beat(900);

    const text =
      (await page
        .locator('p:has-text("Language:")')
        .first()
        .textContent()
        .catch(() => null)) ?? '';

    if (/spanish/i.test(text)) {
      if (attempt > 1) console.log(`   ✓ Label reads spanish after ${attempt} clicks.`);
      return true;
    }

    ctx.warn(`Click ${attempt} left the label on "${text.trim() || 'unknown'}", not spanish.` +
        ` Most likely a recompile reset the state; clicking again.`,
    );
  }

  // Not thrown. A take that reaches the chat on the wrong language is a weak
  // clip, not a broken recorder, and the run should still produce it and say so.
  ctx.warn(`Could not get the label onto spanish in 3 clicks. The reply language in` +
      ` this take proves nothing -- re-record before using it as evidence.`,
  );
  return false;
}

/**
 * The left panel as the app shows it: the `Language:` label's value and the
 * raw `agent.state` JSON under it. Scoped to the panel, because a reply can
 * carry its own `<pre>` code block.
 */
async function readLanguagePanel(
  page: Page,
): Promise<{ label: string; state: Record<string, unknown> | null; raw: string } | null> {
  return page
    .evaluate(() => {
      const p = Array.from(document.querySelectorAll('p')).find((el) =>
        (el.textContent ?? '').trim().startsWith('Language:'),
      );
      if (!p) return null;
      const label = (p.querySelector('strong')?.textContent ?? '').trim();
      const raw = (p.parentElement?.querySelector('pre')?.textContent ?? '').trim();
      let state: Record<string, unknown> | null = null;
      try {
        state = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
      } catch {
        state = null;
      }
      return { label, state, raw };
    })
    .catch(() => null);
}

/** Rests the cursor on an element and pauses, if it is there at all. */
async function restOn(
  page: Page,
  selector: string,
  dwellMs = 1500,
  label?: string,
): Promise<boolean> {
  const target = page.locator(selector).first();
  if (!(await target.isVisible({ timeout: 4000 }).catch(() => false))) return false;

  const box = await target.boundingBox();
  if (!box) return false;

  if (label) {
    console.log(`   🎯 ${label} at (${Math.round(box.x)}, ${Math.round(box.y)})`);
  }
  await humanGlide(
    page,
    box.x + Math.min(box.width / 2, 220),
    box.y + Math.min(box.height / 2, 60),
    22,
  );
  await sleep(dwellMs);
  return true;
}

/**
 * Reading agent state: the agent switches language, the app never notices.
 *
 * Order matters. The prompt goes first and the reply is allowed to finish, so
 * that by the time the cursor moves to the left panel the agent has visibly
 * answered in Spanish -- the panel still reading its old value is only damning
 * next to a reply that proves the agent changed.
 */
export const runSharedStateReadAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  _rootPath,
  ctx,
) => {

  const before = await readLanguagePanel(page);

  console.log(`   [Shared State Read] Asking the agent to switch language...`);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });
  await waitForAgentResponseCompletion(page, 2500, msgCount);

  await restOn(page, 'p:has-text("Language:")', 2200, 'Language panel');
  await restOn(page, 'pre', 2600, 'Raw agent.state');

  await sleep(config.waitAfterPromptMs ?? 3000);

  // The finding, read off the page before the working variant navigates away:
  // the reply is in Spanish and the panel is not. Both halves are required --
  // an English reply means the agent never switched, and then an unchanged
  // panel is the honest answer, not the defect.
  const after = await readLanguagePanel(page);
  const reply = await latestReplyText(page);
  const spanishReply = looksSpanish(reply);
  const panelSpanish = /spanish|espa[nñ]ol/i.test(after?.label ?? '');
  console.log(
    `   [Shared State Read] panel "${before?.label ?? '?'}" -> "${after?.label ?? '?'}"; ` +
      `reply Spanish: ${spanishReply} ("${excerpt(reply, 80)}")`,
  );
  let reproduced = false;
  if (!after) {
    ctx.fail('The "Language:" panel is not on the page -- the demo route changed.');
  } else if (!spanishReply) {
    ctx.warn(`The agent did not answer in Spanish ("${excerpt(reply, 90)}"), so this take cannot show the panel lagging behind it.`);
  } else if (!panelSpanish) {
    reproduced = true;
    ctx.reproduced(
      `language panel still "${after.label}" (was "${before?.label ?? '?'}"; agent.state ${excerpt(after.raw.replace(/\s+/g, ' '), 80)}) ` +
        `after the agent replied in Spanish: "${excerpt(reply, 90)}"`,
    );
  } else {
    console.log(`   [Shared State Read] The panel followed the agent to "${after.label}".`);
  }

  await showWorkingVariant(page, {
    route: 'shared-state/in-app-agent-read/fixed',
    prompt: config.prompt,
    proofSelector: 'p:has-text("Language:")',
    waitAfterPromptMs: 3000,
  });
  await restOn(page, 'pre', 2500, 'Raw agent.state on the fixed route');

  if (config.knownIssue && reproduced) {
    await writeIssueNote(page, config.id, config.knownIssue);
  }
};

/**
 * Writing agent state: the toggle flips the label and changes nothing else.
 *
 * The button is clicked before the prompt, not after. `agent.setState` writes
 * locally and the value ships with the *next* run, so a prompt sent first would
 * be a fair run of the old value and would prove nothing.
 */
export const runSharedStateWriteAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  _rootPath,
  ctx,
) => {
  // Let the route finish compiling before anything is clicked. A Turbopack
  // rebuild arriving after the toggle remounts the component and drops the
  // write, which is exactly how a take ends up prompting in English.
  await page.waitForLoadState('networkidle').catch(() => {});
  await beat(1200);

  console.log(`   [Shared State Write] Clicking "Toggle Language"...`);
  await toggleToSpanish(ctx, page);

  // The label and the raw state both flip here. That is the point: the write
  // lands on the frontend, so whatever fails next is not the button.
  await beat(1000);
  await restOn(page, 'p:has-text("Language:")', 1800, 'Language now reads spanish');
  await restOn(page, 'pre', 2000, 'Raw agent.state carries the write');

  const before = await readLanguagePanel(page);

  console.log(`   [Shared State Write] Prompting so the new value ships with a run...`);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });
  await waitForAgentResponseCompletion(page, 2500, msgCount);

  await sleep(config.waitAfterPromptMs ?? 3500);

  // The finding: `language` was set before the run and is gone after it. Read
  // from the raw `agent.state` rather than the label, because the label falls
  // back to "english" when the key is missing and would hide the drop.
  const after = await readLanguagePanel(page);
  const reply = await latestReplyText(page);
  const wasSet = typeof before?.state?.language === 'string' && before.state.language !== '';
  const nowValue = after?.state?.language;
  const emptied = nowValue === undefined || nowValue === null || nowValue === '';
  console.log(
    `   [Shared State Write] language before run: ${JSON.stringify(before?.state?.language)}, ` +
      `after: ${JSON.stringify(nowValue)}; reply Spanish: ${looksSpanish(reply)}`,
  );
  let reproduced = false;
  if (!after) {
    ctx.fail('The "Language:" panel is not on the page -- the demo route changed.');
  } else if (!wasSet) {
    ctx.warn('agent.state carried no language before the run, so the take cannot show the run dropping it.');
  } else if (after.state === null) {
    ctx.warn(`agent.state could not be read after the run ("${excerpt(after.raw, 80)}").`);
  } else if (emptied) {
    reproduced = true;
    ctx.reproduced(
      `language was ${JSON.stringify(before?.state?.language)} before the run and is ` +
        `${nowValue === undefined ? 'missing' : JSON.stringify(nowValue)} from agent.state after it ` +
        `(label "${after.label}"); reply ${looksSpanish(reply) ? 'in Spanish' : 'not in Spanish'}: "${excerpt(reply, 80)}"`,
    );
  } else {
    console.log(`   [Shared State Write] language survived the run as ${JSON.stringify(nowValue)}.`);
  }

  await showWorkingVariant(page, {
    route: 'shared-state/in-app-agent-write/fixed',
    prompt: config.prompt,
    proofSelector: 'button:has-text("Toggle Language")',
    // Driven identically: toggle, then prompt. The fixed graph seeds `language`
    // to english, so without this the reply would be English for an honest
    // reason and the comparison would be worthless.
    beforePrompt: async (p) => {
      await toggleToSpanish(ctx, p);
    },
    waitAfterPromptMs: 1200,
  });

  if (config.knownIssue && reproduced) {
    await writeIssueNote(page, config.id, config.knownIssue);
  }
};
