"use client";

import { useCallback } from "react";

import StoryScene from "@/components/story/StoryScene";
import WorldWrapper from "@/components/story/WorldWrapper";
import type { WorldConfig, WorldId } from "@/lib/types";

export interface StoryWorldProps {
  world: WorldConfig;
  /** Reports the scene currently dominating the viewport, by 1-based order. */
  onSceneChange: (order: number) => void;
  /** Rendered at the end of the world — the hand-off to whatever is next. */
  footer?: React.ReactNode;
}

/**
 * StoryWorld
 *
 * Renders any world from its config. Replaces the Phase 2 `BuilderWorld`,
 * which hardcoded a single world — with three worlds of the same shape,
 * one component driven by data is the correct structure.
 */
export function StoryWorld({ world, onSceneChange, footer }: StoryWorldProps) {
  const handleActivate = useCallback(
    (id: string) => {
      const scene = world.scenes.find((entry) => entry.id === id);
      if (scene) onSceneChange(scene.order);
    },
    [world, onSceneChange],
  );

  return (
    <WorldWrapper
      id={`world-${world.id}`}
      name={world.name}
      eyebrow={world.eyebrow}
      description={world.description}
      accent={world.accent}
    >
      {world.scenes.map((scene) => (
        <StoryScene key={scene.id} scene={scene} onActivate={handleActivate} />
      ))}

      {footer}
    </WorldWrapper>
  );
}

export interface WorldOutroProps {
  label: string;
  actionLabel?: string;
  onAction?: () => void;
  nextWorld?: WorldId;
}

/**
 * WorldOutro
 *
 * The end-of-world marker: a dropping rule, a line of mono, and — where a
 * next world exists — an explicit control to continue. Scroll still works;
 * this is an affordance, not a gate.
 */
export function WorldOutro({
  label,
  actionLabel,
  onAction,
}: WorldOutroProps) {
  return (
    <div className="flex w-full flex-col items-center gap-s3 px-s4 pb-s8 pt-s6">
      <span
        aria-hidden="true"
        className="block h-s6 w-px"
        style={{
          background: "linear-gradient(to bottom, var(--acc-line), transparent)",
        }}
      />
      <p className="u-mono text-center text-fg-mute">{label}</p>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-s2 inline-flex min-h-[44px] items-center gap-s2 rounded-md border border-line px-s4 py-s2 transition-colors duration-200 hover:border-[var(--acc-line)]"
        >
          <span className="u-mono" style={{ color: "var(--acc-text)" }}>
            {actionLabel}
          </span>
          <span aria-hidden="true" className="u-mono text-fg-mute">
            →
          </span>
        </button>
      ) : null}
    </div>
  );
}

export default StoryWorld;
