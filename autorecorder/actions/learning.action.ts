import { type Page } from 'playwright';
import {
  AgentSilentError,
  promptsFor,
  sendPrompt,
  waitForAgentResponseCompletion,
} from '../core/actions';
import { sleep } from '../core/overlays/cursor';
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';
import { captureConsole, findEntries, type ConsoleCapture } from '../core/console-capture';
import { copilotkitVersionLine, markServerLogs } from './error-evidence';
import { evidenceThenIssueNote, glideClick, glideTo, waitForText } from './glide-click';

/**
 * Learning -- one turn on the agent the page's selector assigns, one on the
 * agent it does not.
 *
 * With `CPK_INTELLIGENCE_API_KEY` set, the page's runtime connects and the
 * take follows the path the page describes: `expense-agent` is routed to the
 * example container `expense-review`; where that container does not exist the
 * platform answers `LEARNING_CONTAINER_NOT_FOUND`, the run fails with "Failed
 * to initialize thread" and the chat shows nothing, while `sample_agent` (the
 * control, which the selector assigns nowhere) answers.
 *
 * Without a key, the page's
 * `new CopilotKitIntelligence({ apiKey: process.env.CPK_INTELLIGENCE_API_KEY! })`
 * throws at module load, the mount answers 500, and neither tab can send.
 *
 * The note is written from what the take saw, so it holds either way.
 */

/** The platform's Learning codes, the run failure, and the module-load throw. */
const RELEVANT = /LEARNING_|expense-agent|initialize thread|copilotkit-learning\/agent\/|CopilotKitIntelligence|apiKey is required/i;

const SILENCE_MS = 25_000;

type Outcome = 'answered' | 'silent';

async function turn(
  page: Page,
  agentId: string,
  prompt: string,
  postWaitMs: number,
): Promise<Outcome> {
  const ready = await waitForText(page.locator('[data-testid=learning-ready]'), (t) => t === 'true', 30_000);
  await glideTo(page, page.locator('[data-testid=learning-assignment]'), 2000);
  console.log(`   [Learning] ${agentId}: ready=${ready}`);

  // The composer may not be able to send (runtime in error): type it anyway
  // and let the button's disabled state show that nothing went out.
  const count = await sendPrompt(page, prompt, { expectInputToEmpty: false });
  try {
    await waitForAgentResponseCompletion(page, postWaitMs, count, undefined, {
      startTimeoutMs: SILENCE_MS,
    });
    console.log(`   [Learning] ${agentId} answered.`);
    return 'answered';
  } catch (error) {
    if (!(error instanceof AgentSilentError)) throw error;
    console.log(`   [Learning] ${agentId} stayed silent.`);
    await glideTo(page, page.locator('[data-testid=learning-info]'), 1800);
    return 'silent';
  }
}

/** What this take saw, from the page, the console and the servers' logs. */
interface LearningSeen {
  info: string;
  expense: Outcome;
  control: Outcome;
  /** The no-key branch: /info 5xx, or the constructor's throw in the server log. */
  noKey: boolean;
  /** The platform's code, from the server log or the browser console. */
  containerNotFound: string | undefined;
  /** The run failure the chat never shows, from the browser console or server log. */
  initFailed: string | undefined;
  version: string;
}

function observe(
  info: string,
  expense: Outcome,
  control: Outcome,
  serverLines: string[],
  capture: ConsoleCapture,
  version: string,
): LearningSeen {
  const fromConsole = (re: RegExp) => findEntries(capture, re, 1)[0]?.text;
  const fromServer = (re: RegExp) => serverLines.find((l) => re.test(l))?.trim();
  return {
    info,
    expense,
    control,
    noKey: /^5\d\d/.test(info) || serverLines.some((l) => /apiKey is required/.test(l)),
    containerNotFound:
      fromServer(/LEARNING_CONTAINER_NOT_FOUND/) ?? fromConsole(/LEARNING_CONTAINER_NOT_FOUND/),
    initFailed: fromConsole(/Failed to initialize thread/i) ?? fromServer(/Failed to initialize thread/i),
    version,
  };
}

