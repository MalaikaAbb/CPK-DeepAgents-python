import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "function ApprovalInterrupt() {\n  useInterrupt({\n    render: ({ interrupt, resolve, cancel }) => (\n      <div className=\"p-3 border rounded\">\n        <p>{interrupt?.message ?? \"Approve this action?\"}</p>\n        <div className=\"mt-2 flex gap-2\">\n          <button onClick={() => resolve({ approved: true })}>Approve</button>\n          <button onClick={() => cancel()}>Cancel</button>\n        </div>\n      </div>\n    ),\n  });\n  return null;\n}";

const SNIPPET_1 = "useInterrupt({\n  render: ({ interrupts, resolve, cancel }) => (\n    <ul>\n      {interrupts.map((i) => (\n        <li key={i.id}>\n          {i.message}\n          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>\n          <button onClick={() => cancel(i.id)}>Cancel</button>\n        </li>\n      ))}\n    </ul>\n  ),\n});";

/**
 * Pausing the Agent for Input (useInterrupt): reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11) the page says useInterrupt is
 * not available on this framework and prints no backend; its two generic
 * frontend blocks are shown verbatim as text.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/useInterrupt" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>useInterrupt</code> hands a paused run to your component: <code>interrupt</code> / <code>interrupts</code> from a <code>RUN_FINISHED</code> with <code>outcome.type === &quot;interrupt&quot;</code> (standard flow) or an <code>on_interrupt</code> custom event (legacy flow), and <code>resolve(payload, id)</code> / <code>cancel(id)</code> that resume once every open interrupt is answered.
        </p>
      </Panel>

      <Callout tone="warn" title="The page says this is not available for Deep Agents">
        <p>
          Rendered under /deepagents/, the page shows the &quot;Not available for Langchain DeepAgents yet&quot; banner and states in its own text that <code>useInterrupt</code> is not available on this framework. It prints no backend (no agent that calls <code>interrupt()</code>), only two generic frontend blocks, shown below verbatim.
        </p>
        <p className="mt-2">
          Those blocks do match the installed react-core 1.73.3 (<code>interrupt</code>, <code>interrupts</code>, <code>resolve</code>, <code>cancel</code> are all on its render props), but with no published agent there is nothing on this page to run them against. Deep Agents are LangGraph graphs and do support <code>interrupt()</code>; this repo&apos;s <code>/generative-ui/your-components/interrupt-based</code> route already runs <code>useInterrupt</code> against one, from that page&apos;s code. Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
        <p className="mb-2 text-xs font-medium text-slate-500">Approve / Cancel example</p>
        <CodeBlock code={SNIPPET_0} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Multi-interrupt behavior</p>
        <CodeBlock code={SNIPPET_1} language="tsx" />
      </Panel>
    </>
  );
}
