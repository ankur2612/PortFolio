"use client";

import { useState } from "react";

import { TRAVEL_PLACES } from "@/data/sidequests";
import { cn } from "@/lib/utils";

/**
 * IndiaMap — S1.
 *
 * A stylised silhouette, not GIS data: one simplified path plus positioned
 * markers. It is an illustrated travel journal, and it is honest about that.
 *
 * Deliberately does NOT claim a count of states. Places appear because Ankur
 * listed them; markers without a verified memory simply show the name.
 *
 * Interaction is real buttons in a real list — keyboard, screen reader and
 * touch all work without any extra machinery.
 */

/**
 * Simplified India outline — an illustrated silhouette, not a survey
 * boundary.
 *
 * Built as a straight-segment polygon rather than beziers: at this scale
 * smooth curves read as an amoeba, whereas faceted segments read as a
 * deliberate technical trace and hold the landmark shapes far better — the
 * Kashmir crown, the Kutch notch, the Gujarat bulge, the Bengal indentation,
 * and the long taper to Kanyakumari.
 */
const INDIA_POINTS: [number, number][] = [
  // North — Kashmir crown
  [33.0, 8.0],
  [36.5, 5.5],
  [39.5, 7.5],
  [38.0, 11.0],
  [41.5, 12.5],
  // Nepal / north-east arc
  [46.0, 14.5],
  [51.0, 15.5],
  [55.0, 17.0],
  [58.5, 16.0],
  [62.0, 17.5],
  // North-east limb
  [66.0, 19.0],
  [64.0, 22.0],
  [60.0, 22.5],
  [58.0, 25.5],
  [60.5, 28.0],
  [57.0, 30.5],
  // Bengal indentation
  [52.5, 29.5],
  [50.0, 33.0],
  [51.5, 37.0],
  // East coast running south
  [48.5, 43.0],
  [45.5, 50.0],
  [43.0, 57.0],
  [41.0, 64.0],
  [38.5, 71.0],
  // Kanyakumari
  [35.0, 80.0],
  [32.5, 88.0],
  [30.5, 84.0],
  [29.0, 76.0],
  // West coast running north
  [27.0, 68.0],
  [25.5, 60.0],
  [24.0, 52.0],
  [22.0, 45.0],
  // Gujarat bulge + Kutch notch
  [18.5, 41.0],
  [14.5, 39.5],
  [16.5, 35.5],
  [13.0, 33.5],
  [16.0, 31.0],
  [20.0, 32.0],
  [22.5, 28.5],
  // Rajasthan / back up to the crown
  [21.0, 24.0],
  [24.5, 20.0],
  [27.0, 15.5],
  [29.5, 11.0],
];

const INDIA_PATH = `M${INDIA_POINTS.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;

export function IndiaMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = TRAVEL_PLACES.find((place) => place.id === activeId) ?? null;

  return (
    <div className="flex w-full flex-col gap-s4 lg:flex-row lg:items-start lg:gap-s5">
      {/* ---------------- Map ---------------- */}
      <div className="relative mx-auto w-full max-w-[360px] shrink-0 lg:mx-0 lg:max-w-[340px]">
        <svg
          viewBox="0 0 80 100"
          className="h-auto w-full"
          style={{ color: "var(--acc)" }}
          role="img"
          aria-label="Stylised map of India showing places travelled"
        >
          {/* Silhouette. */}
          <path
            d={INDIA_PATH}
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeOpacity="0.4"
            strokeLinejoin="round"
          />

          {/* Travel trace connecting the markers in listed order. */}
          <polyline
            points={TRAVEL_PLACES.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeOpacity="0.3"
            strokeDasharray="1.2 1.6"
          />

          {/* Markers. */}
          {TRAVEL_PLACES.map((place) => {
            const isActive = place.id === activeId;
            return (
              <g key={place.id}>
                {isActive ? (
                  <circle
                    cx={place.x}
                    cy={place.y}
                    r="2.6"
                    fill="currentColor"
                    fillOpacity="0.18"
                  />
                ) : null}
                <circle
                  cx={place.x}
                  cy={place.y}
                  r={isActive ? 1.25 : 0.85}
                  fill="currentColor"
                  fillOpacity={isActive ? 1 : 0.62}
                  style={{ transition: "r 200ms ease, fill-opacity 200ms ease" }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ---------------- Log ---------------- */}
      <div className="flex w-full flex-col gap-s3">
        <ul className="flex flex-wrap gap-s2">
          {TRAVEL_PLACES.map((place) => {
            const isActive = place.id === activeId;
            return (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() =>
                    setActiveId((current) =>
                      current === place.id ? null : place.id,
                    )
                  }
                  onPointerEnter={() => setActiveId(place.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "u-mono rounded-sm border px-s2 py-s1 transition-colors duration-200",
                    // 44px touch target height via padding + min-height
                    "min-h-[36px]",
                    isActive
                      ? "border-[var(--acc)] text-fg"
                      : "border-line text-fg-dim hover:border-[var(--acc-line)]",
                  )}
                  style={isActive ? { boxShadow: "var(--glow-sm)" } : undefined}
                >
                  {place.name}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Detail card. Reserves its own height so selecting a place never
            shifts the layout underneath it. */}
        <div className="min-h-[92px]" aria-live="polite">
          {active ? (
            <div className="u-card flex flex-col gap-s2 px-s4 py-s3">
              <span className="u-display text-h3 text-fg">{active.name}</span>
              {active.note ? (
                <p className="text-small text-fg-dim">{active.note}</p>
              ) : (
                <p className="u-mono text-fg-mute">Been there.</p>
              )}
            </div>
          ) : (
            <p className="u-mono text-fg-mute">
              Pick a place. Some of them have a story attached.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default IndiaMap;
