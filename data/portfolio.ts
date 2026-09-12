import {
  EDUCATION,
  EXPERIENCE,
  FACTS,
  LEADERSHIP,
  LINKS,
  PROFILE,
  PROJECTS,
  SKILLS,
  SUMMARY,
} from "@/data/resume";

/**
 * PORTFOLIO — the curation layer.
 *
 * `resume.ts` is the factual source of truth and is never contradicted here.
 * This file decides what gets shown, in what order, and with what framing.
 * Every value below is either imported from `resume.ts` or is presentational
 * language that makes no new factual claim.
 *
 * The separation matters: when the résumé changes, facts change in one place;
 * when the pitch changes, only this file moves.
 */

/* ------------------------------------------------------------------------ */
/* Q1 — WHO                                                                  */
/* ------------------------------------------------------------------------ */

export const IDENTITY = {
  name: PROFILE.name,
  /** Three words, not a job title. Titles live in EXPERIENCE. */
  descriptor: "Developer · Builder · Curious human",
  role: PROFILE.positioning,
  location: PROFILE.location,
  education: PROFILE.education,
  current: PROFILE.currentRole,
  summary: SUMMARY,
  /** The one line a recruiter should be able to repeat. */
  pitch:
    "I have already been the first engineer on a real product — Flutter on the front, Node and PostgreSQL behind it, and the architecture decisions in between.",
} as const;

/* ------------------------------------------------------------------------ */
/* Q2 — WHAT I BUILD                                                         */
/* ------------------------------------------------------------------------ */

export interface PortfolioProject {
  id: string;
  name: string;
  /** One line. What it is, not how impressive it is. */
  oneLiner: string;
  role: string;
  period?: string;
  tech: string[];
  href: string | null;
  hrefLabel: string;
  /**
   * Set when the project is not a shipped build — e.g. "Design". Rendered as
   * a badge so a specification is never mistaken for a working product.
   */
  stage?: string;
  /** Ordering weight — lower shows first. */
  priority: number;
  /** Hidden from the recruiter view until verified content arrives. */
  incomplete?: boolean;
}

const ZINGRO = EXPERIENCE.find((entry) => entry.company === "Zingro");
const DYOTIS = EXPERIENCE.find(
  (entry) => entry.company === "Dyotis Technologies",
);
const RECOVER_AI = PROJECTS.find((project) => project.name === "RecoverAI");
const SAFE_ROUTE = PROJECTS.find((project) => project.name === "SafeRoute");

/**
 * Ordered by what makes the strongest case, not chronology.
 *
 * BWH and VoiceFocus are included, each described at its ACTUAL stage —
 * verified by reading what exists on disk, not from memory:
 *
 *   BWH        a real React 19 / Vite 6 / TypeScript codebase with its own
 *              architecture docs. Described as a shipped frontend.
 *   VoiceFocus two design documents, no code. Described as a design, with
 *              `stage: "Design"` so it is never mistaken for a built app.
 *
 * A project shown at the wrong stage is worse than one left out, so the
 * distinction is explicit in the data rather than implied by wording.
 */
export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "zingro",
    name: "Zingro",
    oneLiner:
      "A product built from nothing — mobile app, API layer and database schema, with the architecture decisions owned end to end.",
    role: ZINGRO?.role ?? "Founding Engineer",
    period: ZINGRO ? `${ZINGRO.start} – ${ZINGRO.end}` : undefined,
    tech: ZINGRO?.stack ?? [],
    href: null,
    hrefLabel: "Private",
    priority: 1,
  },
  {
    id: "recoverai",
    name: "RecoverAI",
    oneLiner: `An AI revenue-recovery platform handling ${FACTS.recoverAiEvents} payment events, where a deterministic policy layer validates every automated action before it runs.`,
    role: "Built it",
    tech: RECOVER_AI?.stack ?? [],
    href: RECOVER_AI?.href ?? null,
    hrefLabel: RECOVER_AI?.hrefLabel ?? "Live Demo",
    priority: 2,
  },
  {
    id: "saferoute",
    name: "SafeRoute",
    oneLiner: `A Flutter navigation app over a FastAPI backend, comparing routes on travel time, distance and historical crime exposure across ${FACTS.safeRouteApiAreas} API areas.`,
    role: "Built it",
    tech: SAFE_ROUTE?.stack ?? [],
    href: SAFE_ROUTE?.href ?? null,
    hrefLabel: SAFE_ROUTE?.hrefLabel ?? "GitHub",
    priority: 3,
  },
  {
    // Verified against the codebase: package.json, ARCHITECTURE.md and
    // src/config/site.ts. Frontend-only by design, with the service layer
    // written as the single backend-swap seam.
    id: "bwh",
    name: "BWH — Build With Hardware",
    oneLiner:
      "An engineering ecosystem for learning hardware by building real products — Learn, Build, DIY Kits, Community. Every screen runs against a typed mock service layer designed as the single point where a backend swaps in.",
    role: "Started it · built it",
    tech: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "TanStack Query",
      "Zustand",
    ],
    href: null,
    hrefLabel: "Private",
    priority: 4,
  },
  {
    // Design documents only — no implementation exists. `stage` makes that
    // explicit rather than leaving a recruiter to assume it shipped.
    id: "voicefocus",
    name: "VoiceFocus",
    oneLiner:
      "A phone turned into a listening companion: detect the separate voices in a room, then isolate or boost the one you actually want to hear. Specified for on-device processing so it works offline and no audio leaves the phone.",
    role: "Concept & architecture · with two collaborators",
    stage: "Design",
    tech: ["Flutter", "Riverpod", "GoRouter", "On-device audio"],
    href: null,
    hrefLabel: "Design document",
    priority: 5,
  },
  {
    id: "dyotis",
    name: "Dyotis Technologies",
    oneLiner:
      "Cross-platform Flutter apps for Android and iOS — Firebase and REST integration, plus the debugging, testing and release workflow around production builds.",
    role: DYOTIS?.role ?? "App Developer & UI/UX Designer",
    period: DYOTIS ? `${DYOTIS.start} – ${DYOTIS.end}` : undefined,
    tech: DYOTIS?.stack ?? [],
    href: null,
    hrefLabel: "Internship",
    priority: 6,
  },
];

