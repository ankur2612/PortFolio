/**
 * Motion constants.
 *
 * Every animation in the project pulls its easing, duration and stagger from
 * here. Hard-coded values in components are a review failure — consistency of
 * timing is what makes a site feel authored rather than assembled.
 */

export const EASE = {
  /** Entrances. Decisive arrival, soft settle. */
  out: "power3.out",
  /** Transitions between two states. */
  inOut: "power2.inOut",
  /** Snaps: explode layers, counters landing. */
  snap: "expo.out",
  /** Scrub-driven timelines must be linear. */
  linear: "none",
} as const;

export const DUR = {
  /** Hovers, micro-feedback. */
  micro: 0.2,
  /** Text reveals, single-element entrances. */
  reveal: 0.6,
  /** Scene-level moves. */
  scene: 0.9,
  /** Deliberate holds between story beats. */
  hold: 1.2,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.07,
  loose: 0.12,
} as const;

/**
 * Landing beat map, in seconds, relative to timeline start.
 *
 * Compressed from ~8s to ~4s. The original pacing held a near-empty black
 * screen for eight seconds before contact links appeared — anticipation is
 * only anticipation while the visitor still believes something is coming.
 * Past about four seconds it reads as a broken page.
 *
 * The shape of the sequence is unchanged; the holds are simply tightened, and
 * identity now overlaps the tail of the statement rather than waiting for it.
 */
export const LANDING_BEATS = {
  nothingIn: 0.2,
  subtitleIn: 0.85,
  clearOut: 1.9,
  statementIn: 2.25,
  identityIn: 3.3,
  selectorIn: 3.75,
  /** Contact links land early and independently — never gated on the story. */
  cornerIn: 1.2,
} as const;
