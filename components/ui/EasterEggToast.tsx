"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { subscribe, type EggEvent } from "@/lib/easterEggs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * EasterEggToast
 *
 * The single surface every Easter egg reports through. Bottom-left so it
 * never collides with the progress HUD, small, and gone in four seconds.
 *
 * Deliberately `aria-live="polite"` and never focus-stealing: an egg is a
 * reward, not an interruption. Nothing here blocks input or covers content.
 */
export function EasterEggToast() {
  const [event, setEvent] = useState<EggEvent | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const unsubscribe = subscribe((next) => setEvent(next));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => setEvent(null), 4200);
    return () => clearTimeout(timer);
  }, [event]);

  return (
    <div
      aria-live="polite"
      // The HUD spans the bottom on mobile, so the toast clears it; on
      // desktop the corner is free and it drops back down.
      className="pointer-events-none fixed bottom-[168px] left-s3 z-[65] u-no-print sm:bottom-s3"
    >
      <AnimatePresence>
        {event ? (
          <motion.div
            key={event.id}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="u-card max-w-[280px] px-s3 py-s2"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-raised) 92%, transparent)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <span className="u-mono block" style={{ color: "var(--acc-text)" }}>
              {event.definition.title}
            </span>
            {event.definition.lines.map((line) => (
              <span key={line} className="mt-s1 block text-small text-fg-dim">
                {line}
              </span>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default EasterEggToast;
