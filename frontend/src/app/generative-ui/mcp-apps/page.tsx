import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          An MCP server whose tools carry UI resources: <code>MCPAppsMiddleware</code>{" "}
          on the runtime&apos;s agent adds the server&apos;s tools to each run,
          and when the agent calls one the chat renders the tool&apos;s UI in a
          sandboxed iframe. The page&apos;s runtime is mounted on its own
          endpoint with the Quickstart graph and the public Excalidraw server.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Draw a simple flowchart with three boxes: Plan, Build, Ship."]}
            expect="The agent calls an Excalidraw tool and an interactive Excalidraw canvas renders inline in the chat. Not yet observed here."
            fail="A plain-text reply with no tool call (the middleware's tools never reached the model), an error banner (mcp.excalidraw.com unreachable, or the 0.1.1 middleware failing on runtime 1.73.3), or a tool call with no iframe."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Version mismatch with the page, and harness glue">
        <p>
          The page says to install <code>@ag-ui/mcp-apps-middleware</code> and
          use <code>@copilotkit/runtime</code> 1.76.0 or later, because the
          current middleware (0.1.3) needs <code>@ag-ui/client</code> 1.x. This
          repo is on runtime 1.73.3, whose AG-UI is 0.0.59; installing 0.1.3
          would add a second AG-UI copy. Runtime 1.73.3 already pulls in the
          middleware at 0.1.1 (peer <code>@ag-ui/client &gt;=0.0.40</code>),
          and that copy is what the import resolves to. It is not declared in{" "}
          <code>package.json</code>. Whether 0.1.1 behaves like the version the
          page documents is exactly what this route tests.
        </p>
        <p className="mt-2">
          Harness changes, both labelled in the files: the runtime&apos;s{" "}
          <code>basePath</code> is <code>/api/copilotkit-mcp-apps</code>{" "}
          instead of <code>/api/copilotkit</code>, and the demo mounts its own{" "}
          <code>CopilotKitProvider</code> pointed there (the page needs no
          frontend code, so it prints none). The agent is the page&apos;s own{" "}
          <code>LangGraphAgent</code> for <code>sample_agent</code>. Needs
          network access to <code>mcp.excalidraw.com</code>. The page&apos;s{" "}
          <code>deploymentUrl</code> falls back to port 8123, while this
          repo&apos;s LangGraph server listens on 8030, so set{" "}
          <code>LANGGRAPH_DEPLOYMENT_URL</code> in <code>frontend/.env.local</code>{" "}
          for this route (the other routes default to 8030 on their own).
        </p>
      </Callout>

      <Panel title="The runtime route">
        <SourceCode file="frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/generative-ui/mcp-apps/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
