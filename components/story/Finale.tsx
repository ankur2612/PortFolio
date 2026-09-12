"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import AnkurCharacter from "@/components/character/AnkurCharacter";
import ContactScene from "@/components/contact/ContactScene";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { registerScrollTrigger } from "@/lib/animations";
import { DUR, EASE } from "@/lib/motion";

export interface FinaleProps {
  onRestart?: () => void;
}

/** The three worlds, reduced to one word each. */
const FRAGMENTS = [
  { id: "build", label: "Build", world: "builder" },
  { id: "human", label: "Human", world: "human" },
  { id: "explore", label: "Explore", world: "sidequest" },
] as const;

/**
 * Finale
 *
 * The environment empties out. The three worlds pass behind the walking
 * figure as single words, then go. Three lines land with real silence
 * between them, and the ask follows.
 *
 * The pacing is the whole design here: each line gets a full beat to itself,
 * because a closing statement delivered at the same rhythm as body copy is
 * not a closing statement. Nothing here says "thanks for visiting my
 * portfolio" — the line is "thanks for staying", which is both truer and
 * addressed to a person rather than a visitor.
 */
export function Finale({ onRestart }: FinaleProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerScrollTrigger();

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      const fragments = q("[data-finale='fragment']");
      const walker = q("[data-finale='walker']");
      const lines = q("[data-finale='line']");
      const thanks = q("[data-finale='thanks']");

      if (reducedMotion) {
        gsap.set([...fragments, ...lines, ...thanks], {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          y: 0,
        });
        gsap.set(walker, { opacity: 0.55, x: 0 });
        return;
      }

      gsap.set(fragments, { opacity: 0, y: 20 });
      gsap.set(lines, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(thanks, { opacity: 0 });
      gsap.set(walker, { opacity: 0, x: -60 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EASE.out },
      });

      // The figure enters, walking.
      tl.to(walker, { opacity: 0.55, x: 0, duration: DUR.hold * 1.2 }, 0);

      // The three worlds pass behind him, then fade.
      tl.to(
        fragments,
        { opacity: 1, y: 0, duration: DUR.reveal, stagger: 0.28 },
        0.35,
      );
      tl.to(
        fragments,
        { opacity: 0.18, duration: DUR.scene, stagger: 0.1 },
        "+=0.5",
      );

      /*
       * Three lines, with real silence between them. The holds are the whole
       * design: a closing statement delivered at the tempo of body copy is
       * not a closing statement. Each gap is long enough to feel deliberate —
       * the visitor should finish reading and then wait a beat before the
       * next line arrives.
       */
      tl.to(lines[0], { clipPath: "inset(0 0% 0 0)", duration: DUR.scene }, "+=0.35");
      tl.to(lines[1], { clipPath: "inset(0 0% 0 0)", duration: DUR.scene }, "+=1.35");
      tl.to(lines[2], { clipPath: "inset(0 0% 0 0)", duration: DUR.scene * 1.2 }, "+=1.5");
      tl.to(thanks, { opacity: 1, duration: DUR.reveal }, "+=1.1");

      ScrollTrigger.create({
        trigger: root,
        start: "top 65%",
        once: true,
        onEnter: () => tl.play(),
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="finale"
      data-scene="finale"
      aria-label="Finale"
      // `justify-start` with a generous top offset instead of `justify-center`:
      // once the contact block is included the content exceeds one viewport,
      // and centring a taller-than-screen column left a dead band beneath the
      // ending. The bottom padding is trimmed for the same reason.
      className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-start overflow-x-clip px-s4 pb-s6 pt-s7 sm:px-s5 sm:pt-s8 lg:px-s6"
    >
      {/* The environment has emptied: one horizon, one light, nothing else. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <span
          className="absolute inset-x-0"
          style={{
            top: "68%",
            height: 1,
            background:
              "linear-gradient(to right, transparent, var(--acc-line) 25%, var(--acc-line) 75%, transparent)",
          }}
        />
        <span
          className="absolute block h-[60vmax] w-[60vmax] rounded-full"
          style={{
            left: "50%",
            top: "68%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, var(--acc-glow) 0%, transparent 62%)",
            filter: "blur(40px)",
            opacity: 0.5,
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-start">
        {/* The three worlds, as words. */}
        <ul className="mb-s6 flex flex-wrap items-center gap-s4">
          {FRAGMENTS.map((fragment) => (
            <li
              key={fragment.id}
              data-finale="fragment"
              data-world={fragment.world}
              className="u-display text-h2"
              style={{ color: "var(--acc)" }}
            >
              {fragment.label}
            </li>
          ))}
        </ul>

        {/* Walking toward the horizon. */}
        {/* Placeholder geometry, held back until the real asset exists: at
            full opacity it announces itself as the protagonist, which it is
            not yet. Kept small and faint so the ending rests on the type. */}
        <div
          data-finale="walker"
          className="relative mb-s4 h-[12vh] w-full max-w-[120px] overflow-hidden"
        >
          <AnkurCharacter
            pose="walking"
            position={{ x: 42, y: 92 }}
            scale={11}
            opacity={0.3}
            blur={0.5}
            // The one pose that must never pop in late.
            priority
            interactive
          />
        </div>

        <div className="flex flex-col gap-s3">
          <h2
            data-finale="line"
            className="u-display text-display text-fg"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            That&rsquo;s the short version.
          </h2>
          <p
            data-finale="line"
            className="u-display text-h2 text-fg-dim"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            There&rsquo;s more.
          </p>
          <p
            data-finale="line"
            className="u-display text-display"
            style={{ clipPath: "inset(0 100% 0 0)", color: "var(--acc)" }}
          >
            Let&rsquo;s build something.
          </p>
        </div>

        <div className="mt-s5 w-full">
          <ContactScene />
        </div>

        {/*
          The closing row. Left-aligned and padded clear of the bottom-right
          corner where the HUD and player live, so neither the thanks nor the
          restart control is ever obscured.
        */}
        <div className="mt-s5 flex w-full flex-col items-start gap-s3 pb-s6 sm:flex-row sm:items-center sm:gap-s5">
          {/* fg-dim (#9AA0A8) clears 4.5:1 on the void; fg-mute did not.
              Still the quietest line on the screen — it should whisper, but
              it has to be readable to whisper anything. */}
          <p data-finale="thanks" className="u-mono text-fg-dim">
            Thanks for staying.
          </p>
          {onRestart ? (
            <button
              type="button"
              onClick={onRestart}
              className="u-mono inline-flex min-h-[40px] items-center text-fg-mute transition-colors duration-200 hover:text-fg"
            >
              Start again ↺
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Finale;
