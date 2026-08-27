"use client";

import { useSyncExternalStore } from "react";

// The value never changes after mount, so no store updates are ever emitted.
const subscribe = () => () => {};

/**
 * Returns `false` during SSR and the first client (hydration) render, then
 * `true` afterwards. This lets components defer localStorage-dependent UI until
 * after hydration without a setState-in-effect (which the React Compiler flags)
 * and without risking a hydration mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
