// MCP Apps — the page's `app/api/copilotkit/[[...slug]]/route.ts`, verbatim
// (fetched 2026-11-11) except for one harness change, marked below: it is
// mounted at /api/copilotkit-mcp-apps rather than /api/copilotkit, so it does
// not replace the runtime every other route uses.
//
// Versions. The page says to `npm install @ag-ui/mcp-apps-middleware` and to
// use @copilotkit/runtime 1.76.0+, because the current middleware (0.1.3)
// needs @ag-ui/client 1.x. This repo is on runtime 1.73.3 / @ag-ui/client
// 0.0.59, and installing 0.1.3 would add a second AG-UI copy. Runtime 1.73.3
// already depends on @ag-ui/mcp-apps-middleware ^0.1.1 (0.1.1 in the lockfile,
// peer @ag-ui/client >=0.0.40), so the import below resolves to that copy,
// undeclared in package.json. Not yet run against the Excalidraw server.
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph"; 
import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware"; 

const agent = new LangGraphAgent({
deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
  graphId: "sample_agent",
langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
});

agent.use(
  new MCPAppsMiddleware({
    mcpServers: [
      {
        type: "http",
        url: "https://mcp.excalidraw.com",
        serverId: "excalidraw",
      },
    ],
  }),
);

const runtime = new CopilotRuntime({
  agents: { sample_agent: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  // Harness change: the page's basePath is "/api/copilotkit".
  basePath: "/api/copilotkit-mcp-apps",
});

export const GET = handler;
export const POST = handler;
