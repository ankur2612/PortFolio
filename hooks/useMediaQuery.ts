"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query.
 *
 * Implemented with `useSyncExternalStore` rather than `useState` + `useEffect`
 * because a media query *is* an external store: this is the API React provides
 * for exactly this case. It avoids the cascading render that a setState inside
 * an effect causes, and its explicit server snapshot guarantees the SSR markup
 * and the first client render agree — no hydration mismatch.
 *
 * The server snapshot is always `false`, so components render their
 * "full motion / fine pointer absent" baseline on the server and correct
 * themselves on the client before paint.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
