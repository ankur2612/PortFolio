import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import GrainOverlay from "@/components/ui/GrainOverlay";
import { PROFILE, SUMMARY } from "@/data/resume";

import "./globals.css";

/**
 * Three fonts, three voices.
 *   Space Grotesk — display. Technical, geometric, slightly unusual; reads as
 *                   engineered rather than corporate.
 *   Inter         — body. Maximum legibility for everything a recruiter reads.
 *   JetBrains Mono— annotation. The blueprint-label voice.
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${PROFILE.name} — Take It Apart`,
    template: `%s — ${PROFILE.name}`,
  },
  description: SUMMARY,
  applicationName: `${PROFILE.name} — Take It Apart`,
  authors: [{ name: PROFILE.name }],
  creator: PROFILE.name,
  keywords: [
    "Ankur Pathak",
    "Founding Engineer",
    "Flutter Developer",
    "Full Stack Developer",
    "Node.js",
    "PostgreSQL",
    "Riverpod",
    "Bengaluru",
  ],
  openGraph: {
    title: `${PROFILE.name} — Take It Apart`,
    description: SUMMARY,
    type: "profile",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} — Take It Apart`,
    description: SUMMARY,
  },
};

export const viewport: Viewport = {
  themeColor: "#08090A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-world="builder"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-[100svh] bg-void text-fg">
        <a href="#main-content" className="u-sr-only">
          Skip to content
        </a>
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
