import { FACTS } from "@/data/resume";
import { HUMAN_SCENES } from "@/data/human";
import { SIDEQUEST_SCENES } from "@/data/sidequests";
import type { SceneConfig, WorldConfig } from "@/lib/types";

/**
 * Scene configuration.
 *
 * All story content lives here. Components read configs — they never hold
 * copy. Two rules govern this file:
 *
 *  1. Every professional claim (title, date, metric, stack) is imported from
 *     `resume.ts`. Nothing verifiable is retyped inline.
 *  2. Every claim here is traceable to `resume.ts` or to source code that was
 *     read directly. Nothing is stated that could not be shown.
 */

/* ======================================================================== */
/* WORLD 01 — THINGS I BUILT                                                */
/* ======================================================================== */

const B1: SceneConfig = {
  id: "b1",
  world: "builder",
  order: 1,
  eyebrow: "Ghazipur · around 2014",
  title: "The builder existed before the developer",
  description:
    "Nobody in my family was an engineer. I was the one who fixed things.",
  body: [
    "Phones first. Then laptops, around class 6 or 7 — usually ones already broken, which made them fair game.",
  ],
  quote: "I took things apart long before anyone called it engineering.",
  visualType: "workshop-desk",
  accent: "builder",
  interaction: "explode",
  density: "medium",
  explode: {
    id: "b1-phone",
    title: "The phone",
    subtitle: "Exhibit A · disassembled, mostly reassembled",
    cta: "Take it apart",
    mode: "stack",
    layers: [
      {
        id: "glass",
        label: "01",
        title: "Glass",
        description:
          "The part everyone sees. Also the part that convinced me the rest could be opened.",
      },
      {
        id: "screen",
        label: "02",
        title: "Display",
        description:
          "Ribbon cables taught me that everything connects to something else, and in one order only.",
      },
      {
        id: "battery",
        label: "03",
        title: "Battery",
        description:
          "The first component I understood as a system constraint rather than a part.",
      },
      {
        id: "board",
        label: "04",
        title: "Logic board",
        description:
          "I did not understand it. I kept opening it anyway. That instinct never went away.",
      },
      {
        id: "broke",
        label: "05",
        title: "The part I broke",
        description:
          "There was always one. Learning what it cost to be wrong is why I now design for being wrong.",
        variant: "terminal",
      },
    ],
  },
};

const B2: SceneConfig = {
  id: "b2",
  world: "builder",
  order: 2,
  eyebrow: "Class 9 → class 11",
  title: "Why not me?",
  description:
    "Before class 9 I was weak at computers. Then one teacher sat with me, and the subject stopped being a wall.",
  body: [
    "After that I was one of the strongest computer science students in my school — same brain, different teacher.",
    "Then a regional inter-school coding competition. I won it.",
    "That was the first time the thought arrived properly: why not me?",
  ],
  quote: "Winning once is not proof. It is permission.",
  facts: [
    { label: "Competition", value: "Regional inter-school" },
    { label: "Result", value: "Winner" },
  ],
  visualType: "classroom-terminal",
  accent: "builder",
  interaction: "reveal",
  density: "medium",
};

const B3: SceneConfig = {
  id: "b3",
  world: "builder",
  order: 3,
  eyebrow: "Hackathons · teams · deadlines",
  title: "Under pressure",
  description:
    "Most of them we did not win. You still learn more in thirty-six hours than in a semester — that is not a slogan, it is arithmetic.",
  body: [
    "I build better with a clock running. I do not fully know why, and I have stopped interrogating it.",
    "The other half of pressure is people. The thing that actually frustrates me is someone not doing the part they said they would do. Most of what I know about leading is downstream of that.",
  ],
  facts: [
    { label: "Hackathons", value: FACTS.hackathons },
    { label: "National finalist", value: FACTS.nationalFinals },
    { label: "Developers led · GLUG", value: FACTS.glugDevelopers },
    { label: "HackNocturne editions", value: FACTS.hackNocturneEditions },
    { label: "Participants", value: FACTS.hackNocturneParticipants },
    { label: "Drone Club team", value: FACTS.droneClubTeam },
  ],
  visualType: "pressure-room",
  accent: "builder",
  interaction: "reveal",
  density: "high",
};

