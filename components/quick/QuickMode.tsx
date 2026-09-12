"use client";

import { useEffect, useRef } from "react";

import ContactScene from "@/components/contact/ContactScene";
import AnkurCharacter from "@/components/character/AnkurCharacter";
import {
  EDUCATION_ENTRY,
  IDENTITY,
  PROOF,
  PROOF_LEADERSHIP,
  SKILL_GROUPS,
  THINKING,
  VISIBLE_PROJECTS,
} from "@/data/portfolio";
import { trigger } from "@/lib/easterEggs";
import { cn } from "@/lib/utils";

export interface QuickModeProps {
  onExit?: () => void;
  onEnterStory?: () => void;
}

/** Time on page before the "room" Easter egg fires. */
const ROOM_EGG_DELAY_MS = 45_000;

function Section({
  index,
  eyebrow,
  title,
  children,
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("w-full border-t border-line py-s6", className)}>
      <div className="mb-s4 flex items-baseline gap-s3">
        <span className="u-mono shrink-0" style={{ color: "var(--acc-text)" }}>
          {index}
        </span>
        <div className="flex flex-col gap-s1">
          <span className="u-mono text-fg-mute">{eyebrow}</span>
          <h2 className="u-display text-h2 text-fg">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

/**
 * QuickMode — the recruiter view.
 *
 * Designed against a 90–120 second budget. Everything a recruiter needs is
 * here, in the order they need it: who, what he builds, proof, how he thinks,
 * how to reach him.
 *
 * Same visual language as the story — near-black, grain, mono annotations,
 * Archivo display — but the animation budget drops to almost nothing and the
 * information density triples. It is an executive summary that happens to be
 * cinematic, not a cinematic experience that happens to contain facts.
 *
 * Every claim comes from `portfolio.ts`, which in turn reads `resume.ts`.
 * No figure here was typed by hand.
 */
export function QuickMode({ onExit, onEnterStory }: QuickModeProps) {
  const eggTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // E2 — a visitor who is still here after 45 seconds is actually reading.
  useEffect(() => {
    eggTimerRef.current = setTimeout(() => trigger("room"), ROOM_EGG_DELAY_MS);
    return () => {
      if (eggTimerRef.current) clearTimeout(eggTimerRef.current);
    };
  }, []);

  return (
    <div
      data-world="builder"
      // Top padding clears the fixed Back control, which sits at top-left on
      // every viewport. Generous on small screens where it wraps to a second
      // visual row against the header.
      className="relative mx-auto w-full max-w-5xl px-s4 pb-s8 pt-s7 sm:px-s5 sm:pt-s6 lg:px-s6"
    >
      {/* ---------------- Q1 · WHO ---------------- */}
      <header className="relative flex flex-col gap-s4 pb-s5">
        <div className="flex items-start justify-between gap-s4">
          <div className="flex flex-col gap-s2">
            <span className="u-mono" style={{ color: "var(--acc-text)" }}>
              {IDENTITY.descriptor}
            </span>
            <h1 className="u-display text-display text-fg">{IDENTITY.name}</h1>
            <span aria-hidden="true" className="u-rule block w-full max-w-[280px]" />
          </div>

          {/* The figure appears once here, small, so Quick Mode still feels
              like the same portfolio rather than a detached résumé page.
              `overflow-hidden` keeps it inside its own box regardless of the
              vh-based scale, so it can never crop against the header. */}
          <div className="relative hidden h-[150px] w-[110px] shrink-0 sm:block">
            <AnkurCharacter
              pose="confident"
              position={{ x: 50, y: 98 }}
              scale={13}
              opacity={0.92}
              interactive
            />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-s3 sm:grid-cols-4">
          {[
            { label: "Role", value: IDENTITY.role },
            { label: "Now", value: IDENTITY.current },
            { label: "Based in", value: IDENTITY.location },
            { label: "Graduating", value: IDENTITY.education },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-s1">
              <dt className="u-mono text-fg-mute">{item.label}</dt>
              <dd className="text-small text-fg">{item.value}</dd>
            </div>
          ))}
        </dl>

        <p className="u-measure text-body text-fg-dim">{IDENTITY.pitch}</p>
      </header>

      {/* ---------------- Q2 · WHAT I BUILD ---------------- */}
      <Section index="01" eyebrow="What I build" title="Things that shipped">
        <ul className="flex flex-col gap-s3">
          {VISIBLE_PROJECTS.map((project) => (
            <li
              key={project.id}
              className="u-card flex flex-col gap-s3 px-s4 py-s4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-s2">
                <span className="flex flex-wrap items-baseline gap-s2">
                  <h3 className="u-display text-h3 text-fg">{project.name}</h3>
                  {/* A specification must never be mistaken for a shipped
                      product, so the stage is stated beside the name. */}
                  {project.stage ? (
                    <span
                      className="u-mono rounded-sm border px-s2 py-s1"
                      style={{
                        color: "var(--color-fg-mute)",
                        borderColor: "var(--color-line-hi)",
                      }}
                    >
                      {project.stage}
                    </span>
                  ) : null}
                </span>
                <span className="u-mono text-fg-mute">
                  {project.role}
                  {project.period ? ` · ${project.period}` : ""}
                </span>
              </div>

              <p className="u-measure text-small text-fg-dim">
                {project.oneLiner}
              </p>

              <div className="flex flex-wrap items-center gap-s2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="u-mono rounded-sm border border-line px-s2 py-s1 text-fg-dim"
                  >
                    {tech}
                  </span>
                ))}

                {/* A link renders only when a real URL exists. A dead
                    "Live Demo" button is worse than no button at all. */}
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-mono ml-auto rounded-sm px-s2 py-s1 transition-colors duration-200"
                    style={{
                      color: "var(--acc-text)",
                      border: "1px solid var(--acc-line)",
                    }}
                  >
                    {project.hrefLabel} →
                  </a>
                ) : (
                  <span className="u-mono ml-auto text-fg-mute">
                    {project.hrefLabel}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------- Q3 · PROOF ---------------- */}
      <Section index="02" eyebrow="Proof" title="Numbers that are real">
        <dl className="grid grid-cols-2 gap-s4 sm:grid-cols-3">
          {PROOF.map((point) => (
            <div
              key={point.label}
              className="flex flex-col gap-s1 border-t pt-s2"
              style={{ borderColor: "var(--color-line)" }}
            >
              <dd
                className="u-display text-h2 tabular-nums"
                style={{ color: "var(--acc)" }}
              >
                {point.value}
              </dd>
              <dt className="u-mono text-fg">{point.label}</dt>
              {point.detail ? (
                <span className="text-small text-fg-mute">{point.detail}</span>
              ) : null}
            </div>
          ))}
        </dl>

        <ul className="mt-s5 flex flex-col gap-s2">
          {PROOF_LEADERSHIP.map((item) => (
            <li
              key={item}
              className="u-measure flex gap-s3 text-small text-fg-dim"
            >
              <span
                aria-hidden="true"
                className="mt-[0.55em] block h-px w-s3 shrink-0"
                style={{ background: "var(--acc-line)" }}
              />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------- Q4 · HOW I THINK ---------------- */}
      <Section index="03" eyebrow="How I think" title="Take it apart">
        <ol className="grid grid-cols-1 gap-s2 sm:grid-cols-5">
          {THINKING.map((step, index) => (
            <li
              key={step.id}
              className="relative flex flex-col gap-s2 border-t pt-s3"
              style={{ borderColor: "var(--acc-line)" }}
            >
              <span className="u-mono text-fg-mute">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="u-display text-h3 text-fg">{step.label}</span>
              <span className="text-small text-fg-mute">{step.detail}</span>
            </li>
          ))}
        </ol>

        {onEnterStory ? (
          <button
            type="button"
            onClick={onEnterStory}
            className="mt-s5 inline-flex items-center gap-s2 rounded-md border border-line px-s4 py-s2 transition-colors duration-200 hover:border-[var(--acc-line)]"
          >
            <span className="u-mono" style={{ color: "var(--acc-text)" }}>
              See it applied
            </span>
            <span aria-hidden="true" className="u-mono text-fg-mute">
              the long version →
            </span>
          </button>
        ) : null}
      </Section>

      {/* ---------------- Skills + education ---------------- */}
      <Section index="04" eyebrow="Toolkit" title="What I work with">
        <div className="flex flex-col gap-s4">
          {SKILL_GROUPS.map((group) => (
            <div key={group.group} className="flex flex-col gap-s2">
              <span className="u-mono text-fg-mute">{group.group}</span>
              <div className="flex flex-wrap gap-s2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="u-mono rounded-sm border border-line px-s2 py-s1 text-fg-dim"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-s2 flex flex-col gap-s1 border-t pt-s3" style={{ borderColor: "var(--color-line)" }}>
            <span className="u-mono text-fg-mute">Education</span>
            <span className="text-small text-fg">
              {EDUCATION_ENTRY.institution}
            </span>
            <span className="u-mono text-fg-mute">
              {EDUCATION_ENTRY.degree} · {EDUCATION_ENTRY.grade} ·{" "}
              {EDUCATION_ENTRY.period}
            </span>
          </div>
        </div>
      </Section>

      {/* ---------------- Q5 · CONTACT ---------------- */}
      <ContactScene compact onExit={onExit} />
    </div>
  );
}

export default QuickMode;
