"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import ModeSelector from "@/components/ModeSelector";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LINKS, PROFILE } from "@/data/resume";
import { DUR, EASE, LANDING_BEATS, STAGGER } from "@/lib/motion";

export interface LandingProps {
  onStoryMode: () => void;
  onQuickMode: () => void;
}

const CORNER_LINKS = [
  { label: "Résumé", href: LINKS.resume, external: false },
  { label: "GitHub", href: LINKS.github, external: true },
  { label: "LinkedIn", href: LINKS.linkedin, external: true },
  { label: "Email", href: LINKS.email, external: false },
];

/**
 * Landing
 *
 * The opening beat. Near-empty screen, one warm light, and a paced reveal:
 *
 *   NOTHING HERE YET.
 *   → That's how everything I've built started.
 *   → (clear)
 *   → I TAKE THINGS APART. / UNTIL I UNDERSTAND THEM. / THEN I BUILD THEM BETTER.
 *   → ANKUR PATHAK — TAKE IT APART.
 *   → mode selector
 *
 * Implementation notes:
 * - The whole sequence is one paused GSAP timeline inside a `gsap.context()`
 *   scoped to the root, reverted on unmount. No stray tweens, no leaks.
 * - Elements start hidden via inline styles set in `useLayoutEffect` *before
 *   paint*, so the server HTML and the first client render agree (no
 *   hydration mismatch) and there is no flash of fully-visible text.
 * - Under `prefers-reduced-motion` the timeline is never built: every element
 *   is set to its final state immediately. No information is lost and nothing
 *   moves.
 * - Text reveals use `clip-path`, never fade-and-slide-up.
 */
