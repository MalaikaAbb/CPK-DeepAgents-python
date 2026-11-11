import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "import { standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\n<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>";

const SNIPPET_1 = "import { createGenerativeUI, standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI],\n  components: {\n    ProductCard: { component: ProductCard, props: productSchema },\n  },\n});";

const SNIPPET_2 = "export const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI.omit([\"Map\", \"Video\", \"HtmlView\"])],\n  components: {},\n});";

const SNIPPET_3 = "import {\n  createGenerativeUI,\n  standardUI,\n  type GenerativeUIComponentProps,\n} from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction MyCard({ children }: GenerativeUIComponentProps<typeof standardUI, \"Card\">) {\n  return <div className=\"rounded-2xl border p-6 shadow-sm\">{children}</div>;\n}\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI],\n  overrides: { Card: { component: MyCard } },\n  components: {},\n});";

/**
 * Standard catalog: reference only.
 *
 * The page (fetched 2026-11-11) teaches the standard catalog on top of
 * `@copilotkit/react-core/v2/generative-ui`, which react-core 1.73.3 does not
 * ship. Its React blocks are shown verbatim as text.
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

      <Callout tone="warn" title="Needs a newer CopilotKit than this repo installs">
        <p>
          Everything this page teaches lives in <code>@copilotkit/react-core/v2/generative-ui</code> and the provider&apos;s <code>generativeUI</code> prop. The installed <code>@copilotkit/react-core</code> is 1.73.3, which has neither: the entry point first appears in a release after 1.79.1 (1.84.0 has it). Importing a module that does not exist fails the Next build outright, so the page&apos;s React blocks are shown below as text instead of compiled. Upgrading CopilotKit is a dependency change outside a doc sync.
        </p>
        <p className="mt-2">
          Angular blocks are left out (this is a React harness). Nothing is borrowed from other harnesses or the showcase.
        </p>
        <p className="mt-2">
          The rendered page did not render its content when fetched (an almost empty document), so the blocks below come from the page&apos;s markdown export. They are frontend-only and the same for every framework.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
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
