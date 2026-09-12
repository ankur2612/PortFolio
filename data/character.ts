/**
 * CHARACTER ASSET MANIFEST
 *
 * The single place that knows how Ankur is drawn. Scenes request a pose by
 * name and never touch a file path, so replacing the artwork is a change to
 * this file plus a folder of images — nothing else in the project moves.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CURRENT STATUS: NO ARTWORK EXISTS YET.
 *
 * Every `src` below is null. The final Ankur is a 3D-avatar render (the
 * canonical reference: messy dark curly hair, full dark beard, rectangular
 * gold-framed glasses, olive long-sleeve polo, blue jeans, white sneakers,
 * dark over-ear headphones) and producing it requires an image generator or
 * an illustrator — neither of which is available from inside this codebase.
 *
 * While `src` is null the character system renders its geometric stand-in and
 * says so. It is deliberately NOT dressed up to look like finished art: a
 * convincing fake would be harder to notice and harder to replace.
 *
 * TO SHIP THE REAL CHARACTER:
 *   1. Produce the PNGs (see PRODUCTION_NOTES below) at 1024×1536,
 *      transparent, feet on a common baseline.
 *   2. Convert to .webp and drop them in /public/character/.
 *   3. Set `src` on each pose here. Nothing else changes.
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
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "neck",
    prop: "none",
    expression: "calm",
    alt: "Ankur standing, relaxed",
    facing: "left",
  },
  confident: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "none",
    prop: "none",
    expression: "confident",
    alt: "Ankur standing with his arms crossed",
    facing: "left",
  },
  walking: {
    src: null,
    frames: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "calm",
    alt: "Ankur walking",
    facing: "away",
  },
  walkingBack: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "worn",
    prop: "none",
    expression: "playful",
    alt: "Ankur walking away, glancing back over his shoulder",
    facing: "away",
  },

  /* ------------------------------------------------------------- BUILDER */
  coding: {
    src: null,
    figureHeight: 0.72,
    baseline: 0.94,
    headphones: "worn",
    prop: "laptop",
    expression: "focused",
    alt: "Ankur at a laptop, working",
    facing: "left",
  },
  engineering: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "none",
    prop: "tool",
    expression: "focused",
    alt: "Ankur opening a small electronic device with a screwdriver",
    facing: "left",
  },
  debugging: {
    src: null,
    figureHeight: 0.72,
    baseline: 0.94,
    headphones: "neck",
    prop: "laptop",
    expression: "frustrated",
    alt: "Ankur leaning into a laptop, one hand on his forehead",
    facing: "left",
  },
  leadership: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "none",
    prop: "none",
    expression: "confident",
    alt: "Ankur gesturing toward a team, explaining something",
    facing: "right",
  },
  victory: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "none",
    prop: "none",
    expression: "victorious",
    alt: "Ankur with one fist raised in a small celebration",
    facing: "left",
  },

  /* --------------------------------------------------------------- HUMAN */
  thinking: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "none",
    prop: "none",
    expression: "thoughtful",
    alt: "Ankur with a hand near his chin, thinking",
    facing: "left",
  },
  pressure: {
    src: null,
    figureHeight: 0.74,
    baseline: 0.94,
    headphones: "none",
    prop: "none",
    expression: "pressured",
    alt: "Ankur leaning forward, holding steady under pressure",
    facing: "left",
  },

    /* ---------------------------------------------------------- PLAYGROUND */
  travelling: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "neck",
    prop: "backpack",
    expression: "adventurous",
    alt: "Ankur with a backpack over one shoulder, looking into the distance",
    facing: "right",
  },
  exploring: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "none",
    prop: "phone",
    expression: "curious",
    alt: "Ankur looking around, curious",
    facing: "right",
  },
  writing: {
    src: null,
    figureHeight: 0.7,
    baseline: 0.94,
    headphones: "worn",
    prop: "notebook",
    expression: "focused",
    alt: "Ankur writing in a notebook",
    facing: "left",
  },
  rap: {
    src: null,
    figureHeight: 0.78,
    baseline: 0.94,
    headphones: "worn",
    prop: "microphone",
    expression: "playful",
    alt: "Ankur performing into a microphone",
    facing: "left",
  },

  /* ---------------------------------------------------------- EASTER EGG */
  sleeping: {
    src: null,
    figureHeight: 0.42,
    baseline: 0.94,
    headphones: "neck",
    prop: "none",
    expression: "sleeping",
    alt: "Ankur fast asleep in an improbable position",
    facing: "left",
  },
};

/** True once every pose has artwork. Drives the stand-in notice. */
export const ARTWORK_READY: boolean = Object.values(POSES).every(
  (pose) => pose.src !== null,
);

/** Poses still missing artwork — surfaced in dev so gaps stay visible. */
export function missingArtwork(): AnkurPose[] {
  return (Object.keys(POSES) as AnkurPose[]).filter(
    (pose) => POSES[pose].src === null,
  );
}

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
