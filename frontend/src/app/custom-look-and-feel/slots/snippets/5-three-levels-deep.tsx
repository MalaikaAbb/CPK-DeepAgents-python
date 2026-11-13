// Slots page, "Nested Slots — Three levels deep". Bare JSX on the page; the
// import and `export function Chat()` wrapper are the harness's.
import { CopilotChat } from "@copilotkit/react-core/v2";

export function Chat() {
  return (
<CopilotChat
  messageView={{
    assistantMessage: {
      copyButton: ({ onClick }) => (
        <button onClick={onClick}>Copy</button>
      ),
    },
  }}
/>
  );
}
