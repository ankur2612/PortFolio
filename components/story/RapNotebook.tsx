"use client";

import gsap from "gsap";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ARTISTS, NOTEBOOK_FRAGMENTS, SEEN_LIVE } from "@/data/sidequests";
import { DUR, EASE } from "@/lib/motion";

/**
 * RapNotebook — S2.
 *
 * The joke is entirely in the pacing, which is why this component is mostly
 * empty space and timing. Opening the notebook reveals abstract verse marks
 * (never real lyrics — this site does not reproduce copyrighted text under
 * any circumstance), then the line Ankur actually said about himself, then
 * the annotation that undercuts it.
 *
 * Self-aware, not self-aggrandising: the site never claims he is a rapper.
 */
export function RapNotebook() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      const lines = q("[data-nb='line']");
      const claim = q("[data-nb='claim']");
      const note = q("[data-nb='note']");

      if (reducedMotion) {
        gsap.set([...lines, ...claim, ...note], { opacity: 1, y: 0 });
        timelineRef.current = null;
        return;
      }

      gsap.set(lines, { opacity: 0, x: -10 });
      gsap.set(claim, { opacity: 0, y: 8 });
      gsap.set(note, { opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(lines, {
        opacity: 1,
        x: 0,
        duration: DUR.reveal * 0.6,
        stagger: 0.16,
        ease: EASE.out,
      });
      // The hold before the punchline is the joke.
      tl.to(
        claim,
        { opacity: 1, y: 0, duration: DUR.reveal, ease: EASE.out },
        "+=0.65",
      );
      tl.to(note, { opacity: 1, duration: DUR.reveal }, "+=0.55");

      timelineRef.current = tl;
    }, root);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();
  }, [open]);

  const toggle = useCallback(() => setOpen((value) => !value), []);
  const isOpen = reducedMotion ? true : open;

  return (
    <div ref={rootRef} className="flex w-full flex-col items-start gap-s4">
      {/* Artists — the taste, stated plainly. */}
      <div className="flex flex-col gap-s2">
        <span className="u-mono text-fg-mute">On repeat</span>
        <div className="flex flex-wrap gap-s2">
          {ARTISTS.map((artist) => (
            <span
              key={artist}
              className="u-mono rounded-sm border border-line px-s2 py-s1 text-fg-dim"
            >
              {artist}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-s2">
        <span className="u-mono text-fg-mute">Seen live</span>
        <div className="flex flex-wrap gap-s2">
          {SEEN_LIVE.map((artist) => (
            <span
              key={artist}
              className="u-mono rounded-sm px-s2 py-s1"
              style={{
                color: "var(--acc)",
                border: "1px solid var(--acc-line)",
              }}
            >
              {artist}
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- The notebook ---------------- */}
      <div
        className="u-card relative w-full max-w-[440px] overflow-hidden px-s4 py-s4"
        style={{ minHeight: 210 }}
      >
        {/* Ruled margin, like a real notebook. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-s5 w-px"
          style={{ background: "var(--acc-faint)" }}
        />

        <div className="flex flex-col gap-s3 pl-s5">
          <span className="u-mono text-fg-mute">Notebook · last entry</span>

          {!isOpen ? (
            <p className="u-mono text-fg-mute">Closed. Probably for the best.</p>
          ) : (
            <>
              {/* Abstract verse marks. Never real lyrics. */}
              <div
                aria-hidden="true"
                className="flex flex-col gap-s2"
                style={{ color: "var(--color-fg-mute)" }}
              >
                {NOTEBOOK_FRAGMENTS.map((fragment, index) => (
                  <span
                    key={index}
                    data-nb="line"
                    className="u-mono tracking-[0.4em]"
                  >
                    {fragment}
                  </span>
                ))}
              </div>

              <p
                data-nb="claim"
                className="u-display text-h3"
                style={{ color: "var(--acc)" }}
              >
                &ldquo;I think I&rsquo;m Eminem of India.&rdquo;
              </p>

              <span data-nb="note" className="u-mono text-fg-mute">
                confidence: unreasonable
              </span>
            </>
          )}
        </div>
      </div>

      {!reducedMotion ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="inline-flex items-center gap-s2 rounded-md px-s2 py-s2"
        >
          <span
            className="u-mono"
            style={{ color: open ? "var(--color-fg-mute)" : "var(--acc)" }}
          >
            {open ? "Close the notebook" : "Open the notebook"}
          </span>
          <span
            aria-hidden="true"
            className="u-mono transition-transform duration-300"
            style={{
              color: open ? "var(--color-fg-mute)" : "var(--acc)",
              transform: open ? "rotate(180deg)" : "none",
            }}
          >
            ↓
          </span>
        </button>
      ) : null}

      {/* Static transcript: the joke must survive with no JS and no motion. */}
      <div className="u-sr-only">
        <p>
          Notebook, last entry. Written in Hinglish, heavily lyrical, mostly
          about claiming territory. He has not written anything in months. After
          finishing it he thought, quote, I think I&rsquo;m Eminem of India.
          Confidence: unreasonable.
        </p>
      </div>
    </div>
  );
}

export default RapNotebook;
