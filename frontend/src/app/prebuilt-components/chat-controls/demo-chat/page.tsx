"use client";

import {
  CopilotChatConfigurationProvider,
  CopilotSidebar,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "sample_agent";

// Programmatically open or close the chat
// Read it with useCopilotChatConfiguration() and call setModalOpen(true | false)
function OpenChatButton() {
  const config = useCopilotChatConfiguration();
  // setModalOpen is only present when a provider in the tree owns modal state
  // (the prebuilt CopilotPopup / CopilotSidebar create it for you).
  if (!config?.setModalOpen) return null;
  return <button onClick={() => config.setModalOpen(true)}>Close</button>;
}

// Control the open state from your own UI
// Pass open and onOpenChange to <CopilotSidebar> or <CopilotPopup> to own the open state yourself.
export default function Page() {
  const [chatOpen, setChatOpen] = useState(false);
  const [feedbackEvents, setFeedbackEvents] = useState<
    { value: "up" | "down"; messageId: string }[]
  >([]);

  // Simulated analytics.track from the doc snippet
  const analytics = {
    track: (
      event: string,
      data: { messageId?: string; value: "up" | "down" },
    ) => {
      console.log(event, data);
      if (data.messageId) {
        setFeedbackEvents((prev) => [
          ...prev,
          { value: data.value, messageId: data.messageId! },
        ]);
      }
    },
  };

  return (
    <DemoFrame
      parentPath="/prebuilt-components/chat-controls"
      subtitle={`agent: ${AGENT_ID} · CopilotSidebar controls & feedback`}
    >
      <style>{`
        button[data-copilotkit-rating][aria-pressed="true"] {
          background-color: #000 !important;
          color: #fff !important;
        }
        button[data-copilotkit-rating][aria-pressed="true"] svg {
          fill: currentColor !important;
          stroke-width: 2.5px !important;
        }
      `}</style>
      <CopilotChatConfigurationProvider
        agentId={AGENT_ID}
        isModalDefaultOpen={chatOpen}
      >
        <div className="flex h-full w-full">
          {/* Main Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <nav className="flex items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
              <button
                onClick={() => setChatOpen(true)}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
              >
                Ask the assistant
              </button>
              <OpenChatButton />
            </nav>

            <main className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-500">
              Click &ldquo;Ask the assistant&rdquo; or &ldquo;Open chat&rdquo;
              to open the sidebar.
            </main>
          </div>

          {/* Right Drawer / Console / Analytics Output Panel */}
          <aside className="w-80 shrink-0 border-l border-slate-800 bg-[#070b14] p-6 text-slate-300 flex flex-col font-mono text-xs">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              ANALYTICS.TRACK(...)
            </div>
            <div className="mt-4">
              {feedbackEvents.length === 0 ? (
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Send a message, then press 👍 or 👎 under the reply.
                </p>
              ) : (
                <div className="space-y-4">
                  {feedbackEvents.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-slate-200">
                        feedback: {item.value} on
                      </div>
                      <div className="break-all text-slate-400">
                        {item.messageId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Capture message feedback (thumbs up / down) on assistantMessage */}
          <CopilotSidebar
            agentId={AGENT_ID}
            open={chatOpen}
            onOpenChange={setChatOpen}
            messageView={{
              assistantMessage: {
                onThumbsUp: (message) => {
                  analytics.track("feedback", {
                    messageId: message.id,
                    value: "up",
                  });
                },
                onThumbsDown: (message) => {
                  analytics.track("feedback", {
                    messageId: message.id,
                    value: "down",
                  });
                },
              },
            }}
          />
        </div>
      </CopilotChatConfigurationProvider>
    </DemoFrame>
  );
}
