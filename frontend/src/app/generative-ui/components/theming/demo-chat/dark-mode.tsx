"use client";

// "Dark mode" — the page's script, verbatim. The page puts it in <head>; this
// harness renders it in the demo body (the shared layout is not the page's),
// so it runs on a full page load but not after a client-side navigation:
// reload the demo to test it.
const colorSchemeScript = `(() => {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => document.documentElement.classList.toggle("dark", media.matches);
  apply();
  media.addEventListener("change", apply);
})();`;

export function ColorSchemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />;
}
