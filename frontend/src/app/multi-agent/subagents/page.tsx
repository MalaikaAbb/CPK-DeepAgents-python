import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Sub-agents — reference only. Nothing is implemented, on purpose.
 *
 * Rendered for Deep Agents (fetched 2026-11-11), the page shows a "Not
 * available for Langchain DeepAgents yet" banner and a "Missing snippet — No
 * demo found for deepagents::subagents" box in place of each of its three code
 * blocks. The `.md` export carries the default LangGraph-Python snippets
 * instead, but those are not this framework's code (AGENTS.md rule 4), and
 * even they import an unpublished `HeaderForwardingMiddleware`, never build the
 * supervisor agent, and leave `SubAgentName`, `DelegationLogProps` and
 * `SUB_AGENT_STYLE` undefined in the delegation-log component. Nothing here is
 * filled in from a sibling or the showcase.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent/subagents" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A supervisor agent that hands narrow jobs (research, drafting,
          critique) to sub-agents exposed as tools, records each hand-off in a{" "}
          <code>delegations</code> list in shared state, and a frontend that
          renders that list live with{" "}
          <code>useAgent({"{ updates: [OnStateChanged, OnRunStatusChanged] }"})</code>
          .
        </p>
      </Panel>

      <Callout tone="warn" title="No Deep Agents code on the page">
        <p>
          Rendered under <code>/deepagents/</code>, the page says the feature is
          not available for Deep Agents yet and shows &ldquo;Missing snippet:
          No demo found for deepagents::subagents&rdquo; where all three code
          blocks (sub-agent setup, delegation tools, delegation log) should be.
          There is no backend, no runtime wiring and no frontend to copy, so
          this route has no agent and no demo.
        </p>
        <p className="mt-2">
          The page&apos;s markdown export does contain code, but it is the
          generic LangGraph default, not this framework&apos;s. It is also
          incomplete on its own terms: it imports{" "}
          <code>HeaderForwardingMiddleware</code> from an unpublished{" "}
          <code>src.agents._header_forwarding_middleware</code> module, never
          creates the supervisor agent that would own the three delegation
          tools, and its <code>DelegationLog</code> component uses{" "}
          <code>SubAgentName</code>, <code>DelegationLogProps</code> and{" "}
          <code>SUB_AGENT_STYLE</code> without defining them. The page&apos;s
          own warning also advises against the{" "}
          <code>Annotated[list, operator.add]</code> reducer that the same
          snippet uses for <code>delegations</code>.
        </p>
        <p className="mt-2">
          Per this repo&apos;s rules nothing is filled in from another
          framework or the showcase. When the docs publish a Deep Agents
          version, build it here and update the status in{" "}
          <code>lib/nav-config.ts</code>.
        </p>
      </Callout>
    </>
  );
}
