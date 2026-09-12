"use client";

import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import { useFinePointer } from "@/hooks/useFinePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface MagneticButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  /** Fraction of the cursor delta the button travels. Keep it subtle. */
  strength?: number;
  /** Radius in px within which attraction applies. */
  radius?: number;
  className?: string;
}

/**
 * MagneticButton
 *
 * The site's one "expensive" micro-interaction: inside a radius, the button
 * drifts a fraction of the way toward the cursor, and its inner label drifts
 * slightly further — a tiny parallax that reads as depth rather than as a
 * gimmick.
 *
 * Correctness rules honoured here:
 * - Disabled entirely on touch/coarse pointers (`useFinePointer`) so there is
 *   never a hover dependency on mobile.
 * - Disabled under `prefers-reduced-motion`.
 * - Uses `gsap.quickTo` so pointermove does not allocate a new tween per event.
 * - All GSAP work is scoped in a `gsap.context()` and reverted on unmount.
 */
export function MagneticButton({
  children,
  strength = 0.25,
  radius = 120,
  className,
  ...props
}: MagneticButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const quickRef = useRef<{
    x: (value: number) => void;
    y: (value: number) => void;
    lx: (value: number) => void;
    ly: (value: number) => void;
  } | null>(null);

  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    if (!root || !label) return;

    if (!enabled) {
      quickRef.current = null;
      gsap.set([root, label], { x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const config = { duration: DUR.micro * 2, ease: EASE.out };
      quickRef.current = {
        x: gsap.quickTo(root, "x", config),
        y: gsap.quickTo(root, "y", config),
        lx: gsap.quickTo(label, "x", config),
        ly: gsap.quickTo(label, "y", config),
      };
    }, root);

    return () => {
      quickRef.current = null;
      ctx.revert();
    };
  }, [enabled]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const quick = quickRef.current;
      const root = rootRef.current;
      if (!quick || !root || event.pointerType !== "mouse") return;

      const rect = root.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);

      const distance = Math.hypot(dx, dy);
      // Falls off to zero at the edge of the radius: no snap on entry.
      const falloff = Math.max(0, 1 - distance / radius);

      quick.x(dx * strength * falloff);
      quick.y(dy * strength * falloff);
      quick.lx(dx * strength * falloff * 0.35);
      quick.ly(dy * strength * falloff * 0.35);
    },
    [radius, strength],
  );

  const handlePointerLeave = useCallback(() => {
    const quick = quickRef.current;
    if (!quick) return;
    quick.x(0);
    quick.y(0);
    quick.lx(0);
    quick.ly(0);
  }, []);

  return (
    <button
      ref={rootRef}
      type="button"
      onPointerMove={enabled ? handlePointerMove : undefined}
      onPointerLeave={enabled ? handlePointerLeave : undefined}
      className={cn(
        "group relative inline-flex items-center justify-center",
        "rounded-md border border-line bg-raised",
        "px-s4 py-s3 will-change-transform",
        "transition-colors duration-200",
        "hover:border-[var(--acc-line)]",
        className,
      )}
      {...props}
    >
      {/* Accent wash on hover — light, never a fill. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "var(--acc-wash)", boxShadow: "var(--glow-sm)" }}
      />
      <span ref={labelRef} className="relative z-10 will-change-transform">
        {children}
      </span>
    </button>
  );
}

export default MagneticButton;
