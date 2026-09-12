"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useIdle — true once the visitor has stopped interacting.
 *
 * Used only for the sleeping-character Easter egg, so it is deliberately
 * passive: it never blocks input, never opens anything, and resets on the
 * first sign of life. Listeners are all passive and cleaned up on unmount.
 */
export function useIdle(delayMs = 60_000): boolean {
  const [idle, setIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reset = () => {
      setIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIdle(true), delayMs);
    };

    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "pointermove",
      "keydown",
      "scroll",
      "wheel",
      "touchstart",
    ];

    events.forEach((event) =>
      window.addEventListener(event, reset, { passive: true }),
    );
    reset();

    return () => {
      events.forEach((event) => window.removeEventListener(event, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delayMs]);

  return idle;
}
