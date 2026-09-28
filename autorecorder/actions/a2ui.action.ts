import { type Page } from 'playwright';
import { sendPrompt, waitForAgentResponseCompletion, AgentSilentError } from '../core/actions';
import { writeIssueNote } from '../core/issue-note';
import { captureConsole, findEntries } from '../core/console-capture';
import { humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';

/**
 * The A2UI takes.
 *
 * Three of these four pages work and are recorded plainly. The fourth --
 * Fixed Schema -- fails with `Catalog not found: .../basic_catalog.json`, and
 * that message exists only in the browser console.
 *
 * This take used to draw a replica of Chrome's DevTools console over the page
 * to put the error on screen. It has stopped doing that: nobody testing an app
 * can conjure a panel into existence, and anything on screen a human could not
 * have put there turns evidence into a presentation. What a tester actually
 * does is read the console, then write down what it said -- so the error is
 * still captured, still verified, and now reaches the video the way a person
 * would deliver it: typed into the Notepad note at the end.
 *
 * The empty surface is left to speak for itself. This clip is one of the
 * narrated ones -- `audio/FixedSchemaA2UI.m4a` -- so the absence is
 * explained by the voice track and the note, not by anything on the page.
 */

/** Rests the cursor where the A2UI surface renders, or should have. */
async function restOnSurface(page: Page, dwellMs: number): Promise<void> {
  const surface = page
    .locator('.a2ui-surface, [class*="a2ui"], .copilotKitAssistantMessage')
    .first();

  // Waited for, not snapshotted. An A2UI surface is drawn once the operations
  // container arrives in the tool result, which is after the text has finished
  // streaming -- and `isVisible` does not poll however large its timeout, so
  // checking it directly parked the cursor in the middle of the screen every
  // time the surface was a moment late.
  await surface.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

  if (!(await surface.isVisible().catch(() => false))) {
    await humanGlide(page, 960, 460, 20);
    await sleep(dwellMs);
    return;
  }

  const box = await surface.boundingBox();
  if (!box) return;
  await humanGlide(
    page,
    box.x + Math.min(box.width / 2, 260),
    box.y + Math.min(box.height / 2, 120),
    22,
  );
  await sleep(dwellMs);
}

/** Dynamic Schema, Styling, Advanced: prompt, then look at what got drawn. */
export const runA2uiSurfaceAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  console.log(`   [A2UI] Prompting for a generated surface...`);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });

  // A2UI surfaces arrive after the text does -- the operations container is
  // rendered once the tool result lands -- so the wait comes first and the
  // cursor moves afterwards.
  //
  // 75s to start, not the default 30s. On the dynamic-schema agent a *second*
  // model writes the whole component tree before the first word is said, and
  // 30s was a coin flip: Dynamic Schema and Advanced cleared it on one run while
  // Styling -- same agent, same runtime, same prompt -- did not, and was
  // reported as a dead page. A limit that fails one of three identical calls is
  // measuring the limit, not the app.
  await waitForAgentResponseCompletion(page, 1500, msgCount, undefined, { startTimeoutMs: 75000 });
  await restOnSurface(page, config.waitAfterPromptMs ?? 5000);
};

/** The eight custom properties the Styling page documents, as theme.css sets them. */
const DOCUMENTED_VARS = [
  '--primary',
  '--primary-foreground',
  '--card',
  '--border',
  '--radius',
  '--foreground',
  '--input',
  '--background',
] as const;

interface StylingProbe {
  /** The variables as resolved on `.a2ui-surface` (empty = not set there). */
  vars: Record<string, string>;
  /** Elements inside the surface, including it. */
  elements: number;
  /** Elements whose computed style changed when the variables were swapped. */
  changed: number;
  /** One example property that changed, e.g. `div background-color`. */
  changedExample: string;
  /** `.a2ui-card` elements inside the surface. */
  cards: number;
  /** The surface's first card-like element as rendered, for the log/note. */
  sample: string;
}

/**
 * Whether the documented variables do anything to the rendered surface.
 *
 * Differential, not a colour match: snapshot every element's computed
 * colours and radii, set all eight documented variables on the surface to
 * sentinel values, snapshot again, then restore -- all in one synchronous
 * task, so no frame is painted with the sentinels. If nothing reads the
 * variables, nothing changes. A colour match against theme.css's values would
 * be fooled by a renderer default that happens to equal one of them.
 */
