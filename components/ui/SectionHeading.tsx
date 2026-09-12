import type { AccentName } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  /** Mono kicker above the title, e.g. "GHAZIPUR · 2014". */
  eyebrow?: string;
  title: string;
  description?: string;
  accent?: AccentName;
  align?: "left" | "center";
  /** Heading level — keeps document hierarchy correct per context. */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * SectionHeading
 *
 * Technical-editorial title block: mono eyebrow with an accent tick, display
 * title, optional body description, and a rule that reads as a dimension line
 * from an engineering drawing.
 *
 * Server component — no interactivity, no client JS.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  accent,
  align = "left",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      data-world={accent}
      className={cn(
        "flex w-full flex-col",
        centered ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <div
          className={cn(
            "mb-s3 flex items-center gap-s2",
            centered && "justify-center",
          )}
        >
          <span
            aria-hidden="true"
            className="h-px w-s5 shrink-0"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--acc-line))",
            }}
          />
          <span className="u-mono" style={{ color: "var(--acc-text)" }}>
            {eyebrow}
          </span>
        </div>
      ) : null}

      <Tag
        className={cn(
          "u-display text-display text-fg",
          centered ? "text-balance" : "",
        )}
      >
        {title}
      </Tag>

      {/* Dimension rule. */}
      <span
        aria-hidden="true"
        className="mt-s4 block h-px w-full max-w-[220px]"
        style={{
          background:
            "linear-gradient(to right, var(--acc), var(--acc-faint) 45%, transparent)",
        }}
      />

      {description ? (
        <p
          className={cn(
            "u-measure mt-s4 text-body text-fg-dim",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
