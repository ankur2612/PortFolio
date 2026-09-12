"use client";

import { useCallback, useMemo, useState } from "react";

import { WORLDS } from "@/data/scenes";
import type { ExperienceMode, WorldConfig, WorldId } from "@/lib/types";

export interface StoryState {
  mode: ExperienceMode;
  world: WorldId;
  worldConfig: WorldConfig;
  /** 1-based index of the scene currently filling the viewport. */
  sceneOrder: number;
  sceneCount: number;
  worldName: string;
  /** The next world in narrative order, or null at the end. */
  nextWorld: WorldConfig | null;
  enterStory: () => void;
  enterQuick: () => void;
  returnToLanding: () => void;
  setWorld: (world: WorldId) => void;
  goToNextWorld: () => void;
  setSceneOrder: (order: number) => void;
}

/**
 * Single source of truth for where the visitor is.
 *
 * Deliberately plain React state: the app is one page with three axes
 * (mode / world / scene) and no shareable deep links yet. Reaching for a state
 * library or a route per scene here would add ceremony without buying
 * anything.
 *
 * Extended in Phase 3 rather than replaced — `world` now moves across all
 * three worlds and exposes the next one for the outro hand-off.
 */
export function useStoryState(): StoryState {
  const [mode, setMode] = useState<ExperienceMode>("landing");
  const [world, setWorldState] = useState<WorldId>("builder");
  const [sceneOrder, setSceneOrder] = useState(1);

  const enterStory = useCallback(() => {
    setMode("story");
    setWorldState("builder");
    setSceneOrder(1);
  }, []);

  const enterQuick = useCallback(() => setMode("quick"), []);

  const returnToLanding = useCallback(() => {
    setMode("landing");
    setWorldState("builder");
    setSceneOrder(1);
  }, []);

  const setWorld = useCallback((next: WorldId) => {
    setWorldState(next);
    setSceneOrder(1);
  }, []);

  const worldConfig = useMemo(
    () => WORLDS.find((entry) => entry.id === world) ?? WORLDS[0],
    [world],
  );

  const nextWorld = useMemo(() => {
    const index = WORLDS.findIndex((entry) => entry.id === world);
    const candidate = WORLDS[index + 1];
    return candidate?.available ? candidate : null;
  }, [world]);

  const goToNextWorld = useCallback(() => {
    if (nextWorld) setWorld(nextWorld.id);
  }, [nextWorld, setWorld]);

  return {
    mode,
    world,
    worldConfig,
    sceneOrder,
    sceneCount: worldConfig.scenes.length,
    worldName: worldConfig.name,
    nextWorld,
    enterStory,
    enterQuick,
    returnToLanding,
    setWorld,
    goToNextWorld,
    setSceneOrder,
  };
}
