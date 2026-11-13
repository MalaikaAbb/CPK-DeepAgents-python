"use client";

// The page's import block, verbatim. Nothing below uses either name: the
// `useComponent` registration they are for is "Missing snippet" on the page
// when rendered for Deep Agents, and is not written here.
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";
/* eslint-enable @typescript-eslint/no-unused-vars */

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "tool_based_agent";

/**
 * Components as Tools, as far as the page goes for Deep Agents.
 *
 * The agent is the page's (`backend/src/tool_based.py`): CopilotKitMiddleware
 * plus a prompt that tells the model to call `render_bar_chart`. The frontend
 * half, the `useComponent` call that would register `render_bar_chart` and
 * its chart component, is not published for this framework, so nothing is
 * registered here. The chat (harness chrome, not doc code) shows what the
 * page's code alone produces.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/tool-based" subtitle={`graph: ${AGENT_ID}`}>
      <CopilotChat agentId={AGENT_ID} className="h-full" />
    </DemoFrame>
  );
}
