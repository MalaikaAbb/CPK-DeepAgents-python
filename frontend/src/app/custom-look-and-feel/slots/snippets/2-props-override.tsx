// Slots page, "Props Override". The page prints a bare JSX element; the
// `import` and `export function Chat() { return (...) }` around it are the
// harness's, the element is verbatim.
import { CopilotChat } from "@copilotkit/react-core/v2";

export function Chat() {
  return (
<CopilotChat
  messageView={{
    className: "my-custom-messages",
    // @ts-expect-error Doc bug kept verbatim: "data-testid" is not a known property of the messageView slot object (TS2353 excess property).
    "data-testid": "message-view",
  }}
  input={{ autoFocus: true }}
/>
  );
}
