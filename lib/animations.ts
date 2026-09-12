import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { DUR, EASE, STAGGER } from "@/lib/motion";

/**
 * Animation primitives.
 *
 * Eight functions. Every animation in the project composes from these — a
 * component that reaches for a raw `gsap.to` is a review failure, because
 * that is how timing consistency erodes.
 *
 * All of them are pure factories: they build and return a tween/timeline and
 * never register global state. Scoping and cleanup are the caller's job, and
 * the caller does that with `gsap.context()`.
 */

/** Register ScrollTrigger exactly once, on the client only. */
let registered = false;
export function registerScrollTrigger() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export type AnimTarget = gsap.TweenTarget;

/* ------------------------------------------------------------------------ */
/* 1 — revealUp                                                              */
/* ------------------------------------------------------------------------ */

export interface RevealUpOptions {
  /** Travel distance in px. Keep small: this is a settle, not a slide. */
  distance?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
}

/**
 * revealUp — secondary content entrance.
 *
 * Target: fact rows, chips, links, cards. NOT headlines (use revealClip).
 * A short opacity + y settle. Deliberately restrained so it never competes
 * with the clip reveals carrying the actual story.
 */
export function revealUp(target: AnimTarget, options: RevealUpOptions = {}) {
  const {
    distance = 16,
    duration = DUR.reveal * 0.7,
    stagger = STAGGER.base,
    delay = 0,
    ease = EASE.out,
  } = options;

  return gsap.fromTo(
    target,
    { opacity: 0, y: distance },
    { opacity: 1, y: 0, duration, stagger, delay, ease, clearProps: "willChange" },
  );
}

/* ------------------------------------------------------------------------ */
/* 2 — revealClip                                                            */
/* ------------------------------------------------------------------------ */

export interface RevealClipOptions {
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
}

const CLIP_FROM: Record<string, string> = {
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
};

/**
 * revealClip — the signature text reveal.
 *
 * Target: headlines, display type, rules. A mask wipe, never a fade-and-slide.
 * This is the single most identity-defining motion on the site; fade-slide-up
 * is banned precisely because it is what every template portfolio uses.
 */
export function revealClip(target: AnimTarget, options: RevealClipOptions = {}) {
  const {
    direction = "left",
    duration = DUR.scene,
    stagger = STAGGER.base,
    delay = 0,
    ease = EASE.out,
  } = options;

  return gsap.fromTo(
    target,
    { clipPath: CLIP_FROM[direction] },
    { clipPath: "inset(0 0% 0 0)", duration, stagger, delay, ease },
  );
}

/* ------------------------------------------------------------------------ */
/* 3 — textSplitReveal                                                       */
/* ------------------------------------------------------------------------ */

export interface TextSplitRevealOptions {
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
}

/**
 * textSplitReveal — per-word mask reveal.
 *
 * Target: a container whose children are `[data-word]` spans (produced by the
 * SplitText helper below, or authored directly).
 *
 * We do NOT use GSAP's paid SplitText plugin. Splitting is done in React so
 * the real, selectable, screen-readable text stays in the DOM; the visual
 * words are aria-hidden and the source sentence is exposed to assistive tech.
 */
export function textSplitReveal(
  container: Element,
  options: TextSplitRevealOptions = {},
) {
  const {
    duration = DUR.reveal,
    stagger = STAGGER.tight,
    delay = 0,
    ease = EASE.out,
  } = options;

  const words = container.querySelectorAll("[data-word-inner]");
  if (!words.length) return gsap.timeline();

  return gsap.fromTo(
    words,
    { yPercent: 110 },
    { yPercent: 0, duration, stagger, delay, ease },
  );
}

/* ------------------------------------------------------------------------ */
/* 4 — explode                                                               */
/* ------------------------------------------------------------------------ */

