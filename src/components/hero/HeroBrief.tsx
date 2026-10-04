"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";
import { useReducedMotionSafe } from "@/lib/hooks";
import { played, track } from "@/lib/track";
import { HeroFrame, useIntentGo, type HeroProps } from "./shared";

/**
 * the brief.
 *
 * The hero is one sentence the visitor finishes: "I need [this] for [them],
 * [by then]." The three blanks are slot-machine reels; a click spins one, the
 * lever spins all three. Every result answers with something he has actually
 * built that matches, and the sentence becomes the subject line of an email,
 * so playing with the page writes the brief.
 */

type Thing = {
  label: string;
  color: string;
  proof: string;
  project: string;
  slug?: string;
};

const THINGS: Thing[] = [
  { label: "an AI agent", color: "#0e7a5f", proof: "Four agents that draft a legal appeal end to end.", project: "FASL", slug: "fasl" },
  { label: "a WhatsApp bot", color: "#1fa855", proof: "An agent that interviews workers in Darija and matches them to jobs.", project: "RESO Khdma", slug: "reso-khdma" },
  { label: "an MVP", color: "#d6336c", proof: "Launched from an empty repo, live with paying customers.", project: "Magical Hekaya", slug: "magical-hekaya" },
  { label: "an online store", color: "#e8590c", proof: "818 clients and 629 orders in its first two months.", project: "Belmo", slug: "belmo" },
  { label: "an automation", color: "#1971c2", proof: "Seven agents that turn one product photo into a finished video ad.", project: "Laqta", slug: "laqta" },
  { label: "a web app", color: "#7048e8", proof: "An e-learning platform with about 500 students enrolled.", project: "Magic Hands LMS" },
];

const WHO = ["my startup", "my shop", "my law firm", "my clinic", "my agency", "my team"];

const WHEN = [
  { label: "this quarter", reply: "A sane timeline. Good." },
  { label: "this month", reply: "Then we cut the scope hard. I'll tell you what fits." },
  { label: "yesterday", reply: "I can't do yesterday. I can do a free call this week." },
];

