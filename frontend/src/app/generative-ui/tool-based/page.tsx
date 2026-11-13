import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A React component registered with <code>useComponent</code> becomes a
          frontend tool; <code>CopilotKitMiddleware</code> merges it into the
          Deep Agent&apos;s tool list, and when the model calls it the chat
          renders the component with the tool arguments as props. Here only the
          backend half exists, because only the backend half is published for
          Deep Agents.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show me a bar chart of the five largest US states by area."]}
            expect="What the published code produces: a short prose reply, no chart and no tool call. Nothing registers render_bar_chart, so the middleware has no forwarded tool to offer the model."
            fail="An error banner or no reply (backend down), or a chart, which would mean the missing frontend half was filled in."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="The useComponent half is not published for Deep Agents">
        <p>
          Rendered under <code>/deepagents/</code>, the page shows a &ldquo;Not
          available for Langchain DeepAgents yet&rdquo; banner, then prints the
          Deep Agent (<code>create_deep_agent</code> with{" "}
          <code>CopilotKitMiddleware</code>), its <code>SYSTEM_PROMPT</code>{" "}
          naming <code>render_bar_chart</code>, and the frontend imports. The
          block that matters, the <code>useComponent</code> call with its zod
          schema and chart component, is &ldquo;Missing snippet: No demo found
          for deepagents::gen-ui-tool-based&rdquo;. It is not written here, so
          the agent is told to call a tool that no client registers.
        </p>
        <p className="mt-2">
          Two smaller things. The page prints the agent before the prompt it
          uses, as two steps of one <code>agent.py</code>; pasted in that order
          it raises <code>NameError</code>, so the file here puts the prompt
          first. And <code>model=&quot;openai:gpt-6-luna&quot;</code> is read
          from <code>OPENAI_MODEL</code> like every agent in this repo. The
          headless snippet (<code>CopilotChatToolCallsView</code> with{" "}
          <code>assistantMessage</code>/<code>allMessages</code>) uses two
          variables it never defines and is not built.
        </p>
      </Callout>

      <Panel title="The agent" description="backend/src/tool_based.py">
        <SourceCodeGroup
          files={[
            { file: "backend/src/tool_based.py", region: "system-prompt" },
            { file: "backend/src/tool_based.py", region: "agent" },
          ]}
        />
      </Panel>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/generative-ui/tool-based/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
