"use client";

import gsap from "gsap";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { QUEST_CARDS } from "@/data/sidequests";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 6;
const REVEAL_STEP = 4;

/**
 * Per-card scatter. Fixed, not random: a deterministic layout can be tuned,
 * reviewed and reproduced, and it does not reshuffle on every render.
 *
 * `col` places the card on a 12-column grid; `span` is its width; `rot` and
 * `drop` push it off the baseline. The point is that no two cards share a
 * top edge — a pinboard, not a table.
 */
const SCATTER: { col: number; span: number; rot: number; drop: number; scale: number }[] = [
  { col: 1, span: 5, rot: -1.6, drop: 0, scale: 1 },
  { col: 7, span: 6, rot: 1.1, drop: 44, scale: 0.96 },
  { col: 2, span: 6, rot: 0.9, drop: 14, scale: 0.98 },
  { col: 8, span: 5, rot: -1.3, drop: 58, scale: 1 },
  { col: 1, span: 4, rot: 1.8, drop: 26, scale: 0.94 },
  { col: 6, span: 6, rot: -0.8, drop: 8, scale: 1 },
  { col: 3, span: 5, rot: -2.1, drop: 40, scale: 0.97 },
  { col: 8, span: 5, rot: 1.4, drop: 12, scale: 0.95 },
];

/**
 * QuestBoard — S3.
 *
 * A pinned board, not a card grid. The previous six-column grid was the most
 * template-shaped screen on the site: "playful, unpredictable, slightly
 * chaotic" rendered as a settings page. Cards now sit at varied widths,
 * rotations and vertical offsets, overlapping slightly, with thread lines
 * running between them — the visual register of a corkboard someone actually
 * uses.
 *
 * The chaos is controlled: the scatter table is fixed, every card stays on
 * the 12-column grid, and mobile collapses to a single readable column. On
 * touch there is no room to be clever, and legibility wins.
 */
export function QuestBoard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isCompact = useMediaQuery("(max-width: 767px)");

  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const shown = reducedMotion ? QUEST_CARDS.length : visible;
  const remaining = QUEST_CARDS.length - shown;

  const previousRef = useRef(INITIAL_VISIBLE);

  const cards = useMemo(() => QUEST_CARDS.slice(0, shown), [shown]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) {
      previousRef.current = shown;
      return;
    }

    const from = previousRef.current;
    previousRef.current = shown;
    if (shown <= from) return;

    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>("[data-quest-card]", root);
      const fresh = nodes.slice(from, shown);
      if (!fresh.length) return;

      // Cards land like something dropped onto a board: a little overshoot,
      // a little rotation, settling into place.
      gsap.fromTo(
        fresh,
        { opacity: 0, y: 26, rotate: (i: number) => (i % 2 ? 4 : -4), scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          rotate: (i: number) => SCATTER[(from + i) % SCATTER.length].rot,
          scale: (i: number) => SCATTER[(from + i) % SCATTER.length].scale,
          duration: DUR.reveal,
          stagger: STAGGER.base,
          ease: EASE.snap,
        },
      );
    }, root);

    return () => ctx.revert();
  }, [shown, reducedMotion]);

  const showMore = useCallback(() => {
    setVisible((value) => Math.min(value + REVEAL_STEP, QUEST_CARDS.length));
  }, []);

  return (
    <div ref={rootRef} className="flex w-full flex-col gap-s5">
      {/* ---------------- The board ---------------- */}
      <div
        className={cn(
          "relative w-full",
          isCompact ? "flex flex-col gap-s3" : "grid grid-cols-12 gap-x-s3",
        )}
      >
        {/* Thread lines between pins. Desktop only — on a phone the cards are
            a single column and threads would just be noise. */}
        {!isCompact ? (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ color: "var(--acc)" }}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <g
              stroke="currentColor"
              strokeWidth="0.12"
              strokeOpacity="0.22"
              fill="none"
            >
              <path d="M18 12 Q42 22 66 18" />
              <path d="M66 18 Q80 40 74 56" />
              <path d="M18 12 Q10 38 26 52" />
              <path d="M26 52 Q52 64 74 56" />
            </g>
            <g fill="currentColor" fillOpacity="0.5">
              <circle cx="18" cy="12" r="0.5" />
              <circle cx="66" cy="18" r="0.5" />
              <circle cx="26" cy="52" r="0.5" />
              <circle cx="74" cy="56" r="0.5" />
            </g>
          </svg>
        ) : null}

        {cards.map((card, index) => {
          const s = SCATTER[index % SCATTER.length];
          return (
            <article
              key={card.id}
              data-quest-card
              className={cn(
                "u-card relative flex flex-col gap-s2 px-s4 py-s3",
                "transition-colors duration-200 hover:border-[var(--acc-line)]",
                isCompact ? "w-full" : "",
              )}
              style={
                isCompact
                  ? undefined
                  : {
                      gridColumn: `${s.col} / span ${s.span}`,
                      marginTop: s.drop,
                      transform: `rotate(${s.rot}deg) scale(${s.scale})`,
                      zIndex: 10 + index,
                    }
              }
            >
              {/* Pin. The card is attached to something. */}
              {!isCompact ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-s1 left-s4 block h-s2 w-s2 rounded-full"
                  style={{
                    background: "var(--acc)",
                    boxShadow: "var(--glow-sm)",
                  }}
                />
              ) : null}

              <div className="flex items-center justify-between gap-s3">
                <span className="u-mono" style={{ color: "var(--acc-text)" }}>
                  {card.label}
                </span>
                <span className="u-mono text-fg-mute">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h4 className="u-display text-h3 text-fg">{card.title}</h4>
              <p className="text-small text-fg-dim">{card.description}</p>
            </article>
          );
        })}
      </div>

      {remaining > 0 ? (
        <button
          type="button"
          onClick={showMore}
          className="inline-flex min-h-[44px] items-center gap-s2 self-start rounded-md border border-line px-s4 py-s2 transition-colors duration-200 hover:border-[var(--acc-line)]"
        >
          <span className="u-mono" style={{ color: "var(--acc-text)" }}>
            More
          </span>
          <span className="u-mono text-fg-mute">{remaining} left</span>
        </button>
      ) : (
        <p className="u-mono text-fg-mute">
          That&rsquo;s the log so far. It keeps growing.
        </p>
      )}
    </div>
  );
}

export default QuestBoard;
