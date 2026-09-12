"use client";

import { useCallback, useState } from "react";

import { CONTACT_LINKS } from "@/data/portfolio";
import { PROFILE } from "@/data/resume";
import { cn } from "@/lib/utils";

export interface ContactSceneProps {
  /** Tighter spacing for use at the end of Quick Mode. */
  compact?: boolean;
  onExit?: () => void;
  className?: string;
}

/**
 * ContactScene
 *
 * Direct links, no form. A portfolio contact form has a backend, a spam
 * problem and a silent-failure mode; `mailto:` plus copy-to-clipboard has
 * none of those and reaches the same inbox. If a form is ever needed, it
 * slots in below this block without touching the links.
 *
 * Used by both Quick Mode and the Finale, so the closing ask is identical
 * whichever path the visitor took.
 */
export function ContactScene({
  compact = false,
  onExit,
  className,
}: ContactSceneProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions or an insecure context.
      // The mailto link beside this still works, so there is nothing to say.
    }
  }, []);

  return (
    <section
      className={cn(
        "w-full border-t border-line",
        compact ? "py-s6" : "py-s7",
        className,
      )}
      aria-label="Contact"
    >
      <div className="flex flex-col gap-s2">
        {compact ? (
          <span className="u-mono" style={{ color: "var(--acc-text)" }}>
            05 · Let&rsquo;s talk
          </span>
        ) : null}

        <h2 className="u-display text-display text-fg">
          Let&rsquo;s build something.
        </h2>
        <span aria-hidden="true" className="u-rule mt-s2 block w-full max-w-[280px]" />
      </div>

      <p className="u-measure mt-s4 text-body text-fg-dim">
        Hiring, building something, or you just want to argue about rap —
        either way the inbox is the same.
      </p>

      {/* Primary ask, unmissable. */}
      <div className="mt-s5 flex flex-col gap-s2 sm:flex-row sm:items-center">
        <a
          href={`mailto:${PROFILE.email}`}
          className="inline-flex min-h-[48px] items-center justify-center gap-s2 rounded-md px-s5 py-s3 transition-colors duration-200"
          style={{
            border: "1px solid var(--acc)",
            color: "var(--acc)",
            boxShadow: "var(--glow-sm)",
          }}
        >
          <span className="u-mono">{PROFILE.email}</span>
        </a>

        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-line px-s4 py-s3 transition-colors duration-200 hover:border-[var(--color-line-hi)]"
        >
          <span className="u-mono text-fg-mute">
            {copied ? "Copied" : "Copy address"}
          </span>
        </button>
      </div>

      {/* Everything else. */}
      <ul className="mt-s5 grid grid-cols-1 gap-s2 sm:grid-cols-2">
        {CONTACT_LINKS.filter((link) => link.id !== "email").map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="flex min-h-[56px] items-center justify-between gap-s3 rounded-md border border-line px-s4 py-s3 transition-colors duration-200 hover:border-[var(--acc-line)]"
            >
              <span className="flex flex-col gap-s1">
                <span className="u-mono text-fg-mute">{link.label}</span>
                <span className="text-small text-fg">{link.value}</span>
              </span>
              <span aria-hidden="true" className="u-mono text-fg-mute">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-s5 flex flex-wrap items-center justify-between gap-s3">
        <p className="u-mono text-fg-mute">
          {PROFILE.location} · {PROFILE.phone}
        </p>
        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            className="u-mono inline-flex min-h-[40px] items-center px-s2 text-fg-mute transition-colors duration-200 hover:text-fg"
          >
            ← Back
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default ContactScene;
