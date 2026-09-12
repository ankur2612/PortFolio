"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { registerScrollTrigger, revealClip, revealUp } from "@/lib/animations";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import type { AccentName } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ScrollSceneProps {
  id: string;
  children: ReactNode;
  className?: string;
  accent?: AccentName;
  /**
   * Per-scene accent hex. Side Quests shifts colour scene to scene while
   * keeping one world identity; this overrides `--acc` for this scene only.
   */
  accentOverride?: string;
  label?: string;
  minHeight?: string;
  /** Blueprint grid plate behind the content. */
  grid?: boolean;
  /**
   * Motion density. Drives the *rhythm* of the scene, not just its art:
   *
   *   high   — Builder/Playground. Snappy, staggered, energetic.
   *   medium — default.
   *   low    — Human. Slower, longer, almost no stagger.
   *   still  — the reveal does not animate at all. Text is simply present.
   *
   * Contrast is the point. A quiet scene only reads as quiet next to a loud
   * one, so Human running at the same tempo as Builder made both feel flat.
   */
  density?: "still" | "low" | "medium" | "high";
  /** Fires when this scene becomes the dominant one in the viewport. */
  onActivate?: (id: string) => void;
  /** Continuous 0→1 scroll progress, for scenes that need it. */
  onProgress?: (progress: number) => void;
}

/**
 * ScrollScene
 *
 * The orchestrator. One ScrollTrigger per scene — not one per element —
 * which is the difference between a site that scrolls at 60fps and one that
 * stutters on a mid-range Android.
 *
 * Responsibilities:
 * - Reveal the scene's content when it enters the viewport, once.
 * - Report activation, so the progress HUD tracks the visitor.
 * - Report scrubbed progress for scenes that drive their own visuals.
 * - Revert everything on unmount via `gsap.context()`.
 *
 * Children opt into reveals declaratively with data attributes:
 *   [data-reveal="clip"]  → mask wipe (headlines, rules)
 *   [data-reveal="up"]    → opacity + y settle (secondary content)
 * Anything without an attribute is simply never touched, which keeps this
 * component from becoming a god-object.
 *
 * Scroll is never hijacked: no pinning, no scroll-jacking, no custom scroll
 * engine. The visitor's wheel maps 1:1 to the page, always.
 */
export function ScrollScene({
  id,
  children,
  className,
  accent,
  accentOverride,
  label,
  minHeight = "min-h-[100svh]",
  grid = false,
  density = "medium",
  onActivate,
  onProgress,
}: ScrollSceneProps) {
  const rootRef = useRef<HTMLElement>(null);

  // Keep callbacks in refs so identity changes never rebuild ScrollTriggers.
  // Assigned in an effect, never during render: a ref written during render
  // can be torn by concurrent rendering.
  const onActivateRef = useRef(onActivate);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onActivateRef.current = onActivate;
    onProgressRef.current = onProgress;
  }, [onActivate, onProgress]);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerScrollTrigger();

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];

      const clipTargets = q("[data-reveal='clip']");
      const upTargets = q("[data-reveal='up']");

      // --- Reduced motion: final state, no triggers, no movement. -------
      if (reducedMotion) {
        gsap.set(clipTargets, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(upTargets, { opacity: 1, y: 0 });

        // Activation still needs to work so the HUD stays truthful.
        ScrollTrigger.create({
          trigger: root,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (st) => {
            if (st.isActive) onActivateRef.current?.(id);
          },
        });
        return;
      }

      // --- "still": no entrance animation at all. -----------------------
      // Reserved for the scenes that must land as a held frame rather than a
      // reveal. Content is simply present when the visitor arrives.
      if (density === "still") {
        gsap.set(clipTargets, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(upTargets, { opacity: 1, y: 0 });

        ScrollTrigger.create({
          trigger: root,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (st) => {
            if (st.isActive) onActivateRef.current?.(id);
          },
        });
        return;
      }

      // --- Rhythm per density -------------------------------------------
      const rhythm = {
        low: { stagger: STAGGER.tight * 0.6, dur: DUR.scene * 1.5, travel: 10, offset: 0.3 },
        medium: { stagger: STAGGER.base, dur: DUR.scene, travel: 16, offset: 0.18 },
        high: { stagger: STAGGER.base, dur: DUR.scene * 0.85, travel: 18, offset: 0.12 },
      }[density];

      // --- Start states -------------------------------------------------
      gsap.set(clipTargets, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(upTargets, { opacity: 0, y: rhythm.travel });

      // --- One reveal timeline for the whole scene ----------------------
      const tl = gsap.timeline({
        paused: true,
        defaults: { overwrite: "auto" },
      });

      if (clipTargets.length) {
        tl.add(
          revealClip(clipTargets, {
            stagger: rhythm.stagger,
            duration: rhythm.dur,
            // Human eases out slowly rather than snapping into place.
            ease: density === "low" ? EASE.inOut : EASE.out,
          }),
          0,
        );
      }
      if (upTargets.length) {
        tl.add(
          revealUp(upTargets, {
            stagger: rhythm.stagger,
            duration: rhythm.dur * 0.75,
            distance: rhythm.travel,
            ease: density === "low" ? EASE.inOut : EASE.out,
          }),
          rhythm.offset,
        );
      }

      ScrollTrigger.create({
        trigger: root,
        // Low-density scenes begin later, so the visitor arrives at stillness
        // before anything starts moving.
        start: density === "low" ? "top 62%" : "top 72%",
        once: true,
        onEnter: () => tl.play(),
      });

      // --- Activation + progress ---------------------------------------
      ScrollTrigger.create({
        trigger: root,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (st) => {
          if (st.isActive) onActivateRef.current?.(id);
        },
      });

      if (onProgressRef.current) {
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (st) => onProgressRef.current?.(st.progress),
        });
      }
    }, root);

    return () => ctx.revert();
  }, [id, reducedMotion, density]);

  return (
    <section
      ref={rootRef}
      id={id}
      data-scene={id}
      data-world={accent}
      aria-label={label}
      style={
        accentOverride
          ? ({ "--acc": accentOverride } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "relative isolate flex w-full flex-col items-center justify-center",
        // `overflow-x-clip` rather than `overflow-hidden`: it contains the
        // environment art horizontally without creating a scroll container,
        // which would break ScrollTrigger's position calculations.
        "overflow-x-clip px-s4 py-s7 sm:px-s5 lg:px-s6",
        minHeight,
        className,
      )}
    >
      {grid ? (
        <div
          aria-hidden="true"
          className="u-grid-plate pointer-events-none absolute inset-0 -z-10 opacity-[0.055]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 65% at 50% 45%, #000 20%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 65% at 50% 45%, #000 20%, transparent 78%)",
          }}
        />
      ) : null}

      <div className="relative z-10 flex w-full max-w-6xl flex-col">
        {children}
      </div>
    </section>
  );
}

export default ScrollScene;
