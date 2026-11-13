// Slots page, "Nested Slots — Two levels deep". The page prints a bare JSX
// element and never defines the three components it passes. The import, the
// `export function Chat()` wrapper and the three components are the
// harness's (NOT FROM THE DOC PAGE, minimal, labelled below); the element is
// verbatim.
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { CopilotChat } from "@copilotkit/react-core/v2";

// NOT FROM THE DOC PAGE: minimal stand-ins for components the snippet names.
function CustomToolbar(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className="mt-1 flex gap-2 text-xs text-indigo-600" />;
}
function CustomCopyButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="rounded border px-1.5 text-xs">Copy (custom)</button>;
}
function CustomUserMessage({ message }: { message?: { content?: unknown } }) {
  return (
    <div className="my-2 text-right text-sm text-indigo-700">
      {typeof message?.content === "string" ? message.content : ""}
    </div>
  );
}

export function Chat() {
  return (
<CopilotChat
  messageView={{
    assistantMessage: {
      toolbar: CustomToolbar,
      copyButton: CustomCopyButton,
    },
    // @ts-expect-error Doc bug kept verbatim: a plain component is not assignable to the userMessage slot (`typeof CopilotChatUserMessage` also carries Container/MessageRenderer/... statics).
    userMessage: CustomUserMessage,
  }}
/>
  );
}
