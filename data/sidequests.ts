import { FACTS } from "@/data/resume";
import type { SceneConfig, TravelPlace, QuestCard } from "@/lib/types";

/**
 * WORLD 03 — SIDE QUESTS
 *
 * Content rules:
 *  1. No fabricated memories, dates or counts. Places are listed because
 *     Ankur listed them; none carries an invented anecdote.
 *  2. No copyrighted lyrics, ever. The notebook line is Ankur's own joke
 *     about himself.
 *  3. Anything awaiting verified detail is `placeholder: true` and greppable.
 */

/* ------------------------------------------------------------------------ */
/* S1 — Travel log                                                           */
/* ------------------------------------------------------------------------ */

/**
 * Coordinates are percentages within the stylised India silhouette's
 * viewBox — deliberately approximate placements on an illustrated map, not
 * GIS data. Order is roughly north → south so the trace reads as a journey.
 */
export const TRAVEL_PLACES: TravelPlace[] = [
  { id: "hp", name: "Himachal Pradesh", x: 31.5, y: 14.5, note: null },
  { id: "pb", name: "Punjab", x: 27.5, y: 18.5, note: null },
  { id: "dl", name: "Delhi", x: 30.5, y: 23.0, note: null },
  { id: "uk", name: "Uttarakhand", x: 35.5, y: 19.5, note: null },
  {
    id: "up",
    name: "Uttar Pradesh",
    x: 38.5,
    y: 27.5,
    note: "Home. Ghazipur, near Banaras.",
  },
  { id: "br", name: "Bihar", x: 47.0, y: 30.5, note: null },
  { id: "mp", name: "Madhya Pradesh", x: 34.0, y: 38.0, note: null },
  { id: "mh", name: "Maharashtra", x: 28.5, y: 50.0, note: null },
  { id: "ga", name: "Goa", x: 26.5, y: 60.5, note: null },
  { id: "tg", name: "Telangana", x: 35.0, y: 55.0, note: null },
  {
    id: "ka",
    name: "Karnataka",
    x: 30.0,
    y: 65.0,
    note: "Currently here. Bengaluru.",
  },
  { id: "ap", name: "Andhra Pradesh", x: 37.0, y: 62.0, note: null },
  { id: "tn", name: "Tamil Nadu", x: 33.0, y: 76.0, note: null },
];

/* ------------------------------------------------------------------------ */
/* S2 — Music                                                                */
/* ------------------------------------------------------------------------ */

export const ARTISTS = ["Raftaar", "KR$NA", "Karma"] as const;
export const SEEN_LIVE = ["Raftaar", "Seedhe Maut", "KR$NA"] as const;

/**
 * Deliberately NOT real lyrics. These are abstract fragments standing in for
 * the shape of a verse — the joke works on pacing, not on words, and this
 * keeps the site permanently clear of any copyright question.
 */
export const NOTEBOOK_FRAGMENTS = [
  "— — — —— — —",
  "—— — — ——",
  "— —— — — —",
] as const;

/* ------------------------------------------------------------------------ */
/* S3 — Quest cards                                                          */
/* ------------------------------------------------------------------------ */

export const QUEST_CARDS: QuestCard[] = [
  {
    id: "hills",
    label: "Challenge",
    title: "Ran up the hill",
    description:
      "Normal people hike. I apparently decided to run. No reason. It seemed like a good idea at the time.",
  },
  {
    id: "glug",
    label: "Community",
    title: "Technical Lead, GLUG",
    description: `Leading ${FACTS.glugDevelopers} developers across technical projects and initiatives.`,
  },
  {
    id: "hacknocturne",
    label: "Started it",
    title: "HackNocturne",
    description: `Lead Organizer across ${FACTS.hackNocturneEditions} editions — technical operations and coordination for ${FACTS.hackNocturneParticipants} participants.`,
  },
  {
    id: "drone",
    label: "Started it",
    title: "Drone Club, Sir MVIT",
    description: `Business and Marketing Head, leading a ${FACTS.droneClubTeam}-member team preparing for NIDAR 2027.`,
  },
  {
    id: "hackathons",
    label: "Competing",
    title: `${FACTS.hackathons} hackathons`,
    description: `Finalist placements in ${FACTS.nationalFinals} national-level hackathons. Most of the rest, we didn't win.`,
  },
  {
    id: "gaming",
    label: "1 a.m.",
    title: "Free Fire · Clash of Clans · Clash Royale",
    description:
      "My competitiveness needed somewhere to go when everything else was closed.",
  },
  {
    /*
     * BWH is named because Ankur named it. Nothing beyond the name and the
     * fact that he started it is verified, so nothing beyond that is stated.
     * The card reads as deliberately terse rather than as broken, and it is
     * excluded from Quick Mode entirely — a recruiter should not meet a
     * project with no description. See PENDING_WORK in data/portfolio.ts.
     */
    id: "bwh",
    label: "Started it",
    title: "BWH — Build With Hardware",
    description: "Another one I started. Write-up pending.",
    placeholder: true,
  },
  {
    id: "people",
    label: "Ongoing",
    title: "Interesting people",
    description:
      "The most reliable reason to leave the room. Most of what I've started began as a conversation with someone.",
  },
];

/* ------------------------------------------------------------------------ */
/* Scenes                                                                    */
/* ------------------------------------------------------------------------ */

export const S1: SceneConfig = {
  id: "s1",
  world: "sidequest",
  order: 1,
  eyebrow: "Travel log",
  title: "The map",
  description: "I've spent a lot of time outside the room.",
  body: [
    "Mostly by train, mostly badly planned. The list grows; this is where it is so far.",
  ],
  visualType: "india-map",
  accent: "sidequest",
  accentOverride: "#22D3EE",
  interaction: "tap-reveal",
  density: "high",
};

export const S2: SceneConfig = {
  id: "s2",
  world: "sidequest",
  order: 2,
  eyebrow: "Rap · hip-hop · a notebook",
  title: "Music & chaos",
  description:
    "Raftaar. KR$NA. Karma. Most of what got built was built with one of them playing.",
  body: [
    "I've seen Raftaar, Seedhe Maut and KR$NA live. I was extremely normal about all three.",
    "I don't rap. But I write. The last one was in Hinglish, heavily lyrical, mostly about claiming territory. I haven't written anything in months.",
  ],
  visualType: "studio-desk",
  accent: "sidequest",
  accentOverride: "#F5C518",
  interaction: "tap-reveal",
  density: "medium",
};

export const S3: SceneConfig = {
  id: "s3",
  world: "sidequest",
  order: 3,
  eyebrow: "Everything else",
  title: "Side quests",
  description:
    "Career is the main quest. This is the rest of the log.",
  body: ["Not all of them made it. I keep starting things anyway."],
  visualType: "quest-board",
  accent: "sidequest",
  accentOverride: "#A78BFA",
  interaction: "tap-reveal",
  density: "high",
};

export const SIDEQUEST_SCENES: SceneConfig[] = [S1, S2, S3];
