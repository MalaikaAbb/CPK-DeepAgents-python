import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>";

const SNIPPET_1 = "const runtime = new CopilotRuntime({\n  agents: { default: agent },\n  generativeUI: true,\n});";

const SNIPPET_2 = "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI, transport: \"markdown\" }}>";

const SNIPPET_3 = "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{ ui: standardUI, agentIds: [\"shop\"] }}\n>";

/**
 * Transports: reference only.
 *
 * The page (fetched 2026-11-11) teaches transports on top of
 * `@copilotkit/react-core/v2/generative-ui`, which react-core 1.73.3 does not
 * ship. Its React blocks are shown verbatim as text.
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

      <Callout tone="warn" title="Needs a newer CopilotKit than this repo installs">
        <p>
          Everything this page teaches lives in <code>@copilotkit/react-core/v2/generative-ui</code> and the provider&apos;s <code>generativeUI</code> prop. The installed <code>@copilotkit/react-core</code> is 1.73.3, which has neither: the entry point first appears in a release after 1.79.1 (1.84.0 has it). Importing a module that does not exist fails the Next build outright, so the page&apos;s React blocks are shown below as text instead of compiled. Upgrading CopilotKit is a dependency change outside a doc sync.
        </p>
        <p className="mt-2">
          Angular blocks are left out (this is a React harness). Nothing is borrowed from other harnesses or the showcase.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
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
