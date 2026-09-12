"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * True only for devices with a real hovering pointer (mouse / trackpad).
 *
 * Gates cursor-driven effects such as the magnetic button. Touch devices get
 * the static, tap-friendly version instead — never a hover dependency.
 */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
