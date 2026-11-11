import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

// The page's "Agent server environment" block, quoted as published.
const AGENT_ENV = `CPK_INTELLIGENCE_API_KEY=cpk-...
CPK_INTELLIGENCE_LEARNING_CONTAINER_ID=expense-review`;

const SERVER_LOG = `GET  /api/copilotkit-learning/info   → 500
POST /api/copilotkit-learning        → 500   (single-route fallback)

⨯ Error: CopilotKitIntelligence \`apiKey\` is required and cannot be blank. It is the
  CopilotKit Intelligence project API key, normally read from the CPK_INTELLIGENCE_API_KEY
  environment variable. Run \`copilotkit project select\` to provision one for your project.

Client: runtime connection "error" · agent ready false · send button disabled on both tabs`;

// Added upstream 2026-11-11, quoted as published and shown as text only: the
// installed runtime (1.73.3) has neither `getTrajectoryLearningContainerIds`
// nor `intelligence.experimental.learning` (both are on 1.85.0; the page names
// no version), so none of these compile or run here.
const TRAJECTORY_SNIPPET = `const intelligence = new CopilotKitIntelligence({
  apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
  getTrajectoryLearningContainerIds: ({ trajectoryId, user }) =>
    ["expense-review"],
});`;

const CLI_SNIPPET = `npx copilotkit@latest learning containers list

npx copilotkit@latest learning containers default-id

npx copilotkit@latest learning containers create --id <container-id> --name "<container name>"`;

