import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "import { z } from \"zod\";\nimport {\n  createGenerativeUI,\n  type GenerativeUIComponentProps,\n} from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction ProductGrid({ title, children }: GenerativeUIComponentProps<typeof shopUI, \"ProductGrid\">) {\n  return (\n    <section>\n      {title ? <h3>{title}</h3> : null}\n      <div className=\"grid grid-cols-2 gap-4\">{children}</div>\n    </section>\n  );\n}\n\nfunction ProductCard({ name, price, imageUrl }: GenerativeUIComponentProps<typeof shopUI, \"ProductCard\">) {\n  return (\n    <article>\n      <img src={imageUrl} alt={name} />\n      <h4>{name}</h4>\n      <p>${price}</p>\n    </article>\n  );\n}\n\nexport const shopUI = createGenerativeUI({\n  id: \"acme/shop@1\",\n  components: {\n    ProductGrid: {\n      component: ProductGrid,\n      description: \"A grid of products. Put the ids of ProductCard components in children.\",\n      props: z.object({ title: z.string().optional() }),\n      slots: { children: \"multiple\" },\n    },\n    ProductCard: {\n      component: ProductCard,\n      description: \"One product. Copy every value from a product of a tool result.\",\n      props: z.object({ name: z.string(), price: z.number(), imageUrl: z.string() }),\n    },\n  },\n});";

const SNIPPET_1 = "<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: shopUI }}>";

const SNIPPET_2 = "function ProductCard(props: GenerativeUIComponentProps<typeof shopUI, \"ProductCard\">) {\n  props.price; // number\n  props.color; // type error: not a prop of ProductCard\n}";

const SNIPPET_3 = "import { z } from \"zod\";\n\nprops: z.object({ name: z.string(), price: z.number() }),";

const SNIPPET_4 = "import * as v from \"valibot\";\nimport { toStandardJsonSchema } from \"@valibot/to-json-schema\";\n\nprops: toStandardJsonSchema(v.object({ name: v.string(), price: v.number() })),";

const SNIPPET_5 = "import { createGenerativeUI, standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const appUI = createGenerativeUI({\n  id: \"acme/app@1\",\n  extends: [standardUI, cartUI],\n  components: { Hero: { component: Hero, props: z.object({ title: z.string() }) } },\n});";

const SNIPPET_6 = "import { exportA2UICatalog } from \"@copilotkit/react-core/v2/generative-ui\";\n\nconst catalog = exportA2UICatalog(appUI, { title: \"Acme app\" });\nfs.writeFileSync(\"acme-catalog.json\", JSON.stringify(catalog, null, 2));";

const SNIPPET_7 = "const ui = createGenerativeUI({\n  id: \"acme/panel@1\",\n  components: {\n    Panel: {\n      component: Panel,\n      props: z.object({ title: z.string(), color: z.string().optional() }),\n      slots: { children: \"multiple\" },\n      parameterOrder: [\"title\", \"children\"],\n    },\n  },\n});";

/**
 * Catalogs: reference only.
 *
 * The page (fetched 2026-11-11) teaches custom catalogs on top of
 * `@copilotkit/react-core/v2/generative-ui`, which react-core 1.73.3 does not
 * ship. Its React blocks are shown verbatim as text.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/catalogs" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Declaring your own components and their typed props once with <code>createGenerativeUI</code>, merging in <code>standardUI</code>, typing component props from the schema, and exporting the catalog as A2UI JSON.
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
        <p className="mb-2 text-xs font-medium text-slate-500">app/catalog.tsx</p>
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
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 7</p>
        <CodeBlock code={SNIPPET_6} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 8</p>
        <CodeBlock code={SNIPPET_7} language="tsx" />
      </Panel>
    </>
  );
}
