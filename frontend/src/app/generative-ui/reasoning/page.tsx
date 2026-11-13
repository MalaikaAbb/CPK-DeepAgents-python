import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Reasoning: reference only. Nothing is implemented, on purpose.
 *
 * Rendered for Deep Agents (fetched 2026-11-11) the page has a "Not available
 * for Langchain DeepAgents yet" banner and "Missing snippet" boxes for all
 * three code blocks, and no Code tab. Nothing is filled in from other frameworks.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/reasoning" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Reasoning tokens from models that emit them arrive as <code>REASONING_MESSAGE_*</code> events and render as their own message type: a built-in card (&quot;Thinking…&quot; while streaming, collapsing to &quot;Thought for X seconds&quot;), or your own component passed to the <code>messageView.reasoningMessage</code> slot.
        </p>
      </Panel>

      <Callout tone="warn" title="No Deep Agents code on the page">
        <p>
          Rendered under /deepagents/, the page says reasoning is not available for Deep Agents yet. The zero-config block and both tabs of the custom example (<code>page.tsx</code> and <code>reasoning-block.tsx</code>) are &quot;Missing snippet: No demo found for deepagents::reasoning-default&quot; / &quot;deepagents::reasoning-custom&quot;. There is no Code tab, no backend agent and no model configuration shown for this framework.
        </p>
        <p className="mt-2">
          Without the page&apos;s agent and its <code>ReasoningBlock</code> component there is nothing to build that would not be invented here, so this route has no agent and no demo. Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>
    </>
  );
}
