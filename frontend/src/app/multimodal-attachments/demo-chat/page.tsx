"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "sample_agent";

/**
 * Multimodal Attachments Quick start
 * https://docs.copilotkit.ai/deepagents/multimodal-attachments
 *
 * Add `attachments` to your `CopilotChat` component:
 *
 *   <CopilotChat
 *     agentId="sample_agent"
 *     attachments={{ enabled: true }}
 *   />
 *
 * That's it. Users can now click the attachment button or drag-and-drop files into the chat.
 * The files are sent as part of the message content to your agent.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/multimodal-attachments"
      subtitle={`agent: ${AGENT_ID} · CopilotChat attachments={{ enabled: true }}`}
    >
      <CopilotChat
        agentId={AGENT_ID}
        attachments={{ enabled: true }}
      />
    </DemoFrame>
  );
}
