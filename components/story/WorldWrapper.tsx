import type { ReactNode } from "react";

import type { AccentName } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface WorldWrapperProps {
  id: string;
  name: string;
  eyebrow: string;
  description?: string;
  accent: AccentName;
  children: ReactNode;
  className?: string;
}

/**
 * WorldWrapper
 *
 * The visual environment for an entire story world. Sets `[data-world]`,
 * which cascades `--acc` / `--acc-2` to every descendant — this single
 * attribute is how one world recolours completely without any component
 * knowing which world it is in.
 *
 * Deliberately lightweight and server-renderable: no animation logic lives
 * here. Scene-level orchestration belongs to ScrollScene, world entry
 * choreography to WorldIntro.
 */
export function WorldWrapper({
  id,
  name,
  eyebrow,
  description,
  accent,
  children,
  className,
}: WorldWrapperProps) {
  return (
    <div
      id={id}
      data-world={accent}
      aria-label={`${eyebrow}. ${name}`}
      className={cn("relative isolate w-full", className)}
    >
      {/* Ambient world light — one warm source, low left. Fixed so it reads
          as environment rather than as a decoration that scrolls past. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      >
        <div
          className="absolute h-[80vmax] w-[80vmax] rounded-full"
          style={{
            left: "-22vmax",
            bottom: "-34vmax",
            background:
              "radial-gradient(circle, var(--acc-glow) 0%, transparent 62%)",
            filter: "blur(34px)",
            opacity: 0.75,
          }}
        />
        <div
          className="absolute h-[50vmax] w-[50vmax] rounded-full"
          style={{
            right: "-18vmax",
            top: "-20vmax",
            background:
              "radial-gradient(circle, var(--acc-wash) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Screen-reader landmark for the world as a whole. */}
      <h2 className="u-sr-only">
        {eyebrow} — {name}
        {description ? `. ${description}` : ""}
      </h2>

      {children}
    </div>
  );
}

export default WorldWrapper;
