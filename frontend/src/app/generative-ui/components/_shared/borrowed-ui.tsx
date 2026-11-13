"use client";

/**
 * Borrowed UI components — NOT from the docs.
 *
 * Adopt from A2UI's "After" catalog registers `Airport` and `Arrow` and never
 * defines or imports them. These are the aws-strands-ts harness's minimal
 * versions (`_shared/scaffolding.tsx`), copied unchanged. Nothing else from
 * that file is used: its data, cart hook, schema and cart catalog are not UI
 * components, so the variants that need them stay broken here.
 */

/** Borrowed from aws-strands-ts: `Airport` is used by the After catalog but not defined. */
export function Airport({ code, city }: { code: string; city: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{code}</p>
      <p className="text-xs text-slate-500">{city}</p>
    </div>
  );
}

/** Borrowed from aws-strands-ts: `Arrow` is used by the After catalog but not defined. */
export function Arrow() {
  return <span className="text-2xl">→</span>;
}