async function probeSurfaceTheming(page: Page): Promise<StylingProbe | null> {
  // tsx compiles with keepNames, which wraps named functions inside an
  // evaluate callback in `__name(...)` -- undefined in the page (see take.ts).
  await page.evaluate('window.__name = window.__name || function (f) { return f; }').catch(() => {});
  return page
    .evaluate((names) => {
      const surface = document.querySelector<HTMLElement>('.a2ui-surface');
      if (!surface) return null;
      const props = [
        'color', 'background-color', 'border-top-color', 'border-right-color',
        'border-bottom-color', 'border-left-color', 'outline-color', 'fill', 'stroke',
        'border-top-left-radius', 'border-bottom-right-radius', 'box-shadow',
      ];
      const els = [surface, ...Array.from(surface.querySelectorAll<HTMLElement>('*'))];
      const snap = () => els.map((el) => {
        const cs = getComputedStyle(el);
        return props.map((p) => cs.getPropertyValue(p)).join('|');
      });

      const cs = getComputedStyle(surface);
      const vars: Record<string, string> = {};
      for (const n of names) vars[n] = cs.getPropertyValue(n).trim();

      // Transitions off for the probe: with a colour transition, the computed
      // value right after the swap is still the old one, which would read as
      // "the variables do nothing" when they do.
      const still = document.createElement('style');
      still.textContent = '.a2ui-surface, .a2ui-surface * { transition: none !important; animation: none !important; }';
      document.head.appendChild(still);

      const before = snap();
      const saved = names.map((n) => [n, surface.style.getPropertyValue(n), surface.style.getPropertyPriority(n)] as const);
      for (const n of names) surface.style.setProperty(n, n === '--radius' ? '37px' : 'rgb(1, 2, 3)', 'important');
      const after = snap();
      for (const [n, v, prio] of saved) {
        if (v) surface.style.setProperty(n, v, prio);
        else surface.style.removeProperty(n);
      }
      // Recompute with the original values while transitions are still off,
      // so removing the override does not animate back from the sentinels.
      snap();
      still.remove();

      let changed = 0;
      let changedExample = '';
      before.forEach((b, i) => {
        if (b === after[i]) return;
        changed++;
        if (!changedExample) {
          const bi = b.split('|');
          const ai = after[i].split('|');
          const k = bi.findIndex((v, j) => v !== ai[j]);
          changedExample = `${els[i].tagName.toLowerCase()} ${props[k]}`;
        }
      });

      const cardLike = surface.querySelector<HTMLElement>('[class*="card" i]') ??
        (surface.firstElementChild as HTMLElement | null) ??
        surface;
      const ccs = getComputedStyle(cardLike);
      return {
        vars,
        elements: els.length,
        changed,
        changedExample,
        cards: surface.querySelectorAll('.a2ui-card').length,
        sample: `background ${ccs.backgroundColor}, text ${ccs.color}, border ${ccs.borderTopColor}`,
      };
    }, [...DOCUMENTED_VARS])
    .catch(() => null);
}

/**
 * Styling: the same surface take, then a check that the documented variables
 * reach the surface at all.
 *
 * Observable here: the variables are set on `.a2ui-surface` (theme.css is
 * applied) and swapping them changes no computed style inside it, and no
 * `.a2ui-card` element exists for the "Card width" rule to match. NOT
 * observable from a take: the cause -- that the installed renderer reads only
 * `--a2ui-primary-color` -- which is a fact about the package's source, not
 * about anything the page renders.
 */
