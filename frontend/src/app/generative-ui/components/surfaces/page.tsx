import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "import { GenerativeUISurface } from \"@copilotkit/react-core/v2/generative-ui\";\nimport { shopUI } from \"./catalog\";\n\nexport function FeaturedProducts({ products }: { products: Product[] }) {\n  return (\n    <GenerativeUISurface\n      id=\"featured\"\n      ui={shopUI}\n      description=\"The Featured Products row of the home page. When the customer asks to see products here, show them as a ProductGrid with one ProductCard for each product. When they ask for the featured products again, delete this surface.\"\n      components={[\"ProductGrid\", \"ProductCard\"]}\n      fallback={<ProductRow products={products} />}\n    />\n  );\n}";

const SNIPPET_1 = "<GenerativeUISurface id=\"featured\" ui={shopUI} components={[\"ProductGrid\", \"ProductCard\"]} />";

const SNIPPET_2 = "<GenerativeUISurface id=\"sidebar-notes\" autoScroll={false} />";

const SNIPPET_3 = "[data-generative-ui-surface] {\n  scroll-margin-top: 6rem;\n}";

const SNIPPET_4 = "<GenerativeUISurface\n  key={product.id}\n  id={`recommendations-${product.id}`}\n  description={`The \"You might also like\" row under ${product.name}. Show related products here. Never include ${product.name} itself.`}\n/>";

const SNIPPET_5 = "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{\n    ui: shopUI,\n    errorBoundary: {\n      onError: (info) => console.warn(info.kind, info.surfaceId, info.error.message),\n      fallback: ({ retry }) => <button onClick={retry}>Try again</button>,\n    },\n  }}\n>";

/**
 * Surfaces: reference only.
 *
 * The page (fetched 2026-11-11) teaches surface targets on top of
 * `@copilotkit/react-core/v2/generative-ui`, which react-core 1.73.3 does not
 * ship. Its React blocks are shown verbatim as text.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/surfaces" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Named areas of the page (<code>GenerativeUISurface id=…</code>) that the chat can fill or change, with per-target component lists, auto-scroll, per-item keys and error fallbacks.
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
        <p className="mb-2 text-xs font-medium text-slate-500">app/page.tsx</p>
        <CodeBlock code={SNIPPET_0} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 2</p>
        <CodeBlock code={SNIPPET_1} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 3</p>
        <CodeBlock code={SNIPPET_2} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 4</p>
        <CodeBlock code={SNIPPET_3} language="css" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 5</p>
        <CodeBlock code={SNIPPET_4} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 6</p>
        <CodeBlock code={SNIPPET_5} language="tsx" />
      </Panel>
    </>
  );
}