const B4: SceneConfig = {
  id: "b4",
  world: "builder",
  order: 4,
  eyebrow: "May 2026 · founding engineer",
  title: "Zingro",
  description:
    "Built from scratch. Mobile, API architecture, database design — and the product calls in between.",
  body: [
    `${FACTS.zingroWorkflows} core workflows: authentication, subscriptions, cart, checkout, order management.`,
    "The hardest part was never the app. It was designing a backend that would not need rebuilding in six months.",
  ],
  quote: "May 2026. Nothing here.",
  visualType: "system-build",
  accent: "builder",
  interaction: "explode",
  density: "high",
  explode: {
    id: "b4-zingro",
    title: "Zingro",
    subtitle: "Founding engineer · built from scratch",
    cta: "Take it apart",
    mode: "stack",
    spacing: 104,
    layers: [
      {
        id: "product",
        label: "01",
        title: "Product",
        description:
          "Five core workflows a person actually moves through: authentication, subscriptions, cart, checkout, order management.",
        technology: ["Flutter"],
      },
      {
        id: "state",
        label: "02",
        title: "Application / State",
        description:
          "Riverpod holding every workflow's state, so the UI stays a function of data rather than a pile of local flags.",
        technology: ["Flutter", "Riverpod"],
      },
      {
        id: "api",
        label: "03",
        title: "API",
        description:
          "Express over Node — the contract between what the app asks for and what the data can promise.",
        technology: ["Node.js", "Express.js"],
      },
      {
        id: "database",
        label: "04",
        title: "Database",
        description:
          "A PostgreSQL schema designed around the real product workflow, so it would not need rebuilding in six months.",
        technology: ["PostgreSQL"],
      },
      {
        /*
         * Written from the actual Zingro source, not from memory. Each line
         * below is evidenced in code:
         *
         *   lib/core/providers/repository_providers.dart  — mock/API swap
         *   lib/core/config/app_environment.dart          — release guard
         *   lib/core/network/interceptors.dart            — refresh + retry
         *   lib/core/network/dio_error_mapper.dart        — typed errors
         *   lib/core/services/token_store.dart            — secure storage
         */
        id: "decisions",
        label: "05",
        title: "The thinking",
        description:
          "Every repository has a mock and an API implementation behind one interface, chosen at runtime from a single base-URL flag — so the whole app was built and demoed before a backend existed, and no screen changed when one arrived. Release builds refuse to fall back to a mock rather than quietly shipping fake payments. A 401 triggers one shared token refresh and retries the request once, so a queue of parallel calls cannot fire a refresh storm or dump the user to the login screen mid-order. And every transport failure is mapped to a typed error before the UI sees it — a DNS mistake and a TLS rejection no longer both tell the customer they are offline.",
        technology: ["Riverpod", "Dio", "Secure Storage"],
        variant: "terminal",
      },
    ],
  },
};

/* ======================================================================== */
/* WORLDS                                                                    */
/* ======================================================================== */

export const BUILDER_WORLD: WorldConfig = {
  id: "builder",
  index: "01",
  name: "Builder",
  eyebrow: "World 01 / Things I Built",
  description:
    "The work, in the order it actually happened — from a disassembled phone to a product built from nothing.",
  accent: "builder",
  available: true,
  scenes: [B1, B2, B3, B4],
};

export const HUMAN_WORLD: WorldConfig = {
  id: "human",
  index: "02",
  name: "Human",
  eyebrow: "World 02 / Things That Built Me",
  description:
    "Ghazipur, a game that ended, and the year the reason behind everything changed.",
  accent: "human",
  available: true,
  scenes: HUMAN_SCENES,
};

export const SIDEQUEST_WORLD: WorldConfig = {
  id: "sidequest",
  index: "03",
  name: "Side Quests",
  eyebrow: "World 03 / Everything Else",
  description:
    "Maps, rap notebooks, hills taken at a run, and a long list of things started.",
  accent: "sidequest",
  available: true,
  scenes: SIDEQUEST_SCENES,
};

export const WORLDS: WorldConfig[] = [
  BUILDER_WORLD,
  HUMAN_WORLD,
  SIDEQUEST_WORLD,
];

export const BUILDER_SCENES = BUILDER_WORLD.scenes;

/** Every scene across every world, in narrative order. */
export const ALL_SCENES: SceneConfig[] = WORLDS.flatMap(
  (world) => world.scenes,
);

export function getWorld(id: WorldConfig["id"]) {
  return WORLDS.find((world) => world.id === id);
}
