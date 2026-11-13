"use client";

import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { QuickstartProviders } from "@/components/quickstart-provider";

import { Chat as TailwindChat } from "../snippets/1-tailwind-classes";
import { Chat as PropsChat } from "../snippets/2-props-override";
import { Chat as ComponentChat } from "../snippets/3-custom-components";
import { Chat as TwoLevelsChat } from "../snippets/4-two-levels-deep";
import { Chat as ThreeLevelsChat } from "../snippets/5-three-levels-deep";
import { Chat as ToolCallsChat } from "../snippets/6-tool-calls";
import { Chat as LabelsChat } from "../snippets/7-labels";

/**
 * Slots: the page's generic blocks, one tab each.
 *
 * The page's own Deep Agents demo (welcome-screen, assistant-message and
 * disclaimer slots) is "Missing snippet" when rendered for this framework, so
 * none of that is here. What is here are the seven framework-agnostic blocks
 * the page does print, each in `../snippets/`, unchanged apart from the
 * labelled wrappers. They name no agent, so each tab mounts inside the
 * Quickstart's own provider (`agentId="sample_agent"`), not inside a harness
 * agent prop.
 */
const TABS = [
  { key: "tailwind", label: "Tailwind classes", Chat: TailwindChat },
  { key: "props", label: "Props override", Chat: PropsChat },
  { key: "component", label: "Custom component", Chat: ComponentChat },
  { key: "two", label: "Two levels deep", Chat: TwoLevelsChat },
  { key: "three", label: "Three levels deep", Chat: ThreeLevelsChat },
  { key: "tools", label: "Tool calls", Chat: ToolCallsChat },
  { key: "labels", label: "Labels", Chat: LabelsChat },
] as const;

export default function Page() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("tailwind");
  const active = TABS.find((t) => t.key === tab) ?? TABS[0];
  const ActiveChat = active.Chat;

  return (
    <DemoFrame parentPath="/custom-look-and-feel/slots" subtitle="graph: sample_agent">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-1 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded px-2 py-1 text-xs font-medium ${
                t.key === tab
                  ? "bg-[var(--accent)] text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1">
          <QuickstartProviders key={active.key}>
            <ActiveChat />
          </QuickstartProviders>
        </div>
      </div>
    </DemoFrame>
  );
}
