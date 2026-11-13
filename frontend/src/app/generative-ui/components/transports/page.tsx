import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>";

const SNIPPET_1 = "const runtime = new CopilotRuntime({\n  agents: { default: agent },\n  generativeUI: true,\n});";

const SNIPPET_2 = "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI, transport: \"markdown\" }}>";

const SNIPPET_3 = "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{ ui: standardUI, agentIds: [\"shop\"] }}\n>";

/**
 * Transports: the page's React blocks, shown as text below; the
 * runnable ones are mounted in `demo-chat/` (see the status note).
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/transports" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          How generated UI reaches the browser: the default <code>render_ui</code> tool transport, or <code>transport: &quot;markdown&quot;</code> with a2ui blocks in the reply; limiting it to some agents with <code>agentIds</code>.
        </p>
      </Panel>

      <Callout tone="info" title="How this route is wired">
        <p>
          The demo runs on <code>/api/copilotkit-genui</code>
           (for this page, <code>/api/copilotkit-genui-transports</code> with the page&apos;s <code>generativeUI: true</code>), the section&apos;s runtime mounted beside the main one. Its
          agent is <code>components_agent</code>, a Deep Agents graph standing
          in for the section&apos;s TanStack <code>BuiltInAgent</code> (same
          prompt, no tools, <code>CopilotKitMiddleware</code> as the page says
          for a LangGraph Python agent). Each provider&apos;s{" "}
          <code>generativeUI</code> value is the page&apos;s; only its{" "}
          <code>runtimeUrl</code> differs. Needs CopilotKit 1.87 (this repo was
          on 1.73.3, which has no <code>v2/generative-ui</code>). What runs and
          what stays broken is in the status note above.
        </p>
      </Callout>

      <Panel title="Code the page prints" description="Verbatim from the rendered page. The runnable parts are mounted in the demo; the rest is listed in the status note.">
        <p className="mb-2 text-xs font-medium text-slate-500">Block 1</p>
        <CodeBlock code={SNIPPET_0} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">app/api/copilotkit/route.ts</p>
        <CodeBlock code={SNIPPET_1} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 3</p>
        <CodeBlock code={SNIPPET_2} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 4</p>
        <CodeBlock code={SNIPPET_3} language="tsx" />
      </Panel>
    </>
  );
}
