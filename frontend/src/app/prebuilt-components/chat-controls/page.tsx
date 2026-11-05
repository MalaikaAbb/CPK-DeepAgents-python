import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/chat-controls" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two common controls for the prebuilt chat surfaces (
          <code>CopilotSidebar</code> and <code>CopilotPopup</code>): opening and
          closing the surface from outside UI, and capturing assistant message
          thumbs-up / thumbs-down feedback.
        </p>

        <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Controlled open state:</strong> Pass <code>open</code> and{" "}
            <code>onOpenChange</code> to own the open state in your component.
            The button lives outside the sidebar; requests to open or close
            arrive on <code>onOpenChange</code>.
          </p>
          <p>
            <strong>2. Programmatic context control:</strong> Alternatively, read{" "}
            <code>useCopilotChatConfiguration()</code> and invoke{" "}
            <code>config.setModalOpen(true | false)</code> from any component
            inside the provider hierarchy.
          </p>
          <p>
            <strong>3. Message feedback:</strong> Pass <code>onThumbsUp</code>{" "}
            and <code>onThumbsDown</code> to the <code>messageView.assistantMessage</code>{" "}
            slot to capture user ratings with the specific assistant{" "}
            <code>message.id</code>.
          </p>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={[
              "Click 'Ask the assistant (setChatOpen)' or 'Open chat' to reveal the sidebar",
              "Ask 'What is the weather in Lisbon?'",
              "Click the thumbs-up or thumbs-down icon on the assistant message",
            ]}
            expect="The sidebar opens or closes in response to external buttons, and clicking thumbs up/down fires the callback with message.id logged on screen."
            fail="The sidebar ignores the open prop, or the thumbs icons do not render in the assistant message toolbar."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Slots vs Context">
        <p>
          The assistant-message toolbar buttons only render when a handler or
          custom thumb slot is provided on <code>messageView.assistantMessage</code>{" "}
          (or when Automatic Learning capture is enabled with an active
          Trajectory). The button labels default to &ldquo;Good response&rdquo;
          and &ldquo;Bad response&rdquo; and can be overridden via chat labels in{" "}
          <code>useCopilotChatConfiguration</code>.
        </p>
      </Callout>

      <Panel title="The demo's implementation">
        <SourceCode file="frontend/src/app/prebuilt-components/chat-controls/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}

