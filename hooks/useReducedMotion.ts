"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Tracks the user's reduced-motion preference.
 *
 * Every animated component must consult this and render its final state
 * immediately when it is true — no information may be lost when motion is off.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
