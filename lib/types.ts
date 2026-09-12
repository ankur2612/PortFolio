/**
 * Shared types.
 */

export type WorldId = "builder" | "human" | "sidequest";

export type AccentName = WorldId;

export type ExperienceMode = "landing" | "story" | "quick";

/** Which environment visual a scene renders behind its content. */
export type VisualType =
  // World 01 — WORKSHOP
  | "workshop-desk"
  | "classroom-terminal"
  | "pressure-room"
  | "system-build"
  // World 02 — MEMORY
  | "memory-room"
  | "cricket-dusk"
  | "pressure-press"
  // World 03 — PLAYGROUND
  | "india-map"
  | "studio-desk"
  | "quest-board";

/** What the visitor can do in a scene. */
export type InteractionType = "none" | "explode" | "reveal" | "tap-reveal";

/* ------------------------------------------------------------------------ */
/* World 03 data shapes                                                      */
/* ------------------------------------------------------------------------ */

export interface TravelPlace {
  id: string;
  name: string;
  /** Percentage position within the stylised map viewBox. */
  x: number;
  y: number;
  /** Null where no verified memory exists — the place still shows. */
  note: string | null;
}

export interface QuestCard {
  id: string;
  label: string;
  title: string;
  description: string;
  placeholder?: boolean;
}

/* ------------------------------------------------------------------------ */
/* Explode                                                                   */
/* ------------------------------------------------------------------------ */

export type ExplodeMode = "stack" | "radial" | "lateral";

export interface ExplodeLayerData {
  id: string;
  /** Mono index label, e.g. "01". */
  label: string;
  title: string;
  description: string;
  technology?: string[];
  /** Per-layer offset override, in px / degrees. */
  offset?: { x?: number; y?: number; rotate?: number };
  /** Marks a layer as tonally different — the DECISIONS layer. */
  variant?: "default" | "terminal";
  /** True while the copy is placeholder awaiting real content. */
  placeholder?: boolean;
}

export interface ExplodeConfig {
  id: string;
  title: string;
  subtitle?: string;
  /** Affordance copy. Defaults to "Take it apart". */
  cta?: string;
  mode?: ExplodeMode;
  spacing?: number;
  layers: ExplodeLayerData[];
}

/* ------------------------------------------------------------------------ */
/* Scenes                                                                    */
/* ------------------------------------------------------------------------ */

export interface SceneFact {
  label: string;
  value: string;
}

export interface SceneConfig {
  id: string;
  world: WorldId;
  /** 1-based position within its world; drives the progress HUD. */
  order: number;
  eyebrow: string;
  title: string;
  description?: string;
  /** Paragraphs, in order. */
  body?: string[];
  /** Set larger, with an accent rule. One per scene, maximum. */
  quote?: string;
  facts?: SceneFact[];
  visualType: VisualType;
  accent: AccentName;
  /**
   * Per-scene accent hex. Side Quests shifts colour scene to scene while
   * keeping one world identity; this overrides `--acc` for that scene only.
   */
  accentOverride?: string;
  interaction: InteractionType;
  explode?: ExplodeConfig;
  /**
   * Motion rhythm. `still` means the scene does not animate in at all —
   * reserved for the moments that must land as a held frame.
   */
  density?: "still" | "low" | "medium" | "high";
}

export interface WorldConfig {
  id: WorldId;
  index: string;
  name: string;
  eyebrow: string;
  description: string;
  accent: AccentName;
  available: boolean;
  scenes: SceneConfig[];
}
