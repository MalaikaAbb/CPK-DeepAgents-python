import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "Here is an estimate you can play with:\n\n```a2ui\n{\"version\":\"1.0\",\"createSurface\":{\"surfaceId\":\"plan-estimator\",\"dataModel\":{\"seats\":10,\"price\":\"$290 / month\"},\"components\":[{\"id\":\"root\",\"component\":\"Card\",\"children\":[\"seats\",\"price\"]}]}}\n{\"version\":\"1.0\",\"updateComponents\":{\"surfaceId\":\"plan-estimator\",\"components\":[{\"id\":\"seats\",\"component\":\"Slider\",\"label\":\"Seats\",\"min\":1,\"max\":50,\"value\":{\"@path\":\"/seats\"}},{\"id\":\"price\",\"component\":\"Text\",\"text\":{\"@path\":\"/price\"}}]}}\n```\n\nMove the slider to change the seat count.";

const SNIPPET_1 = "import { CopilotKitProvider } from \"@copilotkit/react-core/v2\";\nimport { standardUI } from \"@copilotkit/react-core/v2/generative-ui\";\n\n<CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI, transport: \"markdown\" }}>\n  {children}\n</CopilotKitProvider>;";

const SNIPPET_2 = "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{ ui: standardUI, transport: \"markdown\", sendContext: false }}\n>";

const SNIPPET_3 = "{\n  \"1.0\": {\n    \"supportedCatalogIds\": [\"copilotkit/standard@1\"],\n    \"inlineCatalogs\": [\n      {\n        \"catalogId\": \"copilotkit/standard@1\",\n        \"protocolVersion\": \"1.0\",\n        \"components\": { \"Card\": { \"props\": { \"type\": \"object\" } } },\n        \"functions\": {},\n        \"instructions\": \"You can show interactive UI in your reply ...\"\n      }\n    ]\n  },\n  \"metadata\": {\n    \"extensions\": {\n      \"copilotkit_format\": 3,\n      \"copilotkit_transport\": \"markdown\",\n      \"copilotkit_targets\": [{ \"id\": \"chat\", \"kind\": \"chat\" }],\n      \"copilotkit_surfaces\": {},\n      \"copilotkit_contextSent\": false\n    }\n  }\n}";

const SNIPPET_4 = "ui = input.forwarded_props[\"copilotkit\"][\"ui\"]\ncatalog = ui[\"1.0\"][\"inlineCatalogs\"][0]\nsystem = f\"{MY_PROMPT}\\n\\n{catalog['instructions']}\\n\\nComponents:\\n{json.dumps(catalog['components'])}\"";

/**
 * Markdown mode: reference only.
 *
 * The page (fetched 2026-11-11) teaches markdown mode on top of
 * `@copilotkit/react-core/v2/generative-ui`, which react-core 1.73.3 does not
 * ship. Its React blocks are shown verbatim as text.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/markdown-mode" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The markdown transport: the agent writes ``<code>a2ui blocks inside its reply and the chat renders each as a live surface, with the catalog read from </code>forwardedProps.copilotkit.ui` on the agent side.
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
        <CodeBlock code={SNIPPET_0} language="text" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">app/providers.tsx</p>
        <CodeBlock code={SNIPPET_1} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 3</p>
        <CodeBlock code={SNIPPET_2} language="tsx" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 4</p>
        <CodeBlock code={SNIPPET_3} language="json" />
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 5</p>
        <CodeBlock code={SNIPPET_4} language="python" />
      </Panel>
    </>
  );
}
