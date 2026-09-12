"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface WalkCycleOptions {
  /** Frames per second. 8–10 reads as a natural unhurried walk. */
  fps?: number;
  enabled?: boolean;
}

/**
 * useWalkCycle — steps through walk frames on a fixed interval.
 *
 * A plain `setInterval` rather than rAF or GSAP: a walk cycle advances 8
 * times a second, so driving it at 60fps would waste 52 wake-ups out of every
 * 60 to render the same image. The interval is the cheaper and more honest
 * mechanism for frame-stepped art.
 *
 * Returns 0 whenever motion is reduced, the tab is hidden, or fewer than two
 * frames exist — so the caller always has a valid index and the static pose
 * simply shows.
 */
export function useWalkCycle(
  frames: string[] | null | undefined,
  { fps = 9, enabled = true }: WalkCycleOptions = {},
): number {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const frameCount = frames?.length ?? 0;
  const active = enabled && !reducedMotion && frameCount > 1;

  useEffect(() => {
    if (!active) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (timer) return;
      timer = setInterval(
        () => setIndex((current) => (current + 1) % frameCount),
        1000 / fps,
      );
    };

    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    };

    // A walk cycle in a buried tab is pure waste.
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, frameCount, fps]);

  return active ? index : 0;
}
