import { RouteHeader } from "@/components/route-header";
import { RuntimeStatus } from "@/components/runtime-status";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The whole stack in one message. A Deep Agent with a single Python
          function as its tool, published as the graph <code>sample_agent</code>{" "}
          by the LangGraph dev server, addressed by a{" "}
          <code>CopilotRuntime</code> route holding a <code>LangGraphAgent</code>
          , and driven by a <code>CopilotSidebar</code> in the browser.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page offers three backend tabs — Python, TypeScript and FastAPI.
          This repo takes the <strong>Python</strong> tab (a{" "}
          <code>langgraph.json</code> manifest served by the LangGraph CLI), and
          therefore the <strong>Deep Agent</strong> tab of the runtime step, not
          the FastAPI one.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "What's the weather in Lisbon?",
              "What tools do you have access to?",
            ]}
            expect={
              <>
                Tokens stream a word at a time. The first prompt opens a
                collapsed <code>Called get_weather</code> row — that is{" "}
                <code>useDefaultRenderTool</code> drawing the call — and the
                reply says Lisbon is sunny.
              </>
            }
            fail="An error banner in the chat, or no reply at all. Check that `langgraph dev` is up on :8030 and that backend/.env has OPENAI_API_KEY."
          />
        </div>
      </Panel>

      <Callout tone="info" title="The Intelligence key moved again; this repo still takes the fallback">
        <p>
          The runtime step&apos;s key went from{" "}
          <code>INTELLIGENCE_API_KEY</code> to{" "}
          <code>CPK_INTELLIGENCE_API_KEY</code>, and the prose stopped calling
          it a license key and started calling it the project API key. The
          2026-09-21 sync moved the file it goes in as well: the placeholder
          block was <code>.env.local</code> and is now <code>.env</code>, and
          the step no longer tells you to write it at all: it tells you to run{" "}
          <code>npx copilotkit@latest project select</code> from the frontend
          app directory and says the command writes the key there.
        </p>
        <p className="mt-2">
          Nothing here reads it. The same step&apos;s callout documents dropping{" "}
          <code>intelligence</code> and <code>identifyUser</code> to fall back to
          SSE with an <code>InMemoryAgentRunner</code>, and that is the path this
          runtime route takes — so the rename is recorded rather than
          implemented. The link under the callout also moved from{" "}
          <code>/deepagents/premium/connect-your-runtime</code> to{" "}
          <code>/deepagents/intelligence/connect-your-runtime</code>, then to{" "}
          <code>/deepagents/intelligence/quickstart</code>.
        </p>
      </Callout>

      <Callout tone="warn" title="Two different .env files, both titled “.env”">
        <p>
          Step 6 (&ldquo;Configure your environment&rdquo;) says to create a{" "}
          <code>.env</code> <em>in your agent directory</em> holding{" "}
          <code>OPENAI_API_KEY</code>. The runtime step now prints a second
          block, also captioned <code>.env</code>, holding{" "}
          <code>CPK_INTELLIGENCE_API_KEY</code>, but that one belongs to the
          frontend app, three steps and one <code>cd</code> later. Nothing in
          either caption distinguishes them, and the agent directory is where a
          reader who follows the page in order last created a file of that name.
          Put the project key in the agent&apos;s <code>.env</code> and the Next
          runtime never sees it, with no error to say so. This repo keeps the
          two apart the way its own README does: <code>backend/.env</code> for
          the model key, <code>frontend/.env.local</code> for the frontend.
        </p>
        <p className="mt-2">
          Step 1 also changed from &ldquo;Create a free account&rdquo; to
          &ldquo;Set up CopilotKit Intelligence&rdquo;, and now states that
          managed setup &ldquo;does not issue{" "}
          <code>COPILOTKIT_LICENSE_TOKEN</code>&rdquo;, naming a variable that
          appears nowhere else on the page, so the only thing a first-time
          reader learns about it is that they will not get one.
        </p>
      </Callout>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent"
        description="The page's main.py, and the manifest that publishes it."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/main.py", region: "quickstart-agent" },
            { file: "backend/langgraph.json" },
          ]}
        />
      </Panel>

      <Panel
        title="Live connection"
        description="Probed on the server while this page renders — what the runtime actually negotiated, not what .env claims."
      >
        <RuntimeStatus />
      </Panel>

      <Panel
        title="The runtime route"
        description="Read from this repo, so it can be diffed against the page's snippet directly."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
      </Panel>

      <Callout tone="warn" title="The runtime moved to v2 — three breaking changes">
        <p>
          The Quickstart used to build a v1 <code>CopilotRuntime</code> with an{" "}
          <code>ExperimentalEmptyAdapter</code> at{" "}
          <code>app/api/copilotkit/route.ts</code>. It now builds a v2 one, and
          all three differences break silently if you miss them:
        </p>
        <p className="mt-2">
          <strong>1. The import is <code>@copilotkit/runtime/v2</code>.</strong>{" "}
          There is no <code>serviceAdapter</code> on this surface at all —{" "}
          <code>ExperimentalEmptyAdapter</code> has no counterpart.
        </p>
        <p className="mt-2">
          <strong>
            2. The file is <code>[[...slug]]/route.ts</code>.
          </strong>{" "}
          <code>createCopilotRuntimeHandler</code> serves a whole subtree —{" "}
          <code>/info</code>, agent runs, thread list, rename, delete — so a
          single-segment <code>route.ts</code> 404s everything except the bare
          URL. Four verbs are exported, not one: PATCH and DELETE are how
          threads are renamed and removed.
        </p>
        <p className="mt-2">
          <strong>
            3. The provider needs <code>useSingleEndpoint={"{false}"}</code>.
          </strong>{" "}
          Omit it and the client posts the bare URL against a multi-route
          handler — every run 404s while <code>/info</code> still answers 200,
          so the app looks connected and does nothing.
        </p>
      </Callout>

      <Callout tone="info" title="Two credentials, not one">
        <p>
          <code>INTELLIGENCE_API_KEY</code> authorizes the runtime against the
          platform: it is what makes <code>/info</code> report{" "}
          <code>mode: &quot;intelligence&quot;</code> and what makes the thread
          endpoints return real rows. Leave it unset and the runtime falls back
          to SSE with an <code>InMemoryAgentRunner</code> — chat still works on
          every route here, but nothing persists across a restart.
        </p>
        <p className="mt-2">
          <code>COPILOTKIT_LICENSE_TOKEN</code> is separate, and it is what the{" "}
          <em>client</em> gates features on. <code>/info</code> reports{" "}
          <code>licenseStatus</code> from it, and{" "}
          <code>&lt;CopilotThreadsDrawer&gt;</code> renders its locked
          &ldquo;Upgrade&rdquo; view unless that status is <code>valid</code> or{" "}
          <code>expiring</code> — regardless of whether threads actually work.
          So a runtime can serve threads perfectly while every drawer shows a
          lock. The panel above reports both axes separately for that reason.
        </p>
      </Callout>

      <Callout tone="info" title="identifyUser makes threads per-user">
        <p>
          Without it every visitor shares one history. The runtime reads{" "}
          <code>x-user-id</code> / <code>x-user-name</code> off the request, and{" "}
          <code>Providers</code> sends them as a fixed demo identity — a real app
          would derive them from a verified session. Override{" "}
          <code>NEXT_PUBLIC_DEMO_USER_ID</code> and reload to watch the thread
          list on the{" "}
          <a
            href="/prebuilt-components/copilot-threads-drawer"
            className="underline underline-offset-4"
          >
            Threads Drawer
          </a>{" "}
          diverge.
        </p>
      </Callout>
    </>
  );
}
