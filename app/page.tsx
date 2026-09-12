"use client";

import { useCallback, useEffect, useState } from "react";

import Landing from "@/components/Landing";
import QuickMode from "@/components/quick/QuickMode";
import Finale from "@/components/story/Finale";
import ProgressNavigation from "@/components/story/ProgressNavigation";
import StoryWorld, { WorldOutro } from "@/components/story/StoryWorld";
import WorldIntro from "@/components/story/WorldIntro";
import EasterEggToast from "@/components/ui/EasterEggToast";
import HiringSignal from "@/components/ui/HiringSignal";
import IdleSleeper from "@/components/ui/IdleSleeper";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useStoryState } from "@/hooks/useStoryState";
import type { WorldId } from "@/lib/types";

/**
 * The single-page application shell.
 *
 * Experience flow:
 *   Landing → Story (Builder → Human → Side Quests → Finale)
 *   Landing → Quick Mode
 *   Q from anywhere → Quick Mode.  Esc → back.
 *
 * Story Mode and Quick Mode remain states of this page, not routes.
 *
 * There is no audio anywhere in this project. Choosing Story Mode opens
 * directly into the first world — the experience is designed to work in
 * silence, and nothing is gated behind a sound preference.
 */
export default function Home() {
  const story = useStoryState();

  const [introDone, setIntroDone] = useState(false);
  const [atFinale, setAtFinale] = useState(false);

  const {
    mode,
    world,
    worldConfig,
    worldName,
    sceneOrder,
    sceneCount,
    nextWorld,
    enterStory,
    enterQuick,
    returnToLanding,
    setWorld,
    goToNextWorld,
    setSceneOrder,
  } = story;

  /* ---------------- Entry ---------------- */

  const handleEnterStory = useCallback(() => {
    setIntroDone(false);
    setAtFinale(false);
    enterStory();
  }, [enterStory]);

  /* ---------------- Navigation ---------------- */

  const handleBack = useCallback(() => {
    setIntroDone(false);
    setAtFinale(false);
    returnToLanding();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [returnToLanding]);

  const handleQuickMode = useCallback(() => {
    enterQuick();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [enterQuick]);

  // Every world change replays its entry transition, so moving between worlds
  // reads as a cut in a film rather than a page jump.
  const handleSelectWorld = useCallback(
    (next: WorldId) => {
      if (next === world && !atFinale) return;
      setAtFinale(false);
      setIntroDone(false);
      setWorld(next);
    },
    [world, atFinale, setWorld],
  );

  const handleNextWorld = useCallback(() => {
    if (nextWorld) {
      setIntroDone(false);
      goToNextWorld();
    } else {
      // End of the last world: the finale replaces it in place.
      setAtFinale(true);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [nextWorld, goToNextWorld]);

  const handleEscape = useCallback(() => {
    if (mode === "quick" || mode === "story") handleBack();
  }, [mode, handleBack]);

  useGlobalShortcuts({
    onQuickMode: handleQuickMode,
    onEscape: handleEscape,
  });

  // Entering a world always starts at the top, never mid-scroll.
  useEffect(() => {
    if (mode === "story") window.scrollTo({ top: 0, behavior: "auto" });
  }, [mode, world]);

  /* ---------------- Global overlays ---------------- */

  const overlays = (
    <>
      <EasterEggToast />
      <IdleSleeper />
    </>
  );

  /* ---------------- Landing ---------------- */
  if (mode === "landing") {
    return (
      <div id="main-content">
        <Landing onStoryMode={handleEnterStory} onQuickMode={handleQuickMode} />
        {overlays}
      </div>
    );
  }

  /* ---------------- Quick Mode ---------------- */
  if (mode === "quick") {
    return (
      <div id="main-content" className="relative">
        <QuickMode onExit={handleBack} onEnterStory={handleEnterStory} />

        <button
          type="button"
          onClick={handleBack}
          title="Back to the landing (Esc)"
          className="fixed left-s3 top-s3 z-[64] inline-flex min-h-[40px] items-center gap-s2 rounded-md border border-line px-s3 py-s2 u-no-print"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-raised) 86%, transparent)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <span className="u-mono text-fg-mute">← Back</span>
          <span aria-hidden="true" className="u-mono text-fg-mute">
            Esc
          </span>
        </button>

        {overlays}
      </div>
    );
  }

  /* ---------------- Story Mode ---------------- */
  const outroLabel = nextWorld
    ? `${worldConfig.eyebrow.split(" / ")[0]} complete · ${nextWorld.eyebrow} comes next`
    : "Three worlds down · one thing left";

  return (
    <div id="main-content">
      {!introDone && !atFinale ? (
        <WorldIntro
          key={`intro-${world}`}
          eyebrow={worldConfig.eyebrow}
          title={worldConfig.scenes[0]?.title ?? worldConfig.name}
          accent={worldConfig.accent}
          onComplete={() => setIntroDone(true)}
        />
      ) : null}

      {atFinale ? (
        <div data-world="sidequest">
          <Finale onRestart={handleBack} />
        </div>
      ) : (
        <StoryWorld
          key={`world-${world}`}
          world={worldConfig}
          onSceneChange={setSceneOrder}
          footer={
            <WorldOutro
              label={outroLabel}
              actionLabel={
                nextWorld ? `Enter ${nextWorld.name}` : "See how it ends"
              }
              onAction={handleNextWorld}
            />
          }
        />
      )}

      <HiringSignal onOpen={handleQuickMode} />

      {!atFinale ? (
        <ProgressNavigation
          world={world}
          worldName={worldName}
          sceneOrder={sceneOrder}
          sceneCount={sceneCount}
          onSelectWorld={handleSelectWorld}
          onBack={handleBack}
        />
      ) : null}

      {overlays}
    </div>
  );
}
