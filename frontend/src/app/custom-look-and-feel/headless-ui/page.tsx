import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Headless UI: reference only. Nothing is implemented, on purpose.
 *
 * Rendered for Deep Agents (fetched 2026-11-11) the page has a "Not available
 * for Langchain DeepAgents yet" banner and "Missing snippet" boxes in place of
 * every code block, and no Code tab.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/headless-ui" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Building your own chat surface from the low-level hooks: <code>useAgent</code> for messages and run state, <code>useCopilotKit</code> for <code>runAgent(&#123; agent &#125;)</code>, <code>useRenderToolCall</code> for tool calls, and for a complete rebuild <code>useRenderActivityMessage</code> and <code>useRenderCustomMessages</code>, composed by a hand-written <code>useRenderedMessages</code> hook.
        </p>
      </Panel>

      <Callout tone="warn" title="No code on the page for Deep Agents">
        <p>
          Rendered under /deepagents/, the page says headless UI is not available for Deep Agents yet. All of its code (the minimal example&apos;s message list and composer, and the complete example&apos;s <code>useRenderedMessages</code> hook, per-role dispatch, tool-call composition and <code>UserBubble</code>/<code>AssistantBubble</code> chrome) is &quot;Missing snippet: No demo found for deepagents::headless-simple&quot; or &quot;deepagents::headless-complete&quot;. There is no Code tab.
        </p>
        <p className="mt-2">
          The prose lists the hooks but prints no usage, so a demo here would be written from scratch rather than from the page. Nothing is built and nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>
    </>
  );
}
