/**
 * EASTER EGGS — a tiny event bus.
 *
 * The architectural rule this file exists to enforce: components never own
 * hidden behaviour. They report an interaction (`trigger`) or subscribe to
 * discoveries (`subscribe`); all the state, thresholds and copy live here.
 * That keeps the eggs greppable in one place and stops them leaking into
 * scene logic.
 *
 * No egg ever gates content, blocks input, or steals focus.
 */

export type EggId = "king" | "room" | "sleep" | "konami";

export interface EggDefinition {
  id: EggId;
  /** Shown in the toast when discovered. */
  title: string;
  /** One or two lines, in the site's voice. */
  lines: string[];
  /** Interactions required before it fires. */
  threshold: number;
}

export const EGGS: Record<EggId, EggDefinition> = {
  king: {
    id: "king",
    title: "Chain",
    lines: ["okay, okay."],
    threshold: 4,
  },
  room: {
    id: "room",
    title: "Still reading",
    lines: ["I am here in the room.", "I am going to dominate the room."],
    threshold: 1,
  },
  sleep: {
    id: "sleep",
    title: "Professional sleeper",
    lines: ["he can sleep anywhere."],
    threshold: 1,
  },
  konami: {
    id: "konami",
    title: "Why not me",
    lines: ["confidence: temporarily unregulated."],
    threshold: 1,
  },
};

export interface EggEvent {
  id: EggId;
  definition: EggDefinition;
}

type Listener = (event: EggEvent) => void;

const listeners = new Set<Listener>();
const counts = new Map<EggId, number>();
const discovered = new Set<EggId>();

/** Subscribe to discoveries. Returns an unsubscribe function. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Report an interaction. Fires the egg once its threshold is met, and only
 * once per session — a repeated joke stops being one.
 */
export function trigger(id: EggId): void {
  if (discovered.has(id)) return;

  const definition = EGGS[id];
  if (!definition) return;

  const nextCount = (counts.get(id) ?? 0) + 1;
  counts.set(id, nextCount);
  if (nextCount < definition.threshold) return;

  discovered.add(id);
  listeners.forEach((listener) => listener({ id, definition }));
}

export function isDiscovered(id: EggId): boolean {
  return discovered.has(id);
}

export function discoveredCount(): number {
  return discovered.size;
}

export function totalEggs(): number {
  return Object.keys(EGGS).length;
}

/** Test/navigation helper. Not exposed in the UI. */
export function resetEggs(): void {
  counts.clear();
  discovered.clear();
}

/* ------------------------------------------------------------------------ */
/* Konami                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * "WHYNOTME" typed anywhere. Chosen over the arrow-key Konami code because
 * arrow keys are how a keyboard visitor scrolls, and stealing them would
 * break navigation to serve a joke.
 */
export const SECRET_WORD = "WHYNOTME";

export function createSecretMatcher(onMatch: () => void) {
  let buffer = "";

  return (key: string) => {
    if (key.length !== 1) return;
    buffer = (buffer + key.toUpperCase()).slice(-SECRET_WORD.length);
    if (buffer === SECRET_WORD) {
      buffer = "";
      onMatch();
    }
  };
}
