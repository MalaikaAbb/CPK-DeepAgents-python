import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "<head>\n  <script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>\n</head>\n<body>\n  <canvas id=\"myChart\"></canvas>\n</body>";

/**
 * Open Generative UI: reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11): "Not available for Langchain
 * DeepAgents yet"; every runtime and frontend block is "Missing snippet".
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Open-ended generative UI: <code>OpenGenerativeUIMiddleware</code> on the runtime turns the agent&apos;s streamed <code>generateSandboxedUi</code> tool call into activity events, and the built-in renderer builds the UI live in a sandboxed iframe (CSS, then HTML, then JS expressions). Sandbox functions let that UI call back into the host page.
        </p>
      </Panel>

      <Callout tone="warn" title="No Deep Agents code on the page">
        <p>
          Rendered under /deepagents/, the page says Open Generative UI is not available for Deep Agents yet. The runtime block that adds <code>OpenGenerativeUIMiddleware</code>, the <code>&lt;CopilotChat /&gt;</code> page, and the two advanced blocks (runtime and sandbox-function registration on the provider) are &quot;Missing snippet: No demo found for deepagents::open-gen-ui&quot; / &quot;deepagents::open-gen-ui-advanced&quot;. There is no Code tab. The only code printed is the CDN <code>&lt;script&gt;</code> example shown below.
        </p>
        <p className="mt-2">
          The prose does say what a Deep Agent would need (frontend tools reaching the model, which <code>CopilotKitMiddleware</code> provides), but not how the runtime middleware is constructed or where it goes, so no route is built. Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
        <p className="mb-2 text-xs font-medium text-slate-500">Using CDN libraries (generated HTML)</p>
        <CodeBlock code={SNIPPET_0} language="html" />
      </Panel>
    </>
  );
}
