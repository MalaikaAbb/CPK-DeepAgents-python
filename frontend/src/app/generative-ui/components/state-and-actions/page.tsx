import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "const cartSchema = z.object({\n  items: z.array(z.object({ productId: z.string(), quantity: z.number() })),\n});\n\nexport const shopUI = createGenerativeUI({\n  id: \"acme/shop@1\",\n  state: { cart: cartSchema },\n  components: {\n    ProductCard: {\n      component: ProductCard,\n      props: z.object({ productId: z.string(), name: z.string(), inCart: z.number() }),\n      bind: {\n        inCart: (state, { productId }) =>\n          state.cart.items.find((item) => item.productId === productId)?.quantity ?? 0,\n      },\n    },\n  },\n});";

const SNIPPET_1 = "import { useGenerativeUIState } from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction CartState({ cart }: { cart: Cart }) {\n  useGenerativeUIState(shopUI, \"cart\", { items: cart.items });\n  return null;\n}";

const SNIPPET_2 = "export const shopUI = createGenerativeUI({\n  id: \"acme/shop@1\",\n  functions: {\n    addToCart: {\n      description: \"Add a product to the cart\",\n      parameters: z.object({ productId: z.string(), quantity: z.number().default(1) }),\n    },\n  },\n  components: {\n    ProductCard: {\n      component: ProductCard,\n      props: z.object({ productId: z.string(), name: z.string() }),\n      events: { onAddToCart: {} },\n    },\n  },\n});";

const SNIPPET_3 = "import { useGenerativeUIFunction } from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction CartActions({ cart }: { cart: Cart }) {\n  useGenerativeUIFunction(shopUI, \"addToCart\", ({ productId, quantity }) => {\n    cart.addItem(productId, quantity);\n    return { added: productId };\n  });\n  return null;\n}";

const SNIPPET_4 = "import { useState } from \"react\";\nimport type { GenerativeUIComponentProps } from \"@copilotkit/react-core/v2/generative-ui\";\n\nfunction ProductCard({ productId, name, onAddToCart }: GenerativeUIComponentProps<typeof shopUI, \"ProductCard\">) {\n  const [error, setError] = useState<string>();\n  return (\n    <article>\n      <h4>{name}</h4>\n      <button\n        onClick={async () => {\n          const result = await onAddToCart?.({ productId });\n          if (result && !result.ok) setError(result.error.message);\n        }}\n      >\n        Add to cart\n      </button>\n      {error ? <p role=\"alert\">{error}</p> : null}\n    </article>\n  );\n}";

const SNIPPET_5 = "functions: {\n  addToCart: { parameters: z.object({ productId: z.string() }), allowedCallers: \"rendererOrAgent\", returnType: \"object\" },\n  track: { parameters: z.object({ event: z.string() }), returnType: \"void\" },\n  reload: { parameters: z.object({}), allowedCallers: \"agentOnly\" },\n},";

const SNIPPET_6 = "events: {\n  onChoose: {\n    description: \"The user picked a plan\",\n    parameters: z.object({ plan: z.string() }),\n  },\n},";

const SNIPPET_7 = "CheckoutForm: {\n  component: CheckoutForm,\n  props: z.object({ email: z.string().optional() }),\n  writable: [\"email\"],\n},";

const SNIPPET_8 = "function CheckoutForm({ email, setEmail }: GenerativeUIComponentProps<typeof shopUI, \"CheckoutForm\">) {\n  return <input value={email ?? \"\"} onChange={(event) => setEmail(event.target.value)} />;\n}";

/**
 * State and actions: reference only.
 *
 * The page (fetched 2026-11-11) teaches state, functions and writable props on top of
 * `@copilotkit/react-core/v2/generative-ui`, which react-core 1.73.3 does not
 * ship. Its React blocks are shown verbatim as text.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/state-and-actions" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Feeding live app state into generated UI (<code>useGenerativeUIState</code>), running your code on events (<code>useGenerativeUIFunction</code>), and two-way writable props.
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
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">app/catalog.tsx</p>
        <CodeBlock code={SNIPPET_2} language="bash" />
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
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 9</p>
        <CodeBlock code={SNIPPET_8} language="tsx" />
      </Panel>
    </>
  );
}
