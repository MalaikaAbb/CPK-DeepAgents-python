import {
  CopilotKitIntelligence,
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

import {
  A2UI_DYNAMIC_GRAPH_ID,
  LANGGRAPH_DEPLOYMENT_URL,
  LANGSMITH_API_KEY,
} from "@/lib/agents";

/**
 * A second runtime, for the three routes that drive the A2UI dynamic-schema
 * agent: Dynamic Schema, Styling and Advanced.
 *
 * Note the absence of an `a2ui` block. That is the Dynamic Schema page's point:
 * passing a catalog to the provider is enough to turn A2UI on and inject
 * `generate_a2ui`, so the runtime needs no configuration. It has to be its own
 * endpoint because /api/copilotkit turns injection off for the fixed-schema
 * agent, and that setting is per-runtime.
 *
 * Same v2 shape and same catch-all path as the main route — see the comments
 * there for why both matter.
 */
const agents = {
  [A2UI_DYNAMIC_GRAPH_ID]: new LangGraphAgent({
    deploymentUrl: LANGGRAPH_DEPLOYMENT_URL,
    graphId: A2UI_DYNAMIC_GRAPH_ID,
    langsmithApiKey: LANGSMITH_API_KEY,
  }),
};

const INTELLIGENCE_API_KEY = process.env.INTELLIGENCE_API_KEY;
const LICENSE_TOKEN = process.env.COPILOTKIT_LICENSE_TOKEN;

function buildRuntime(): CopilotRuntime {
  if (!INTELLIGENCE_API_KEY) {
    return new CopilotRuntime({
      agents,
      runner: new InMemoryAgentRunner(),
      ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    });
  }

  return new CopilotRuntime({
    agents,
    ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    intelligence: new CopilotKitIntelligence({ apiKey: INTELLIGENCE_API_KEY }),
    identifyUser: (request) => ({
      id: request.headers.get("x-user-id") ?? "anonymous",
      name: request.headers.get("x-user-name") ?? "Anonymous",
    }),
  });
}

const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime(),
  basePath: "/api/copilotkit-a2ui-dynamic",
});

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
