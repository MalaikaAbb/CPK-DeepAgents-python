import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "<CopilotChat\n  messageView={{\n    reasoningMessage: {\n      header: CustomHeader,\n      contentView: CustomContent,\n    },\n  }}\n/>";

const SNIPPET_1 = "import { CopilotChat } from \"@copilotkit/react-core/v2\";\nimport \"@copilotkit/react-core/v2/styles.css\";\n\nfunction CustomHeader({\n  isOpen,\n  label,\n  hasContent,\n  isStreaming,\n  ...props\n}: React.ButtonHTMLAttributes<HTMLButtonElement> & {\n  isOpen?: boolean;\n  label?: string;\n  hasContent?: boolean;\n  isStreaming?: boolean;\n}) {\n  return (\n    <button\n      className=\"flex w-full items-center gap-2 px-3 py-2 text-sm font-medium\"\n      {...props}\n    >\n      {isStreaming ? \"🧠\" : \"💡\"}\n      <span>{label}</span>\n      {hasContent && (\n        <span className=\"ml-auto text-xs\">{isOpen ? \"Hide\" : \"Show\"}</span>\n      )}\n    </button>\n  );\n}\n\n<CopilotChat\n  messageView={{\n    reasoningMessage: { header: CustomHeader },\n  }}\n/>";

const SNIPPET_2 = "function CustomContent({\n  isStreaming,\n  hasContent,\n  children,\n  ...props\n}: React.HTMLAttributes<HTMLDivElement> & {\n  isStreaming?: boolean;\n  hasContent?: boolean;\n}) {\n  if (!hasContent && !isStreaming) return null;\n\n  return (\n    <div className=\"px-4 pb-3 text-sm text-gray-500 font-mono\" {...props}>\n      {children}\n      {isStreaming && <span className=\"animate-pulse ml-1\">▊</span>}\n    </div>\n  );\n}\n\n<CopilotChat\n  messageView={{\n    reasoningMessage: { contentView: CustomContent },\n  }}\n/>";

const SNIPPET_3 = "import {\n  CopilotChatReasoningMessage,\n} from \"@copilotkit/react-core/v2\";\nimport { CopilotChat } from \"@copilotkit/react-core/v2\";\nimport \"@copilotkit/react-core/v2/styles.css\";\n\nfunction MyReasoningLayout(props: React.ComponentProps<typeof CopilotChatReasoningMessage>) {\n  return (\n    <CopilotChatReasoningMessage {...props}>\n      {({ header, toggle }) => (\n        <div className=\"rounded-lg border bg-yellow-50 my-2\">\n          {header}\n          {toggle}\n        </div>\n      )}\n    </CopilotChatReasoningMessage>\n  );\n}\n\n<CopilotChat\n  messageView={{\n    reasoningMessage: MyReasoningLayout,\n  }}\n/>";

/**
 * Reasoning Messages: reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11) the page has a "Not available
 * for Langchain DeepAgents yet" banner, and its agent and custom-component
 * blocks are "Missing snippet". The generic slot blocks are shown verbatim as
 * text.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/reasoning-messages" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The reasoning card&apos;s parts (<code>header</code>, <code>contentView</code>, <code>toggle</code>) can be swapped through <code>messageView.reasoningMessage</code>, the whole card replaced by your own component, or the built-in <code>CopilotChatReasoningMessage</code> rearranged with render-prop children.
        </p>
      </Panel>

      <Callout tone="warn" title="No Deep Agents agent or demo on the page">
        <p>
          Rendered under /deepagents/, the page says reasoning customization is not available for Deep Agents yet. The block that connects an agent emitting reasoning tokens and the fully custom <code>ReasoningBlock</code> example are &quot;Missing snippet: No demo found for deepagents::reasoning-default&quot; / &quot;deepagents::reasoning-custom&quot;. There is no Code tab.
        </p>
        <p className="mt-2">
          The four generic blocks it prints (shown below, verbatim) only change how reasoning messages look. None of this repo&apos;s agents is configured to stream reasoning tokens, and the page does not show how a Deep Agent would, so wiring the blocks to a chat would produce a demo where nothing ever renders. They are kept as text. Two of them also end with a bare <code>&lt;CopilotChat … /&gt;</code> expression statement after the component, which is not valid as a module on its own.
        </p>
        <p className="mt-2">
          Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
        <p className="mb-2 text-xs font-medium text-slate-500">Passing sub-components through messageView</p>
        <CodeBlock code={SNIPPET_0} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Custom Header</p>
        <CodeBlock code={SNIPPET_1} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Custom Content</p>
        <CodeBlock code={SNIPPET_2} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Render-prop children</p>
        <CodeBlock code={SNIPPET_3} language="tsx" />
      </Panel>
    </>
  );
}
