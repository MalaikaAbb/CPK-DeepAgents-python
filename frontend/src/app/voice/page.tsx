import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Voice: reference only. Nothing is implemented, on purpose.
 *
 * Rendered for Deep Agents (fetched 2026-11-11) the page has a "Not available
 * for Langchain DeepAgents yet" banner and "Missing snippet" boxes for every
 * code block, and no Code tab. Nothing is filled in from other frameworks.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/voice" />

      <Panel title="What the page is about">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Speech input for the chat: when the runtime advertises audio transcription on <code>/info</code>, <code>CopilotChat</code> shows a mic button, posts recorded audio to the runtime&apos;s <code>/transcribe</code> endpoint (backed by a <code>TranscriptionService</code> such as <code>TranscriptionServiceOpenAI</code> from <code>@copilotkit/voice</code>), and sends the transcript like a typed message.
        </p>
      </Panel>

      <Callout tone="warn" title="No Deep Agents code on the page">
        <p>
          Rendered under /deepagents/, the page says voice is not available for Deep Agents yet, and every code block (the chat pointed at <code>/api/copilotkit-voice</code>, the sample-audio button for testing without a mic, and the <code>[[...slug]]</code> runtime route that sets <code>transcriptionService</code>) is replaced by &quot;Missing snippet: No demo found for deepagents::voice&quot;. There is no Code tab.
        </p>
        <p className="mt-2">
          The prose names the pieces (<code>createCopilotRuntimeHandler</code>, <code>TranscriptionService</code>, <code>TranscriptionServiceOpenAI</code>, the <code>@copilotkit/voice</code> package and its openai 5.x requirement) but prints none of the code, so nothing is built here: no runtime route, no package install, no demo. Nothing is borrowed from other frameworks or the showcase. When the docs publish a Deep Agents version, build it here and update the status in <code>lib/nav-config.ts</code>.
        </p>
      </Callout>
    </>
  );
}
