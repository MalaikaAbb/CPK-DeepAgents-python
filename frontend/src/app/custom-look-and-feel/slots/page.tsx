import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/custom-look-and-feel/slots/snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/slots" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The three ways to fill a chat slot (a class string, a props object, a
          whole component) and how slots nest, using the generic blocks the
          page prints. Each block is its own tab on the demo, running against
          the Quickstart agent through the Quickstart&apos;s provider.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Lisbon?"]}
            expect={
              <>
                Each tab restyles or replaces one part of the chat: grey message
                area and blue input border; a focused input; a plain
                right/left text list; custom user messages and a custom copy
                button; a bare &ldquo;Copy&rdquo; button; a dashed box around
                the <code>get_weather</code> call; the custom placeholder,
                welcome text and disclaimer.
              </>
            }
            fail="A tab throws, or a chat shows no change from the default. The Custom component and Two levels deep tabs fail type-checking as published (see below) but are expected to render."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="The page's Deep Agents demo is missing; only its generic blocks are here">
        <p>
          Rendered under <code>/deepagents/</code> the page says slots are not
          available for Deep Agents yet, and the three blocks of its own demo
          (welcome screen, assistant message card, input disclaimer) are
          &ldquo;Missing snippet: No demo found for deepagents::chat-slots&rdquo;.
          Those are not reconstructed. The seven blocks it does print name no
          agent and no framework, so they run here unchanged, each inside the
          Quickstart&apos;s <code>CopilotKitProvider</code> with{" "}
          <code>agentId=&quot;sample_agent&quot;</code>.
        </p>
        <p className="mt-2">
          Three blocks are bare JSX, so the files wrap them in{" "}
          <code>export function Chat()</code>. The two-levels-deep block passes{" "}
          <code>CustomToolbar</code>, <code>CustomCopyButton</code> and{" "}
          <code>CustomUserMessage</code> without defining them; minimal
          versions are written in that file and labelled as not from the page.
        </p>
      </Callout>

      <Callout tone="warn" title="Published blocks that fail type-checking (kept as published)">
        <p>
          <strong>Props override:</strong> <code>&quot;data-testid&quot;</code>{" "}
          is not a property of the <code>messageView</code> slot object.{" "}
          <strong>Custom component:</strong> <code>({"{ messages, isRunning }"})</code>{" "}
          is implicitly <code>any</code>, and a plain function is not assignable
          to the <code>messageView</code> slot, whose type also carries the{" "}
          <code>Cursor</code> static. <strong>Two levels deep:</strong> the same
          for <code>userMessage</code> (<code>CopilotChatUserMessage</code>{" "}
          carries several statics). Each is suppressed with a line-level{" "}
          <code>@ts-expect-error</code>; nothing else is changed.
        </p>
      </Callout>

      <Panel title="The page's blocks">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/1-tailwind-classes.tsx` },
            { file: `${DIR}/2-props-override.tsx` },
            { file: `${DIR}/3-custom-components.tsx` },
            { file: `${DIR}/4-two-levels-deep.tsx` },
            { file: `${DIR}/5-three-levels-deep.tsx` },
            { file: `${DIR}/6-tool-calls.tsx` },
            { file: `${DIR}/7-labels.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}
