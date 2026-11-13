import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * HITL Overview: reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11): "Not available for Langchain
 * DeepAgents yet" and both code blocks are "Missing snippet".
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          An overview of human-in-the-loop: <code>useHumanInTheLoop</code> when the model decides to ask (a frontend tool whose <code>render</code> calls <code>respond</code>), <code>useInterrupt</code> when the graph forces the pause with <code>interrupt()</code>, and headless resolution for UIs outside the chat.
        </p>
      </Panel>

      <Callout tone="warn" title="No Deep Agents code on the page">
        <p>
          Rendered under /deepagents/, the page says this is not available for Deep Agents yet. Its two code blocks (the <code>useHumanInTheLoop</code> meeting-slot picker and the static slot list it reads) are &quot;Missing snippet: No demo found for deepagents::hitl-in-chat&quot;. There is no Code tab and no other code.
        </p>
        <p className="mt-2">
          Related routes in this repo: <code>/human-in-the-loop/governed-actions</code> (a tool-call approval flow) and <code>/generative-ui/your-components/interrupt-based</code> (<code>useInterrupt</code> against a Deep Agent that calls <code>interrupt()</code>). Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>
    </>
  );
}