// The three "Manage Learning from your server" blocks, in page order. The
// "// <title>" lines are the code-block captions, added here to separate them.
const MANAGE_SNIPPET = `// Application server — Select a container and start a run
import { CopilotKitIntelligence } from "@copilotkit/runtime/v2";

const intelligence = new CopilotKitIntelligence({
  apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
});

const page = await intelligence.experimental.learning.listLearningContainers();
// Use page.nextCursor to request another page when it is not null.
const container = await intelligence.experimental.learning.getLearningContainer({
  containerId: "expense-review",
});

// Call only after the authorized user requests a manual run.
const admittedRun = await intelligence.experimental.learning.startLearningRun({
  containerId: container.id,
});
const runs = await intelligence.experimental.learning.listLearningRuns({
  containerId: container.id,
});
const progress = runs.find((run) => run.id === admittedRun.id);

// Application server — Review a proposed Skill
const candidates = await intelligence.experimental.learning.listLearningCandidates({
  containerId: "expense-review",
});
const pending = candidates.find((item) => item.status === "pending_review");
if (pending) {
  const candidate = await intelligence.experimental.learning.getLearningCandidate({
    containerId: "expense-review",
    candidateId: pending.id,
  });
  const evidence = await Promise.all(
    candidate.supportingInsights.map((insight) =>
      intelligence.experimental.learning.getLearningInsightEvidence({
        containerId: "expense-review",
        insightId: insight.id,
      }),
    ),
  );
  // Show candidate.bundle.files and evidence to the authorized reviewer.
}

// Authorized review handler
const review = await intelligence.experimental.learning.reviewLearningCandidate({
  containerId: "expense-review",
  candidateId, // The candidate the reviewer inspected.
  action: "approve", // Use "reject" for an explicit rejection.
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/learning" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Learning groups Threads from one kind of work into a container,
          analyzes completed runs into Insights, and proposes Skills you review
          and publish. The only code the page asks for is one runtime callback,{" "}
          <code>getLearningContainerId</code>, that decides which container a
          new Thread joins. This route mounts that runtime verbatim at{" "}
          <code>/api/copilotkit-learning</code> with one agent it assigns
          (<code>expense-agent</code>) and one it does not
          (<code>sample_agent</code>, the Deep Agents Quickstart&apos;s id), both
          on the Quickstart graph.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "On expense-agent: Review this expense: $42 team lunch, receipt attached.",
              "On sample_agent: Say hello in five words.",
            ]}
            expect="Both agents answer; expense-agent's Thread shows up in the expense-review container in the dashboard."
            fail="What actually happens here: neither tab can send — the page's runtime fails at load without an Intelligence key. See below."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Without an Intelligence key the page's runtime does not load">
        <code>apiKey: process.env.CPK_INTELLIGENCE_API_KEY!</code> — the{" "}
        <code>!</code> tells the type checker the key is there, and the page
        never says it has to be. This harness has no key, so
        the constructor throws at import time, the route answers 500, the
        provider lands in <code>error</code>, and the chat on either tab never
        enables its send button. Mounted anywhere shared, the same line would
        take down every chat on that runtime; here it is isolated on its own
        route. The page names the Intelligence Quickstart as a prerequisite
        only implicitly.
        <pre className="mt-3 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
          {SERVER_LOG}
        </pre>
      </Callout>

      <Callout tone="warn" title="The snippet leans on two things it never defines">
        <code>new CopilotRuntime({"{ agents, intelligence, identifyUser }"})</code>{" "}
        — <code>agents</code> and <code>identifyUser</code> appear nowhere else
        on the page. They are supplied in <code>lib/learning-runtime.ts</code>,
        above the verbatim block, and marked as this harness&apos;s. For Deep
        Agents, <code>agents</code> means <code>LangGraphAgent</code>s keyed by
        the id the selector tests — <code>expense-agent</code> is not a graph id
        this backend has, so it is mapped onto the Quickstart graph.
      </Callout>

      <Callout tone="warn" title="No version floor">
        <code>getLearningContainerId</code> exists on{" "}
        <code>CopilotKitIntelligence</code> from runtime 1.70; on 1.69.0, which
        this repo&apos;s lockfile pinned until 2026-09-23, the option is a type
        error (1.69.0 has only the <code>ɵlearning</code> runtime option). This
        repo now declares <code>^1.73.3</code> and installs 1.73.3, where it
        compiles. The page names no
        version and never mentions <code>ɵlearning</code>, so a reader on an
        older runtime is not told what to use instead.
      </Callout>

      <Callout tone="warn" title="The new skill-delivery steps cannot be followed from this backend">
        <p>
          The 2026-09-21 sync replaced the one-line pointer to{" "}
          <code>/deepagents/intelligence/learned-skills</code> with a three-step{" "}
          <strong>Set up skill delivery</strong> section. Step 2 tells
          you to configure &ldquo;the supported native adapter&rdquo; in the
          agent server environment with this block:
        </p>
        <pre className="mt-3 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
          {AGENT_ENV}
        </pre>
        <p className="mt-2">
          The agent server here is Python, and the LangGraph Python adapter that
          would read those variables,{" "}
          <code>copilotkit-intelligence-langgraph</code>, is not on PyPI. See{" "}
          <Link
            href="/intelligence/learned-skills"
            className="underline underline-offset-4"
          >
            Skill delivery
          </Link>
          . So the environment block configures nothing, and step 3 (&ldquo;
          Verify delivery in a new invocation&rdquo;) has nothing to verify.
          Step 2 no longer lists frameworks; it says &ldquo;Pick the adapter for
          the agent you already run.&rdquo; For this repo that is LangGraph
          Python, the unpublished one. The new &ldquo;Collect runs and deliver
          Skills&rdquo; section points agent setup at the Mastra, LangGraph
          TypeScript or LangGraph Python example, in that order, and names
          BuiltInAgent only among the others the delivery guide &ldquo;also
          covers&rdquo;. BuiltInAgent&apos;s <code>learnedSkills</code> now
          compiles on the installed runtime (1.73.3), but it replaces the Deep
          Agent rather than attaching to it, so it is not the adapter for the
          agent this repo runs.
        </p>
        <p className="mt-2">
          The container id in the block is <code>expense-review</code>, the same
          one this page&apos;s runtime selector returns, so the two halves agree
          about the name. Nothing here can check that they agree about anything
          else.
        </p>
      </Callout>

      <Callout tone="premium" title="The daily schedule is dashboard-only">
        The same sync added a <strong>Choose the daily schedule</strong> step
        and a threshold to <strong>Collect examples</strong>: automatic Learning
        wants <strong>15 eligible Threads</strong> and runs on a daily schedule
        defaulting to <strong>02:00 UTC</strong>, editable per project or per
        organization. Every part of that is a dashboard control: <strong>Edit
        schedule</strong>, <strong>Next scheduled run</strong>,{" "}
        <strong>Start manual run now</strong>, <strong>Analysis results</strong>
        . All of it sits behind a provisioned project and a login this harness
        does not have. Two of the new troubleshooting rows are about that surface
        (&ldquo;An automatic run has not started&rdquo;, &ldquo;Learning is
        waiting after a failed run&rdquo;). None of it is on the clip.
      </Callout>

      <Callout tone="premium" title="Not exercised here">
        Container assignment itself (what happens when a Thread is routed to{" "}
        <code>expense-review</code>, and whether a container that does not
        exist breaks the run), creating a container, Run Learning, reviewing
        Insights, approving a Skill, and{" "}
        <code>npx copilotkit@latest skills download</code>{" "}
        all need a provisioned Intelligence project and a dashboard login this
        harness does not have. They are not on the clip, and nothing here says
        whether they work.
      </Callout>

      <Callout tone="warn" title="2026-11-11 sync: three new sections, none runnable on this runtime">
        <p>
          The page added <strong>Assign browser activity to a Learning Space</strong>{" "}
          (<code>getTrajectoryLearningContainerIds</code> on{" "}
          <code>CopilotKitIntelligence</code>), CLI commands for listing,
          naming and creating containers, and{" "}
          <strong>Manage Learning from your server</strong> (the experimental{" "}
          <code>intelligence.experimental.learning.*</code> methods: list
          containers, start a run, list and review candidates). The installed{" "}
          <code>@copilotkit/runtime</code> 1.73.3 has neither the callback nor
          the <code>experimental.learning</code> namespace (1.85.0 has both), and
          the page names no minimum version. Bumping the runtime is out of scope
          for a doc sync, so the blocks below are shown as published and not
          mounted.
        </p>
        <p className="mt-2">
          Even on a runtime that has them, the blocks are not self-contained:
          the trajectory and management snippets need an Intelligence key and an
          existing Space/container, the management blocks use top-level{" "}
          <code>await</code> with no surrounding handler, and the review
          handler&apos;s <code>candidateId</code> is never defined. The CLI
          commands need a selected Intelligence project. None of this is
          exercised here.
        </p>
      </Callout>

      <Panel title="New upstream code (reference only)" description="Verbatim from the page; not compiled or mounted.">
        <p className="mb-2 text-xs font-medium text-slate-500">Assign browser activity to a Learning Space</p>
        <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{TRAJECTORY_SNIPPET}</pre>
        <p className="mb-2 mt-4 text-xs font-medium text-slate-500">Create a container (Terminal)</p>
        <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{CLI_SNIPPET}</pre>
        <p className="mb-2 mt-4 text-xs font-medium text-slate-500">Manage Learning from your server</p>
        <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{MANAGE_SNIPPET}</pre>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/lib/learning-runtime.ts" />
        <div className="mt-4">
          <SourceCode file="frontend/src/app/learning/demo-chat/page.tsx" />
        </div>
      </Panel>
    </>
  );
}
