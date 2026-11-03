import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/multimodal-attachments" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Enabling user file attachments (images, audio, video, documents) in{" "}
          <code>CopilotChat</code>. Files can be attached via file picker or
          drag-and-drop, displayed with thumbnail previews and lightbox viewing,
          and forwarded as multimodal <code>InputContent</code> parts to the agent
          over the AG-UI protocol.
        </p>

        <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>Quick start:</strong> Add{" "}
            <code>attachments={"{ enabled: true }"}</code> to your{" "}
            <code>CopilotChat</code> component. That&apos;s it. Users can now
            click the attachment button or drag-and-drop files into the chat.
          </p>
          <p>
            <strong>Configuration options:</strong> The <code>attachments</code>{" "}
            prop accepts an <code>AttachmentsConfig</code> object for{" "}
            <code>accept</code> (MIME filter), <code>maxSize</code> (in bytes),{" "}
            <code>maxConcurrentUploads</code>, custom <code>onUpload</code>, and{" "}
            <code>onUploadFailed</code>.
          </p>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={[
              "Click the paperclip button in the chat input or drag a file (PNG, JPEG, PDF) into the chat",
              "Type a message, e.g.: 'What is in this attachment?' and send",
            ]}
            expect="The file appears with a thumbnail preview in the composer and is sent as multimodal InputContent to the agent."
            fail="The paperclip button is missing, or attaching a file throws an error."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Model Modality Support">
        <p>
          Not all models support all modalities. For example, OpenAI&apos;s
          GPT-4o / GPT-4o-mini support images, but sending audio/video or
          unsupported binaries may result in a <code>RUN_ERROR</code> event from
          the upstream API. The <code>onError</code> prop on{" "}
          <code>CopilotChat</code> allows graceful capture and presentation of
          these errors.
        </p>
      </Callout>

      <Panel title="The demo's implementation">
        <SourceCode file="frontend/src/app/multimodal-attachments/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
