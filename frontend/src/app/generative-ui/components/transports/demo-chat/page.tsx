"use client";

import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";

/** The page's runtime (`generativeUI: true`), mounted for this page only. */
const RUNTIME_URL = "/api/copilotkit-genui-transports";
const WELCOME = "Try: compare the Starter, Team, and Enterprise plans in a table.";

/**
 * Transports: the `generativeUI` value of each of the page's three providers,
 * verbatim. "Only some agents" lists `shop`; no page publishes a `shop` agent,
 * so this chat talks to `default` — which is not in `agentIds` and should get
 * no catalog, no guide and no `render_ui`.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/transports" subtitle="tool · markdown · agentIds · agent: components_agent">
      <GenUIDemo
        variants={[
          {
            id: "tool",
            label: "Tool transport",
            note: "The agent calls render_ui; the table arrives as a separate tool-call message.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: { ui: standardUI },
            welcome: WELCOME,
          },
          {
            id: "markdown",
            label: "Markdown transport",
            note: "The agent writes ```a2ui blocks inside its reply; the table sits in the text.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: { ui: standardUI, transport: "markdown" },
            welcome: WELCOME,
          },
          {
            id: "some-agents",
            label: 'agentIds: ["shop"] — chat as default',
            note: "default is not in agentIds: expect a plain text answer. The shop half needs a shop agent, which no page publishes.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: { ui: standardUI, agentIds: ["shop"] },
            welcome: WELCOME,
          },
        ]}
      />
    </DemoFrame>
  );
}
