"use client";

import Image from "next/image";
import { useCallback } from "react";

import Character from "@/components/story/Character";
import { CANVAS, POSES, type AnkurPose } from "@/data/character";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWalkCycle } from "@/hooks/useWalkCycle";
import { trigger } from "@/lib/easterEggs";
import { cn } from "@/lib/utils";

export type { AnkurPose } from "@/data/character";

/**
 * Stand-in geometry parameters.
 *
 * These drive the placeholder figure ONLY. They are not an attempt to draw
 * Ankur — the real character is a 3D-avatar render and cannot be approximated
 * with limb rotations without producing a different person. They exist so
 * every pose has a distinct, legible silhouette while the artwork is pending,
 * and so composition, scale and anchoring can be reviewed today.
 */
interface StandInTransform {
  torso?: number;
  armLeft?: number;
  armRight?: number;
  lean?: number;
  prop?: "none" | "headphones" | "backpack" | "tool";
}

const STAND_IN: Record<AnkurPose, StandInTransform> = {
  neutral: { prop: "headphones" },
  confident: { torso: -2, armLeft: 8, armRight: 8 },
  walking: { lean: 4, armLeft: 18, armRight: -18, prop: "headphones" },
  walkingBack: { lean: 4, armLeft: -18, armRight: 18, prop: "headphones" },

  coding: { torso: 8, armLeft: 30, armRight: 26, prop: "headphones" },
  engineering: { torso: 8, armLeft: 26, armRight: 22, prop: "tool" },
  debugging: { torso: 12, armLeft: 34, armRight: -40 },
  leadership: { torso: -2, armRight: -34 },
  victory: { armLeft: -38, armRight: -6 },

  thinking: { torso: -3, armRight: -42 },
  pressure: { torso: 10, armLeft: 12, armRight: 12 },

  travelling: { lean: 5, armLeft: 12, prop: "backpack" },
  exploring: { torso: -4, lean: 3, armRight: 16 },
  writing: { torso: 14, armLeft: 28, armRight: 24, prop: "headphones" },
  rap: { torso: -4, armLeft: -30, armRight: 18, prop: "headphones" },

  sleeping: { torso: 0 },
};

export interface AnkurCharacterProps {
  pose?: AnkurPose;
  /** Placement within the parent, as percentages. */
  position?: { x: number; y: number };
  /** Height in vh. Normalised against the pose's figureHeight. */
  scale?: number;
  opacity?: number;
  flip?: boolean;
  blur?: number;
  breathe?: boolean;
  /** Loads eagerly. Reserve for the Finale walker. */
  priority?: boolean;
  /** Makes the chain clickable — Easter egg E1. */
  interactive?: boolean;
  /** Silhouette treatment. Only affects the stand-in. */
  variant?: "default" | "silhouette";
  className?: string;
}

/**
 * AnkurCharacter — the character abstraction layer.
 *
 * Scenes ask for a pose and nothing else:
 *
 *     <AnkurCharacter pose="coding" />
 *
 * They never see a file path, a frame index, or the fact that the artwork is
 * currently missing. That is the whole point of this component: when the real
 * assets land, every scene picks them up without changing a line.
 *
 * ── RENDERING PATHS ──────────────────────────────────────────────────────
 *
 * 1. ARTWORK PRESENT (`POSES[pose].src` is set)
 *    Renders the image through `next/image`, scale-normalised by the pose's
 *    `figureHeight` and ground-anchored by its `baseline`, so switching poses
 *    never makes the figure jump or resize. Walk poses with frames step
 *    through them via `useWalkCycle`.
 *
 * 2. ARTWORK MISSING (current state)
 *    Renders the geometric stand-in from `components/story/Character.tsx`.
 *    This is NOT presented as the final character — it is deliberately
 *    abstract, and `data/character.ts` documents exactly what is outstanding.
 *
 * Reduced motion is honoured on both paths: no walk cycle, no breathing,
 * static pose, nothing hidden.
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
  variant = "silhouette",
  className,
}: AnkurCharacterProps) {
  const asset = POSES[pose];
  const reducedMotion = useReducedMotion();

  const frameIndex = useWalkCycle(asset.frames, { enabled: !reducedMotion });
  const handleChainClick = useCallback(() => trigger("king"), []);

  /*
   * Scale normalisation. `scale` is the height the FIGURE should occupy, in
   * vh. Because the figure fills only `figureHeight` of its canvas, the
   * canvas itself must be rendered proportionally larger — otherwise a
   * seated pose (smaller figure, same canvas) would read as further away.
   */
  const canvasHeight = scale / asset.figureHeight;

  /*
   * Ground anchoring. `position.y` is where the character's FEET belong.
   * Offsetting by the baseline puts the contact point there regardless of
   * pose, which is what stops vertical jumps between poses.
   */
  const anchorOffset = `-${asset.baseline * 100}%`;

  const hasArtwork = asset.src !== null;
  const src =
    asset.frames && !reducedMotion && asset.frames.length > 1
      ? asset.frames[frameIndex]
      : asset.src;

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
      data-artwork={hasArtwork ? "final" : "pending"}
    >
      {hasArtwork && src ? (
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
      ) : (
        /*
         * Stand-in. Fills the canvas box so the layout, anchoring and scale
         * behave exactly as they will with real artwork — swapping the asset
         * in changes nothing about the surrounding composition.
         */
        <div className="relative h-full w-full">
          <Character
            fill
            opacity={1}
            variant={variant}
            breathe={breathe}
            armLeft={STAND_IN[pose].armLeft}
            armRight={STAND_IN[pose].armRight}
            torso={STAND_IN[pose].torso}
            prop={STAND_IN[pose].prop}
          />
          {/* The story must survive with no artwork and no images. */}
          <span className="u-sr-only">{asset.alt}</span>
        </div>
      )}

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
