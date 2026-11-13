"use client";

import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../_shared/genui-demo";

/**
 * The page's step 3: a provider given `generativeUI={{ ui: standardUI }}` and a
 * plain chat. Harness change: the provider's `runtimeUrl` is
 * `/api/copilotkit-genui` (the page's runtime, mounted beside the main one),
 * whose agent is the `components_agent` Deep Agents graph standing in for the
 * page's TanStack `BuiltInAgent`, with the same prompt.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components" subtitle="standardUI · agent: components_agent">
      <GenUIDemo
        variants={[
          {
            id: "overview",
            label: "standardUI",
            generativeUI: { ui: standardUI },
            welcome: "Try: Compare the Starter, Team, and Enterprise plans in a table",
          },
        ]}
      />
    </DemoFrame>
  );
}
