"use client";

import { CopilotSidebar, useDefaultRenderTool } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { Providers } from "./providers";

const AGENT_ID = "sample_agent";

/**
 * The Quickstart's `app/page.tsx`, inside the Quickstart's `app/providers.tsx`.
 *
 * Since the 2026-11-11 doc sync the page's provider is a bare
 * `<CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="sample_agent"
 * useSingleEndpoint={false}>` (it was `<CopilotKit agent="sample_agent">`).
 * That file is copied verbatim into `./providers.tsx` and mounted here, nested
 * under the app-wide provider, so this demo exercises exactly the page's
 * provider. The app-wide one (`components/providers.tsx`) stays on
 * `<CopilotKit>` because other routes (Predictive State Updates) need the
 * listeners only that wrapper mounts. Being nested, this demo no longer shares
 * its conversation with the rest of the app.
 *
 * `<CopilotSidebar />` carries no `agentId`, as on the page: the provider's
 * `agentId="sample_agent"` picks the agent. The one departure left is the
 * styled `<details>` renderer and the harness `DemoFrame` around it.
 *
 * `useDefaultRenderTool` is the page's — a catch-all that draws every tool call
 * the agent makes, which is how you see `get_weather` fire at all. It is
 * registered in `QuickstartPage`, below the nested provider, so it lands on
 * the page's provider rather than the app-wide one.
 */
export default function Page() {
  return (
    <Providers>
      <QuickstartPage />
    </Providers>
  );
}

function QuickstartPage() {
  useDefaultRenderTool({
    render: ({ name, status, parameters, result }) => (
      <details className="my-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/60">
        <summary className="cursor-pointer font-medium text-slate-800 dark:text-slate-200">
          {status === "complete" ? `Called ${name}` : `Calling ${name}`}
        </summary>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Status: {status}
        </p>
        <p className="mt-1 break-all font-mono text-xs text-slate-600 dark:text-slate-400">
          Args: {JSON.stringify(parameters)}
        </p>
        <p className="mt-1 break-all font-mono text-xs text-slate-600 dark:text-slate-400">
          Result: {JSON.stringify(result)}
        </p>
      </details>
    ),
  });

  return (
    <DemoFrame parentPath="/quickstart" subtitle={`graph: ${AGENT_ID}`}>
      <main className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Your App
        </h1>
        <p className="max-w-md text-sm text-slate-500">
          The sidebar is docked at the right edge. Ask it for the weather
          somewhere to confirm the whole stack — browser, runtime route,
          LangGraph server, model — is connected.
        </p>
      </main>

      <CopilotSidebar />
    </DemoFrame>
  );
}
