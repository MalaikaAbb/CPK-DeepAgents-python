import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "import { CopilotKitCSSProperties } from \"@copilotkit/react-ui\";\n\n<div\n  style={\n    {\n      \"--copilot-kit-primary-color\": \"#222222\",\n    } as CopilotKitCSSProperties\n  }\n>\n  <CopilotSidebar />\n</div>";

const SNIPPET_1 = "[data-copilotkit] {\n  --primary: oklch(0.55 0.22 264); /* accent / action color */\n  --primary-foreground: oklch(0.99 0 0); /* text on primary */\n  --background: oklch(1 0 0); /* surface background */\n  --foreground: oklch(0.145 0 0); /* primary text */\n  --muted: oklch(0.97 0 0); /* subtle backgrounds */\n  --border: oklch(0.922 0 0); /* dividers, outlines */\n  --radius: 0.625rem; /* global corner radius */\n}\n\n/* Dark mode is keyed off a `.dark` ancestor */\n.dark [data-copilotkit] {\n  --background: oklch(0.145 0 0);\n  --foreground: oklch(0.985 0 0);\n  --border: oklch(0.269 0 0);\n}";

const SNIPPET_2 = ".copilotKitButton {\n  border-radius: 0;\n}\n\n.copilotKitMessages {\n  padding: 2rem;\n}\n\n.copilotKitUserMessage {\n  background: #007AFF;\n}";

const SNIPPET_3 = ".copilotKitMessages {\n  font-family: \"Arial, sans-serif\";\n}\n\n.copilotKitInput {\n  font-family: \"Arial, sans-serif\";\n}";

const SNIPPET_4 = "<CopilotChat\n  icons={{\n    openIcon: <YourOpenIconComponent />,\n    closeIcon: <YourCloseIconComponent />,\n  }}\n/>";

const SNIPPET_5 = "<CopilotChat\n  labels={{\n    welcomeMessageText: \"Hello! How can I help you today?\",\n    modalHeaderTitle: \"My Copilot\",\n    chatInputPlaceholder: \"Ask me anything!\",\n  }}\n/>";

/**
 * CSS Customization: reference only.
 *
 * Rendered for Deep Agents (fetched 2026-11-11) the page has a "Not available
 * for Langchain DeepAgents yet" banner and "Missing snippet" boxes for its demo
 * blocks. The generic blocks it prints are shown verbatim as text; see the
 * callout for why none of them is wired in.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/css" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two theming systems: the v1 <code>--copilot-kit-*</code> variables and <code>.copilotKit*</code> classes for <code>@copilotkit/react-ui</code>, and the shadcn-style oklch tokens on <code>[data-copilotkit]</code> that the v2 components in <code>@copilotkit/react-core/v2</code> read. Plus the <code>icons</code> and <code>labels</code> props for copy and icon swaps.
        </p>
      </Panel>

      <Callout tone="warn" title="No Deep Agents demo on the page; the generic blocks don't fit this repo">
        <p>
          Rendered under /deepagents/, the page says CSS customization is not available for Deep Agents yet. The three blocks that would show the demo&apos;s scoped <code>theme.css</code> (the import, the variable overrides on the wrapper, the user-bubble rule) are &quot;Missing snippet: No demo found for deepagents::chat-customization-css&quot;. There is no Code tab.
        </p>
        <p className="mt-2">
          What the page does print is shown below, verbatim, but not wired in. The inline-override block imports <code>CopilotKitCSSProperties</code> from <code>@copilotkit/react-ui</code>, the v1 UI package this repo does not install (the Quickstart no longer installs it either). The <code>.copilotKit*</code> classes, the font rule and the <code>--copilot-kit-*</code> variables target the v1 components, while this repo renders the v2 ones. The v2 token block is global (<code>[data-copilotkit]</code> with no scope), so adding it would re-skin every route. The icons block passes an <code>icons</code> prop that v2 <code>CopilotChat</code> does not have on 1.73.3 (its labels block uses keys that do exist).
        </p>
        <p className="mt-2">
          Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents demo, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
        <p className="mb-2 text-xs font-medium text-slate-500">Inline overrides with CopilotKitCSSProperties</p>
        <CodeBlock code={SNIPPET_0} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">v2 design tokens (globals.css)</p>
        <CodeBlock code={SNIPPET_1} language="css" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Custom CSS classes (globals.css)</p>
        <CodeBlock code={SNIPPET_2} language="css" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Custom fonts (globals.css)</p>
        <CodeBlock code={SNIPPET_3} language="css" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Custom icons</p>
        <CodeBlock code={SNIPPET_4} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Custom labels</p>
        <CodeBlock code={SNIPPET_5} language="tsx" />
      </Panel>
    </>
  );
}
