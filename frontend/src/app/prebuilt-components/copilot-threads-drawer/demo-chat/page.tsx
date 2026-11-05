"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotThreadsDrawer,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "sample_agent";

function NewConversationButton() {
  const configuration = useCopilotChatConfiguration();

  return (
    <button
      type="button"
      onClick={() => configuration?.startNewThread()}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      New conversation
    </button>
  );
}

/**
 * A drawer and a chat inside one shared `CopilotChatConfigurationProvider`,
 * with a custom "New conversation" button.
 *
 * The shared configuration is the point. It holds the active thread, so
 * selecting a row connects the chat to that thread and replays its history, and
 * both the drawer's "New Conversation" row and our custom `NewConversationButton`
 * call `configuration.startNewThread()` to reset the chat to a fresh welcome screen —
 * with no `threadId` state, no selection handler, and no props passed between the
 * components.
 *
 * `CopilotKitProvider` is not repeated here; the app already mounts one at the
 * root. The doc nests them because its sample is a whole page.
 *
 * In a flex row `CopilotChat` has no flex basis of its own, so it collapses to
 * min-content beside a full-width drawer unless constrained; `flex: 1` plus
 * `minWidth: 0` gives it the remaining space.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${AGENT_ID} · CopilotThreadsDrawer + CopilotChat`}
    >
      <CopilotChatConfigurationProvider agentId={AGENT_ID}>
        <div style={{ display: "flex", height: "100%" }}>
          <CopilotThreadsDrawer />
          <main
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <header className="border-b border-slate-200 p-2 dark:border-slate-800">
              <NewConversationButton />
            </header>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CopilotChat />
            </div>
          </main>
        </div>
      </CopilotChatConfigurationProvider>
    </DemoFrame>
  );
}
