// Slots page, "Labels". Bare JSX on the page; the import and
// `export function Chat()` wrapper are the harness's.
import { CopilotChat } from "@copilotkit/react-core/v2";

export function Chat() {
  return (
<CopilotChat
  labels={{
    chatInputPlaceholder: "Ask your agent anything...",
    welcomeMessageText: "How can I help you today?",
    chatDisclaimerText: "AI responses may be inaccurate.",
  }}
/>
  );
}
