"use client";

import HumanEnvironment from "@/components/story/HumanEnvironment";
import SideQuestEnvironment from "@/components/story/SideQuestEnvironment";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { VisualType } from "@/lib/types";

/**
 * SceneEnvironment
 *
 * Every environment in the project is built from 2–4 vector/CSS primitives
 * rather than raster art. This is a deliberate architectural choice:
 * primitives recolour with `var(--acc)`, weigh nothing, parallax in layers,
 * and — crucially — cannot drift in style the way a set of separately
 * generated images would.
 *
 * The visual language is THE WORKSHOP: near-black, warm amber light, blueprint
 * lines, deep shadow. No neon, no particles, no futuristic UI chrome.
 */

interface EnvironmentProps {
  type: VisualType;
}

function WorkshopDesk() {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Hanging bulb and its cord — the single light source. */}
      <line
        x1="280"
        y1="0"
        x2="280"
        y2="118"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.28"
      />
      <circle cx="280" cy="126" r="7" fill="currentColor" fillOpacity="0.85" />
      <circle cx="280" cy="126" r="26" fill="currentColor" fillOpacity="0.1" />

      {/* Light cone falling onto the desk. */}
      <path
        d="M280 130 L120 470 L440 470 Z"
        fill="currentColor"
        fillOpacity="0.045"
      />

      {/* Desk edge. */}
      <line
        x1="60"
        y1="470"
        x2="1140"
        y2="470"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.45"
      />
      <line
        x1="60"
        y1="476"
        x2="1140"
        y2="476"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.15"
      />

      {/* Desk legs. */}
      <line x1="150" y1="476" x2="150" y2="600" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="1050" y1="476" x2="1050" y2="600" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />

      {/* Scattered components: screws and small parts laid out in a row. */}
      <g fill="currentColor" fillOpacity="0.5">
        <circle cx="520" cy="462" r="2.5" />
        <circle cx="542" cy="462" r="2.5" />
        <circle cx="564" cy="462" r="2.5" />
        <circle cx="586" cy="462" r="2.5" />
      </g>

      {/* Screwdriver. */}
      <g stroke="currentColor" strokeOpacity="0.4" strokeWidth="2">
        <line x1="800" y1="458" x2="862" y2="446" />
      </g>
      <rect
        x="856"
        y="436"
        width="34"
        height="14"
        rx="3"
        transform="rotate(-11 856 436)"
        fill="currentColor"
        fillOpacity="0.35"
      />

      {/* Blueprint annotation ticks along the desk. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.22">
        <line x1="200" y1="470" x2="200" y2="486" />
        <line x1="400" y1="470" x2="400" y2="486" />
        <line x1="600" y1="470" x2="600" y2="486" />
        <line x1="800" y1="470" x2="800" y2="486" />
        <line x1="1000" y1="470" x2="1000" y2="486" />
      </g>
    </svg>
  );
}

function ClassroomTerminal({ reduced }: { reduced: boolean }) {
  const rows = [
    { y: 214, w: 210 },
    { y: 236, w: 300 },
    { y: 258, w: 168 },
    { y: 280, w: 262 },
    { y: 302, w: 128 },
  ];

  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* CRT monitor body. */}
      <rect
        x="420"
        y="170"
        width="380"
        height="270"
        rx="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
      {/* Screen bloom. */}
      <rect
        x="440"
        y="188"
        width="340"
        height="220"
        rx="4"
        fill="currentColor"
        fillOpacity="0.07"
      />

      {/* Code fragments — terminal lines. */}
      <g fill="currentColor">
        {rows.map((row, i) => (
          <rect
            key={row.y}
            x="462"
            y={row.y}
            width={row.w}
            height="5"
            rx="2.5"
            fillOpacity={0.28 + i * 0.06}
            style={
              reduced
                ? undefined
                : {
                    animation: `ap-drift ${5 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
                  }
            }
          />
        ))}
        {/* Blinking cursor block. */}
        <rect x="462" y="324" width="11" height="14" fillOpacity="0.8" />
      </g>

      {/* Monitor stand. */}
      <path
        d="M580 440 L580 470 L520 470 M620 470 L680 470"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.3"
      />
      <line x1="520" y1="470" x2="700" y2="470" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />

      {/* Desks receding into the dark — the classroom. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.12">
        <line x1="120" y1="520" x2="380" y2="520" />
        <line x1="820" y1="520" x2="1080" y2="520" />
        <line x1="60" y1="560" x2="420" y2="560" />
        <line x1="780" y1="560" x2="1140" y2="560" />
      </g>
    </svg>
  );
}

function PressureRoom({ reduced }: { reduced: boolean }) {
  const nodes = [
    { x: 250, y: 250 },
    { x: 380, y: 190 },
    { x: 430, y: 320 },
    { x: 830, y: 210 },
    { x: 910, y: 330 },
    { x: 760, y: 340 },
  ];

  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Overhead work-light cone. */}
      <path d="M600 0 L400 600 L800 600 Z" fill="currentColor" fillOpacity="0.035" />
      <circle cx="600" cy="18" r="5" fill="currentColor" fillOpacity="0.9" />

      {/* Team nodes and their connections — leadership, drawn as a network. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.22">
        <line x1="250" y1="250" x2="380" y2="190" />
        <line x1="380" y1="190" x2="430" y2="320" />
        <line x1="250" y1="250" x2="430" y2="320" />
        <line x1="830" y1="210" x2="910" y2="330" />
        <line x1="830" y1="210" x2="760" y2="340" />
        <line x1="760" y1="340" x2="910" y2="330" />
      </g>
      <g fill="currentColor">
        {nodes.map((node, i) => (
          <circle
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r="4"
            fillOpacity="0.7"
            style={
              reduced
                ? undefined
                : {
                    animation: `ap-drift ${6 + i}s ease-in-out ${i * 0.5}s infinite`,
                  }
            }
          />
        ))}
      </g>

      {/* Task board: three columns of cards. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" fill="none">
        <rect x="120" y="420" width="78" height="22" rx="2" />
        <rect x="120" y="450" width="78" height="22" rx="2" />
        <rect x="212" y="420" width="78" height="22" rx="2" />
        <rect x="304" y="420" width="78" height="22" rx="2" />
        <rect x="304" y="450" width="78" height="22" rx="2" />
        <rect x="304" y="480" width="78" height="22" rx="2" />
      </g>

      {/* Tables. */}
      <g stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.32">
        <line x1="820" y1="450" x2="1100" y2="450" />
        <line x1="860" y1="500" x2="1060" y2="500" />
      </g>
    </svg>
  );
}

function SystemBuild() {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Blueprint corner registration marks — the drawing-sheet motif. */}
      <g stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.3" fill="none">
        <path d="M60 110 L60 60 L110 60" />
        <path d="M1090 60 L1140 60 L1140 110" />
        <path d="M1140 490 L1140 540 L1090 540" />
        <path d="M110 540 L60 540 L60 490" />
      </g>

      {/* Dimension line across the sheet. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.18">
        <line x1="60" y1="86" x2="1140" y2="86" />
        <line x1="60" y1="80" x2="60" y2="92" />
        <line x1="1140" y1="80" x2="1140" y2="92" />
      </g>

      {/* Faint schema relationship lines at the base. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.14" fill="none">
        <path d="M180 470 L320 470 L320 430 L460 430" />
        <path d="M1020 470 L880 470 L880 430 L740 430" />
      </g>
      <g fill="currentColor" fillOpacity="0.35">
        <circle cx="180" cy="470" r="3" />
        <circle cx="1020" cy="470" r="3" />
        <circle cx="460" cy="430" r="3" />
        <circle cx="740" cy="430" r="3" />
      </g>
    </svg>
  );
}

const WORKSHOP_TYPES: VisualType[] = [
  "workshop-desk",
  "classroom-terminal",
  "pressure-room",
  "system-build",
];

const MEMORY_TYPES: VisualType[] = [
  "memory-room",
  "cricket-dusk",
  "pressure-press",
];

/**
 * Single entry point for every scene environment. Scenes ask for a
 * `visualType` and never need to know which world's module draws it, which
 * keeps `StoryScene` free of per-world branching.
 */
export function SceneEnvironment({ type }: EnvironmentProps) {
  const reduced = useReducedMotion();

  if (MEMORY_TYPES.includes(type)) {
    return <HumanEnvironment type={type} />;
  }

  if (!WORKSHOP_TYPES.includes(type)) {
    return <SideQuestEnvironment type={type} />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, #000 30%, transparent 88%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, #000 30%, transparent 88%)",
      }}
    >
      {type === "workshop-desk" ? <WorkshopDesk /> : null}
      {type === "classroom-terminal" ? (
        <ClassroomTerminal reduced={reduced} />
      ) : null}
      {type === "pressure-room" ? <PressureRoom reduced={reduced} /> : null}
      {type === "system-build" ? <SystemBuild /> : null}
    </div>
  );
}

export default SceneEnvironment;
