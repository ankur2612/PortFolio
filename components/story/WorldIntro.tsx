"use client";

import gsap from "gsap";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import AnkurCharacter from "@/components/character/AnkurCharacter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { worldTransition } from "@/lib/animations";
import type { AccentName } from "@/lib/types";

export interface WorldIntroProps {
  eyebrow: string;
  title: string;
  accent: AccentName;
  onComplete?: () => void;
}

/**
 * Per-world entry texture.
 *
 * Builder arrives as a blueprint grid, Human as a soft horizon with no grid
 * at all, Side Quests as scattered fragments. Same duration, same structure —
 * only the atmosphere changes, which is the rule the whole project follows.
 */
function IntroTexture({ accent }: { accent: AccentName }) {
  if (accent === "human") {
    // MEMORY — no grid. A horizon and warm light. Softer than what precedes it.
    return (
      <>
        <div
          className="absolute inset-x-0"
          style={{
            top: "62%",
            height: 1,
            background:
              "linear-gradient(to right, transparent, var(--acc-line) 30%, var(--acc-line) 70%, transparent)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 62%, var(--acc-wash), transparent 70%)",
          }}
        />
      </>
    );
  }

  if (accent === "sidequest") {
    // PLAYGROUND — the warm world fracturing into colourful fragments.
    return (
      <>
        {[
          { l: 12, t: 22, s: 46, r: -12 },
          { l: 74, t: 18, s: 62, r: 8 },
          { l: 26, t: 68, s: 38, r: 22 },
          { l: 86, t: 62, s: 52, r: -18 },
          { l: 48, t: 12, s: 30, r: 14 },
          { l: 62, t: 80, s: 44, r: -6 },
        ].map((frag, i) => (
          <span
            key={i}
            className="absolute block"
            style={{
              left: `${frag.l}%`,
              top: `${frag.t}%`,
              width: frag.s,
              height: frag.s,
              border: "1px solid var(--acc-line)",
              transform: `rotate(${frag.r}deg)`,
              opacity: 0.5,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--acc-wash), transparent 65%)",
          }}
        />
      </>
    );
  }

  // WORKSHOP — blueprint grid.
  return (
    <div
      className="u-grid-plate absolute inset-0 opacity-[0.07]"
      style={{
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, #000 10%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, #000 10%, transparent 78%)",
      }}
    />
  );
}

/**
 * WorldIntro
 *
 * The cinematic hand-off into a world. Roughly 1.9 seconds, then it hands
 * scroll back to the visitor and removes itself from the layout entirely.
 *
 * Kept short on purpose: a transition the visitor must sit through a second
 * time is a transition they resent. It is also fully skippable — any click,
 * or Escape/Enter, ends it immediately.
 *
 * Under reduced motion it never renders at all: the world simply appears.
 */
export function WorldIntro({
  eyebrow,
  title,
  accent,
  onComplete,
}: WorldIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reduced motion: skip the whole sequence. Handled in an effect that only
  // notifies the parent — the component itself returns null during render, so
  // there is no intermediate visible state to flush.
  useEffect(() => {
    if (reducedMotion) onCompleteRef.current?.();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];

      const tl = worldTransition(
        {
          environment: q("[data-intro='environment']")[0],
          annotation: q("[data-intro='annotation']")[0],
          title: q("[data-intro='title']")[0],
        },
        { duration: 2.2 },
      );

      /*
       * A real hold on the title before the cut. At 1.9s total the card
       * appeared and vanished before the visitor had oriented, so it read as
       * a flicker rather than as a change of place. The extra ~0.7s is what
       * turns it into a cut — and it is still under three seconds, which is
       * the ceiling before a transition becomes something to resent.
       */
      tl.to(
        root,
        { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" },
        "+=0.75",
      );
      tl.call(() => {
        setDone(true);
        onCompleteRef.current?.();
      });

      timelineRef.current = tl;
    }, root);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  const skip = useCallback(() => {
    timelineRef.current?.progress(1);
  }, []);

  if (reducedMotion || done) return null;

  return (
    <div
      ref={rootRef}
      data-world={accent}
      onClick={skip}
      onKeyDown={(event) => {
        if (event.key === "Escape" || event.key === "Enter") skip();
      }}
      role="button"
      tabIndex={0}
      aria-label={`${eyebrow}. ${title}. Press Enter to skip the transition.`}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-void px-s4"
    >
      {/* Workshop environment fades up beneath the type. */}
      <div
        data-intro="environment"
        aria-hidden="true"
        className="absolute inset-0"
      >
        <IntroTexture accent={accent} />
        <div
          className="absolute h-[70vmax] w-[70vmax] rounded-full"
          style={{
            left: "-18vmax",
            bottom: "-28vmax",
            background:
              "radial-gradient(circle, var(--acc-glow) 0%, transparent 62%)",
            filter: "blur(30px)",
          }}
        />
        {/* Requested by pose, like every other scene — the world intro does
            not know or care how the character is drawn. */}
        <AnkurCharacter
          pose={accent === "human" ? "thinking" : "confident"}
          position={{ x: 86, y: 82 }}
          scale={18}
          variant="silhouette"
          opacity={0.22}
          blur={2}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <p
          data-intro="annotation"
          className="u-mono mb-s4"
          style={{ color: "var(--acc)" }}
        >
          {eyebrow}
        </p>
        <h2
          data-intro="title"
          className="u-display text-display text-fg"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {title}
        </h2>
        <p className="u-mono mt-s5 text-fg-mute">Click anywhere to skip</p>
      </div>
    </div>
  );
}

export default WorldIntro;
