"use client";

import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { appUI as omittedUI } from "./omit";
import { appUI as overriddenUI } from "./override";

/**
 * Standard catalog: "Use it as it is" (`{ ui: standardUI }`), "Drop
 * components" and "Replace a component". "Add your own components" is not
 * mounted: it needs `ProductCard` and `productSchema`, which the page never
 * defines (see the route page).
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/standard-catalog" subtitle="standardUI · agent: components_agent">
      <GenUIDemo
        variants={[
          {
            id: "standard",
            label: "standardUI as is",
            generativeUI: { ui: standardUI },
            welcome: "Try: show a bar chart of signups for the last three months in a card.",
          },
          {
            id: "omit",
            label: "omit Map / Video / HtmlView",
            generativeUI: { ui: omittedUI },
            welcome: "Try: show the Eiffel Tower and the Louvre on a map.",
          },
          {
            id: "override",
            label: "overrides Card → MyCard",
            generativeUI: { ui: overriddenUI },
            welcome: "Try: put a short summary of our three plans in a card.",
          },
        ]}
      />
    </DemoFrame>
  );
}
