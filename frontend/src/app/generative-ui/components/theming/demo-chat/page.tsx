"use client";

import { standardUI, type GenerativeUIConfig } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { ColorSchemeScript } from "./dark-mode";
import "./theming.css";

/** "What is this?" — the `generativeUI` value of the page's provider, verbatim. */
const brandTheme: GenerativeUIConfig = {
  ui: standardUI,
  theme: {
    "--a2ui-color-accent": "#d97706",
    "--a2ui-font-family": "Inter, sans-serif",
    "--a2ui-radius-md": "10px",
  },
};

const WELCOME = "Try: show a card with a primary button, a slider, and a bar chart of three months.";

/**
 * Theming: the provider theme, and the page's CSS (`theming.css`, imported
 * globally by Next once this demo opens, so it shows on every surface) with
 * the plain `{ ui: standardUI }` provider. The dark-mode script follows the OS
 * setting. "Colors for each mode" and "The map" are bare `theme:` fragments
 * and the theme file is never given to a provider on the page, so those are
 * shown on the route page, not run.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/theming" subtitle="generativeUI.theme · agent: components_agent">
      <ColorSchemeScript />
      <GenUIDemo
        variants={[
          { id: "brand", label: "Provider theme", generativeUI: brandTheme, welcome: WELCOME },
          {
            id: "css",
            label: "CSS variables only",
            note: "No theme prop: the accent comes from .a2ui-surface in theming.css.",
            generativeUI: { ui: standardUI },
            welcome: WELCOME,
          },
        ]}
      />
    </DemoFrame>
  );
}
