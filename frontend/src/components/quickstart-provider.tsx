"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";

/**
 * The Deep Agents Quickstart's `app/providers.tsx` (as published 2026-11-11),
 * reused by routes whose doc page prints a bare `<CopilotChat />` and no
 * provider of its own. Only the export name differs from the Quickstart.
 *
 * Nested under the app-wide `<CopilotKit>`, it gives the page's chat the agent
 * the Quickstart names (`agentId="sample_agent"`), so the snippet can stay
 * byte-for-byte without an `agentId` prop. A chat inside it has its own
 * conversation, separate from the rest of the app.
 */
export function QuickstartProviders({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="sample_agent" useSingleEndpoint={false}>
      {children}
    </CopilotKitProvider>
  );
}
