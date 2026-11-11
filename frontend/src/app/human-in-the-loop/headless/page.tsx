import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Headless Interrupts: reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11) the page says the feature is not
 * available on this framework and prints no code.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A render-less interrupt resolver assembled from the primitives <code>useInterrupt</code> uses internally (<code>useAgent</code>, <code>agent.subscribe</code>, <code>copilotkit.runAgent</code>), for button grids, side panels, test fixtures or any UI outside the chat.
        </p>
      </Panel>

      <Callout tone="warn" title="No code on the page for Deep Agents">
        <p>
          Rendered under /deepagents/, the page shows the &quot;Not available for Langchain DeepAgents yet&quot; banner, says headless interrupts are not available on this framework, and prints no code at all (its markdown export&apos;s blocks are not rendered for Deep Agents). There is no Code tab.
        </p>
        <p className="mt-2">
          Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>
    </>
  );
}