/**
 * Which part of the knownIssue this take showed, as evidence text, or
 * undefined when it showed none of it.
 *
 * Observable: the no-key branch (/info 5xx, the constructor throw), the
 * platform's LEARNING_CONTAINER_NOT_FOUND, the "Failed to initialize thread"
 * run failure, and expense-agent staying silent while sample_agent answers.
 * NOT observable from a take: that `agents` and `identifyUser` are undefined
 * in the snippet and that no minimum runtime version is stated -- both are
 * facts about the doc's code, shown in the IDE tabs, not in the running app.
 */
function evidenceFor(s: LearningSeen): string | undefined {
  if (s.noKey) {
    return `no Intelligence key: GET /api/copilotkit-learning/info -> ${s.info || '(unread)'}; ` +
      `expense-agent ${s.expense}, sample_agent ${s.control}`;
  }
  const parts: string[] = [];
  if (s.containerNotFound) parts.push(`platform: ${s.containerNotFound.slice(0, 140)}`);
  if (s.initFailed) parts.push(`run: ${s.initFailed.slice(0, 140)}`);
  if (s.expense === 'silent' && s.control === 'answered') parts.push('expense-agent silent while sample_agent answered');
  return parts.length > 0 ? parts.join('; ') : undefined;
}

/** The note, one line per thing this take showed, plus the doc facts. */
function noteFor(s: LearningSeen): string {
  const tail = [
    '',
    'also: agents and identifyUser never defined on the page',
    `getLearningContainerId needs runtime 1.70+, page never says so (here: ${s.version})`,
  ];
  if (s.noKey) {
    return [
      'learning - page runtime fails at load, nothing answers',
      '',
      'mounted the snippet verbatim on its own route',
      'no intelligence key, apiKey: process.env.CPK_INTELLIGENCE_API_KEY! throws at import',
      `/info ${s.info}`,
      `expense-agent ${s.expense}, sample_agent ${s.control}`,
      ...tail,
    ].join('\n');
  }
  return [
    s.expense === 'silent' ? 'learning - expense-agent never answers' : 'learning - both agents answer',
    '',
    'page selector sends expense-agent threads to container "expense-review"',
    ...(s.containerNotFound ? ['the platform says the container does not exist -> LEARNING_CONTAINER_NOT_FOUND'] : []),
    ...(s.initFailed ? ['run fails: failed to initialize thread, chat stays blank'] : []),
    s.control === 'answered'
      ? 'sample_agent (no container) answers fine, same graph'
      : 'sample_agent (no container) did not answer either this take',
    '',
    'troubleshooting table only says the thread will not show in the container',
    ...tail,
  ].join('\n');
}

export const runLearningAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  rootPath: string,
  ctx: ActionContext,
) => {
  const logs = markServerLogs(rootPath);
  const prompts = promptsFor(config);
  // "Failed to initialize thread" reaches the browser console and nowhere on
  // screen, so the take listens for it from the first turn.
  const capture = captureConsole(page);

  try {
    console.log('   [Learning] 1/2: expense-agent -> "expense-review"...');
    const expense = await turn(page, 'expense-agent', prompts[0], 2000);
    if (expense === 'answered') {
      ctx.warn('expense-agent answered. The expense-review container may exist in the project now -- re-check the finding on /learning.');
    }

    console.log('   [Learning] 2/2: sample_agent -> no container...');
    await glideClick(page, page.locator('[data-testid=learning-agent-sample_agent]'));
    await sleep(1500);
    const control = await turn(page, 'sample_agent', prompts[1] ?? prompts[0], config.waitAfterPromptMs ?? 3000);

    const info = ((await page.locator('[data-testid=learning-info]').textContent().catch(() => '')) ?? '').trim();
    const version = copilotkitVersionLine(rootPath);
    await evidenceThenIssueNote(page, config, logs, RELEVANT, {
      note: (lines) => noteFor(observe(info, expense, control, lines, capture, version)),
      extraLines: () => (info ? [`GET /api/copilotkit-learning/info -> ${info}`] : []),
      writeNote: (lines) => {
        const evidence = evidenceFor(observe(info, expense, control, lines, capture, version));
        if (!evidence) {
          ctx.warn(`None of the documented Learning failure showed up: /info ${info || '(unread)'}, expense-agent ${expense}, sample_agent ${control}.`);
          return false;
        }
        ctx.reproduced(evidence);
        return true;
      },
    });
  } finally {
    capture.stop();
  }
};
