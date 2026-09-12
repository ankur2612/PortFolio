"use client";

import AnkurCharacter, {
  type AnkurCharacterProps,
} from "@/components/character/AnkurCharacter";
import type { AnkurPose } from "@/data/character";
import ExplodeObject from "@/components/story/ExplodeObject";
import IndiaMap from "@/components/story/IndiaMap";
import QuestBoard from "@/components/story/QuestBoard";
import RapNotebook from "@/components/story/RapNotebook";
import SceneEnvironment from "@/components/story/SceneEnvironment";
import ScrollScene from "@/components/story/ScrollScene";
import type { SceneConfig, VisualType } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface StoryScenePropsData {
  scene: SceneConfig;
  onActivate: (id: string) => void;
}

/**
 * Character placement, per environment.
 *
 * One asset, positioned and scaled differently so the figure reads as moving
 * through the worlds rather than being pasted onto each screen. Kept in a
 * lookup rather than inline conditionals so adding a scene is a data change.
 *
 * All placements sit to the right of the copy column and are hidden below
 * `lg`, where the copy occupies the full width.
 */
/*
 * SCENE → POSE MAPPING.
 *
 * Scenes request a pose by name; they never know how the character is drawn.
 * Placement rules, which hold whether the artwork is final or pending:
 *
 *   1. Never inside a text column. Every placement sits at x >= 90, past the
 *      right edge of the measure, so it cannot strike through body copy.
 *   2. `opacity` stays low while the stand-in is in place — the geometric
 *      figure is atmospheric structure, not a protagonist. When real artwork
 *      lands these lift to full presence (see FINAL_OPACITY below).
 *   3. Omitted from scenes that already carry their own subject —
 *      cricket-dusk and india-map would just gain a competing focal point.
 */
interface ScenePlacement extends AnkurCharacterProps {
  pose: AnkurPose;
}

/**
 * Opacity while the stand-in is showing. Real artwork wants far more
 * presence than abstract geometry does, so this is deliberately separate
 * from the placement — flipping it is a one-line change per scene once the
 * assets exist.
 */
const STAND_IN_OPACITY = 0.22;

const CHARACTER_BY_VISUAL: Partial<Record<VisualType, ScenePlacement>> = {
  // B1 — the childhood engineer, opening a broken phone.
  "workshop-desk": {
    pose: "engineering",
    position: { x: 94, y: 88 },
    scale: 13,
    variant: "silhouette",
    opacity: STAND_IN_OPACITY,
    blur: 1,
    breathe: true,
  },
  // B3 — hackathons and leading a team under a deadline.
  "pressure-room": {
    pose: "leadership",
    position: { x: 93, y: 86 },
    scale: 16,
    variant: "silhouette",
    opacity: STAND_IN_OPACITY,
    blur: 1.5,
    breathe: true,
  },
  // H1 — Ghazipur. Small, further away, looking out.
  "memory-room": {
    pose: "neutral",
    position: { x: 92, y: 90 },
    scale: 10,
    variant: "silhouette",
    opacity: 0.25,
    flip: true,
    blur: 1,
    breathe: true,
  },
  // H3 — the press. Holding steady, not defeated.
  "pressure-press": {
    pose: "pressure",
    position: { x: 95, y: 88 },
    scale: 13,
    variant: "silhouette",
    opacity: 0.2,
    blur: 1.5,
    breathe: true,
  },
  // S2 — the notebook and the microphone.
  "studio-desk": {
    pose: "writing",
    position: { x: 94, y: 90 },
    scale: 14,
    variant: "silhouette",
    opacity: 0.2,
    blur: 1.5,
    breathe: true,
  },
};

/**
 * StoryScene
 *
 * Renders one SceneConfig. Every scene in every world is this one file with a
 * different config object, so a new scene costs a data entry rather than a new
 * component.
 *
 * Layout is asymmetric — copy left, interaction right — because a centred
 * column for every scene is what makes portfolios read as templates. Scenes
 * with no interaction (H3) get a single wide column and much more negative
 * space, which is how the quiet scenes stay quiet.
 */