export const runA2uiStylingAction: PageActionHandler = async (page, config, rootPath, ctx) => {
  await runA2uiSurfaceAction(page, config, rootPath, ctx);

  const probe = await probeSurfaceTheming(page);
  if (!probe) {
    ctx.warn('No .a2ui-surface rendered, so the styling variables could not be tested in this take.');
    return;
  }
  const set = Object.entries(probe.vars).filter(([, v]) => v);
  console.log(
    `   [A2UI Styling] ${set.length}/8 documented variables set on .a2ui-surface; ` +
      `${probe.changed}/${probe.elements} element(s) changed when they were swapped; ` +
      `.a2ui-card elements: ${probe.cards}; card renders ${probe.sample}`,
  );
  if (set.length === 0) {
    // theme.css not applied at all is a harness problem, not the documented
    // defect -- the page's claim was never put to the test.
    ctx.warn('None of the documented variables is set on .a2ui-surface -- theme.css did not apply, so the page was not tested.');
    return;
  }
  if (probe.changed > 0) {
    console.log(`   [A2UI Styling] The variables do reach the surface (e.g. ${probe.changedExample}).`);
    return;
  }

  const evidence =
    `${set.length} documented variables set on .a2ui-surface (e.g. --card ${probe.vars['--card'] || '(unset)'}), ` +
    `swapping all of them changed no computed style in ${probe.elements} element(s); ` +
    `card renders ${probe.sample}; .a2ui-card elements: ${probe.cards}`;
  ctx.reproduced(evidence);

  if (config.knownIssue) {
    await writeIssueNote(page, config.id, config.knownIssue, {
      extraLines: [`measured: card ${probe.sample}`, `.a2ui-card elements on the surface: ${probe.cards}`],
    });
  }
};

/**
 * Fixed Schema: the catalog never resolves, and the console is the only witness.
 *
 * Capture starts before the prompt, because the fetch that fails happens while
 * the surface is being drawn. `AgentSilentError` is caught rather than allowed
 * to propagate: whether the agent also fails to answer is not the finding.
 * The take is `[ISSUE]` only when the catalog error is actually captured.
 */
export const runA2uiFixedSchemaAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  _rootPath,
  ctx,
) => {
  const capture = captureConsole(page);

  try {
    console.log(`   [A2UI Fixed] Prompting for the fixed-schema surface...`);
    const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });

    try {
      await waitForAgentResponseCompletion(page, 2000, msgCount);
    } catch (e) {
      if (!(e instanceof AgentSilentError)) throw e;
      console.log(`   [A2UI Fixed] No assistant reply -- continuing.`);
    }

    // The empty space where the card should be. The page's own note says what
    // was expected there, so this reads as an absence rather than a pause.
    await restOnSurface(page, config.waitAfterPromptMs ?? 4000);

    // `/Catalog not found/`, the renderer's own message
    // (@a2ui/web_core message-processor: `Catalog not found: ${catalogId}`,
    // thrown when createSurface names a catalog id nothing registered). Not
    // `/catalog|a2ui/i`: that matched the agent id -- `a2ui_fixed_agent` is in
    // the context of every CopilotKit error on this page -- so an unrelated
    // stream failure was reported as the catalog defect. And no fallback to
    // "the first captured error": that typed an unrelated error into the note
    // as if it were the catalog evidence.
    const catalogErrors = findEntries(capture, /Catalog not found/, 2);
    const surfaceDrawn = await page.locator('.a2ui-surface').first().isVisible().catch(() => false);

    // The text goes in the log, not just a count, so the run log says which
    // error the take caught without anyone watching the video.
    console.log(`   [A2UI Fixed] /Catalog not found/ entries: ${catalogErrors.length}; surface drawn: ${surfaceDrawn}`);
    for (const e of catalogErrors) {
      console.log(`      · [${e.level}] ${e.text}${e.source ? `  (${e.source})` : ''}`);
    }

    if (catalogErrors.length > 0) {
      ctx.reproduced(
        `console: ${catalogErrors[0].text.slice(0, 200)}` +
          (surfaceDrawn ? ' (a .a2ui-surface did render)' : '; no .a2ui-surface rendered'),
      );
    } else {
      ctx.warn(
        `No "Catalog not found" error was captured` +
          (surfaceDrawn ? ' and an A2UI surface rendered' : ', but no A2UI surface rendered either') +
          ` -- the documented defect did not show up in this take.`,
      );
    }

    // Written only when the catalog error was seen: the note says "console has
    // the real reason", which is false on a take whose console did not have it.
    if (config.knownIssue && catalogErrors.length > 0) {
      // The console line goes into the note, which is how a tester would carry
      // it: read the console, write down what it said.
      await writeIssueNote(page, config.id, config.knownIssue, {
        extraLines: [`console: ${catalogErrors[0].text.slice(0, 180)}`],
      });
    }
  } finally {
    capture.stop();
  }
};
