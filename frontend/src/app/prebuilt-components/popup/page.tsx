import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "import { CopilotKit, CopilotPopup } from \"@copilotkit/react-core/v2\";\nimport \"@copilotkit/react-core/v2/styles.css\";";

/**
 * CopilotPopup: reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11) the page has a "Not available
 * for Langchain DeepAgents yet" banner; everything but a two-line import is
 * "Missing snippet".
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/popup" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A floating launcher bubble that opens an overlay chat window, with defaultOpen, agentId, labels and header/toggleButton slots.
        </p>
      </Panel>

      <Callout tone="warn" title="Only the import line is published for Deep Agents">
        <p>
          Rendered under /deepagents/, the page says this feature is not available for Deep Agents yet. The only code it prints is the two-line import shown below; the basic setup block (open by default, custom placeholder via labels) are &quot;Missing snippet: No demo found for deepagents::prebuilt-popup&quot;. There is no Code tab.
        </p>
        <p className="mt-2">
          A route that renders <code>&lt;CopilotPopup&gt;</code> here would be written by the harness rather than taken from the page, so none is built. The component itself is exercised elsewhere in this repo (the Quickstart&apos;s demo renders <code>&lt;CopilotSidebar&gt;</code>, and most demos render <code>&lt;CopilotChat&gt;</code>). Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
        <p className="mb-2 text-xs font-medium text-slate-500">Basic setup (the import the page prints)</p>
        <CodeBlock code={SNIPPET_0} language="tsx" />
      </Panel>
    </>
  );
}
