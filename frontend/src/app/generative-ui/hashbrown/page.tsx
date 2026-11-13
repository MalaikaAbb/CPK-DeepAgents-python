import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "{\n  \"ui\": [\n    { \"metric\": { \"props\": { \"label\": \"Total Revenue\", \"value\": \"$1.2M\" } } },\n    {\n      \"pieChart\": {\n        \"props\": {\n          \"title\": \"Revenue by Segment\",\n          \"data\": \"[{\\\"label\\\":\\\"Enterprise\\\",\\\"value\\\":600000},{\\\"label\\\":\\\"SMB\\\",\\\"value\\\":400000},{\\\"label\\\":\\\"Startup\\\",\\\"value\\\":200000}]\"\n        }\n      }\n    }\n  ]\n}";

/**
 * Hashbrown: reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11): "Not available for Langchain
 * DeepAgents yet", no Code tab, and only an example assistant message printed.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Progressive generative UI: the agent streams one <code>&#123; ui: [...] &#125;</code> JSON object, and an assistant-message renderer parses it with Hashbrown&apos;s <code>useJsonParser</code> against a UI kit schema and renders finished parts with <code>kit.render</code> while the rest is still arriving.
        </p>
      </Panel>

      <Callout tone="warn" title="Only an example output is published for Deep Agents">
        <p>
          Rendered under /deepagents/, the page says this feature is not available for Deep Agents yet. It describes <code>HashBrownDashboard</code>, <code>HashBrownRenderMessage</code>, the kit&apos;s <code>metric</code>/<code>pieChart</code>/<code>barChart</code>/<code>dealCard</code>/<code>Markdown</code> components, the runtime route and the agent, and refers to a Code tab, but the page has no Code tab for this framework. The only code it prints is the example assistant message below.
        </p>
        <p className="mt-2">
          It also names <code>@hashbrownai/core</code> and <code>@hashbrownai/react</code> <code>0.5.0-beta.4</code> for the bundled demos. Nothing is installed or built here. Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
        <p className="mb-2 text-xs font-medium text-slate-500">Example assistant message</p>
        <CodeBlock code={SNIPPET_0} language="json" />
      </Panel>
    </>
  );
}
