import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "npm install @copilotkit/react-core @copilotkit/runtime @tanstack/ai @tanstack/ai-openai";

const SNIPPET_1 = "OPENAI_API_KEY=sk-...";

const SNIPPET_2 = "import { chat } from \"@tanstack/ai\";\nimport { openaiText } from \"@tanstack/ai-openai\";\nimport {\n  BuiltInAgent,\n  convertInputToTanStackAI,\n  CopilotRuntime,\n  createCopilotRuntimeHandler,\n  InMemoryAgentRunner,\n} from \"@copilotkit/runtime/v2\";\n\nconst agent = new BuiltInAgent({\n  type: \"tanstack\",\n  factory: ({ input, abortController }) => {\n    const { messages, systemPrompts, tools } = convertInputToTanStackAI(input);\n    return chat({\n      adapter: openaiText(\"gpt-6-luna\"),\n      messages,\n      systemPrompts: [\n        \"You are a helpful assistant. When a visual answer helps, render it with generative UI.\",\n        ...systemPrompts,\n      ],\n      tools,\n      abortController,\n    });\n  },\n});\n\nconst runtime = new CopilotRuntime({\n  agents: { default: agent },\n  runner: new InMemoryAgentRunner(),\n});\n\nconst handler = createCopilotRuntimeHandler({ runtime, basePath: \"/api/copilotkit\" });\n\nexport const GET = handler;\nexport const POST = handler;";

const SNIPPET_3 = "\"use client\";\nimport { CopilotKitProvider } from \"@copilotkit/react-core/v2\";\nimport { standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\nimport \"@copilotkit/react-core/v2/styles.css\";\n\nexport function Providers({ children }: { children: React.ReactNode }) {\n  return (\n    <CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>\n      {children}\n    </CopilotKitProvider>\n  );\n}";

const SNIPPET_4 = "import { Providers } from \"./providers\";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <Providers>{children}</Providers>\n      </body>\n    </html>\n  );\n}";

const SNIPPET_5 = "\"use client\";\nimport { CopilotChat } from \"@copilotkit/react-core/v2\";\n\nexport default function Page() {\n  return <CopilotChat />;\n}";

const SNIPPET_6 = "npm install chart.js maplibre-gl lucide";

const SNIPPET_7 = "Compare the Starter, Team, and Enterprise plans in a table";

/**
 * Components and surfaces: the page's React blocks, shown as text below; the
 * runnable ones are mounted in `demo-chat/` (see the status note).
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent renders your React components while it answers, in the chat or in named areas of the page, from a catalog you hand the provider (<code>generativeUI=&#123;&#123; ui &#125;&#125;</code>); the runtime then gives each run a <code>render_ui</code> tool and a guide.
        </p>
      </Panel>

      <Callout tone="info" title="How this route is wired">
        <p>
          The demo runs on <code>/api/copilotkit-genui</code>
          , the section&apos;s runtime mounted beside the main one. Its
          agent is <code>components_agent</code>, a Deep Agents graph standing
          in for the section&apos;s TanStack <code>BuiltInAgent</code> (same
          prompt, no tools, <code>CopilotKitMiddleware</code> as the page says
          for a LangGraph Python agent). Each provider&apos;s{" "}
          <code>generativeUI</code> value is the page&apos;s; only its{" "}
          <code>runtimeUrl</code> differs. Needs CopilotKit 1.87 (this repo was
          on 1.73.3, which has no <code>v2/generative-ui</code>). What runs and
          what stays broken is in the status note above.
        </p>
      </Callout>

      <Panel title="Code the page prints" description="Verbatim from the rendered page. The runnable parts are mounted in the demo; the rest is listed in the status note.">
        <p className="mb-2 text-xs font-medium text-slate-500">Block 1</p>
        <CodeBlock code={SNIPPET_0} language="bash" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">.env.local</p>
        <CodeBlock code={SNIPPET_1} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">app/api/copilotkit/[[...slug]]/route.ts</p>
        <CodeBlock code={SNIPPET_2} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">app/providers.tsx</p>
        <CodeBlock code={SNIPPET_3} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">app/layout.tsx</p>
        <CodeBlock code={SNIPPET_4} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">app/page.tsx</p>
        <CodeBlock code={SNIPPET_5} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 7</p>
        <CodeBlock code={SNIPPET_6} language="bash" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 8</p>
        <CodeBlock code={SNIPPET_7} language="tsx" />
      </Panel>
    </>
  );
}
