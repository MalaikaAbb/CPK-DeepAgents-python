import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

import { LANGGRAPH_DEPLOYMENT_URL, LANGSMITH_API_KEY } from "@/lib/agents";

/**
 * The Transports page's runtime.
 *
 * https://docs.copilotkit.ai/deepagents/generative-ui/components/transports
 * prints `new CopilotRuntime({ agents: { default: agent }, generativeUI: true })`
 * (verbatim below). `agent` is the same `components_agent` Deep Agents graph as
 * `/api/copilotkit-genui` (framework-own-agents swap for the section's
 * `BuiltInAgent`); the handler lines are the section's own, mounted at
 * `/api/copilotkit-genui-transports` so `generativeUI: true` stays on this page.
 *
 * The page's "Only some agents" sample names a `shop` agent. No page publishes
 * one, so none is registered: only the `default` half of that sample runs.
 */
const agent = new LangGraphAgent({
  deploymentUrl: LANGGRAPH_DEPLOYMENT_URL,
  graphId: "components_agent",
  langsmithApiKey: LANGSMITH_API_KEY,
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  generativeUI: true,
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-genui-transports" });

export const GET = handler;
export const POST = handler;