/** One reel: shows the current word, rolls to the next on change. */
function Reel({
  word,
  color,
  fg = "#fff",
  tilt,
  onSpin,
  reduced,
}: {
  word: string;
  color: string;
  fg?: string;
  tilt: number;
  onSpin: () => void;
  reduced: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSpin}
      title="Click to change"
      className="font-display relative mx-[0.08em] inline-flex overflow-hidden border-[3px] border-ink px-[0.22em] pb-[0.1em] pt-[0.04em] align-baseline font-bold leading-[1.05] tracking-[-0.03em] shadow-[0.09em_0.09em_0_0_var(--color-ink)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
      style={{ background: color, color: fg, transform: `rotate(${tilt}deg)`, fontSize: "0.86em" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          className="block whitespace-nowrap"
          initial={reduced ? false : { y: "-105%" }}
          animate={{ y: "0%" }}
          exit={reduced ? undefined : { y: "105%" }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function HeroBrief({ name, positioning }: HeroProps) {
  const reduced = useReducedMotionSafe();
  const go = useIntentGo();
  const [pick, setPick] = useState({ thing: 0, who: 0, when: 0 });
  const [spinning, setSpinning] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const step = (key: "thing" | "who" | "when", size: number) =>
    setPick((p) => ({ ...p, [key]: (p[key] + 1) % size }));
  const spin = (key: "thing" | "who" | "when", size: number) => {
    played("reel");
    step(key, size);
  };

  /** The lever: each reel ticks a different number of times, left to right. */
  const pull = () => {
    if (spinning) return;
    played("spin-all");
    if (reduced) {
      setPick({
        thing: Math.floor(Math.random() * THINGS.length),
        who: Math.floor(Math.random() * WHO.length),
        when: Math.floor(Math.random() * WHEN.length),
      });
      return;
    }
    setSpinning(true);
    const reels: ["thing" | "who" | "when", number, number][] = [
      ["thing", THINGS.length, 7 + Math.floor(Math.random() * THINGS.length)],
      ["who", WHO.length, 12 + Math.floor(Math.random() * WHO.length)],
      ["when", WHEN.length, 17 + Math.floor(Math.random() * WHEN.length)],
    ];
    let longest = 0;
    for (const [key, size, ticks] of reels) {
      for (let i = 1; i <= ticks; i++) {
        timers.current.push(window.setTimeout(() => step(key, size), i * 85));
      }
      longest = Math.max(longest, ticks * 85);
    }
    timers.current.push(window.setTimeout(() => setSpinning(false), longest + 200));
  };

  const thing = THINGS[pick.thing];
  const who = WHO[pick.who];
  const when = WHEN[pick.when];
  const sentence = `I need ${thing.label} for ${who}, ${when.label}.`;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(sentence)}`;

  return (
    <HeroFrame>
      {/* Paper ground with a tinted corner in the colour of the current pick */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background] duration-500"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 88% 12%, ${thing.color}2e, transparent 70%)`,
        }}
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col justify-between px-[var(--gutter)] pb-10 pt-6 lg:min-h-0 lg:pb-8">
        <div className="flex items-start justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.22em]">
          {/* The page's real heading; the sentence below is the toy. */}
          <h1 className="font-normal">
            <span className="font-display block text-xl font-bold normal-case leading-none tracking-[-0.02em] sm:text-2xl lg:text-[1.75rem]">
              {name}
            </span>
            <span className="mt-2 block text-muted">{positioning}</span>
          </h1>
          <p className="text-right text-muted">
            Finish the sentence.
            <br />
            Click a word to change it.
          </p>
        </div>

        <p
          aria-label={sentence}
          className="my-8 max-w-[16ch] text-ink lg:my-3"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 500,
            fontSize: "clamp(2.6rem, min(8.2vw, 11vh), 9rem)",
            lineHeight: 1.12,
            letterSpacing: "-0.035em",
          }}
        >
          I need{" "}
          <Reel
            word={thing.label}
            color={thing.color}
            tilt={-2}
            reduced={reduced}
            onSpin={() => spin("thing", THINGS.length)}
          />{" "}
          for{" "}
          <Reel
            word={who}
            color="var(--color-ink)"
            tilt={1.5}
            reduced={reduced}
            onSpin={() => spin("who", WHO.length)}
          />
          ,{" "}
          <Reel
            word={when.label}
            color="var(--color-saffron)"
            fg="var(--color-ink)"
            tilt={-1}
            reduced={reduced}
            onSpin={() => spin("when", WHEN.length)}
          />
          .
        </p>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          {/* The answer */}
          <div className="max-w-xl border-2 border-ink bg-surface p-5 shadow-[7px_7px_0_0_var(--color-ink)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              Built one already
            </p>
            <p className="font-display mt-2 text-2xl font-bold leading-tight" style={{ color: thing.color }}>
              {thing.project}
            </p>
            <p className="mt-1 text-[17px] leading-snug text-ink-soft">{thing.proof}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-[15px] text-ink-soft">
              <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}>
                “{when.label}”: {when.reply}
              </span>
              {thing.slug && (
                <Link
                  href={`/work/${thing.slug}`}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted underline decoration-dotted underline-offset-4 hover:text-accent"
                >
                  Case study →
                </Link>
              )}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={pull}
                disabled={spinning}
                className="border-2 border-ink bg-surface px-6 py-3 font-mono text-[12px] uppercase tracking-[0.15em] text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-50"
              >
                {spinning ? "Spinning…" : "↻ Spin all three"}
              </button>
              <a
                href={mailto}
                onClick={() => track("cta", { kind: "brief", brief: sentence })}
                className="border-2 border-ink bg-accent px-6 py-3 text-sm font-medium text-white shadow-[4px_4px_0_0_var(--color-ink)] transition-transform duration-150 hover:-translate-y-0.5"
              >
                Send me this brief →
              </a>
            </div>
            <button
              type="button"
              onClick={() => go("hire")}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted underline decoration-dotted underline-offset-4 hover:text-ink"
            >
              Hiring for a team instead? →
            </button>
          </div>
        </div>
      </div>
    </HeroFrame>
  );
}
