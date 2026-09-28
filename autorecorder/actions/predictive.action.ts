import { type Page } from 'playwright';
import { AgentSilentError, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { writeIssueNote } from '../core/issue-note';
import { beat, humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';
import { excerpt, latestReplyText } from './reply-text';

/**
 * Predictive State Updates — three variants, one route.
 *
 * The demo page carries a tab strip (`Prebuilt agent` / `Custom graph · manual`
 * / `Custom graph · tool`) because the doc page documents all three against the
 * same `observed_steps` key. Each take picks its tab and drives it.
 *
 * The prebuilt take used to do one thing more: after its own variant failed it
 * switched to the manual tab and asked the identical question there, so the
 * steps filling in on one tab and staying empty on the other made the absence
 * legible. That contrast is gone -- the prebuilt take now stays on its own tab
 * for the whole clip. Prompting a second variant inside another variant's take
 * put a run of the manual graph into a video filed against the prebuilt one,
 * and the manual graph has a defect of its own; two findings in one clip is
 * worse than a weaker clip. The manual variant is recorded separately and can
 * be watched beside this one.
 */

const TABS = {
  prebuilt: 'Prebuilt agent',
  manual: 'Custom graph · manual',
  tool: 'Custom graph · tool',
} as const;

type VariantKey = keyof typeof TABS;

/** Clicks one of the variant tabs, with the cursor visibly travelling to it. */
async function selectVariant(ctx: ActionContext, page: Page, key: VariantKey): Promise<void> {
  const label = TABS[key];
  const tab = page.locator(`button:has-text("${label}")`).first();

  if (!(await tab.isVisible({ timeout: 8000 }).catch(() => false))) {
    ctx.warn(`Variant tab "${label}" not found -- the demo page may have changed.`);
    return;
  }

  const box = await tab.boundingBox();
  if (!box) return;

  await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
  await sleep(350);
  await humanClick(page);
  console.log(`   ✓ Selected variant "${label}".`);

  // The panel is keyed on the variant, so the click remounts both halves. Give
  // React the frame it needs before anything is typed into the new chat.
  await beat(1400);
}

/**
 * The "Agent Progress" panel as rendered: its row count and the
 * `observed_steps` JSON printed under it. Scoped to the panel -- a bare
 * `ul li` also counts the list items of a markdown reply in the chat, and the
 * prompt asks for a three-step plan, so the reply usually has some.
 */
async function readStepsPanel(page: Page): Promise<{ rows: number; json: string } | null> {
  return page
    .evaluate(() => {
      const h = Array.from(document.querySelectorAll('h1')).find(
        (el) => (el.textContent ?? '').trim() === 'Agent Progress',
      );
      const panel = h?.parentElement;
      if (!panel) return null;
      return {
        rows: panel.querySelectorAll('ul li').length,
        json: (panel.querySelector('pre')?.textContent ?? '').replace(/\s+/g, ' ').trim(),
      };
    })
    .catch(() => null);
}

/** Samples the panel's row count until stopped; returns the peak and the sample count. */
function watchSteps(page: Page): { stop: () => { peak: number; samples: number } } {
  let peak = 0;
  let samples = 0;
  const timer = setInterval(() => {
    readStepsPanel(page)
      .then((p) => {
        if (!p) return;
        samples++;
        if (p.rows > peak) peak = p.rows;
      })
      .catch(() => {});
  }, 700);
  return {
    stop: () => {
      clearInterval(timer);
      return { peak, samples };
    },
  };
}

/** Rests the cursor on the steps panel, whether it has rows in it or not. */
async function restOnSteps(page: Page, dwellMs: number): Promise<void> {
  const panel = page
    .locator('h1:has-text("Agent Progress"), p:has-text("Empty. Give the agent"), ul')
    .first();
  if (!(await panel.isVisible({ timeout: 4000 }).catch(() => false))) return;

  const box = await panel.boundingBox();
  if (!box) return;
  await humanGlide(page, box.x + Math.min(box.width / 2, 200), box.y + 40, 22);
  await sleep(dwellMs);
}

/** Drives one variant end to end: pick the tab, ask, watch the steps panel. */
async function runVariant(
  ctx: ActionContext,
  page: Page,
  config: PageRecordConfig,
  key: VariantKey,
  startTimeoutMs = 30000,
  waitForStepsMs = 0,
): Promise<boolean | undefined> {
  await selectVariant(ctx, page, key);

  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });

  // On the custom graphs the steps are the evidence, and on the manual one they
  // are the *only* evidence -- it renders them and then never replies. Waiting
  // for them here means the clip shows the thing that worked before the take
  // runs out of patience on the thing that did not.
  //
  // Not done on `prebuilt`: its finding is that no step ever appears, so a wait
  // there buys a minute of dead video to prove what an empty panel already says.
  let appeared: boolean | undefined;
  if (waitForStepsMs > 0) {
    // The panel's own "Steps" heading only -- it renders when observed_steps
    // has rows. A bare `ul li` also matched a markdown list in the reply.
    appeared = await page
      .locator('h3:has-text("Steps")')
      .first()
      .waitFor({ state: 'visible', timeout: waitForStepsMs })
      .then(() => true)
      .catch(() => false);
    console.log(
      appeared
        ? `   ✓ Steps rendered on "${TABS[key]}".`
        : `   ⚠️ No steps rendered on "${TABS[key]}" within ${waitForStepsMs / 1000}s.`,
    );
  }

  // Mid-stream is the only moment the steps are interesting: this is when rows
  // should be filling in. Waiting for the reply first and looking afterwards
  // shows the aftermath rather than the behaviour.
  await sleep(waitForStepsMs > 0 ? 600 : 2200);
  await restOnSteps(page, 2200);

  await waitForAgentResponseCompletion(
    page,
    config.waitAfterPromptMs ?? 4000,
    msgCount,
    undefined,
    { startTimeoutMs },
  );
  return appeared;
}

