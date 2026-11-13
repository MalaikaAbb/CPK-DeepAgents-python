"use client";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { shopUI } from "./catalog";

/**
 * Catalogs: the page's "Create a catalog" `shopUI`, given to the provider as
 * `generativeUI={{ ui: shopUI }}` like the page's provider line. Only this
 * catalog runs: "Combine catalogs" needs `cartUI`, which no page defines, and
 * the schema-library and export samples are fragments (see the route page).
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/catalogs" subtitle="createGenerativeUI · agent: components_agent">
      <GenUIDemo
        variants={[
          {
            id: "shop",
            label: "shopUI (Create a catalog)",
            note: "Only ProductGrid and ProductCard exist in this catalog — no standard components.",
            generativeUI: { ui: shopUI },
            welcome: "Try: show me three running shoes as product cards.",
          },
        ]}
      />
    </DemoFrame>
  );
}