export function Landing({ onStoryMode, onQuickMode }: LandingProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];

      const opening = q("[data-anim='opening']");
      const openingLines = q("[data-anim='opening-line']");
      const statementLines = q("[data-anim='statement-line']");
      const identity = q("[data-anim='identity']");
      const selector = q("[data-anim='selector']");
      const corner = q("[data-anim='corner']");
      const light = q("[data-anim='light']");
      const rule = q("[data-anim='rule']");

      // --- Reduced motion: final state, immediately. --------------------
      if (reducedMotion) {
        gsap.set(
          [
            ...openingLines,
            ...statementLines,
            ...identity,
            ...selector,
            ...corner,
          ],
          { clipPath: "inset(0 0% 0 0)", opacity: 1, y: 0 },
        );
        gsap.set(opening, { autoAlpha: 1, display: "none" });
        gsap.set(rule, { scaleX: 1 });
        gsap.set(light, { opacity: 0.55 });
        return;
      }

      // --- Start state --------------------------------------------------
      gsap.set([...openingLines, ...statementLines], {
        clipPath: "inset(0 100% 0 0)",
      });
      gsap.set([...identity, ...selector, ...corner], { opacity: 0, y: 14 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(light, { opacity: 0 });

      const B = LANDING_BEATS;
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      // 1 — the light comes up on an empty room
      tl.to(light, { opacity: 0.55, duration: DUR.hold * 1.4 }, 0);

      // 2 — NOTHING HERE YET.
      tl.to(
        openingLines[0],
        { clipPath: "inset(0 0% 0 0)", duration: DUR.scene },
        B.nothingIn,
      );

      // 3 — pause, then the subtitle
      tl.to(
        openingLines[1],
        { clipPath: "inset(0 0% 0 0)", duration: DUR.reveal },
        B.subtitleIn,
      );

      // 4 — clear the opening away
      tl.to(
        opening,
        { autoAlpha: 0, duration: DUR.reveal, ease: EASE.inOut },
        B.clearOut,
      );
      tl.set(opening, { display: "none" });

      // 5 — the core statement, line by line
      tl.to(
        statementLines,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: DUR.scene,
          stagger: STAGGER.loose * 3,
        },
        B.statementIn,
      );

      // 6 — brand identity
      tl.to(
        identity,
        { opacity: 1, y: 0, duration: DUR.reveal, stagger: STAGGER.base },
        B.identityIn,
      );
      tl.to(
        rule,
        { scaleX: 1, duration: DUR.scene, ease: EASE.inOut },
        B.identityIn + 0.1,
      );

      // 7 — the doors
      tl.to(
        selector,
        { opacity: 1, y: 0, duration: DUR.reveal },
        B.selectorIn,
      );

      // Contact links arrive early and on their own track. A recruiter must
      // never wait on the story to find the résumé.
      tl.to(
        corner,
        { opacity: 1, y: 0, duration: DUR.reveal, stagger: STAGGER.tight },
        B.cornerIn,
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <main
      ref={rootRef}
      id="landing"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden px-s4 py-s5 sm:px-s5 sm:py-s6 lg:px-s6"
    >
      {/* Blueprint grid plate. */}
      <div
        aria-hidden="true"
        className="u-grid-plate pointer-events-none absolute inset-0 -z-20 opacity-[0.06]"
        style={{
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 50%, #000 15%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 60% at 50% 50%, #000 15%, transparent 80%)",
        }}
      />

      {/* The single warm light source, low and to the left. */}
      <div
        data-anim="light"
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-[70vmax] w-[70vmax] rounded-full"
        style={{
          left: "-14vmax",
          bottom: "-26vmax",
          background:
            "radial-gradient(circle, var(--acc-glow) 0%, transparent 62%)",
          filter: "blur(28px)",
        }}
      />

      {/* Persistent corner links — present before any choice is made. */}
      <nav
        aria-label="Direct links"
        className="relative z-20 flex flex-wrap items-center justify-end gap-x-s4 gap-y-s2"
      >
        {CORNER_LINKS.map((link) => (
          <a
            key={link.label}
            data-anim="corner"
            href={link.href}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="u-mono text-fg-mute transition-colors duration-200 hover:text-[var(--acc)]"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Centre stage. */}
      <div className="relative z-10 flex flex-1 flex-col justify-center py-s3 sm:py-s4">
        <div className="relative w-full max-w-5xl">
          {/* --- Opening beat ------------------------------------------- */}
          <div data-anim="opening" className="absolute inset-x-0 top-0">
            <h1
              data-anim="opening-line"
              className="u-display u-reveal-target text-fg"
              style={{
                fontSize: "min(clamp(2rem, 5.6vw, 4.75rem), 10.5vh)",
                lineHeight: 0.98,
              }}
            >
              Nothing here yet.
            </h1>
            <p
              data-anim="opening-line"
              className="u-reveal-target mt-s4 max-w-[40ch] text-body text-fg-dim"
            >
              That&rsquo;s how everything I&rsquo;ve built started.
            </p>
          </div>

          {/* --- Core statement ----------------------------------------- */}
          <div aria-hidden="true" className="pt-0">
            {PROFILE.statement.map((line, index) => (
              <p
                key={line}
                data-anim="statement-line"
                className="u-display u-reveal-target"
                style={{
                  /*
                   * Viewport-HEIGHT aware, unlike the global display scale.
                   * Three lines of type plus the identity block plus two doors
                   * must fit 768px; a purely width-based clamp overflowed on
                   * every common laptop, pushing the entry points below the
                   * fold. `min()` keeps the width-driven size as the ceiling
                   * so wide-but-short windows shrink instead of overflowing.
                   */
                  fontSize: "min(clamp(2rem, 5.6vw, 4.75rem), 10.5vh)",
                  lineHeight: 0.98,
                  color:
                    index === PROFILE.statement.length - 1
                      ? "var(--acc)"
                      : "var(--color-fg)",
                }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Screen readers and search engines get the statement as one
              coherent sentence rather than three animated fragments. */}
          <p className="u-sr-only">
            {PROFILE.statement.join(" ")} {PROFILE.name}. {PROFILE.tagline}
          </p>

          {/* --- Identity ------------------------------------------------ */}
          <div className="mt-s4 flex flex-col gap-s2">
            <span
              data-anim="rule"
              aria-hidden="true"
              className="block h-px w-full max-w-[320px]"
              style={{
                background:
                  "linear-gradient(to right, var(--acc), var(--acc-faint) 50%, transparent)",
              }}
            />

            <div className="flex flex-col gap-s2 sm:flex-row sm:items-baseline sm:gap-s4">
              <h2
                data-anim="identity"
                className="u-display text-h2 text-fg"
              >
                {PROFILE.name}
              </h2>
              <span data-anim="identity" className="u-mono text-[var(--acc)]">
                {PROFILE.tagline}
              </span>
            </div>

            {/* One line, not two: on a 768px viewport every saved row is the
                difference between the doors being reachable or not. */}
            <p data-anim="identity" className="u-mono text-fg-mute">
              {PROFILE.positioning} &nbsp;·&nbsp; {PROFILE.location}{" "}
              &nbsp;·&nbsp; {PROFILE.education}
            </p>
          </div>
        </div>
      </div>

      {/* --- Doors ---------------------------------------------------- */}
      <div
        data-anim="selector"
        className="relative z-10 flex w-full flex-col items-start gap-s3"
      >
        <ModeSelector onStoryMode={onStoryMode} onQuickMode={onQuickMode} />
      </div>
    </main>
  );
}

export default Landing;
