"use client";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { appUI } from "./app-ui";

/**
 * The "After" provider: `generativeUI={{ ui: appUI }}`. Its runtime is
 * `/api/copilotkit-genui`, which already matches "Runtime, after" (no A2UI
 * option).
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/from-a2ui" subtitle="createGenerativeUI · after · agent: components_agent">
      <GenUIDemo
        variants={[
          {
            id: "after",
            label: "After",
            generativeUI: { ui: appUI },
            welcome: "Try: show a flight card from SFO (San Francisco) to JFK (New York) with a Book button.",
          },
        ]}
      />
    </DemoFrame>
  );
}
