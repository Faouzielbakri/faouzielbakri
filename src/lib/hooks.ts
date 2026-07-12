"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useMotionPrefs, useUiStore } from "./store";

/**
 * True when motion should be suppressed — either the OS asks for it or the
 * visitor flipped the on-site toggle. Every scroll/entrance effect gates on
 * this and renders its static fallback instead.
 */
export function useReducedMotionSafe(): boolean {
  const system = useReducedMotion();
  const override = useMotionPrefs((s) => s.motionOverride);
  return Boolean(system) || override;
}

/**
 * Registers a landing-page section with the scroll-spy. The section whose
 * element crosses the middle of the viewport becomes `activeSection`.
 */
export function useSectionSpy<T extends HTMLElement>(id: string) {
  const ref = useRef<T | null>(null);
  const setActiveSection = useUiStore((s) => s.setActiveSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveSection]);

  return ref;
}
