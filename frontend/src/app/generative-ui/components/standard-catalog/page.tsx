import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "import { standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\n<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>";

const SNIPPET_1 = "import { createGenerativeUI, standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI],\n  components: {\n    ProductCard: { component: ProductCard, props: productSchema },\n  },\n});";

const SNIPPET_2 = "export const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI.omit([\"Map\", \"Video\", \"HtmlView\"])],\n  components: {},\n});";

const SNIPPET_3 = "import {\n  createGenerativeUI,\n  standardUI,\n  type GenerativeUIComponentProps,\n} from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction MyCard({ children }: GenerativeUIComponentProps<typeof standardUI, \"Card\">) {\n  return <div className=\"rounded-2xl border p-6 shadow-sm\">{children}</div>;\n}\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI],\n  overrides: { Card: { component: MyCard } },\n  components: {},\n});";

/**
 * Standard catalog: the page's React blocks, shown as text below; the
 * runnable ones are mounted in `demo-chat/` (see the status note).
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/standard-catalog" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The 69 ready-made components in <code>standardUI</code> (the A2UI 1.0 basic catalog plus extensions), and how to drop or replace some of them.
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
        <CodeBlock code={SNIPPET_0} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 2</p>
        <CodeBlock code={SNIPPET_1} language="ts" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 3</p>
        <CodeBlock code={SNIPPET_2} language="ts" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 4</p>
        <CodeBlock code={SNIPPET_3} language="tsx" />
      </Panel>
    </>
  );
}
