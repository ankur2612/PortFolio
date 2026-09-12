"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { VisualType } from "@/lib/types";

/**
 * SideQuestEnvironment — WORLD 03, "PLAYGROUND".
 *
 * Where Builder is ordered and Human is still, this world is loose. It is the
 * only place the visual rules bend: scattered geometry, off-grid marks, a
 * scrapbook register. It is still the same near-black foundation, the same
 * grain, the same typography — only the energy changes.
 */

interface EnvironmentProps {
  type: VisualType;
}

/* ------------------------------------------------------------------------ */
/* S1 — open road / route marks                                              */
/* ------------------------------------------------------------------------ */

function RouteField({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Loose route traces crossing the frame — journeys, not borders. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeDasharray="4 12"
      >
        <path d="M-40 180 Q260 90 520 210 T1240 150" strokeOpacity="0.16" />
        <path d="M-40 420 Q300 520 600 400 T1240 460" strokeOpacity="0.12" />
        <path d="M120 -40 Q220 240 90 640" strokeOpacity="0.1" />
        <path d="M1080 -40 Q980 280 1120 640" strokeOpacity="0.1" />
      </g>

      {/* Waypoint pins scattered off-grid. */}
      <g fill="currentColor">
        {[
          [160, 168],
          [430, 214],
          [720, 138],
          [980, 196],
          [250, 452],
          [610, 404],
          [910, 448],
        ].map(([cx, cy], i) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="14" fillOpacity="0.05" />
            <circle
              cx={cx}
              cy={cy}
              r="2.4"
              fillOpacity="0.5"
              style={
                reduced
                  ? undefined
                  : {
                      animation: `ap-drift ${7 + i}s ease-in-out ${i * 0.6}s infinite`,
                    }
              }
            />
          </g>
        ))}
      </g>

      {/* A compass rose, small, upper right. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.22" fill="none">
        <circle cx="1090" cy="110" r="26" />
        <line x1="1090" y1="80" x2="1090" y2="140" />
        <line x1="1060" y1="110" x2="1120" y2="110" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* S2 — studio: mic, pool of light, waveform                                 */
/* ------------------------------------------------------------------------ */

function StudioDesk({ reduced }: { reduced: boolean }) {
  // A fixed pseudo-waveform. Deterministic, so it never shifts on re-render.
  const bars = [
    14, 30, 20, 46, 62, 38, 74, 50, 88, 42, 66, 28, 54, 36, 70, 24, 48, 80, 34,
    58, 22, 44, 68, 30, 52, 18, 40, 60, 26, 46,
  ];

  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Booth panel grid — acoustic foam, abstracted. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.08">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={80 + i * 58} y1="60" x2={80 + i * 58} y2="330" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="80" y1={60 + i * 68} x2="544" y2={60 + i * 68} />
        ))}
      </g>

      {/* The pool of light. One source, gold. */}
      <ellipse cx="880" cy="300" rx="180" ry="180" fill="currentColor" fillOpacity="0.05" />

      {/* Microphone on its stand. */}
      <g stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.55" fill="none">
        <line x1="880" y1="330" x2="880" y2="470" />
        <line x1="836" y1="470" x2="924" y2="470" />
        <rect x="862" y="212" width="36" height="76" rx="18" />
        <line x1="880" y1="288" x2="880" y2="330" />
      </g>
      {/* Mic grille lines. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.3">
        <line x1="866" y1="232" x2="894" y2="232" />
        <line x1="866" y1="244" x2="894" y2="244" />
        <line x1="866" y1="256" x2="894" y2="256" />
        <line x1="866" y1="268" x2="894" y2="268" />
      </g>
      {/* Pop filter. */}
      <g stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.28" fill="none">
        <ellipse cx="812" cy="250" rx="10" ry="26" />
        <path d="M822 250 Q846 250 862 250" />
      </g>

      {/* Waveform along the base — the room's only rhythm. */}
      <g fill="currentColor">
        {bars.map((height, i) => (
          <rect
            key={i}
            x={90 + i * 15}
            y={540 - height / 2}
            width="4"
            height={height}
            rx="2"
            fillOpacity={0.16 + (i % 5) * 0.05}
            style={
              reduced
                ? undefined
                : {
                    animation: `ap-drift ${3.4 + (i % 7) * 0.45}s ease-in-out ${(i % 11) * 0.19}s infinite`,
                  }
            }
          />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* S3 — quest board: pinned scraps, tape, off-grid marks                     */
/* ------------------------------------------------------------------------ */

function QuestBoardEnv() {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Scattered pinned rectangles, slightly rotated — a real corkboard. */}
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        <rect x="96" y="94" width="132" height="90" rx="2" transform="rotate(-3 96 94)" strokeOpacity="0.14" />
        <rect x="292" y="62" width="108" height="76" rx="2" transform="rotate(2.5 292 62)" strokeOpacity="0.1" />
        <rect x="884" y="110" width="150" height="98" rx="2" transform="rotate(-2 884 110)" strokeOpacity="0.12" />
        <rect x="140" y="416" width="120" height="84" rx="2" transform="rotate(3 140 416)" strokeOpacity="0.1" />
        <rect x="948" y="404" width="136" height="92" rx="2" transform="rotate(-2.5 948 404)" strokeOpacity="0.13" />
      </g>

      {/* Pins. */}
      <g fill="currentColor" fillOpacity="0.4">
        <circle cx="162" cy="98" r="3" />
        <circle cx="346" cy="66" r="3" />
        <circle cx="958" cy="114" r="3" />
        <circle cx="200" cy="420" r="3" />
        <circle cx="1016" cy="408" r="3" />
      </g>

      {/* Strings between a few of them — things that connect. */}
      <g stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.14">
        <path d="M162 98 Q260 140 346 66" fill="none" />
        <path d="M346 66 Q650 200 958 114" fill="none" />
        <path d="M200 420 Q600 520 1016 408" fill="none" />
      </g>

      {/* A few loose XP-style tick marks, bottom left. */}
      <g stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.2">
        <line x1="72" y1="546" x2="72" y2="566" />
        <line x1="84" y1="546" x2="84" y2="566" />
        <line x1="96" y1="546" x2="96" y2="566" />
        <line x1="108" y1="546" x2="108" y2="566" />
        <line x1="66" y1="558" x2="114" y2="552" />
      </g>
    </svg>
  );
}

export function SideQuestEnvironment({ type }: EnvironmentProps) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 100% 90% at 50% 50%, #000 40%, transparent 94%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 100% 90% at 50% 50%, #000 40%, transparent 94%)",
      }}
    >
      {type === "india-map" ? <RouteField reduced={reduced} /> : null}
      {type === "studio-desk" ? <StudioDesk reduced={reduced} /> : null}
      {type === "quest-board" ? <QuestBoardEnv /> : null}
    </div>
  );
}

export default SideQuestEnvironment;
