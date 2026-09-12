"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { VisualType } from "@/lib/types";

/**
 * HumanEnvironment — WORLD 02, "MEMORY".
 *
 * The whole point of this world is that it moves less than Builder. Where the
 * workshop has lights, nodes, countdowns and drifting fragments, memory has a
 * horizon, a doorway, and dust. After the density of World 01 this stillness
 * should feel like exhaling — that contrast IS the storytelling, so the
 * restraint here is deliberate, not unfinished.
 *
 * Same construction rules as the workshop: 2–4 vector primitives, recoloured
 * by var(--acc), no raster art, nothing that can drift in style.
 */

interface EnvironmentProps {
  type: VisualType;
}

/* ------------------------------------------------------------------------ */
/* H1 — MEMORY ROOM                                                          */
/* A house with one lit window, a field, a low horizon, two cows.            */
/* ------------------------------------------------------------------------ */

function MemoryRoom({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Low horizon — the defining line of this world. */}
      <line
        x1="0"
        y1="430"
        x2="1200"
        y2="430"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.42"
      />

      {/* Field strokes receding toward the horizon. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.14">
        <line x1="0" y1="470" x2="1200" y2="470" />
        <line x1="0" y1="516" x2="1200" y2="516" />
        <line x1="0" y1="572" x2="1200" y2="572" />
      </g>

      {/* The house: a simple gable with one lit window. */}
      <g stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5" fill="none">
        <path d="M820 430 L820 330 L890 288 L960 330 L960 430" />
        <path d="M806 336 L890 286 L974 336" />
      </g>
      {/* Window light — the single warm source of this scene. */}
      <rect
        x="866"
        y="350"
        width="30"
        height="26"
        fill="currentColor"
        fillOpacity="0.75"
      />
      <rect
        x="856"
        y="340"
        width="50"
        height="46"
        fill="currentColor"
        fillOpacity="0.09"
      />
      {/* Light spilling onto the ground. */}
      <path
        d="M866 376 L836 430 L926 430 L896 376 Z"
        fill="currentColor"
        fillOpacity="0.05"
      />
      {/* Doorway. */}
      <rect
        x="904"
        y="392"
        width="22"
        height="38"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        fill="none"
      />

      {/* Two cows, drawn as the simplest readable forms. */}
      <g stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.45" fill="none">
        {/* body */}
        <path d="M232 420 L232 398 Q232 388 246 388 L296 388 Q310 388 310 398 L310 420" />
        <path d="M310 396 L326 386 L332 394 L324 400 Z" />
        <line x1="246" y1="420" x2="246" y2="430" />
        <line x1="296" y1="420" x2="296" y2="430" />
        <path d="M232 400 L220 392" />
      </g>
      <g stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" fill="none">
        <path d="M368 424 L368 408 Q368 400 379 400 L417 400 Q428 400 428 408 L428 424" />
        <path d="M428 406 L440 399 L444 405 L438 410 Z" />
        <line x1="379" y1="424" x2="379" y2="430" />
        <line x1="417" y1="424" x2="417" y2="430" />
      </g>

      {/* Dust in the last of the light. Twelve motes, slow drift. */}
      <g fill="currentColor">
        {[
          [150, 300],
          [290, 250],
          [430, 320],
          [560, 220],
          [640, 350],
          [700, 190],
          [1020, 260],
          [1090, 340],
          [1130, 210],
          [510, 380],
          [980, 400],
          [80, 380],
        ].map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="1.8"
            fillOpacity={0.22 + (i % 4) * 0.08}
            style={
              reduced
                ? undefined
                : {
                    animation: `ap-drift ${9 + (i % 5) * 1.7}s ease-in-out ${i * 0.7}s infinite`,
                  }
            }
          />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* H2 — CRICKET AT DUSK                                                      */
/* A ground, a crease, stumps, and a ball that becomes a cursor.             */
/* ------------------------------------------------------------------------ */

function CricketDusk({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Ground ellipse, seen low and wide. */}
      <ellipse
        cx="600"
        cy="470"
        rx="620"
        ry="130"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.25"
      />

      {/* The pitch, in perspective. */}
      <path
        d="M498 520 L556 372 L644 372 L702 520 Z"
        fill="currentColor"
        fillOpacity="0.035"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Crease markings. */}
      <g stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45">
        <line x1="516" y1="476" x2="684" y2="476" />
        <line x1="548" y1="396" x2="652" y2="396" />
      </g>

      {/* Stumps at the far end. */}
      <g stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.6">
        <line x1="588" y1="372" x2="588" y2="346" />
        <line x1="600" y1="372" x2="600" y2="346" />
        <line x1="612" y1="372" x2="612" y2="346" />
        <line x1="586" y1="346" x2="614" y2="346" />
      </g>

      {/*
        The ball's arc, drawn as a dotted trajectory that ends in a node.
        This is the scene's thesis rendered as geometry: the same object,
        travelling the same line, arriving as something else.
      */}
      <path
        d="M600 380 Q760 300 930 330"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.35"
        strokeDasharray="3 9"
      />

      {/* Ball — leaving. */}
      <circle cx="600" cy="380" r="6" fill="currentColor" fillOpacity="0.5" />
      <path
        d="M594 377 Q600 381 606 377"
        fill="none"
        stroke="var(--color-void)"
        strokeWidth="1"
        strokeOpacity="0.6"
      />

      {/* The node it becomes — a cursor / connection point. */}
      <g
        style={
          reduced
            ? undefined
            : { animation: "ap-drift 7s ease-in-out infinite" }
        }
      >
        <circle cx="930" cy="330" r="26" fill="currentColor" fillOpacity="0.07" />
        <circle cx="930" cy="330" r="5.5" fill="currentColor" fillOpacity="0.95" />
        <g stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.5">
          <line x1="930" y1="298" x2="930" y2="312" />
          <line x1="930" y1="348" x2="930" y2="362" />
          <line x1="898" y1="330" x2="912" y2="330" />
          <line x1="948" y1="330" x2="962" y2="330" />
        </g>
      </g>

      {/* Far boundary and floodlight haze, kept very faint. */}
      <line
        x1="0"
        y1="340"
        x2="1200"
        y2="340"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.1"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* H3 — THE PRESS                                                            */
/* An abstract mechanical press. Rough material becomes a faceted solid.     */
/* ------------------------------------------------------------------------ */

function PressurePress() {
  return (
    <svg
      viewBox="0 0 1200 600"
      // Anchored right: H3 has no side column, so the copy runs wide on the
      // left and the mechanism must live clear of it rather than behind it.
      preserveAspectRatio="xMaxYMid slice"
      className="absolute inset-0 h-full w-full"
      style={{ color: "var(--acc)" }}
      aria-hidden="true"
    >
      {/* Upper platen and its guide columns. */}
      <g stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.4" fill="none">
        <rect x="470" y="176" width="260" height="26" />
        <line x1="504" y1="176" x2="504" y2="96" />
        <line x1="696" y1="176" x2="696" y2="96" />
        <rect x="470" y="70" width="260" height="26" />
      </g>

      {/* Force arrows — pressure, stated once, mechanically. */}
      <g stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.55">
        <line x1="560" y1="118" x2="560" y2="164" />
        <path d="M554 156 L560 166 L566 156" fill="none" />
        <line x1="640" y1="118" x2="640" y2="164" />
        <path d="M634 156 L640 166 L646 156" fill="none" />
      </g>

      {/* Lower platen / bed. */}
      <g stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.4" fill="none">
        <rect x="470" y="392" width="260" height="26" />
        <line x1="470" y1="418" x2="450" y2="470" />
        <line x1="730" y1="418" x2="750" y2="470" />
        <line x1="430" y1="470" x2="770" y2="470" />
      </g>

      {/* The material, mid-transformation: rough on the left edge,
          faceted and resolved on the right. One object, two states. */}
      <g>
        {/* rough mass */}
        <path
          d="M536 392 L524 340 L548 300 L580 288 L600 300 L600 392 Z"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeOpacity="0.35"
        />
        {/* faceted solid */}
        <g stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.75" fill="none">
          <path d="M600 300 L640 288 L672 320 L636 392 L600 392 Z" />
          <path d="M600 300 L636 392" />
          <path d="M640 288 L636 392" />
          <path d="M672 320 L600 300" />
        </g>
        <path
          d="M600 300 L640 288 L672 320 L636 392 L600 392 Z"
          fill="currentColor"
          fillOpacity="0.1"
        />
      </g>

      {/* Pressure ticks along both platens — a gauge, not a decoration. */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.2">
        {[490, 530, 570, 610, 650, 690].map((x) => (
          <line key={x} x1={x} y1="202" x2={x} y2="214" />
        ))}
        {[490, 530, 570, 610, 650, 690].map((x) => (
          <line key={`b-${x}`} x1={x} y1="380" x2={x} y2="392" />
        ))}
      </g>

      {/* Faint light gathering at the resolved side. */}
      <circle cx="648" cy="340" r="60" fill="currentColor" fillOpacity="0.04" />
    </svg>
  );
}

/*
 * Memory art must never compete with the copy. Two mask strategies:
 *
 *  - Scenes with a continuous horizon fade in from the top, so the horizon
 *    line sits below the body text rather than striking through it.
 *  - The press, which has no side column beside it, additionally fades out
 *    on the left so the wide copy column stays clean.
 */
const HORIZON_MASK =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.22) 46%, #000 72%, #000 100%)";

const RIGHT_WEIGHTED_MASK =
  "linear-gradient(to right, transparent 0%, transparent 34%, rgba(0,0,0,0.55) 52%, #000 72%)";

export function HumanEnvironment({ type }: EnvironmentProps) {
  const reduced = useReducedMotion();
  const mask = type === "pressure-press" ? RIGHT_WEIGHTED_MASK : HORIZON_MASK;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {type === "memory-room" ? <MemoryRoom reduced={reduced} /> : null}
      {type === "cricket-dusk" ? <CricketDusk reduced={reduced} /> : null}
      {type === "pressure-press" ? <PressurePress /> : null}
    </div>
  );
}

export default HumanEnvironment;
