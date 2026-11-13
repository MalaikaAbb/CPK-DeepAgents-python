"use client";

import { GenerativeUISurface } from "@copilotkit/react-core/v2/generative-ui";

// Harness: the Surfaces page imports `shopUI` from "./catalog" and never prints
// that file. The Catalogs page's published `app/catalog.tsx` (ProductGrid +
// ProductCard) is the catalog it means, so it is imported from there.
import { shopUI } from "../../catalogs/demo-chat/catalog";

/** "Limit the components" — the page's element, verbatim. */
export function LimitedFeatured() {
  return <GenerativeUISurface id="featured" ui={shopUI} components={["ProductGrid", "ProductCard"]} />;
}

/** "Scroll to the surface" — the page's element, verbatim. */
export function SidebarNotes() {
  return <GenerativeUISurface id="sidebar-notes" autoScroll={false} />;
}
