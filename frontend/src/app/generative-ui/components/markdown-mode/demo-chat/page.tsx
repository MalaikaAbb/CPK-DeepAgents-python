"use client";

import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";

const WELCOME = "Try: give me a seat-count slider that shows the monthly price at $29 per seat.";

/**
 * Markdown mode: the `generativeUI` value of the page's two providers,
 * verbatim. With `sendContext: false` the catalog travels only in
 * `forwardedProps.copilotkit.ui`. The page's "build your own prompt" backend is
 * a three-line Python fragment that reads it into an undefined `input` and
 * `MY_PROMPT`, with no agent around it; it is not filled in, so this Deep
 * Agents graph never reads the catalog and that variant is expected to answer
 * without UI.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/markdown-mode" subtitle="a2ui code blocks · agent: components_agent">
      <GenUIDemo
        variants={[
          {
            id: "markdown",
            label: 'transport: "markdown"',
            note: "The provider sends the schema and the fence guide as context; copilotkitMiddleware shows them to the model.",
            generativeUI: { ui: standardUI, transport: "markdown" },
            welcome: WELCOME,
          },
          {
            id: "own-prompt",
            label: "sendContext: false",
            note: "No context entries. The catalog is only in forwardedProps.copilotkit.ui, which this agent never reads — expect no UI.",
            generativeUI: { ui: standardUI, transport: "markdown", sendContext: false },
            welcome: WELCOME,
          },
        ]}
      />
    </DemoFrame>
  );
}
