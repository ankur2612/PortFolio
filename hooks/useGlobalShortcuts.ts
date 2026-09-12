"use client";

import { useEffect, useRef } from "react";

import { createSecretMatcher, trigger } from "@/lib/easterEggs";

export interface GlobalShortcutHandlers {
  onQuickMode?: () => void;
  onEscape?: () => void;
}

/**
 * Returns true when the event originated inside a field where the visitor is
 * genuinely typing. Hijacking "q" while someone fills in a search box is the
 * classic way a keyboard shortcut becomes a bug.
 */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * useGlobalShortcuts
 *
 *   Q    → Quick Mode
 *   Esc  → back
 *   "WHYNOTME" typed anywhere → Easter egg
 *
 * Modified keystrokes (⌘/Ctrl/Alt) are ignored so browser and OS shortcuts
 * keep working, and nothing fires while the visitor is typing in a field.
 */
export function useGlobalShortcuts({
  onQuickMode,
  onEscape,
}: GlobalShortcutHandlers) {
  const handlersRef = useRef({ onQuickMode, onEscape });

  useEffect(() => {
    handlersRef.current = { onQuickMode, onEscape };
  }, [onQuickMode, onEscape]);

  useEffect(() => {
    const matchSecret = createSecretMatcher(() => trigger("konami"));

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Escape") {
        handlersRef.current.onEscape?.();
        return;
      }

      if (event.key.toLowerCase() === "q") {
        event.preventDefault();
        handlersRef.current.onQuickMode?.();
        return;
      }

      matchSecret(event.key);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
