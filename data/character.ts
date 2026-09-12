/**
 * CHARACTER ASSET MANIFEST
 *
 * The single place that knows how Ankur is drawn. Scenes request a pose by
 * name and never touch a file path, so replacing the artwork is a change to
 * this file plus a folder of images — nothing else in the project moves.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ARTWORK: EIGHT REAL POSES, EXTRACTED FROM THE APPROVED 3D RENDER.
 *
 * Source: a single transparent pose sheet supplied by Ankur. Each pose was
 * cut from it using the sheet's own alpha channel — no colour keying, no
 * threshold removal, so hair, beard and shirt edges are the original render's.
 *
 * Normalisation applied to every asset:
 *   • 1024×1536 canvas, transparent
 *   • one shared scale factor, derived from the tallest FIGURE (not the
 *     widest composition) so a pose holding a whiteboard shows the same
 *     person at the same size as one standing empty-handed
 *   • lowest contact point on a common baseline, so switching poses never
 *     makes the character jump vertically
 *
 * Eight of the sixteen pose slots have their own artwork. The rest reuse the
 * closest real pose — each mapping is stated explicitly on the entry, and no
 * substitute artwork was generated to fill a gap.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type AnkurPose =
  // Core
  | "neutral"
  | "confident"
  | "walking"
  | "walkingBack"
  // Builder
  | "coding"
  | "engineering"
  | "debugging"
  | "leadership"
  | "victory"
  // Human
  | "thinking"
  | "pressure"
  // Playground
  | "travelling"
  | "exploring"
  | "writing"
  | "rap"
  // Easter egg
  | "sleeping";

export type Expression =
  | "calm"
  | "confident"
  | "curious"
  | "focused"
  | "confused"
  | "frustrated"
  | "victorious"
  | "thoughtful"
  | "pressured"
  | "adventurous"
  | "playful"
  | "sleeping";

export type PoseProp =
  | "none"
  | "headphones"
  | "backpack"
  | "laptop"
  | "tool"
  | "notebook"
  | "microphone"
  | "bat"
  | "phone";

/**
 * Where the headphones sit. They are an identity anchor but must not appear
 * in every scene, so each pose declares its own placement.
 */
export type Headphones = "none" | "neck" | "worn";

export interface PoseAsset {
  /** Public path to the artwork. Null until the asset exists. */
  src: string | null;
  /**
   * Set when this pose has no artwork of its own and borrows another's.
   * Stated explicitly so the reuse is visible in code rather than implied by
   * two entries happening to share a path.
   */
  reusedFrom?: AnkurPose;
  /** Ordered walk-cycle frames. Only the walking poses have these. */
  frames?: string[] | null;
  /**
   * Fraction of the canvas height the figure occupies. Used to normalise
   * scale so a seated pose and a standing pose read as the same person at
   * the same distance.
   */
  figureHeight: number;
  /**
   * Fraction from the top of the canvas where the feet (or the lowest
   * contact point) sit. This is the ground anchor — it is what stops the
   * character jumping vertically when the pose changes.
   */
  baseline: number;
  headphones: Headphones;
  prop: PoseProp;
  expression: Expression;
  /** Meaningful alt text. The story must survive with images off. */
  alt: string;
  /** Direction the figure faces, for flip decisions at call sites. */
  facing: "left" | "right" | "away";
}

/** Shared canvas. Every asset must use exactly these dimensions. */
export const CANVAS = { width: 1024, height: 1536 } as const;

/** Where finished artwork lives. */
export const ASSET_DIR = "/character";