/** Prebuilt agent -- its own tab, start to finish. Nothing else is driven. */
export const runPredictivePrebuiltAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  _rootPath,
  ctx,
) => {
  // Sampled for the whole run: the finding is that the panel is empty at every
  // point, not just at the end.
  const watch = watchSteps(page);
  const started = Date.now();
  let sampled = { peak: 0, samples: 0 };
  try {
    await runVariant(ctx, page, config, 'prebuilt');
  } finally {
    sampled = watch.stop();
  }

  // A long, deliberate look at the panel that should have filled in and did
  // not. With the manual-tab comparison gone this is the whole of the evidence,
  // so it gets the dwell the second half used to spend.
  await restOnSteps(page, 5200);

  const panel = await readStepsPanel(page);
  const reply = await latestReplyText(page);
  const secs = Math.round((Date.now() - started) / 1000);
  console.log(
    `   [Predictive prebuilt] steps panel peaked at ${sampled.peak} row(s) over ${sampled.samples} sample(s) ` +
      `in ${secs}s; now ${panel?.rows ?? '?'} row(s), observed_steps ${panel?.json ?? '?'}`,
  );
  let reproduced = false;
  if (!panel) {
    ctx.fail('The "Agent Progress" panel is not on the page -- the demo route changed.');
  } else if (sampled.peak === 0 && panel.rows === 0 && reply) {
    reproduced = true;
    ctx.reproduced(
      `steps panel had 0 rows in all ${sampled.samples} samples over ${secs}s (observed_steps ${panel.json || '(empty)'}) ` +
        `while the chat answered: "${excerpt(reply, 90)}"`,
    );
  } else if (sampled.peak > 0 || panel.rows > 0) {
    console.log(`   [Predictive prebuilt] Steps did render on the prebuilt tab.`);
  }

  if (config.knownIssue && reproduced) {
    await writeIssueNote(page, config.id, config.knownIssue);
  }
};

/**
 * The two custom-graph variants, each as its own take.
 *
 * 90s to start rather than the default 30s. These graphs emit four steps a
 * second apart before they say anything, and one has been measured at 50s end
 * to end; 30s was reporting a working graph as dead.
 */
const CUSTOM_GRAPH_START_TIMEOUT_MS = 90000;

/**
 * Manual: the steps render, then nothing.
 *
 * The silence is the finding, and it needs no console error to explain it --
 * the page's `chat_node` ends at `# ...` with no return, so the node yields no
 * message and no state update. A direct call to the graph returns 200 with
 * `observed_steps` absent and the human turn as the only message.
 *
 * There was a console matcher here hunting a recursion-limit error. It is gone:
 * this graph is `__start__ -> chat_node -> __end__`, acyclic, one super-step,
 * and structurally cannot reach a recursion limit. The matcher found nothing on
 * every run and warned about it each time, which is noise pointing at the wrong
 * graph -- the tool variant is the one with a `chat_node`/`tool_node` cycle.
 *
 * `AgentSilentError` is caught rather than allowed to propagate: an exception
 * escaping here would skip the Notepad note. Because it is caught, the engine
 * never sees the silence, so this handler calls `ctx.reproduced` itself.
 *
 * Not observable here: the cause (the `# ...` elisions hiding the model call
 * and the return). That is a fact about the doc's code, shown in the IDE tabs,
 * not something the running app can report.
 */
