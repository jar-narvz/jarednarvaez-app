import { useSyncExternalStore } from "react";

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * Reduce Motion, false on the server and while hydrating, then the real value. Motion's
 * useReducedMotion is already true on the first client render, which doesn't match the server's
 * HTML; React leaves the mismatched class alone, so the cards would stay at opacity 0.
 */
export function useReduceMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCE);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}
