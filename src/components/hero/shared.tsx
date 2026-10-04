"use client";

import { useEffect, useRef } from "react";
import { IntentToggle } from "@/components/ui/IntentToggle";
import { LocalTime } from "@/components/layout/LocalTime";
import { useSectionSpy } from "@/lib/hooks";
import { useUiStore, type AudienceIntent } from "@/lib/store";
import { track } from "@/lib/track";

export type HeroProps = {
  name: string;
  headline: string;
  positioning: string;
  microline: string;
};

export const INK = "#141210";
export const ACCENT = "#e8590c";
export const MUTED = "#6e6a63";

export type Pointer = {
  /** Position in px relative to the section's top-left corner. */
  x: number;
  y: number;
  /** False until the pointer has entered, and again after it leaves. */
  active: boolean;
  /** Incremented on every press, so a render loop can react to clicks. */
  clicks: number;
};

/**
 * Tracks the pointer over an element without re-rendering: the value lives in
 * a ref that animation loops read every frame.
 */
export function usePointer<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false, clicks: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = e.clientX - r.left;
      pointer.current.y = e.clientY - r.top;
      pointer.current.active = true;
    };
    const leave = () => {
      pointer.current.active = false;
    };
    const down = (e: PointerEvent) => {
      move(e);
      pointer.current.clicks += 1;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
    };
  }, []);

  return [ref, pointer] as const;
}

/** Sizes a canvas to its box at device resolution and reports the CSS size. */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

/** Canvas cannot read CSS variables in `ctx.font`; resolve the mono family once. */
export function monoFamily() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
  return `${v ? `${v}, ` : ""}ui-monospace, monospace`;
}

/**
 * The section every hero variant lives in: scroll-spy id, height, clipping.
 * On desktop it is exactly one screen tall: the hero owns the first screen and
 * the proof strip is the first thing a scroll reveals.
 */
export function HeroFrame({
  sectionRef,
  className = "",
  children,
}: {
  sectionRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  children: React.ReactNode;
}) {
  const spyRef = useSectionSpy<HTMLElement>("hero");
  return (
    <section
      id="hero"
      ref={(el) => {
        spyRef.current = el;
        if (sectionRef) sectionRef.current = el;
      }}
      className={`relative flex min-h-screen flex-col overflow-hidden pt-16 lg:h-svh lg:min-h-[640px] ${className}`}
    >
      {children}
    </section>
  );
}

/** The status pill under the nav. */
export function SystemBar({ positioning, note }: { positioning: string; note?: string }) {
  return (
    <div className="rail relative z-10 w-full">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-full border border-ink/10 bg-surface/60 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur-sm sm:text-[11px]">
        <span className="inline-flex items-center gap-2 text-ink">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          Available for work
        </span>
        <span className="hidden sm:inline">{note ?? positioning}</span>
        <span>
          Agadir · <LocalTime />
        </span>
      </div>
    </div>
  );
}

/** The statement and the two-way call to action that close every hero. */
export function HeroStatement({
  headline,
  align = "right",
  className = "",
}: {
  headline: string;
  align?: "left" | "right";
  className?: string;
}) {
  const right = align === "right";
  return (
    <div
      className={`flex flex-col gap-5 ${right ? "items-start sm:items-end" : "items-start"} ${className}`}
    >
      <p
        className={`max-w-md leading-snug text-ink-soft ${right ? "sm:text-right" : ""}`}
        style={{ fontSize: "var(--text-lead)" }}
      >
        {headline}
        <span className="text-muted"> Shipped from Agadir, used worldwide.</span>
      </p>
      <IntentToggle />
    </div>
  );
}

/** The huge two-line name. */
export function BigName({
  name,
  className = "",
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [first, ...rest] = name.split(" ");
  return (
    <h1
      className={`font-display font-bold uppercase leading-[0.85] tracking-[-0.03em] ${className}`}
      style={{ fontSize: "clamp(3.25rem, 10vw, 10.5rem)", ...style }}
    >
      <span className="block">{first}</span>
      <span className="block lg:pl-[10vw]">{rest.join(" ")}</span>
    </h1>
  );
}

/**
 * The two-way call to action, unstyled: records the visitor's intent and
 * scrolls to the contact section, so each hero can draw its own buttons.
 */
export function useIntentGo() {
  const setIntent = useUiStore((s) => s.setAudienceIntent);
  return (intent: Exclude<AudienceIntent, null>) => {
    setIntent(intent);
    track("cta", { kind: intent });
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/** Lets a dark hero flip the fixed nav to its light-on-dark palette. */
export function useHeroTone(tone: "light" | "dark") {
  const setHeroTone = useUiStore((s) => s.setHeroTone);
  useEffect(() => {
    setHeroTone(tone);
    return () => setHeroTone("light");
  }, [tone, setHeroTone]);
}