export const runPredictiveManualAction: PageActionHandler = async (page, config, _rootPath, ctx) => {
  // Counted before the run ends, while the emitted rows are still on screen.
  // Scoped to the steps panel (see readStepsPanel).
  const watch = watchSteps(page);
  let sampled = { peak: 0, samples: 0 };

  let silent = false;
  try {
    await runVariant(ctx, page, config, 'manual', CUSTOM_GRAPH_START_TIMEOUT_MS, 45000);
    ctx.warn(`[Predictive manual] The agent DID reply this time -- the documented ` +
        `defect did not reproduce. Check whether it has been fixed before filing it again.`,
    );
  } catch (e) {
    if (!(e instanceof AgentSilentError)) throw e;
    // Caught here, so the engine never sees it and cannot count the silence
    // as reproduced on its own (`expectsNoResponse`); the handler says so.
    silent = true;
    console.log(`   🐞 [Predictive manual] No reply -- as reported.`);
  } finally {
    sampled = watch.stop();
  }
  const peak = sampled.peak;

  // The second half of the finding, and the half nothing was filming.
  //
  // The rows are emitted, so they appear; the node returns nothing, so they do
  // not survive the run that drew them. Watching the panel go back to its empty
  // state -- after it visibly had four rows in it -- is what makes "the steps do
  // not persist" a thing on tape rather than a claim in the note. A tester
  // watching this would do exactly this: look back at the panel once the
  // spinner stops.
  await beat(1500);
  const after = (await readStepsPanel(page))?.rows ?? 0;
  await restOnSteps(page, 4000);

  console.log(
    `   [Predictive manual] Steps peaked at ${peak} row(s) during the run, ${after} after it.`,
  );
  const vanished = peak > 0 && after === 0;
  if (vanished) {
    console.log(`   🐞 [Predictive manual] The emitted steps did not survive the run.`);
  } else if (peak === 0) {
    ctx.warn(`[Predictive manual] No steps were ever drawn, so the clip shows an empty ` +
        `panel throughout and cannot make the "emitted but not persisted" point.`,
    );
  }

  if (silent) {
    ctx.reproduced(
      `the agent never answered; steps panel peaked at ${peak} row(s) during the run and ` +
        `${vanished ? 'went back to 0 after it' : `holds ${after} after it`}`,
    );
  } else if (vanished) {
    ctx.reproduced(`the agent replied, but the steps panel went from ${peak} row(s) to 0 once the run ended`);
  }

  // The config's note describes both halves (silence and vanishing steps), so
  // it is typed only when the take showed the silence; a take that showed
  // neither must not carry it.
  if (config.knownIssue && silent) {
    await writeIssueNote(page, config.id, config.knownIssue, {
      extraLines: [`this take: steps peaked at ${peak}, ${after} after the run`],
    });
  }
};

/**
 * Tool-based: the knownIssue is NOT observable from a take, by construction.
 *
 * The defect is that the page's `graph = workflow.compile(checkpointer=
 * MemorySaver())` makes `langgraph dev` raise ValueError and exit, taking every
 * graph down. backend/src/predictive_state_tool.py drops that argument so the
 * server can boot at all (see its `graph` region note); with it in, no take
 * could run, this one included. So nothing this handler can see -- DOM,
 * console, network, reply -- carries the ValueError, and calling
 * `ctx.reproduced` here would be asserting the finding, not observing it. The
 * take films the variant working without the checkpointer, and the warning
 * says why the defect was not reproduced.
 */
export const runPredictiveToolAction: PageActionHandler = async (page, config, _rootPath, ctx) => {
  const appeared = await runVariant(ctx, page, config, 'tool', CUSTOM_GRAPH_START_TIMEOUT_MS, 45000);
  if (appeared === false) {
    ctx.warn('No steps rendered on the tool-based variant within 45s -- emit_intermediate_state did not reach the panel.');
  }
  if (config.knownIssue) {
    ctx.warn(
      'This knownIssue (langgraph dev ValueError on compile(checkpointer=MemorySaver())) cannot be observed in a take: ' +
        'the backend drops the checkpointer so the server boots. Verify by hand against the published line.',
    );
  }
};
