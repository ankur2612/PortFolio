"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export interface CharacterProps {
  /** Placement within the parent, as percentages. */
  position?: { x: number; y: number };
  /** Height in vh. The figure is deliberately small in frame. */
  scale?: number;
  opacity?: number;
  variant?: "default" | "silhouette";
  flip?: boolean;
  blur?: number;
  /** Slow breathing loop. The one always-on animation permitted. */
  breathe?: boolean;
  /** Pose rotations, in degrees, applied to named groups. */
  armLeft?: number;
  armRight?: number;
  torso?: number;
  /** Accessory that makes a pose read at small scale. */
  prop?: "none" | "headphones" | "backpack" | "tool";
  /**
   * Fill the parent box instead of sizing to `scale` vh. Used by
   * AnkurCharacter, which owns the shared canvas geometry so the stand-in and
   * the final artwork occupy identical space.
   */
  fill?: boolean;
  className?: string;
}

/**
 * Character — PLACEHOLDER GEOMETRY.
 *
 * The final illustrated Ankur (mid-length hair, beard, glasses, hoodie,
 * chain, wrist threads, watch) is a separate art task. This component exists
 * now so every placement, transform and accent interaction is wired and
 * tested; swapping the artwork later is a change to this one file and
 * nothing else.
 *
 * The placeholder is deliberately a clean geometric figure rather than a
 * crude cartoon: at 8–15vh in a dark frame it reads as intentional
 * silhouette art, so scenes can be judged on composition today.
 *
 * Identity tokens present even in placeholder form — hood mass, glasses
 * notch, chain arc — so proportions match the eventual asset.
 */
export function Character({
  position = { x: 50, y: 60 },
  scale = 14,
  opacity = 1,
  variant = "silhouette",
  flip = false,
  blur = 0,
  breathe = false,
  armLeft = 0,
  armRight = 0,
  torso = 0,
  prop = "none",
  fill = false,
  className,
}: CharacterProps) {
  const reducedMotion = useReducedMotion();
  const isSilhouette = variant === "silhouette";
  const shouldBreathe = breathe && !reducedMotion;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute block", className)}
      style={
        fill
          ? {
              // Fill the parent canvas box. AnkurCharacter owns the geometry.
              inset: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              opacity,
              transform: flip ? "scaleX(-1)" : undefined,
              filter: blur > 0 ? `blur(${blur}px)` : undefined,
            }
          : {
              left: `${position.x}%`,
              top: `${position.y}%`,
              height: `${scale}vh`,
              opacity,
              transform: `translate(-50%, -50%) ${flip ? "scaleX(-1)" : ""}`,
              filter: blur > 0 ? `blur(${blur}px)` : undefined,
            }
      }
    >
      <svg
        viewBox="0 0 120 260"
        height="100%"
        style={{
          color: "var(--acc)",
          transformOrigin: "50% 100%",
          animation: shouldBreathe
            ? "ap-breathe 6s ease-in-out infinite"
            : undefined,
        }}
        role="presentation"
      >
        {/* Torso lean, pivoting at the hips. Reads as posture, not motion. */}
        <g
          id="torso"
          style={{
            transform: `rotate(${torso}deg)`,
            transformOrigin: "60px 180px",
          }}
        >
        {/* Body mass — hoodie silhouette. */}
        <path
          d="M60 62c-17 0-29 11-32 27l-8 44c-1 7 3 12 10 12h6l-4 96c0 5 3 8 8 8h40c5 0 8-3 8-8l-4-96h6c7 0 11-5 10-12l-8-44c-3-16-15-27-32-27z"
          fill={isSilhouette ? "var(--color-void)" : "var(--color-raised)"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity={isSilhouette ? 0.9 : 0.5}
        />

        {/* Hood collar. */}
        <path
          d="M40 72c6-8 13-12 20-12s14 4 20 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />

        {/* Head + hair mass. */}
        <path
          d="M60 8c-14 0-23 10-23 24 0 12 5 22 12 26 4 2 18 2 22 0 7-4 12-14 12-26C83 18 74 8 60 8z"
          fill={isSilhouette ? "var(--color-void)" : "var(--color-raised)"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity={isSilhouette ? 0.9 : 0.5}
        />

        {/* Glasses — two rounded rects and a bridge. Legible at 40px. */}
        <g stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.85">
          <rect x="43" y="28" width="13" height="9" rx="2.5" />
          <rect x="64" y="28" width="13" height="9" rx="2.5" />
          <path d="M56 32.5h8" />
        </g>

        {/* Beard line along the jaw. */}
        <path
          d="M45 44c4 7 9 10 15 10s11-3 15-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeOpacity="0.55"
        />

        {/* Chain arc at the neck. */}
        <path
          d="M50 70c4 6 16 6 20 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.9"
        />

        </g>

        {/* Backpack — travelling. Behind the arms, so it reads as worn. */}
        {prop === "backpack" ? (
          <g
            stroke="currentColor"
            strokeWidth="1.4"
            strokeOpacity="0.6"
            fill="none"
          >
            <rect x="24" y="92" width="26" height="40" rx="5" />
            <path d="M50 100c6-4 6-4 10-6" />
            <path d="M50 124c6 2 6 2 10 4" />
          </g>
        ) : null}

        {/*
          Arm groups. Rotation origins sit at the shoulders, so a pose is a
          couple of degrees of rotation rather than a redrawn limb — this is
          what lets one figure cover eight poses.
        */}
        <g
          id="arm-l"
          style={{
            transform: `rotate(${armLeft}deg)`,
            transformOrigin: "34px 92px",
            transformBox: "fill-box",
          }}
        >
          {/* Wrist threads — left. */}
          <g stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.7">
            <path d="M22 140h10" />
            <path d="M22 144h10" />
            <path d="M22 148h10" />
          </g>
          {prop === "tool" ? (
            <g stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.7">
              <line x1="16" y1="150" x2="16" y2="170" />
              <rect
                x="12"
                y="168"
                width="8"
                height="12"
                rx="2"
                fill="currentColor"
                fillOpacity="0.35"
                stroke="none"
              />
            </g>
          ) : null}
        </g>

        <g
          id="arm-r"
          style={{
            transform: `rotate(${armRight}deg)`,
            transformOrigin: "86px 92px",
            transformBox: "fill-box",
          }}
        >
          {/* Watch — right. */}
          <rect
            x="88"
            y="140"
            width="10"
            height="9"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeOpacity="0.8"
          />
        </g>

        {/* Headphones — listening. Over the hair mass. */}
        {prop === "headphones" ? (
          <g
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.85"
            fill="none"
          >
            <path d="M33 30a27 27 0 0 1 54 0" />
            <rect
              x="28"
              y="28"
              width="9"
              height="16"
              rx="4"
              fill="currentColor"
              fillOpacity="0.4"
            />
            <rect
              x="83"
              y="28"
              width="9"
              height="16"
              rx="4"
              fill="currentColor"
              fillOpacity="0.4"
            />
          </g>
        ) : null}

        {/* Rim light on the lit side. */}
        <path
          d="M37 32c0-14 9-24 23-24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.95"
        />
      </svg>
    </div>
  );
}

export default Character;