export function StoryScene({ scene, onActivate }: StoryScenePropsData) {
  const hasExplode = scene.interaction === "explode" && scene.explode;
  const hasWidget = scene.interaction === "tap-reveal";
  const hasSideColumn = Boolean(hasExplode) || hasWidget;

  const character = CHARACTER_BY_VISUAL[scene.visualType];

  // S1's map and S3's board need the full width; S2 reads better split.
  const fullWidthWidget =
    scene.visualType === "india-map" || scene.visualType === "quest-board";

  return (
    <ScrollScene
      id={scene.id}
      accent={scene.accent}
      accentOverride={scene.accentOverride}
      label={scene.title}
      grid={scene.world !== "human"}
      density={scene.density}
      onActivate={onActivate}
      // Mobile reserves a taller bottom strip: the HUD and the HIRING? chip
      // both live down there, and scene content must never run beneath them.
      // Desktop only has to clear the HUD.
      className={cn(
        "pb-[184px] sm:pb-s8",
        hasSideColumn ? "pt-s8" : "pt-s7",
      )}
    >
      <SceneEnvironment type={scene.visualType} />

      {character ? (
        <AnkurCharacter {...character} className="hidden lg:block" />
      ) : null}

      <div
        className={cn(
          "grid w-full gap-s5 lg:gap-s6",
          hasSideColumn && !fullWidthWidget
            ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center"
            : "",
          // Quiet scenes get a narrower measure and more air around them.
          !hasSideColumn ? "max-w-3xl" : "",
        )}
      >
        {/* ---------------- Copy column ---------------- */}
        <div className="flex w-full flex-col">
          <div className="mb-s3 flex items-center gap-s2">
            <span
              aria-hidden="true"
              className="h-px w-s5 shrink-0"
              style={{
                background:
                  "linear-gradient(to right, transparent, var(--acc-line))",
              }}
            />
            <span
              data-reveal="up"
              className="u-mono"
              style={{ color: "var(--acc-text)" }}
            >
              {scene.eyebrow}
            </span>
          </div>

          <h3 data-reveal="clip" className="u-display text-display text-fg">
            {scene.title}
          </h3>

          <span
            data-reveal="clip"
            aria-hidden="true"
            className="u-rule mt-s4 block w-full max-w-[260px]"
          />

          {scene.description ? (
            <p
              data-reveal="up"
              className="u-measure mt-s4 text-body text-fg-dim"
            >
              {scene.description}
            </p>
          ) : null}

          {scene.body?.map((paragraph) => (
            <p
              key={paragraph}
              data-reveal="up"
              className="u-measure mt-s3 text-small text-fg-dim"
            >
              {paragraph}
            </p>
          ))}

          {scene.quote ? (
            <blockquote
              data-reveal="up"
              className={cn("border-l pl-s4", scene.quote ? "mt-s6" : "mt-s5")}
              style={{ borderColor: "var(--acc)" }}
            >
              <p className="u-display text-h2 text-fg">{scene.quote}</p>
            </blockquote>
          ) : null}

          {scene.facts?.length ? (
            <dl className="mt-s5 grid grid-cols-2 gap-s3 sm:grid-cols-3">
              {scene.facts.map((fact) => (
                <div
                  key={fact.label}
                  data-reveal="up"
                  className="flex flex-col gap-s1 border-t pt-s2"
                  style={{ borderColor: "var(--color-line)" }}
                >
                  <dd
                    className="u-display text-h2 tabular-nums"
                    style={{ color: "var(--acc)" }}
                  >
                    {fact.value}
                  </dd>
                  <dt className="u-mono text-fg-mute">{fact.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}

          {/* Full-width widgets sit beneath the copy, not beside it. */}
          {hasWidget && fullWidthWidget ? (
            <div data-reveal="up" className="mt-s6 w-full">
              {scene.visualType === "india-map" ? <IndiaMap /> : null}
              {scene.visualType === "quest-board" ? <QuestBoard /> : null}
            </div>
          ) : null}
        </div>

        {/* ---------------- Side column ---------------- */}
        {hasExplode && scene.explode ? (
          <div data-reveal="up" className="flex w-full justify-center">
            <ExplodeObject
              id={scene.explode.id}
              title={scene.explode.title}
              subtitle={scene.explode.subtitle}
              layers={scene.explode.layers}
              accent={scene.accent}
              mode={scene.explode.mode}
              spacing={scene.explode.spacing}
              cta={scene.explode.cta}
              /*
               * scrollDriven is deliberately OFF.
               *
               * Binding the hero explode to scroll was tried and reverted: the
               * object is ~600px inside a ~960px scene, so any trigger window
               * wide enough to feel cinematic runs past the point where the
               * object has already scrolled out of frame — leaving the stage
               * empty mid-animation, and showing a collapsed single plate on
               * the way in. A deliberate click reads better and never breaks.
               * The capability remains in ExplodeObject for a future scene
               * built around a pinned, full-height stage.
               */
            />
          </div>
        ) : null}

        {hasWidget && !fullWidthWidget ? (
          <div data-reveal="up" className="flex w-full justify-center">
            {scene.visualType === "studio-desk" ? <RapNotebook /> : null}
          </div>
        ) : null}
      </div>
    </ScrollScene>
  );
}

export default StoryScene;
