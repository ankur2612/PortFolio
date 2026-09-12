"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  explode,
  registerScrollTrigger,
  type ExplodeLayerOffset,
} from "@/lib/animations";
import { DUR, EASE } from "@/lib/motion";
import type { AccentName, ExplodeLayerData, ExplodeMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ExplodeObjectProps {
  id: string;
  title: string;
  subtitle?: string;
  layers: ExplodeLayerData[];
  accent?: AccentName;
  mode?: ExplodeMode;
  /** Gap between layers when apart, in px. Scaled down on small screens. */
  spacing?: number;
  cta?: string;
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Bind the explode to scroll position. The object comes apart as the
   * visitor scrolls through the scene and reassembles on the way back —
   * scrubbed, so their wheel drives it 1:1 and nothing is hijacked.
   *
   * The click affordance still works and takes precedence the moment it is
   * used: once a visitor has taken control, scroll stops overriding them.
   */
  scrollDriven?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------------ */
/* Offsets                                                                   */
/* ------------------------------------------------------------------------ */

function computeOffsets(
  count: number,
  mode: ExplodeMode,
  spacing: number,
  layers: ExplodeLayerData[],
): ExplodeLayerOffset[] {
  return Array.from({ length: count }, (_, i) => {
    const override = layers[i]?.offset;
    let x = 0;
    let y = 0;
    let scale = 1;
    const rotate = 0;

    if (mode === "radial") {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      x = Math.cos(angle) * spacing * 1.6;
      y = Math.sin(angle) * spacing * 1.6;
    } else if (mode === "lateral") {
      x = (i - (count - 1) / 2) * spacing * 1.4;
    } else {
      // stack — the signature mode. Centred on the origin so the exploded
      // diagram grows symmetrically and the stage can be sized exactly.
      y = (i - (count - 1) / 2) * spacing;
      scale = 1 - i * 0.014;
    }

    return {
      x: x + (override?.x ?? 0),
      y: y + (override?.y ?? 0),
      rotate: rotate + (override?.rotate ?? 0),
      scale,
    };
  });
}

/* ------------------------------------------------------------------------ */
/* Layer plate                                                               */
/* ------------------------------------------------------------------------ */

interface LayerPlateProps {
  layer: ExplodeLayerData;
  index: number;
  total: number;
  isOpen: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  /** Flow layout (mobile) positions in document order, not absolutely. */
  flow: boolean;
}

function LayerPlate({
  layer,
  index,
  total,
  isOpen,
  isSelected,
  onSelect,
  flow,
}: LayerPlateProps) {
  const terminal = layer.variant === "terminal";

  return (
    <div
      data-layer
      className={cn(
        "w-full will-change-transform",
        flow
          ? "relative"
          : "absolute left-1/2 top-1/2 max-w-[420px] -translate-x-1/2 -translate-y-1/2",
      )}
      style={{ zIndex: total - index }}
    >
      <button
        type="button"
        data-layer-plate
        // In flow layout the plates are always visible and therefore always
        // interactive. In absolute layout they are stacked behind the façade
        // while collapsed, so they must not be reachable until apart.
        onClick={() => (flow || isOpen) && onSelect(layer.id)}
        tabIndex={flow || isOpen ? 0 : -1}
        aria-hidden={!flow && !isOpen}
        aria-pressed={isSelected}
        aria-label={`${layer.title}. ${layer.description}`}
        className={cn(
          "group relative block w-full rounded-md border text-left",
          "px-s4 py-s3 transition-colors duration-200",
          "disabled:cursor-default",
          terminal
            ? "border-dashed bg-[var(--color-void)]"
            : "border-solid bg-[var(--color-raised)]",
          isSelected
            ? "border-[var(--acc)]"
            : "border-[var(--color-line)] hover:border-[var(--acc-line)]",
        )}
        style={{
          boxShadow: isSelected ? "var(--glow-sm)" : "var(--inset-hairline)",
        }}
      >
        {/* Accent edge — the "this is a layer of something" cue. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-px transition-opacity duration-200"
          style={{
            background: "var(--acc)",
            opacity: isSelected ? 1 : 0.35,
          }}
        />

        <span className="flex items-center justify-between gap-s3">
          <span className="flex items-baseline gap-s3">
            <span
              className="u-mono"
              style={{ color: isSelected ? "var(--acc)" : "var(--color-fg-mute)" }}
            >
              {layer.label}
            </span>
            <span className="u-display text-h3 text-fg">{layer.title}</span>
          </span>

          {layer.technology?.length ? (
            <span className="u-mono hidden text-fg-mute sm:inline">
              {layer.technology[0]}
            </span>
          ) : null}
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* ExplodeObject                                                             */
/* ------------------------------------------------------------------------ */

/**
 * ExplodeObject — the central mechanic.
 *
 * Assembled, the layers sit at one origin and read as a single object.
 * Activated, they travel apart into a labelled exploded diagram; selecting a
 * layer reveals its detail beneath.
 *
 * Correctness rules honoured here:
 * - No physics, no 3D. One paused GSAP timeline animating transform only.
 * - The affordance is always visible: the visitor never has to guess that
 *   something can be taken apart.
 * - Every layer's title, description and technology exist in the DOM in BOTH
 *   states — the timeline only moves them. Ctrl+F and screen readers always
 *   see the full content, so the animation is never the sole carrier of
 *   information.
 * - Under reduced motion the object renders already apart, fully labelled,
 *   with no timeline built at all.
 * - Controlled or uncontrolled via `open` / `onOpenChange`.
 */
export function ExplodeObject({
  id,
  title,
  subtitle,
  layers,
  accent,
  mode = "stack",
  spacing = 96,
  cta = "Take it apart",
  open: controlledOpen,
  onOpenChange,
  scrollDriven = false,
  className,
}: ExplodeObjectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  /** Set once the visitor clicks — scroll stops driving after that. */
  const userTookControlRef = useRef(false);

  const reducedMotion = useReducedMotion();
  const isCompact = useMediaQuery("(max-width: 767px)");

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // A layer plate is ~68px tall on desktop, ~62px on mobile. Spacing must
  // clear that or the plates overlap when apart.
  const PLATE_H = isCompact ? 62 : 68;
  const MIN_GAP = 12;

  // Mobile: tighter spacing so a five-layer stack still fits a small screen,
  // but never tighter than the plate height plus a visible gap.
  const effectiveSpacing = Math.max(
    isCompact ? Math.round(spacing * 0.72) : spacing,
    PLATE_H + MIN_GAP,
  );

  // Radial collapses to stack on mobile — a ring does not fit a phone.
  const effectiveMode: ExplodeMode =
    isCompact && mode === "radial" ? "stack" : mode;

  // On small screens the diagram flows in document order instead of being
  // absolutely positioned: an absolute stack of five plates is taller than a
  // phone viewport, which pushes layers off-screen and under the fixed HUD.
  const useFlow = isCompact;

  const offsets = useMemo(
    () =>
      computeOffsets(layers.length, effectiveMode, effectiveSpacing, layers),
    [layers, effectiveMode, effectiveSpacing],
  );

  /**
   * Stage height must fit the layers once apart. Offsets are centred on the
   * origin, so the required height is the full spread (min→max) plus one
   * plate, plus a little breathing room.
   */
  const stageHeight = useMemo(() => {
    const ys = offsets.map((o) => o.y);
    const spread = Math.max(...ys) - Math.min(...ys);
    return Math.round(spread + PLATE_H + 32);
  }, [offsets, PLATE_H]);

  const setOpen = useCallback(
    (next: boolean) => {
      // The first deliberate click hands control to the visitor for good.
      userTookControlRef.current = true;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) setSelectedId(null);
    },
    [isControlled, onOpenChange],
  );

  // --- Build the timeline ------------------------------------------------
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      const plates = gsap.utils.toArray<HTMLElement>("[data-layer]", stage);
      if (!plates.length) return;

      /* -------------------------------------------------------------- *
       * FLOW layout (mobile).
       * Plates sit in document order. "Apart" is expressed as vertical
       * gap + opacity rather than travel, so the stack can never exceed
       * the viewport or collide with neighbouring content. Same mechanic,
       * geometry appropriate to the device.
       * -------------------------------------------------------------- */
      if (useFlow) {
        if (reducedMotion) {
          gsap.set(plates, { marginTop: 12, opacity: 1, y: 0, x: 0, scale: 1 });
          timelineRef.current = null;
          return;
        }

        /*
         * Collapsed, the plates fan into a visible stack of edges rather than
         * hiding behind the top one. Previously only "PRODUCT" was visible on
         * a phone, so the object read as a single item and the whole mechanic
         * was invisible on mobile. Now each layer peeks by STACK_PEEK px and
         * steps back in scale — the deck is legible as a deck before anyone
         * touches it.
         */
        const STACK_PEEK = 16;
        gsap.set(plates, { x: 0, y: 0, rotate: 0 });
        plates.forEach((plate, i) => {
          gsap.set(plate, {
            marginTop: i === 0 ? 0 : -PLATE_H + STACK_PEEK,
            opacity: 1,
            // Each plate steps back AND inward, so the deck reads as depth
            // rather than as one card with a thick border.
            scale: 1 - i * 0.045,
            transformOrigin: "50% 0%",
          });
        });

        const tl = gsap.timeline({ paused: true });
        tl.to(plates.slice(1), {
          marginTop: 12,
          duration: 0.55,
          stagger: 0.05,
          ease: EASE.snap,
        });
        tl.to(
          plates,
          { scale: 1, duration: 0.55, stagger: 0.05, ease: EASE.snap },
          0,
        );
        timelineRef.current = tl;
        return;
      }

      /* -------------------------------------------------------------- *
       * ABSOLUTE layout (desktop). The signature exploded diagram.
       * -------------------------------------------------------------- */
      if (reducedMotion) {
        // Already apart. No timeline, no motion, nothing hidden.
        plates.forEach((plate, i) => {
          gsap.set(plate, {
            x: offsets[i].x,
            y: offsets[i].y,
            scale: 1,
            rotate: offsets[i].rotate,
            marginTop: 0,
            opacity: 1,
          });
        });
        timelineRef.current = null;
        return;
      }

      gsap.set(plates, { x: 0, y: 0, scale: 1, rotate: 0, marginTop: 0, opacity: 1 });
      const tl = explode(plates, offsets, {
        duration: 0.7,
        stagger: 0.06,
        ease: EASE.snap,
      });
      timelineRef.current = tl;

      /*
       * Scroll-driven assembly, created HERE rather than in its own effect:
       * the trigger needs the timeline, and a separate effect cannot rely on
       * the ref being populated yet. Building both together makes the
       * ordering explicit and lets one `gsap.context()` revert both.
       *
       * Scrubbed against native scroll, so it tracks the wheel exactly and
       * runs backwards. Ownership transfers permanently to the visitor the
       * moment they click the affordance.
       */
      if (scrollDriven) {
        registerScrollTrigger();
        /*
         * Trigger on the enclosing SCENE, not on this component's own root.
         * The object is only ~600px tall and sits mid-scene, so triggering on
         * it gives a scrub window shorter than one viewport — the assembly
         * would complete before the visitor had finished arriving. The scene
         * is the correct unit of travel.
         */
        const scene = stage.closest("[data-scene]") ?? stage;
        ScrollTrigger.create({
          trigger: scene,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (userTookControlRef.current) return;
            tl.progress(self.progress);
            // The façade tracks the same progress, so the single object
            // dissolves exactly as its layers separate.
            const facade =
              stage.querySelector<HTMLElement>("[data-facade]");
            if (facade) {
              const o = 1 - Math.min(1, self.progress * 2.4);
              facade.style.opacity = String(o);
              facade.style.pointerEvents = o < 0.2 ? "none" : "auto";
            }
          },
        });
        // Layout settles after fonts and images; without this the trigger can
        // compute its window against a stale page height.
        ScrollTrigger.refresh();
      }
    }, stage);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [offsets, reducedMotion, layers.length, useFlow, PLATE_H, scrollDriven]);

  // --- Drive it ----------------------------------------------------------
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (isOpen) tl.play();
    else tl.reverse();
  }, [isOpen]);


  // --- Collapsed façade fades out as the layers travel -------------------
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to("[data-facade]", {
        opacity: isOpen ? 0 : 1,
        duration: DUR.micro * 1.5,
        ease: EASE.inOut,
        pointerEvents: isOpen ? "none" : "auto",
      });
    }, root);

    return () => ctx.revert();
  }, [isOpen, reducedMotion]);

  const selected = layers.find((layer) => layer.id === selectedId) ?? null;
  const effectiveOpen = reducedMotion ? true : isOpen;

  /**
   * Collapsed-state hint. Derived from the object's own layers — a hardcoded
   * count here silently lies about any object with a different shape, and the
   * "one is different" line must only appear when one actually is.
   */
  const hasTerminalLayer = layers.some(
    (layer) => layer.variant === "terminal",
  );
  const collapsedHint = hasTerminalLayer
    ? `${layers.length} layers. One of them is not like the others.`
    : `${layers.length} layers. Open it up.`;

  return (
    <div
      ref={rootRef}
      data-world={accent}
      className={cn("flex w-full flex-col items-center", className)}
    >
      {/* ---------------- Stage ---------------- */}
      <div
        ref={stageRef}
        className={cn(
          "relative w-full",
          useFlow ? "flex flex-col items-stretch" : "",
        )}
        style={useFlow ? undefined : { height: stageHeight }}
        role="group"
        aria-label={`${title} — exploded diagram`}
      >
        {/* Centre datum line: reads as a technical drawing axis.
            Absolute layout only — in flow layout the plates butt together and
            a vertical axis would just cut through them. */}
        {!useFlow ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--acc-faint) 18%, var(--acc-faint) 82%, transparent)",
              opacity: effectiveOpen ? 1 : 0,
            }}
          />
        ) : null}

        {/* Collapsed façade — the single object before it comes apart.
            Absolute layout only: in flow layout the collapsed stack of plates
            IS the object, so a façade on top of it would be redundant. */}
        {!reducedMotion && !useFlow ? (
          <div
            data-facade
            className="absolute left-1/2 top-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="u-card flex flex-col items-center gap-s2 px-s5 py-s6"
              style={{ boxShadow: "var(--glow-md), var(--inset-hairline)" }}
            >
              <span className="u-mono text-fg-mute">
                {layers.length} layers
              </span>
              <span className="u-display text-h2 text-fg">{title}</span>
              {subtitle ? (
                <span className="u-mono text-center text-fg-mute">
                  {subtitle}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Flow layout gets a compact header instead of the façade. */}
        {useFlow ? (
          <div className="mb-s3 flex items-baseline justify-between gap-s3">
            <span className="u-display text-h3 text-fg">{title}</span>
            <span className="u-mono" style={{ color: "var(--acc-text)" }}>
              {layers.length} layers
            </span>
          </div>
        ) : null}

        {layers.map((layer, index) => (
          <LayerPlate
            key={layer.id}
            layer={layer}
            index={index}
            total={layers.length}
            isOpen={effectiveOpen}
            isSelected={selectedId === layer.id}
            flow={useFlow}
            onSelect={(nextId) =>
              setSelectedId((current) => (current === nextId ? null : nextId))
            }
          />
        ))}
      </div>

      {/* ---------------- Affordance ---------------- */}
      {!reducedMotion ? (
        <button
          type="button"
          onClick={() => setOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`${id}-detail`}
          // Left-aligned on mobile so it sits clear of the fixed HIRING? chip,
          // which owns the bottom-right corner at narrow widths.
          className="group mt-s4 inline-flex min-h-[40px] items-center gap-s2 self-start rounded-md px-s3 py-s2 transition-colors duration-200 sm:self-auto"
        >
          <span
            className="u-mono transition-colors duration-200"
            style={{ color: isOpen ? "var(--color-fg-mute)" : "var(--acc)" }}
          >
            {isOpen ? "Put it back" : cta}
          </span>
          <span
            aria-hidden="true"
            className="u-mono transition-transform duration-300"
            style={{
              color: isOpen ? "var(--color-fg-mute)" : "var(--acc)",
              transform: isOpen ? "rotate(180deg)" : "none",
            }}
          >
            ↓
          </span>
        </button>
      ) : null}

      {/* Pulsing underline: the "something here opens" cue. */}
      {!reducedMotion && !isOpen ? (
        <span
          aria-hidden="true"
          className="mt-s1 block h-px w-[120px] animate-pulse"
          style={{ background: "var(--acc-line)" }}
        />
      ) : null}

      {/* ---------------- Layer detail ---------------- */}
      <div
        id={`${id}-detail`}
        className="mt-s5 w-full max-w-[560px]"
        aria-live="polite"
      >
        {selected ? (
          <div className="u-card flex flex-col gap-s3 px-s4 py-s4">
            <div className="flex items-baseline justify-between gap-s3">
              <span className="u-display text-h3 text-fg">
                {selected.title}
              </span>
              <span className="u-mono" style={{ color: "var(--acc-text)" }}>
                {selected.label}
              </span>
            </div>

            {selected.technology?.length ? (
              <div className="flex flex-wrap gap-s2">
                {selected.technology.map((tech) => (
                  <span
                    key={tech}
                    className="u-mono rounded-sm border border-line px-s2 py-s1 text-fg-dim"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="text-small text-fg-dim">{selected.description}</p>

            {/*
              `placeholder` is an internal flag for tracking unverified
              content — it is deliberately NOT surfaced to visitors. The copy
              in `scenes.ts` already says "coming soon" in the site's own
              voice; a build-status warning on top of that would read as a
              defect rather than as candour.
            */}
          </div>
        ) : (
          <p
            className={cn(
              "u-mono text-fg-mute sm:text-center",
              // On mobile the fanned stack and the "N layers" header already
              // say this, and the line would run under the fixed corner
              // chips. Kept in the DOM for screen readers.
              !effectiveOpen && useFlow ? "u-sr-only" : "",
            )}
          >
            {effectiveOpen ? "Select a layer to inspect it" : collapsedHint}
          </p>
        )}
      </div>

      {/*
        Static, always-present transcript. The animation is never the only
        source of information — this is what Ctrl+F, search engines and screen
        readers read, in both states.
      */}
      <div className="u-sr-only">
        <h3>{title} — layers</h3>
        <dl>
          {layers.map((layer) => (
            <div key={layer.id}>
              <dt>
                {layer.label} {layer.title}
                {layer.technology?.length
                  ? ` (${layer.technology.join(", ")})`
                  : ""}
              </dt>
              <dd>{layer.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default ExplodeObject;
