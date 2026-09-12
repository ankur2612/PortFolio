import type { SceneConfig } from "@/lib/types";

/**
 * WORLD 02 — THINGS THAT BUILT ME
 *
 * Content rules for this file:
 *  1. Nothing professional is claimed here that is not in `resume.ts`.
 *  2. Nothing personal is stated that Ankur has not stated himself.
 *  3. Restraint over drama. H3 in particular refuses to extract a moral from
 *     real loss — that refusal is what separates sincerity from the
 *     motivational-poster register.
 */

export const H1: SceneConfig = {
  id: "h1",
  world: "human",
  order: 1,
  eyebrow: "Ghazipur, Uttar Pradesh",
  title: "Where it started",
  description:
    "My father teaches. My mother runs our home. My sister is still studying.",
  body: [
    "I became the one people handed broken things to.",
    "Before any of that, there were cows. We were close.",
  ],
  quote:
    "I didn't grow up around engineers. I grew up wanting to understand things.",
  visualType: "memory-room",
  accent: "human",
  interaction: "explode",
  density: "low",
  explode: {
    id: "h1-becoming",
    title: "How it went",
    subtitle: "Four objects, in order",
    cta: "Take it apart",
    mode: "stack",
    spacing: 92,
    layers: [
      {
        id: "cows",
        label: "01",
        title: "Cows",
        description:
          "The first things I spent real time with. Ghazipur before it was a story about engineering.",
      },
      {
        id: "phone",
        label: "02",
        title: "A broken phone",
        description:
          "Someone's, not mine. It was already broken, which I decided made it fair game.",
      },
      {
        id: "laptop",
        label: "03",
        title: "A laptop",
        description:
          "Class 6 or 7. Considerably more expensive to be wrong about. I opened it anyway.",
      },
      {
        id: "code",
        label: "04",
        title: "Code",
        description:
          "The first thing I took apart that could not be physically opened. It has held my attention the longest.",
        variant: "terminal",
      },
    ],
  },
};

export const H2: SceneConfig = {
  id: "h2",
  world: "human",
  order: 2,
  eyebrow: "The other thing I was good at",
  title: "The game I left",
  description:
    "Cricket was most of my childhood. I was competitive about it in a way I have only been competitive about a few things since.",
  body: [
    "Injuries ended it. I don't have a lesson about that part — it was just a thing I loved that stopped.",
    "What didn't stop was the wanting-to-win. It needed somewhere else to go, and eventually it found one.",
  ],
  quote: "I didn't stop being competitive. I just changed the game.",
  visualType: "cricket-dusk",
  accent: "human",
  interaction: "reveal",
  density: "low",
};

export const H3: SceneConfig = {
  id: "h3",
  world: "human",
  order: 3,
  eyebrow: "The year the reason changed",
  title: "Pressure makes diamonds",
  description:
    "My grandfather passed away. Around the same time things at home became financially very hard.",
  body: [
    "Class 12 boards, JEE, the entrance exams. I had always been the strong student. I scored well below what I expected, and I didn't qualify.",
    "I'm not going to turn any of that into a story about how impressive I am.",
    "But it did change something. Before, I wanted to do well. After, I needed to build something that lasted.",
  ],
  quote:
    "Some moments don't change your plans. They change the reason behind them.",
  visualType: "pressure-press",
  accent: "human",
  interaction: "none",
  /*
   * The only `still` scene on the site. No entrance animation, no
   * interaction — the visitor arrives and the words are simply there.
   * Everything else in the project moves; this one does not, and that is
   * what makes it land.
   */
  density: "still",
};

export const HUMAN_SCENES: SceneConfig[] = [H1, H2, H3];
