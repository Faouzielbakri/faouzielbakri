"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { track } from "@/lib/track";
import type { HeroProps } from "./shared";
import { HERO_KEYS, LEGACY_HERO, type HeroKey, type HeroRoute } from "./variants";

/**
 * Renders the hero the proxy chose, and the small control that lets a visitor
 * step through the other four. Each hero is its own chunk, rendered on the
 * server, so a visitor downloads only the one they see.
 */
const HEROES: Record<HeroKey, React.ComponentType<HeroProps>> = {
  look: dynamic(() => import("./HeroLook").then((m) => m.HeroLook)),
  scratch: dynamic(() => import("./HeroScratch").then((m) => m.HeroScratch)),
  watcher: dynamic(() => import("./HeroWatcher").then((m) => m.HeroWatcher)),
  break: dynamic(() => import("./HeroBreak").then((m) => m.HeroBreak)),
  brief: dynamic(() => import("./HeroBrief").then((m) => m.HeroBrief)),
};

type HeroSwitchProps = HeroProps & { hero: HeroRoute; videoSrc?: string; posterSrc?: string };

export function HeroSwitch({ hero, videoSrc, posterSrc, ...props }: HeroSwitchProps) {
  const index = hero === LEGACY_HERO ? -1 : HERO_KEYS.indexOf(hero);
  const at = (step: number) =>
    `/?hero=${HERO_KEYS[(index + step + HERO_KEYS.length) % HERO_KEYS.length]}`;
  const next = at(1);
  const previous = at(-1);

  // [ and ] step through the heroes; handy when comparing them.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "]") window.location.assign(next);
      else if (e.key === "[") window.location.assign(previous);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, previous]);

  if (hero === LEGACY_HERO) {
    return (
      <div data-hero={hero}>
        <HeroSection {...props} videoSrc={videoSrc} posterSrc={posterSrc} />
      </div>
    );
  }
  const Hero = HEROES[hero];

  return (
    <div className="relative" data-hero={hero}>
      <Hero {...props} />
      {/* A plain link on purpose. The heroes share the URL path, and a client-side
          navigation between them is answered from the router's copy of "/", so
          the hero would not change. A real page load always gets the right one. */}
      <a
        href={next}
        onClick={() => track("hero_next", { from: hero })}
        title="This site has five openings. See the next one."
        className="group absolute right-2 top-1/2 z-30 flex -translate-y-1/2 items-center gap-2 rounded-full border border-white/25 bg-ink/90 px-2 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-bg shadow-[0_10px_30px_-12px_rgba(20,18,16,0.7)] backdrop-blur-sm transition-colors duration-200 hover:bg-accent sm:right-3"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="tabular-nums opacity-60">
          {index + 1}/{HERO_KEYS.length}
        </span>
        <span>next opening</span>
        {/* Vertical writing turns glyphs a quarter turn: this → reads as ↓. */}
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5">
          →
        </span>
      </a>
    </div>
  );
}