/** Only projects with real, showable content. */
export const VISIBLE_PROJECTS = PORTFOLIO_PROJECTS.filter(
  (project) => !project.incomplete,
).sort((a, b) => a.priority - b.priority);

/* ------------------------------------------------------------------------ */
/* Q3 — PROOF                                                                */
/* ------------------------------------------------------------------------ */

export interface ProofPoint {
  value: string;
  label: string;
  detail?: string;
}

/** Every figure below is imported from `resume.ts`. Nothing is estimated. */
export const PROOF: ProofPoint[] = [
  {
    value: FACTS.hackathons,
    label: "Hackathons",
    detail: `${FACTS.nationalFinals} national-level finalist placements`,
  },
  {
    value: FACTS.glugDevelopers,
    label: "Developers led",
    detail: "Technical Lead at GLUG",
  },
  {
    value: FACTS.hackNocturneParticipants,
    label: "Participants",
    detail: `HackNocturne, Lead Organizer across ${FACTS.hackNocturneEditions} editions`,
  },
  {
    value: FACTS.zingroWorkflows,
    label: "Core workflows shipped",
    detail: "Auth, subscriptions, cart, checkout, order management",
  },
  {
    value: FACTS.droneClubTeam,
    label: "Drone Club team",
    detail: "Business & Marketing Head, preparing for NIDAR 2027",
  },
  {
    value: EDUCATION.grade.replace("CGPA: ", ""),
    label: "CGPA",
    detail: `${EDUCATION.degree}, ${EDUCATION.period}`,
  },
];

export const PROOF_LEADERSHIP = LEADERSHIP;

/* ------------------------------------------------------------------------ */
/* Q4 — HOW I THINK                                                          */
/* ------------------------------------------------------------------------ */

export interface ThinkingStep {
  id: string;
  label: string;
  detail: string;
}

/**
 * The recruiter-facing compression of "Take it apart" — the same philosophy
 * the story world demonstrates through interaction, stated plainly here
 * because a recruiter with two minutes will not explode a diagram.
 */
export const THINKING: ThinkingStep[] = [
  {
    id: "problem",
    label: "Problem",
    detail: "Start with the thing that is actually broken, not the symptom.",
  },
  {
    id: "break",
    label: "Break it down",
    detail: "Separate it into layers until each one is small enough to be wrong about safely.",
  },
  {
    id: "understand",
    label: "Understand",
    detail: "Learn why it was built that way before deciding it was built badly.",
  },
  {
    id: "build",
    label: "Build",
    detail: "Design for the version that exists in six months, not the demo.",
  },
  {
    id: "iterate",
    label: "Iterate",
    detail: "Ship, watch it fail somewhere, fix that. Repeat.",
  },
];

/* ------------------------------------------------------------------------ */
/* Q5 — CONTACT                                                              */
/* ------------------------------------------------------------------------ */

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
  external: boolean;
  primary?: boolean;
}

/** Only links that exist in `resume.ts`. Nothing fabricated. */
export const CONTACT_LINKS: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    value: PROFILE.email,
    href: LINKS.email,
    external: false,
    primary: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/ankur2612",
    href: LINKS.github,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/ankur1226",
    href: LINKS.linkedin,
    external: true,
  },
  {
    id: "leetcode",
    label: "LeetCode",
    value: "leetcode.com/u/ap_2612",
    href: LINKS.leetcode,
    external: true,
  },
  {
    id: "resume",
    label: "Résumé",
    value: "PDF",
    href: LINKS.resume,
    external: false,
  },
];

export const SKILL_GROUPS = SKILLS;
export const EDUCATION_ENTRY = EDUCATION;
export const EXPERIENCE_ENTRIES = EXPERIENCE;

/* ------------------------------------------------------------------------ */
/* INTERNAL — content still awaiting verification                            */
/* ------------------------------------------------------------------------ */

/**
 * Not rendered anywhere in the public experience. This is the working list of
 * content Ankur still needs to supply; it exists here so the gap is tracked in
 * code rather than in a chat log.
 */
export const PENDING_WORK = [
  {
    id: "project-links",
    what: "RecoverAI live demo, SafeRoute GitHub",
    why: "Both render without a button until a verified URL exists.",
    need: "Working URLs.",
  },
] as const;
