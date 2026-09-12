"use client";

import Image from "next/image";
import { useCallback } from "react";

import { CANVAS, POSES, type AnkurPose } from "@/data/character";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWalkCycle } from "@/hooks/useWalkCycle";
import { trigger } from "@/lib/easterEggs";
import { cn } from "@/lib/utils";

export type { AnkurPose } from "@/data/character";

export interface AnkurCharacterProps {
  pose?: AnkurPose;
  /** Placement within the parent, as percentages. `y` is where the feet go. */
  position?: { x: number; y: number };
  /** Height of the FIGURE in vh. Normalised against the pose's figureHeight. */
  scale?: number;
  opacity?: number;
  flip?: boolean;
  blur?: number;
  breathe?: boolean;
  /** Loads eagerly. Reserve for the Finale walker. */
  priority?: boolean;
  /** Makes the chain clickable — Easter egg E1. */
  interactive?: boolean;
  className?: string;
}

/**
 * AnkurCharacter — the character abstraction layer.
 *
 * Scenes ask for a pose and nothing else:
 *
 *     <AnkurCharacter pose="engineering" />
 *
 * They never see a file path, a frame index, or which poses share artwork.
 * That is the point: the mapping lives in `data/character.ts`, so changing
 * or adding artwork never touches a scene.
 *
 * Geometry, which is what keeps the character from jumping between poses:
 *
 *   • `scale` is the height of the FIGURE, not of the image. Because the
 *     figure fills only `figureHeight` of its canvas, the canvas is rendered
 *     proportionally larger — so a kneeling pose and a standing pose read as
 *     the same person at the same camera distance.
 *   • `position.y` is where the FEET belong. Offsetting by `baseline` puts
 *     the contact point there regardless of pose.
 *
 * Reduced motion is honoured throughout: no walk cycle, no breathing, static
 * pose, nothing hidden.
 */
export function AnkurCharacter({
  pose = "neutral",
  position = { x: 50, y: 60 },
  scale = 14,
  opacity = 1,
  flip = false,
  blur = 0,
  breathe = true,
  priority = false,
  interactive = false,
  className,
}: AnkurCharacterProps) {
  const asset = POSES[pose];
  const reducedMotion = useReducedMotion();

  const frameIndex = useWalkCycle(asset.frames, { enabled: !reducedMotion });
  const handleChainClick = useCallback(() => trigger("king"), []);

  const canvasHeight = scale / asset.figureHeight;
  const anchorOffset = `-${asset.baseline * 100}%`;

  // A single walking render, not a cycle: `useWalkCycle` returns 0 and the
  // static pose shows. No in-between frames are fabricated.
  const src =
    asset.frames && !reducedMotion && asset.frames.length > 1
      ? asset.frames[frameIndex]
      : asset.src;

  if (!src) return null;

  return (
    <div
      className={cn("pointer-events-none absolute", className)}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        height: `${canvasHeight}vh`,
        aspectRatio: `${CANVAS.width} / ${CANVAS.height}`,
        transform: `translate(-50%, ${anchorOffset}) ${flip ? "scaleX(-1)" : ""}`,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
      data-pose={pose}
    >
      <Image
        src={src}
        alt={asset.alt}
        width={CANVAS.width}
        height={CANVAS.height}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="(max-width: 767px) 45vw, (max-width: 1023px) 30vw, 22vw"
        className="h-full w-auto object-contain"
        style={{
          animation:
            breathe && !reducedMotion
              ? "ap-breathe 6s ease-in-out infinite"
              : undefined,
          transformOrigin: "50% 100%",
        }}
      />

      {/*
        Chain hotspot — Easter egg E1. A real button so it is keyboard
        reachable, positioned over the neckline in the shared canvas space.
      */}
      {interactive ? (
        <button
          type="button"
          onClick={handleChainClick}
          aria-label="Ankur's chain"
          className="pointer-events-auto absolute rounded-full"
          style={{
            left: "50%",
            top: `${asset.baseline * 100 - asset.figureHeight * 100 * 0.82}%`,
            width: "22%",
            height: "7%",
            transform: "translate(-50%, -50%)",
            minWidth: 32,
            minHeight: 32,
          }}
        />
      ) : null}
    </div>
  );
}

export default AnkurCharacter;
