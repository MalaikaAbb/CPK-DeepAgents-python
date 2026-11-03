"use client";

import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

// The backend custom StateGraph is registered as 'state_io_graph' in langgraph.json.
// The doc's Step 3 snippet names "sample_agent", which has no input/output schema separation;
// state_io_graph is the compiled graph implementing the page's input/output schema split.
const AGENT_ID = "state_io_graph";

function MainContent() {
  const { agent } = useAgent({
    agentId: AGENT_ID,
  });

  const answer = (agent.state.answer as string) ?? "Not returned yet";
  console.log(answer);

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Workflow Execution
      </h1>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        Answer: <strong>{answer}</strong>
      </p>

      <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {JSON.stringify(agent.state, null, 2)}
      </pre>
    </div>
  );
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/workflow-execution"
      subtitle={`graph: ${AGENT_ID}`}
    >
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
        <MainContent />
        <div className="min-h-0 border-t border-slate-200 md:border-l md:border-t-0 dark:border-slate-800">
          <CopilotChat agentId={AGENT_ID} className="h-full" />
        </div>
      </div>
    </DemoFrame>
  );
}
