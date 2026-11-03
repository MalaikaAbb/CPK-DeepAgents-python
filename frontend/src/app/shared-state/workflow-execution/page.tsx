import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, KeyValue, Panel, TryIt } from "@/components/ui";

const BOTH_PAGES_OPEN = `# Workflow Execution

> Decide which state properties are received and returned to the frontend`;

const OTHER_PAGE_OPEN = `# Input/Output Schemas

> Decide which state properties are received and returned to the frontend`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/workflow-execution" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Deciding which state properties are received and returned to the frontend
          using LangGraph&apos;s <strong>Input and Output Schema feature</strong>.
        </p>

        <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>Step 1 (Old state):</strong> A monolithic <code>AgentState</code>{" "}
            holding <code>question</code>, <code>answer</code>, and internal{" "}
            <code>resources</code>.
          </p>
          <p>
            <strong>Step 2 (Input/Output split):</strong> Splitting state into{" "}
            <code>InputState(question)</code>, <code>OutputState(answer)</code>, and{" "}
            <code>OverallState(InputState, OutputState, resources)</code> passed to{" "}
            <code>StateGraph(OverallState, input_schema=..., output_schema=...)</code>.
          </p>
          <p>
            <strong>Step 3 (Client inspection):</strong> Using <code>useAgent</code>{" "}
            to verify that <code>answer</code> is returned, <code>question</code> is
            accepted but not echoed, and <code>resources</code> is completely hidden.
          </p>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={[
              "Ask a question in the chat (e.g. 'Why is the sky blue?')",
              "Inspect the answer rendered from agent.state.answer in the main content panel",
            ]}
            expect="answer updates in agent.state; internal resources never crosses the wire."
            fail="resources is exposed in state, or answer fails to update."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Upstream Doc Duplication & Discrepancies">
        <p>
          The nav lists &ldquo;Workflow Execution&rdquo; as its own entry, and the
          URL resolves. However, the published doc page is an exact content duplicate of
          the &ldquo;Input/Output Schemas&rdquo; doc (identical prose, steps, and
          code).
        </p>
        <p className="mt-2">
          Additionally, Step 3 in the published doc prints{" "}
          <code>useAgent(&#123; agentId: &quot;sample_agent&quot; &#125;)</code>,
          which references the Quickstart Deep Agent rather than the compiled
          StateGraph with schema split. In this harness, the demo connects to{" "}
          <code>state_io_graph</code> so the schema split is actually exercised.
        </p>
      </Callout>

      <Panel title="Upstream Page Comparison">
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock
            code={BOTH_PAGES_OPEN}
            language="text"
            filename="deepagents/shared-state/workflow-execution"
          />
          <CodeBlock
            code={OTHER_PAGE_OPEN}
            language="text"
            filename="deepagents/shared-state/state-inputs-outputs"
          />
        </div>
      </Panel>

      <Panel title="The demo implementation">
        <SourceCode file="frontend/src/app/shared-state/workflow-execution/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The backend graph"
        description="The compiled StateGraph in backend/src/state_inputs_outputs.py"
      >
        <SourceCode file="backend/src/state_inputs_outputs.py" />
      </Panel>
    </>
  );
}
