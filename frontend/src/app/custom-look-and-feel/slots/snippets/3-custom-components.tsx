// Slots page, "Custom Components" — page.tsx, verbatim.
import { CopilotChat } from "@copilotkit/react-core/v2";

// @ts-expect-error Doc bug kept verbatim: `messages` and `isRunning` are implicitly `any` (TS7031).
const CustomMessageView = ({ messages, isRunning }) => (
  <div className="space-y-4 p-6">
    {/* @ts-expect-error Doc bug kept verbatim: `msg` is implicitly `any` (TS7006). */}
    {messages?.map((msg) => (
      <div key={msg.id} className={msg.role === "user" ? "text-right" : "text-left"}>
        {msg.content}
      </div>
    ))}
    {isRunning && <div className="animate-pulse">Thinking...</div>}
  </div>
);

export function Chat() {
  // @ts-expect-error Doc bug kept verbatim: a plain function is not assignable to the messageView slot (`typeof CopilotChatMessageView` also carries a `Cursor` static).
  return <CopilotChat messageView={CustomMessageView} />;
}
