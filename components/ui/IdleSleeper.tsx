"use client";

import { useEffect } from "react";

import AnkurCharacter from "@/components/character/AnkurCharacter";
import { useIdle } from "@/hooks/useIdle";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { trigger } from "@/lib/easterEggs";

/**
 * IdleSleeper — Easter egg E3.
 *
 * After a long idle, the figure lies down in the corner and sleeps.
 *
 * Strictly non-blocking: `pointer-events: none`, corner placement, no overlay,
 * no dimming, and it disappears the instant the visitor moves. Someone who
 * stepped away to take a call should come back to a joke, not a modal.
 *
 * Skipped entirely under reduced motion — a figure that animates itself into
 * frame unprompted is exactly what that preference asks us not to do.
 */
export function IdleSleeper() {
  const idle = useIdle(70_000);
  const reducedMotion = useReducedMotion();
  const active = idle && !reducedMotion;

  useEffect(() => {
    if (active) trigger("sleep");
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-s5 right-s4 z-[62] u-no-print"
      style={{
        width: 140,
        height: 90,
        animation: "ap-fade-in 900ms ease-out both",
      }}
    >
      {/*
        The sleeping pose. Rotation is applied here only while the stand-in
        geometry is in place — the final `sleeping.png` is drawn lying down,
        so this wrapper transform comes out when the artwork lands.
      */}
      <div
        className="absolute inset-0"
        style={{ transform: "rotate(90deg) translateY(-14px)" }}
      >
        <AnkurCharacter
          pose="sleeping"
          position={{ x: 50, y: 50 }}
          scale={9}
          opacity={0.4}
          breathe
        />
      </div>

      <span
        className="u-mono absolute bottom-0 right-0 text-fg-mute"
        style={{ opacity: 0.7 }}
      >
        zzz
      </span>
    </div>
  );
}

export default IdleSleeper;
