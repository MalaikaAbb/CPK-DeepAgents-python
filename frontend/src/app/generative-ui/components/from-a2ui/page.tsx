import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "<CopilotKit runtimeUrl=\"/api/copilotkit\" a2ui={{ catalog: myCatalog }}>";

const SNIPPET_1 = "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: appUI }}>";

const SNIPPET_2 = "const runtime = new CopilotRuntime({\n  agents,\n  a2ui: { injectA2UITool: false, agents: [\"shop\"] },\n});";

const SNIPPET_3 = "// Nothing: a run that carries a catalog gets the render_ui tool and the guide.\n// To force or limit it: generativeUI: true, or generativeUI: { agents: [\"shop\"] }.\nconst runtime = new CopilotRuntime({ agents });";

const SNIPPET_4 = "import { createCatalog, DynamicStringSchema } from \"@copilotkit/a2ui-renderer\";\n\nconst definitions = {\n  Airport: {\n    props: z.object({ code: DynamicStringSchema, city: DynamicStringSchema }),\n  },\n  Arrow: { props: z.object({}) },\n};\nconst renderers = { Airport, Arrow };\nexport const myCatalog = createCatalog(definitions, renderers, {\n  catalogId: \"acme/flights\",\n  includeBasicCatalog: true,\n});";

const SNIPPET_5 = "import {\n  createGenerativeUI,\n  standardUI,\n} from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/flights@1\",\n  extends: [standardUI],\n  components: {\n    Airport: {\n      component: Airport,\n      description: \"An airport by IATA code, with its city under it.\",\n      props: z.object({ code: z.string(), city: z.string() }),\n    },\n    Arrow: { component: Arrow, description: \"An arrow between two airports.\" },\n  },\n});";

/**
 * Adopt from A2UI: reference only.
 *
 * The page (fetched 2026-11-11) teaches the A2UI migration on top of
 * `@copilotkit/react-core/v2/generative-ui`, which react-core 1.73.3 does not
 * ship. Its React blocks are shown verbatim as text.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/from-a2ui" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Migrating from the <code>a2ui</code> renderer (A2UI v0.9: <code>a2ui=&#123;&#123; catalog &#125;&#125;</code>, <code>createCatalog</code>, runtime <code>a2ui</code> option) to components and surfaces (A2UI 1.0: <code>generativeUI</code>, <code>createGenerativeUI</code>, no runtime option).
        </p>
      </Panel>

      <Callout tone="warn" title="Needs a newer CopilotKit than this repo installs">
        <p>
          Everything this page teaches lives in <code>@copilotkit/react-core/v2/generative-ui</code> and the provider&apos;s <code>generativeUI</code> prop. The installed <code>@copilotkit/react-core</code> is 1.73.3, which has neither: the entry point first appears in a release after 1.79.1 (1.84.0 has it). Importing a module that does not exist fails the Next build outright, so the page&apos;s React blocks are shown below as text instead of compiled. Upgrading CopilotKit is a dependency change outside a doc sync.
        </p>
        <p className="mt-2">
          Angular blocks are left out (this is a React harness). Nothing is borrowed from other harnesses or the showcase.
        </p>
      </Callout>

      <Panel title="Code the page prints (reference only)" description="Verbatim from the rendered page; shown as text, not compiled or run.">
        <p className="mb-2 text-xs font-medium text-slate-500">Block 1</p>
        <CodeBlock code={SNIPPET_0} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 2</p>
        <CodeBlock code={SNIPPET_1} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 3</p>
        <CodeBlock code={SNIPPET_2} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 4</p>
        <CodeBlock code={SNIPPET_3} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 5</p>
        <CodeBlock code={SNIPPET_4} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 6</p>
        <CodeBlock code={SNIPPET_5} language="tsx" />
      </Panel>
    </>
  );
}
