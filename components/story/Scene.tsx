import type { ReactNode } from "react";

import type { AccentName } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface SceneProps {
  /** Anchor id — also the value of `data-scene`, used by nav and CSS hooks. */
  id: string;
  children: ReactNode;
  className?: string;
  /** Swaps `--acc` / `--acc-2` for everything inside via `[data-world]`. */
  accent?: AccentName;
  /** Tailwind min-height. Defaults to a full, dynamic viewport. */
  minHeight?: string;
  /** Accessible label for the section landmark. */
  label?: string;
  /** Blueprint grid plate behind the content. */
  grid?: boolean;
}

/**
 * Scene
 *
 * The reusable storytelling section. Every story beat is this component with
 * different children.
 *
 * Deliberately contains no GSAP: scroll orchestration (pinning, scrubbing,
 * layered parallax) arrives with the scene engine in the next phase, and
 * lives above this component rather than inside it. Keeping Scene a pure,
 * server-renderable layout primitive means it can be reasoned about, nested
 * and tested without a timeline in play.
 *
 * `min-h-[100svh]` is intentional over `100vh` — on mobile browsers the
 * dynamic toolbar makes `vh` overflow, which is the single most common cause
 * of "there's a weird scroll at the bottom" on a site like this.
 */
export function Scene({
  id,
  children,
  className,
  accent,
  minHeight = "min-h-[100svh]",
  label,
  grid = false,
}: SceneProps) {
  return (
    <section
      id={id}
      data-scene={id}
      data-world={accent}
      aria-label={label}
      className={cn(
        "relative isolate flex w-full flex-col items-center justify-center",
        "overflow-hidden px-s4 py-s6 sm:px-s5 lg:px-s6",
        minHeight,
        className,
      )}
    >
      {grid ? (
        <div
          aria-hidden="true"
          className="u-grid-plate pointer-events-none absolute inset-0 -z-10 opacity-[0.055]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 65% at 50% 45%, #000 20%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 65% at 50% 45%, #000 20%, transparent 78%)",
          }}
        />
      ) : null}

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
        {children}
      </div>
    </section>
  );
}

export default Scene;
