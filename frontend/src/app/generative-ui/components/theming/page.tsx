import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const SNIPPET_0 = "<CopilotKitProvider\n  runtimeUrl=\"/api/copilotkit\"\n  generativeUI={{\n    ui: standardUI,\n    theme: {\n      \"--a2ui-color-accent\": \"#d97706\",\n      \"--a2ui-font-family\": \"Inter, sans-serif\",\n      \"--a2ui-radius-md\": \"10px\",\n    },\n  }}\n>";

const SNIPPET_1 = "import type { GenerativeUITheme } from \"@copilotkit/react-core/v2/generative-ui\";\n\nexport const theme: GenerativeUITheme = { \"--a2ui-color-accent\": \"#d97706\" };";

const SNIPPET_2 = "<html class=\"dark\">";

const SNIPPET_3 = "const colorSchemeScript = `(() => {\n  const media = matchMedia(\"(prefers-color-scheme: dark)\");\n  const apply = () => document.documentElement.classList.toggle(\"dark\", media.matches);\n  apply();\n  media.addEventListener(\"change\", apply);\n})();`;\n\n<head>\n  <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />\n</head>;";

const SNIPPET_4 = "theme: {\n  \"--a2ui-color-accent\": \"#d97706\",\n  dark: {\n    \"--a2ui-color-panel\": \"#1f2937\",\n    \"--a2ui-color-surface\": \"#111827\",\n  },\n},";

const SNIPPET_5 = "theme: {\n  mapStyle: \"https://tiles.example.com/light.json\",\n  dark: { mapStyle: \"https://tiles.example.com/dark.json\" },\n},";

const SNIPPET_6 = ".a2ui-surface {\n  --a2ui-color-accent: #d97706;\n}";

/**
 * Theming: reference only.
 *
 * The page (fetched 2026-11-11) teaches theming on top of
 * `@copilotkit/react-core/v2/generative-ui`, which react-core 1.73.3 does not
 * ship. Its React blocks are shown verbatim as text.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/theming" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Styling the standard components through the provider&apos;s <code>theme</code> option (CSS variables, <code>GenerativeUITheme</code>), dark mode, and map styles.
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
        <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Block 7</p>
        <CodeBlock code={SNIPPET_6} language="css" />
      </Panel>
    </>
  );
}