export const POSES: Record<AnkurPose, PoseAsset> = {
  /* ---------------------------------------------------------------- CORE */
  neutral: {
    src: "/character/neutral.webp",
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "calm",
    alt: "Ankur standing, relaxed",
    facing: "left",
  },
  confident: {
    src: "/character/confident.webp",
    figureHeight: 0.715,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "confident",
    alt: "Ankur standing with his arms crossed",
    facing: "left",
  },
  walking: {
    src: "/character/walking.webp",
    // One walking render exists, not a cycle. `useWalkCycle` returns index 0
    // for a single frame, so the Finale shows a clean static walking pose —
    // no fabricated in-between frames from unrelated poses.
    frames: null,
    figureHeight: 0.673,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "calm",
    alt: "Ankur walking",
    facing: "left",
  },
  walkingBack: {
    // REUSE — no back-facing render exists. Call sites flip this horizontally
    // for the same read without inventing artwork.
    src: "/character/walking.webp",
    reusedFrom: "walking",
    figureHeight: 0.673,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "playful",
    alt: "Ankur walking away",
    facing: "left",
  },

  /* ------------------------------------------------------------- BUILDER */
  coding: {
    // REUSE — no laptop render exists. Writing is the closest real pose:
    // seated, absorbed, working with something in his hands.
    src: "/character/writing.webp",
    reusedFrom: "writing",
    figureHeight: 0.576,
    baseline: 0.94,
    headphones: "worn",
    prop: "notebook",
    expression: "focused",
    alt: "Ankur seated, absorbed in work",
    facing: "left",
  },
  engineering: {
    src: "/character/engineering.webp",
    figureHeight: 0.578,
    baseline: 0.94,
    headphones: "worn",
    prop: "tool",
    expression: "focused",
    alt: "Ankur kneeling with a screwdriver and a circuit board",
    facing: "left",
  },
  debugging: {
    // REUSE — no frustrated-at-a-screen render exists. Pressure carries the
    // same read: head in hands, something is not working.
    src: "/character/pressure.webp",
    reusedFrom: "pressure",
    figureHeight: 0.583,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "frustrated",
    alt: "Ankur seated, head in his hands",
    facing: "left",
  },
  leadership: {
    src: "/character/leadership.webp",
    figureHeight: 0.71,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "confident",
    alt: "Ankur presenting at a board, explaining a plan",
    facing: "right",
  },
  victory: {
    // REUSE — no celebration render exists. Confident is the nearest real
    // pose with the right register: pleased, self-assured, not theatrical.
    src: "/character/confident.webp",
    reusedFrom: "confident",
    figureHeight: 0.715,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "victorious",
    alt: "Ankur standing, pleased with himself",
    facing: "left",
  },

  /* --------------------------------------------------------------- HUMAN */
  thinking: {
    src: "/character/thinking.webp",
    figureHeight: 0.691,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "thoughtful",
    alt: "Ankur with a hand near his chin, thinking",
    facing: "left",
  },
  pressure: {
    src: "/character/pressure.webp",
    figureHeight: 0.583,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "pressured",
    alt: "Ankur seated, holding steady under pressure",
    facing: "left",
  },

  /* ---------------------------------------------------------- PLAYGROUND */
  travelling: {
    // REUSE — no backpack render exists. Walking reads as movement and is
    // the closest honest substitute.
    src: "/character/walking.webp",
    reusedFrom: "walking",
    figureHeight: 0.673,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "adventurous",
    alt: "Ankur walking, on his way somewhere",
    facing: "left",
  },
  exploring: {
    // REUSE — no looking-around render exists. Thinking carries curiosity in
    // the head tilt, which is the same register.
    src: "/character/thinking.webp",
    reusedFrom: "thinking",
    figureHeight: 0.691,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "curious",
    alt: "Ankur looking around, curious",
    facing: "left",
  },
  writing: {
    src: "/character/writing.webp",
    figureHeight: 0.576,
    baseline: 0.94,
    headphones: "worn",
    prop: "notebook",
    expression: "focused",
    alt: "Ankur cross-legged, writing in a notebook",
    facing: "left",
  },
  rap: {
    // REUSE — no microphone render exists. Confident is the nearest pose
    // that reads as performing rather than working.
    src: "/character/confident.webp",
    reusedFrom: "confident",
    figureHeight: 0.715,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "playful",
    alt: "Ankur standing, headphones on",
    facing: "left",
  },

  /* ---------------------------------------------------------- EASTER EGG */
  sleeping: {
    // REUSE — no sleeping render exists. Pressure is the only seated,
    // head-down pose available; IdleSleeper rotates it onto its side, which
    // reads as asleep at the small scale the egg uses.
    src: "/character/pressure.webp",
    reusedFrom: "pressure",
    figureHeight: 0.583,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "sleeping",
    alt: "Ankur fast asleep",
    facing: "left",
  },
};

/** Poses drawn specifically for themselves, rather than borrowing another. */
export const ORIGINAL_POSES: AnkurPose[] = (
  Object.keys(POSES) as AnkurPose[]
).filter((pose) => POSES[pose].src !== null && !POSES[pose].reusedFrom);

/** Pose → the pose it borrows artwork from. */
export const POSE_REUSE: Partial<Record<AnkurPose, AnkurPose>> =
  Object.fromEntries(
    (Object.keys(POSES) as AnkurPose[])
      .filter((pose) => POSES[pose].reusedFrom)
      .map((pose) => [pose, POSES[pose].reusedFrom]),
  );

/* ------------------------------------------------------------------------ */
/* Production notes                                                          */
/* ------------------------------------------------------------------------ */

/**
 * What the artwork must satisfy. Kept in code so it travels with the project
 * rather than living in a chat log.
 *
 * CANVAS      1024×1536, transparent PNG (convert to .webp for shipping).
 * FRAMING     Full body. Head and feet never cropped. Generous padding.
 * SCALE       Figure occupies the `figureHeight` fraction declared above.
 * BASELINE    Lowest contact point at the `baseline` fraction. This is what
 *             keeps the character from jumping between poses.
 * CAMERA      Eye level, fixed distance, unchanged across every asset.
 * LIGHT       Soft key from upper front-left, soft fill. Never changes.
 * STYLE       Soft-shaded 3D avatar render. Not photoreal, not flat 2D.
 *
 * IDENTITY ANCHORS — verify on every asset before shipping:
 *   1. Gold/mustard rectangular glasses, dark lenses
 *   2. Messy wavy dark-brown hair, volume on top
 *   3. Full near-black beard with connected moustache
 *   4. Warm medium-tan skin
 *   5. Slim build, roughly 7 heads tall
 *   6. Olive-green long-sleeve polo, two-button placket
 *   7. Mid-blue bootcut jeans
 *   8. White chunky sneakers
 *
 * WALK CYCLE  `walking.frames` takes 4 frames: contact / passing / contact
 *             (opposite) / passing. Head height and baseline must be
 *             identical in all four or the walk will bob and slide.
 */
export const PRODUCTION_NOTES = {
  canvas: CANVAS,
  format: "PNG master, WebP for delivery",
  walkFrames: 4,
} as const;
