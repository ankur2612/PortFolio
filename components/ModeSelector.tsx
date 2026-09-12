"use client";

import { forwardRef } from "react";

import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export interface ModeSelectorProps {
  onStoryMode: () => void;
  onQuickMode: () => void;
  className?: string;
}

interface DoorProps {
  index: string;
  title: string;
  caption: string;
  meta: string;
  onSelect: () => void;
  accent?: boolean;
}

function Door({ index, title, caption, meta, onSelect, accent }: DoorProps) {
  return (
    <MagneticButton
      onClick={onSelect}
      aria-label={`${title}. ${caption}`}
      className={cn(
        "w-full flex-col items-start gap-s2 !px-s4 !py-s3 text-left sm:!px-s5 sm:!py-s4",
        // Height-capped so two doors plus the statement above them clear a
        // 768px viewport. Still a comfortable target at every size.
        "min-h-[72px] min-[380px]:min-h-[96px] sm:min-h-[112px]",
      )}
    >
      <span className="flex w-full flex-col gap-s3">
        <span className="flex w-full items-center justify-between gap-s3">
          <span
            className="u-mono"
            style={{ color: accent ? "var(--acc)" : "var(--color-fg-mute)" }}
          >
            {index}
          </span>
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{ background: "var(--color-line)" }}
          />
          <span className="u-mono text-fg-mute">{meta}</span>
        </span>

        <span className="u-display text-h3 text-fg transition-colors duration-200 group-hover:text-[var(--acc)] sm:text-h2">
          {title}
        </span>

        {/* The caption is flavour, not information — the meta chip above
            already says "~5 min" / "résumé". Dropped on the shortest phones
            so both doors stay reachable without scrolling. */}
        <span className="hidden text-small text-fg-dim min-[380px]:block">
          {caption}
        </span>
      </span>
    </MagneticButton>
  );
}

/**
 * ModeSelector
 *
 * The two doors. Equal visual weight by design: a recruiter must never feel
 * that the fast path is the lesser one, and a curious visitor must never feel
 * the story is a detour.
 *
 * Both are semantic <button>s, so keyboard and screen-reader behaviour is
 * native. Navigation is the caller's responsibility — this component only
 * reports the choice.
 */
export const ModeSelector = forwardRef<HTMLDivElement, ModeSelectorProps>(
  function ModeSelector({ onStoryMode, onQuickMode, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full max-w-3xl grid-cols-1 gap-s3 sm:grid-cols-2 sm:gap-s4",
          className,
        )}
      >
        <Door
          index="01"
          title="Story Mode"
          caption="Take your time."
          meta="~5 min"
          onSelect={onStoryMode}
          accent
        />
        <Door
          index="02"
          title="Quick Mode"
          caption="I have approximately 30 seconds."
          meta="résumé"
          onSelect={onQuickMode}
        />
      </div>
    );
  },
);

export default ModeSelector;
