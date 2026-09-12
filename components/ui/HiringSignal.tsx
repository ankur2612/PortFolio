"use client";

import { cn } from "@/lib/utils";

export interface HiringSignalProps {
  onOpen: () => void;
  className?: string;
}

/**
 * HiringSignal
 *
 * Persistent recruiter access from anywhere in Story Mode. Top-right, small,
 * always present.
 *
 * This is deliberately NOT hidden, NOT an Easter egg, and NOT clever. A
 * recruiter with two minutes must be able to leave the cinema in one click
 * without hunting for the exit — hiding that behind discovery would be
 * creativity bought at the visitor's expense.
 */
export function HiringSignal({ onOpen, className }: HiringSignalProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title="Switch to the résumé view (Q)"
      aria-label="Hiring? Switch to the résumé view. Keyboard shortcut Q."
      className={cn(
        // Hidden below 360px. At that width a floating chip cannot coexist
        // with a full-width text column without clipping words mid-sentence,
        // and obscured copy is a worse failure than an absent shortcut: the
        // `Q` key still works, the HUD still navigates, and Quick Mode is one
        // tap from the landing.
        "fixed z-[64] u-no-print",
        "hidden min-[360px]:inline-flex",
        // Desktop: top-right, clear of everything.
        // Mobile: pinned to the bottom-right corner, directly above the HUD.
        // Every other corner collides with content at narrow widths — the
        // eyebrow at top-left, the toast at bottom-left, scene cards in the
        // middle. A recruiter control must never sit on the content it is
        // offering to skip.
        // Sits in the strip above the HUD, where no scene content reaches.
        // Below 360px it collapses to a dot + "Q" so it cannot reach across
        // the measure.
        "bottom-[132px] right-s2 sm:bottom-auto sm:right-s3 sm:top-s3",
        "min-h-[40px] items-center gap-s2 rounded-md border px-s3 py-s2",
        "transition-colors duration-200",
        className,
      )}
      style={{
        borderColor: "var(--color-line)",
        backgroundColor:
          "color-mix(in srgb, var(--color-raised) 86%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <span
        aria-hidden="true"
        className="block h-s2 w-s2 shrink-0 rounded-full"
        style={{ background: "var(--acc)", boxShadow: "var(--glow-sm)" }}
      />
      {/* The word is dropped below 360px: on the narrowest phones the chip
          would otherwise reach across the content column. The dot plus the
          shortcut key still reads, and the aria-label carries the meaning. */}
      <span className="u-mono hidden text-fg-dim min-[360px]:inline">
        Hiring?
      </span>
      <span aria-hidden="true" className="u-mono text-fg-mute">
        Q
      </span>
    </button>
  );
}

export default HiringSignal;
