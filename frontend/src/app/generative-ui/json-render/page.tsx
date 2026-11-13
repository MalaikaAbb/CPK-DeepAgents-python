import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "{\n  \"root\": \"revenue-card\",\n  \"elements\": {\n    \"revenue-card\": {\n      \"type\": \"MetricCard\",\n      \"props\": { \"label\": \"Total revenue\", \"value\": \"$184,302\", \"trend\": \"+12%\" },\n      \"children\": [\"by-region\"]\n    },\n    \"by-region\": {\n      \"type\": \"BarChart\",\n      \"props\": {\n        \"title\": \"Revenue by region\",\n        \"description\": null,\n        \"data\": [\n          { \"label\": \"North America\", \"value\": 112000 },\n          { \"label\": \"EMEA\", \"value\": 72302 }\n        ]\n      }\n    }\n  }\n}";

/**
 * JSON Render: reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11): "Not available for Langchain
 * DeepAgents yet", no Code tab, and only an example agent output printed.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Bring-your-own-components generative UI: the agent replies with a <code>&#123; root, elements &#125;</code> JSON object, and a renderer in <code>CopilotChat</code>&apos;s <code>messageView.assistantMessage</code> slot draws it with <code>@json-render/react</code> through a <code>defineCatalog</code> / <code>defineRegistry</code> pair.
        </p>
      </Panel>

      <Callout tone="warn" title="Only an example output is published for Deep Agents">
        <p>
          Rendered under /deepagents/, the page says this feature is not available for Deep Agents yet. It describes the frontend files (<code>page.tsx</code>, <code>chat.tsx</code>, <code>json-render-renderer.tsx</code>, <code>catalog.ts</code>, <code>registry.tsx</code>), the runtime route and the agent, and refers to a Code tab for them, but the page has no Code tab for this framework. The only code it prints is the example agent output shown below.
        </p>
        <p className="mt-2">
          Without the renderer, catalog, registry, agent prompt or runtime route, a demo here would be written from scratch, so none is built and <code>@json-render/react</code> is not installed. Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
        <p className="mb-2 text-xs font-medium text-slate-500">Example agent output</p>
        <CodeBlock code={SNIPPET_0} language="json" />
      </Panel>
    </>
  );
}
