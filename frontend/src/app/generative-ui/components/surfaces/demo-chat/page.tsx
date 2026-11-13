"use client";

import type { GenerativeUIConfig } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { shopUI } from "../../catalogs/demo-chat/catalog";
import { LimitedFeatured, SidebarNotes } from "./targets";
import "./surfaces.css";

/**
 * "When a component fails" — the `generativeUI` value of the page's provider,
 * verbatim (held in a const so the shared demo can pass it to its provider).
 *
 * Mounted targets: "Limit the components" and "Scroll to the surface". Not
 * mounted: "Add a page target" (`FeaturedProducts`) needs a `products` list and
 * a `Product` type the page never defines, and "One target for each item" needs
 * the `product` it reads — both broken, see the route page.
 */
const generativeUI: GenerativeUIConfig = {
  ui: shopUI,
  errorBoundary: {
    onError: (info) => console.warn(info.kind, info.surfaceId, info.error.message),
    fallback: ({ retry }) => <button onClick={retry}>Try again</button>,
  },
};

export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/surfaces" subtitle="GenerativeUISurface · agent: components_agent">
      <GenUIDemo
        variants={[
          {
            id: "targets",
            label: "Page targets",
            note: "Two of the page's targets: featured (ProductGrid/ProductCard only) and sidebar-notes (autoScroll off).",
            generativeUI,
            welcome: "Try: show three running shoes in the featured area, and a short note in sidebar-notes.",
            page: (
              <div className="space-y-6">
                <section>
                  <h2 className="mb-2 text-sm font-semibold">featured</h2>
                  <LimitedFeatured />
                </section>
                <section>
                  <h2 className="mb-2 text-sm font-semibold">sidebar-notes</h2>
                  <SidebarNotes />
                </section>
              </div>
            ),
          },
        ]}
      />
    </DemoFrame>
  );
}
