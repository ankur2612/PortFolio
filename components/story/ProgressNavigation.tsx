"use client";

import { useCallback, useState } from "react";

import { WORLDS } from "@/data/scenes";
import type { WorldId } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ProgressNavigationProps {
  world: WorldId;
  worldName: string;
  sceneOrder: number;
  sceneCount: number;
  onSelectWorld: (world: WorldId) => void;
  onBack: () => void;
}

/**
 * ProgressNavigation
 *
 * A film-timeline HUD, not a navbar. Bottom-centred on desktop, bottom-right
 * on mobile so it sits in thumb reach and clear of content.
 *
 * Reads as a technical instrument: mono type, a frame counter, and scene
 * ticks that fill as the visitor advances. Locked worlds are real
 * <button disabled> elements with an explanatory label rather than hidden
 * links — a visitor should be able to see the shape of what is coming.
 */
export function ProgressNavigation({
  world,
  worldName,
  sceneOrder,
  sceneCount,
  onSelectWorld,
  onBack,
}: ProgressNavigationProps) {
  const [expanded, setExpanded] = useState(false);

  const pad = useCallback(
    (value: number) => String(value).padStart(2, "0"),
    [],
  );

  return (
    <nav
      aria-label="Story progress"
      // The HUD adopts the active world's accent, so the instrument itself
      // reports which world you are in — not just the label inside it.
      data-world={world}
      className={cn(
        "fixed bottom-s3 z-50 u-no-print",
        "left-s3 right-s3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2",
      )}
    >
      <div
        className="u-card flex flex-col overflow-hidden"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-raised) 88%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* --- Expanded tray ------------------------------------------- */}
        {expanded ? (
          <div className="flex flex-col gap-s2 border-b border-line px-s3 py-s3">
            {WORLDS.map((entry) => {
              const isActive = entry.id === world;
              return (
                <button
                  key={entry.id}
                  type="button"
                  disabled={!entry.available}
                  onClick={() => {
                    if (!entry.available) return;
                    onSelectWorld(entry.id);
                    setExpanded(false);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={
                    entry.available
                      ? `${entry.index} ${entry.name}, ${entry.scenes.length} scenes`
                      : `${entry.index} ${entry.name} — coming next`
                  }
                  // Each row carries its own world colour, so the tray reads
                  // as three distinct places rather than a list of links.
                  data-world={entry.id}
                  className={cn(
                    "flex items-center justify-between gap-s4 rounded-sm px-s2 py-s2 text-left",
                    "min-h-[40px] transition-colors duration-200",
                    entry.available
                      ? "hover:bg-[var(--acc-wash)]"
                      : "cursor-not-allowed opacity-45",
                  )}
                >
                  <span className="flex items-baseline gap-s3">
                    <span
                      className="u-mono"
                      style={{
                        color: isActive ? "var(--acc)" : "var(--color-fg-mute)",
                      }}
                    >
                      {entry.index}
                    </span>
                    <span
                      className="u-mono"
                      style={{
                        color: isActive
                          ? "var(--color-fg)"
                          : "var(--color-fg-dim)",
                      }}
                    >
                      {entry.name}
                    </span>
                    {/* Active world gets a lit dot rather than a label. */}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="block h-s2 w-s2 rounded-full"
                        style={{ background: "var(--acc)" }}
                      />
                    ) : null}
                  </span>

                  <span className="u-mono text-fg-mute">
                    {entry.available ? `${entry.scenes.length} scenes` : "soon"}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={onBack}
              className="mt-s1 flex items-center gap-s2 rounded-sm px-s2 py-s2 text-left transition-colors duration-200 hover:bg-[var(--acc-wash)]"
            >
              <span className="u-mono text-fg-mute">← Back to landing</span>
            </button>
          </div>
        ) : null}

        {/* --- Collapsed bar ------------------------------------------- */}
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={`${worldName}, scene ${sceneOrder} of ${sceneCount}. Toggle world navigation.`}
          className="flex min-h-[44px] items-center gap-s3 px-s3 py-s2 transition-colors duration-200 hover:bg-[var(--acc-wash)]"
        >
          {/* Frame counter. */}
          <span className="u-mono tabular-nums" style={{ color: "var(--acc-text)" }}>
            {pad(sceneOrder)}
            <span style={{ color: "var(--color-fg-mute)" }}>
              {" / "}
              {pad(sceneCount)}
            </span>
          </span>

          <span
            aria-hidden="true"
            className="h-s3 w-px shrink-0"
            style={{ background: "var(--color-line-hi)" }}
          />

          {/* World label. */}
          <span className="u-mono text-fg-dim">{worldName}</span>

          {/* Scene ticks — the film timeline. */}
          <span aria-hidden="true" className="ml-auto flex items-center gap-s1">
            {Array.from({ length: sceneCount }, (_, index) => {
              const filled = index < sceneOrder;
              return (
                <span
                  key={index}
                  className="block h-s2 transition-all duration-300"
                  style={{
                    width: index === sceneOrder - 1 ? "18px" : "8px",
                    background: filled
                      ? "var(--acc)"
                      : "var(--color-line-hi)",
                    opacity: filled ? 1 : 0.6,
                  }}
                />
              );
            })}
          </span>

          <span
            aria-hidden="true"
            className="u-mono text-fg-mute transition-transform duration-300"
            style={{ transform: expanded ? "rotate(180deg)" : "none" }}
          >
            ↑
          </span>
        </button>
      </div>
    </nav>
  );
}

export default ProgressNavigation;
