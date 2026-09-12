/**
 * SINGLE SOURCE OF TRUTH for every professional claim on this site.
 *
 * Story Mode and Quick Mode both read from here. Nothing professional —
 * a title, a date, a number, a stack item, a link — may be typed inline in a
 * component. This is what makes it structurally impossible for the two modes
 * to disagree with each other or with the résumé PDF.
 */

export const PROFILE = {
  name: "Ankur Pathak",
  /** The role, not an adjective. This is the 10-second read. */
  positioning: "First engineer. Flutter + Node.",
  location: "Bengaluru, India",
  education: "B.E. CSE '27",
  currentRole: "Founding Engineer at Zingro",
  phone: "+91 90269 24912",
  email: "officialap26@gmail.com",
  tagline: "Take it apart.",
  statement: [
    "I take things apart",
    "until I understand them.",
    "Then I build them better.",
  ],
} as const;

export const LINKS = {
  github: "https://github.com/ankur2612",
  linkedin: "https://linkedin.com/in/ankur1226",
  leetcode: "https://leetcode.com/u/ap_2612",
  email: `mailto:${PROFILE.email}`,
  resume: "/resume.pdf",
} as const;

export const SUMMARY =
  "Computer Science undergraduate and software developer with hands-on experience building mobile and full-stack products from scratch. Founding-engineer experience across Flutter, Riverpod, Node.js, and PostgreSQL, spanning API architecture, database design, and end-to-end feature delivery.";

export interface ExperienceEntry {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  bullets: string[];
  stack: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "Zingro",
    role: "Founding Engineer",
    start: "May 2026",
    end: "August 2026",
    location: "Bengaluru, India",
    bullets: [
      "Built Zingro from scratch, owning end-to-end engineering across mobile development, backend integration, API architecture, database design, and technical product decisions.",
      "Engineered 5+ core workflows — authentication, subscriptions, cart, checkout, and order management — using Flutter and Riverpod over a Node.js, Express.js, and PostgreSQL backend.",
    ],
    stack: ["Flutter", "Riverpod", "Node.js", "Express.js", "PostgreSQL"],
  },
  {
    company: "Dyotis Technologies",
    role: "App Developer & UI/UX Designer",
    start: "February 2026",
    end: "April 2026",
    location: "Bengaluru, India",
    bullets: [
      "Developed cross-platform Flutter applications for Android and iOS, integrating Firebase services and REST APIs with responsive UI across multiple device form factors.",
      "Implemented debugging, testing, and release workflows and contributed to code reviews, improving stability and maintainability of production builds.",
    ],
    stack: ["Flutter", "Firebase", "REST APIs", "Figma"],
  },
];

export interface ProjectEntry {
  name: string;
  stack: string[];
  bullets: string[];
  /** Null until the live URL is verified — a dead button is worse than none. */
  href: string | null;
  hrefLabel: string;
}

export const PROJECTS: ProjectEntry[] = [
  {
    name: "RecoverAI",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Razorpay APIs"],
    bullets: [
      "Built an AI-powered revenue recovery platform handling 500–1,000 payment events, using React, TypeScript, Node.js, PostgreSQL, and Razorpay API integrations.",
      "Architected a 4-stage execution pipeline — AI recommendation, deterministic policy validation, action execution, and audit tracking — keeping every automated action validated and auditable.",
    ],
    href: null,
    hrefLabel: "Live Demo",
  },
  {
    name: "SafeRoute",
    stack: ["Flutter", "FastAPI", "Provider", "Geolocation", "OpenStreetMap"],
    bullets: [
      "Built a Flutter navigation application consuming route and risk data from a FastAPI backend across 5 API areas: route generation, risk scoring, crime data, heatmaps, and location search.",
      "Implemented interactive OpenStreetMap views with crime heatmaps, geolocation, and route comparison on travel time, distance, and historical crime exposure, supporting live and mock API modes.",
    ],
    href: null,
    hrefLabel: "GitHub",
  },
];

export const SKILLS = [
  {
    group: "Languages & Databases",
    items: [
      "Java",
      "Dart",
      "Kotlin",
      "SQL",
      "PostgreSQL",
      "Firestore",
      "SQLite",
    ],
  },
  {
    group: "Mobile & Frameworks",
    items: ["Flutter", "Riverpod", "Provider", "Firebase"],
  },
  {
    group: "Backend & Tools",
    items: [
      "Node.js",
      "Express.js",
      "FastAPI",
      "REST APIs",
      "Git",
      "GitHub",
      "Docker",
      "Postman",
      "Figma",
    ],
  },
] as const;

export const LEADERSHIP = [
  "Competed in 15+ hackathons with finalist placements in 2 national-level hackathons; served as Technical Lead at GLUG, leading 15 developers across technical projects and initiatives.",
  "Led HackNocturne as Lead Organizer across 2 editions, directing technical operations and event coordination for 300+ participants.",
  "Serve as Business and Marketing Head of the Drone Club at Sir MVIT, leading a 12-member team preparing for NIDAR 2027.",
] as const;

export const EDUCATION = {
  institution: "Sir M. Visvesvaraya Institute of Technology",
  degree: "B.E. in Computer Science & Engineering",
  grade: "CGPA: 8.5/10",
  period: "2023 – 2027",
  location: "Bengaluru, India",
  coursework:
    "Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, Object-Oriented Programming",
} as const;

/** Headline numbers used as scene facts. Sourced from the résumé only. */
export const FACTS = {
  hackathons: "15+",
  nationalFinals: "2",
  glugDevelopers: "15",
  hackNocturneEditions: "2",
  hackNocturneParticipants: "300+",
  droneClubTeam: "12",
  zingroWorkflows: "5+",
  recoverAiEvents: "500–1,000",
  safeRouteApiAreas: "5",
} as const;