export interface ExplodeLayerOffset {
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

export interface ExplodeOptions {
  duration?: number;
  stagger?: number;
  ease?: string;
  /** Leader lines: animated stroke-dashoffset → 0. */
  lines?: AnimTarget;
  /** Labels revealed after the layers have travelled. */
  labels?: AnimTarget;
}

/**
 * explode — the central mechanic.
 *
 * Target: an array of layer elements sharing one origin, plus the offsets
 * they should travel to. Returns a PAUSED timeline; the caller decides
 * whether it is driven by click (play/reverse) or by scroll (progress).
 *
 * No physics, no collision. Pure transform + opacity on 4–6 elements. The art
 * does the work, not the maths.
 */
export function explode(
  layers: Element[],
  offsets: ExplodeLayerOffset[],
  options: ExplodeOptions = {},
) {
  const {
    duration = 0.7,
    stagger = 0.06,
    ease = EASE.snap,
    lines,
    labels,
  } = options;

  const tl = gsap.timeline({ paused: true });

  tl.to(layers, {
    x: (index: number) => offsets[index]?.x ?? 0,
    y: (index: number) => offsets[index]?.y ?? 0,
    scale: (index: number) => offsets[index]?.scale ?? 1,
    rotate: (index: number) => offsets[index]?.rotate ?? 0,
    duration,
    stagger,
    ease,
  });

  if (lines) {
    tl.to(
      lines,
      { strokeDashoffset: 0, duration: 0.4, stagger, ease: EASE.out },
      0.25,
    );
  }

  if (labels) {
    tl.to(
      labels,
      { opacity: 1, x: 0, duration: 0.3, stagger, ease: EASE.out },
      0.32,
    );
  }

  return tl;
}

/* ------------------------------------------------------------------------ */
/* 5 — parallax                                                              */
/* ------------------------------------------------------------------------ */

export interface ParallaxOptions {
  /** 0 = static, 1 = moves a full `range` across the scroll window. */
  depth?: number;
  /** Travel in px at depth 1. Halved automatically on small screens. */
  range?: number;
  trigger?: Element;
}

/**
 * parallax — scroll-linked layer drift.
 *
 * Target: a scene background layer. Scrubbed, so it tracks the scroll wheel
 * 1:1 and never feels like scroll-jacking. Returns the ScrollTrigger-backed
 * tween so the caller's context can revert it.
 */
export function parallax(target: AnimTarget, options: ParallaxOptions = {}) {
  registerScrollTrigger();
  const { depth = 0.3, range = 120, trigger } = options;

  const isSmall =
    typeof window !== "undefined" && window.innerWidth < 768;
  const travel = range * depth * (isSmall ? 0.42 : 1);

  return gsap.fromTo(
    target,
    { y: -travel },
    {
      y: travel,
      ease: EASE.linear,
      scrollTrigger: {
        trigger: (trigger ?? target) as gsap.DOMTarget,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    },
  );
}

/* ------------------------------------------------------------------------ */
/* 6 — worldTransition                                                       */
/* ------------------------------------------------------------------------ */

export interface WorldTransitionOptions {
  onComplete?: () => void;
  duration?: number;
}

/**
 * worldTransition — the cinematic hand-off into a world.
 *
 * Target: { outgoing, incoming, annotation, title } element refs.
 * Collapses the outgoing typography, brings the environment up, then lands
 * the world annotation and title. Kept under ~2s: a transition the visitor
 * has to wait through twice is a transition they resent.
 */
export function worldTransition(
  parts: {
    outgoing?: Element | null;
    environment?: Element | null;
    annotation?: Element | null;
    title?: Element | null;
  },
  options: WorldTransitionOptions = {},
) {
  const { onComplete, duration = 1.85 } = options;
  const tl = gsap.timeline({ onComplete });

  if (parts.outgoing) {
    tl.to(
      parts.outgoing,
      { opacity: 0, scaleY: 0.86, filter: "blur(6px)", duration: 0.45, ease: EASE.inOut },
      0,
    );
  }

  if (parts.environment) {
    tl.fromTo(
      parts.environment,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: EASE.out },
      0.3,
    );
  }

  if (parts.annotation) {
    tl.fromTo(
      parts.annotation,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.45, ease: EASE.out },
      0.55,
    );
  }

  if (parts.title) {
    tl.fromTo(
      parts.title,
      { clipPath: CLIP_FROM.left },
      { clipPath: "inset(0 0% 0 0)", duration: duration - 1.05, ease: EASE.out },
      0.85,
    );
  }

  return tl;
}

/* ------------------------------------------------------------------------ */
/* 7 — glowPulse                                                             */
/* ------------------------------------------------------------------------ */

export interface GlowPulseOptions {
  duration?: number;
  minOpacity?: number;
  maxOpacity?: number;
  scale?: number;
}

/**
 * glowPulse — ambient life.
 *
 * Target: accent dots, the "take it apart" affordance underline, light
 * sources. A slow yoyo on opacity/scale only. This is the ONLY continuously
 * running animation permitted in the project, and it must stay cheap.
 */
export function glowPulse(target: AnimTarget, options: GlowPulseOptions = {}) {
  const {
    duration = 2.6,
    minOpacity = 0.35,
    maxOpacity = 1,
    scale = 1.04,
  } = options;

  return gsap.fromTo(
    target,
    { opacity: minOpacity, scale: 1 },
    {
      opacity: maxOpacity,
      scale,
      duration,
      ease: EASE.inOut,
      repeat: -1,
      yoyo: true,
    },
  );
}

/* ------------------------------------------------------------------------ */
/* 8 — scrollScrub                                                           */
/* ------------------------------------------------------------------------ */

export interface ScrollScrubOptions {
  trigger: Element;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean | Element;
  onUpdate?: (progress: number) => void;
}

/**
 * scrollScrub — bind a paused timeline to scroll position.
 *
 * Target: a paused GSAP timeline (e.g. from `explode`). Scroll drives
 * `timeline.progress()` directly, so the visitor's wheel input maps 1:1 and
 * they can scrub forward AND backward at their own speed.
 *
 * Returns the ScrollTrigger so the caller can kill it explicitly if needed;
 * a surrounding `gsap.context().revert()` also cleans it up.
 */
export function scrollScrub(
  timeline: gsap.core.Timeline,
  options: ScrollScrubOptions,
) {
  registerScrollTrigger();
  const {
    trigger,
    start = "top 75%",
    end = "bottom 35%",
    scrub = 1,
    pin = false,
    onUpdate,
  } = options;

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    pin,
    animation: timeline,
    onUpdate: onUpdate ? (self) => onUpdate(self.progress) : undefined,
  });
}
