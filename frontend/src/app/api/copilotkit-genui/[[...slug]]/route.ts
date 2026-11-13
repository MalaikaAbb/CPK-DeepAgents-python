import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

import { LANGGRAPH_DEPLOYMENT_URL, LANGSMITH_API_KEY } from "@/lib/agents";

/**
 * The Components and surfaces runtime.
 *
 * https://docs.copilotkit.ai/deepagents/generative-ui/components ("Add the
 * runtime and an agent"): `new CopilotRuntime({ agents: { default: agent },
 * runner: new InMemoryAgentRunner() })`, served multi-route at
 * `[[...slug]]`, as published. Two harness changes, both labelled:
 *
 *   - `agent` is the `components_agent` Deep Agents graph on this repo's
 *     LangGraph server, reached the way `/api/copilotkit` reaches its graphs,
 *     instead of the page's TanStack `BuiltInAgent` (framework-own-agents).
 *   - It is mounted at `/api/copilotkit-genui`, not `/api/copilotkit`, so the
 *     catalogs these demos send never reach the other routes' agents. Every
 *     Components demo points its provider here.
 *
 * Nothing else is set: the page says the runtime needs no change for
 * generative UI — a run that carries a catalog gets `render_ui` and its guide.
 */
const agent = new LangGraphAgent({
  deploymentUrl: LANGGRAPH_DEPLOYMENT_URL,
  graphId: "components_agent",
  langsmithApiKey: LANGSMITH_API_KEY,
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-genui" });

export const GET = handler;
export const POST = handler;
