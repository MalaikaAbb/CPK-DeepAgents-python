"use client";

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * MCP Apps. The page says no frontend change is needed, so the frontend here
 * is harness glue only: the Quickstart's provider shape pointed at the page's
 * runtime, which this repo mounts at /api/copilotkit-mcp-apps, and a plain
 * chat. The runtime registers the Quickstart graph as `sample_agent`, with
 * the Excalidraw MCP Apps middleware attached.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/mcp-apps" subtitle="graph: sample_agent + MCPAppsMiddleware">
      <CopilotKitProvider
        runtimeUrl="/api/copilotkit-mcp-apps"
        agentId="sample_agent"
        useSingleEndpoint={false}
      >
        <CopilotChat className="h-full" />
      </CopilotKitProvider>
    </DemoFrame>
  );
}
