"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/hooks";
import { createBrain, type BrainEvent, type Mood } from "./brain";
import { played } from "@/lib/track";
import { HeroFrame, useHeroTone, useIntentGo, type HeroProps } from "./shared";

/**
 * LOOK.
 *
 * A poster, not a layout: an orange wall and one word as tall as the screen,
 * whose two O's are eyes. They follow the cursor and have opinions about it:
 * bored when ignored, annoyed when poked, dizzy when shaken, asleep when left
 * alone, and startled when caught sleeping. Poked too many times they lose it:
 * the wall goes black, the page gets knocked about, and afterwards they are
 * sorry and put it back.
 */

const DEFAULT_CAPTION = "at what I build";

const CAPTIONS: Record<BrainEvent, string> = {
  edge: "is something over there?",
  target: "the button is right there",
  roll: "any day now",
  shifty: "act natural",
  sleepy: "so… quiet…",
  asleep: "zzz",
  wake: "I was resting my eyes",
  dizzy: "stop. I'm dizzy",
  annoyed1: "ow. stop poking",
  annoyed2: "I only have two of these",
  annoyed3: "fine. you win. hire him",
  gone: "…hello?",
  ignored: "…I said look",
  resume: DEFAULT_CAPTION,
};

/** How each mood draws: lids (0 open – 1 shut), pupil size, brow tilt and lift. */
type Phase = "normal" | "rage" | "sorry";

/** Six pokes inside five seconds is one too many. */
const RAGE_POKES = 6;
const RAGE_WINDOW = 5000;

const FACE: Record<Mood | "keen" | "rage" | "sorry", { lid: number; pupil: number; brow: number; lift: number }> = {
  rage: { lid: 0.22, pupil: 0.34, brow: 2.3, lift: 16 },
  sorry: { lid: 0.2, pupil: 1.15, brow: -1.6, lift: -2 },
  calm: { lid: 0, pupil: 1, brow: 0, lift: 0 },
  keen: { lid: 0, pupil: 1.28, brow: -0.6, lift: -14 },
  bored: { lid: 0.3, pupil: 0.85, brow: 1, lift: 0 },
  sleepy: { lid: 0.62, pupil: 0.9, brow: -0.3, lift: 8 },
  asleep: { lid: 1, pupil: 0.9, brow: -0.2, lift: 12 },
  startled: { lid: 0, pupil: 0.55, brow: -0.9, lift: -30 },
  dizzy: { lid: 0.12, pupil: 0.8, brow: -0.4, lift: -8 },
  annoyed: { lid: 0.36, pupil: 0.9, brow: 1.5, lift: 6 },
  sad: { lid: 0.18, pupil: 1.1, brow: -1.3, lift: -4 },
};

const R = 100; // eye radius in its own viewBox

function Eye({ index, onPoke }: { index: number; onPoke: (i: number, t: number) => void }) {
  return (
    <svg
      data-look-eye
      viewBox="-110 -150 220 260"
      className="h-[0.86em] w-auto shrink-0 cursor-pointer overflow-visible"
      onPointerDown={(e) => onPoke(index, e.timeStamp)}
      aria-hidden
    >
      <defs>
        <clipPath id={`look-clip-${index}`}>
          <circle r={R - 5} />
        </clipPath>
      </defs>
      <line
        data-brow
        x1="-70"
        y1="-128"
        x2="70"
        y2="-128"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <circle r={R} fill="var(--color-bg)" stroke="currentColor" strokeWidth="12" />
      <g clipPath={`url(#look-clip-${index})`}>
        <g data-pupil>
          <circle r="40" fill="currentColor" />
          <circle cx="-13" cy="-15" r="12" fill="var(--color-bg)" />
        </g>
        {/* Lids close from the top and bottom together */}
        <rect data-lid-top x={-R} y={-R} width={R * 2} height="0" fill="currentColor" />
        <rect data-lid-bottom x={-R} y={R} width={R * 2} height="0" fill="currentColor" />
      </g>
    </svg>
  );
}

export function HeroLook({ name, headline, positioning }: HeroProps) {
  const reduced = useReducedMotionSafe();
  const go = useIntentGo();
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const keen = useRef(false);
  const poked = useRef<{ index: number; at: number }>({ index: -1, at: 0 });
  const brainRef = useRef<ReturnType<typeof createBrain> | null>(null);
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [phase, setPhase] = useState<Phase>("normal");
  const phaseRef = useRef<Phase>("normal");
  const pokeTimes = useRef<number[]>([]);
  const timers = useRef<number[]>([]);
  useHeroTone(phase === "rage" ? "dark" : "light");

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    const section = sectionRef.current;
    const word = wordRef.current;
    if (!section || !word) return;
    const eyes = Array.from(section.querySelectorAll<SVGSVGElement>("[data-look-eye]"));

    const brain = createBrain(
      (event) => {
        // While it is raging or apologising, it has its own lines.
        if (phaseRef.current === "normal") setCaption(CAPTIONS[event]);
      },
      () =>
        Array.from(ctaRef.current?.querySelectorAll("button") ?? []).map((b) => {
          const r = b.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }),
    );
    brainRef.current = brain;

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      brain.move(e.clientX, e.clientY, e.timeStamp);
    };
    const onLeave = (e: PointerEvent) => brain.leave(e.timeStamp);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let nextBlink = performance.now() + 2000;
    const state = eyes.map(() => ({ x: 0, y: 0, lid: 0, pupil: 1, brow: 0, lift: 0 }));

    const frame = (now: number) => {
      let blink = 0;
      if (now > nextBlink) {
        const t = (now - nextBlink) / 160;
        if (t >= 1) nextBlink = now + 1800 + Math.random() * 3400;
        else blink = 1 - Math.abs(t * 2 - 1);
      }

      const box = word.getBoundingClientRect();
      const live = brain.update(now, box.left + box.width / 2, box.top + box.height / 2);
      const phase = phaseRef.current;
      // Rage glares at the cursor; remorse looks at the floor.
      const gaze =
        phase === "rage"
          ? { ...live, x: mouse.x, y: mouse.y, spin: null, mood: "annoyed" as Mood }
          : phase === "sorry"
            ? { ...live, x: box.left + box.width / 2, y: box.bottom + 500, spin: null, mood: "sad" as Mood }
            : live;
      const face =
        FACE[phase !== "normal" ? phase : gaze.mood === "calm" && keen.current ? "keen" : gaze.mood];
      const asleep = phase === "normal" && (gaze.mood === "asleep" || gaze.mood === "sleepy");

      // The whole word shudders while dizzy or annoyed, and thrashes in a rage.
      const shake =
        phase === "rage" ? 11 : phase === "sorry" ? 0 : gaze.mood === "dizzy" ? 5 : gaze.mood === "annoyed" ? 2.5 : 0;
      word.style.transform = shake
        ? `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px) rotate(${Math.sin(now / 90) * shake * 0.12}deg)`
        : "";

      eyes.forEach((svg, i) => {
        const r = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * (150 / 260);
        const scale = r.width / 220;
        const s = state[i];

        let wantX: number;
        let wantY: number;
        if (gaze.spin !== null) {
          // Dizzy eyes spin against each other; an eye-roll goes round together.
          const dizzy = gaze.mood === "dizzy";
          const a = gaze.spin * (dizzy && i ? -1 : 1) + (dizzy ? i * 2 : 0);
          wantX = Math.cos(a) * 46;
          wantY = Math.sin(a) * 46;
        } else {
          const dx = gaze.x - cx;
          const dy = gaze.y - cy;
          const d = Math.hypot(dx, dy) || 1;
          const travel = Math.min(1, d / (R * scale * 2.2)) * 50;
          wantX = (dx / d) * travel;
          wantY = (dy / d) * travel;
        }
        const ease = gaze.spin !== null ? 0.5 : 0.2;
        s.x += (wantX - s.x) * ease;
        s.y += (wantY - s.y) * ease;
        s.lid += (face.lid - s.lid) * 0.14;
        s.pupil += (face.pupil - s.pupil) * 0.2;
        s.brow += (face.brow - s.brow) * 0.14;
        s.lift += (face.lift - s.lift) * 0.14;

        const sincePoke = poked.current.index === i ? now - poked.current.at : Infinity;
        const wince = sincePoke < 700 ? 1 - sincePoke / 700 : 0;

        svg
          .querySelector("[data-pupil]")
          ?.setAttribute("transform", `translate(${s.x} ${s.y}) scale(${s.pupil})`);

        // Positive brow drops the inner end (a frown); negative raises it.
        const inner = i === 0 ? 1 : -1;
        const breathe = gaze.mood === "asleep" ? Math.sin(now / 700) * 4 : 0;
        const y = -128 + s.lift + breathe;
        const brow = svg.querySelector("[data-brow]");
        brow?.setAttribute("y1", String(y + (inner < 0 ? s.brow * 28 : -s.brow * 6)));
        brow?.setAttribute("y2", String(y + (inner > 0 ? s.brow * 28 : -s.brow * 6)));

        // A sleeping eye closes from the top only; a blink or wince meets in the middle.
        const shut = Math.min(1, Math.max(blink, wince, s.lid));
        const top = asleep ? R * 2 * shut : R * 1.3 * shut;
        const rise = asleep ? 0 : R * 0.7 * shut;
        svg.querySelector("[data-lid-top]")?.setAttribute("height", String(top));
        const bottom = svg.querySelector("[data-lid-bottom]");
        bottom?.setAttribute("y", String(R - rise));
        bottom?.setAttribute("height", String(rise));
      });

      if (!reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  const setPhaseNow = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  /** Rage, then remorse, then back to normal. */
  const rage = () => {
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    setPhaseNow("rage");
    played("rage");
    setCaption("THAT'S IT");
    later(1300, () => setCaption("I. SAID. STOP"));
    later(4300, () => {
      setPhaseNow("sorry");
      setCaption("…sorry. I'll put it back");
    });
    later(7600, () => {
      setPhaseNow("normal");
      setCaption(DEFAULT_CAPTION);
    });
  };

  const poke = (index: number, t: number) => {
    poked.current = { index, at: t };
    played("poke");
    if (phaseRef.current !== "normal") return;
    pokeTimes.current = [...pokeTimes.current.filter((p) => t - p < RAGE_WINDOW), t];
    if (pokeTimes.current.length >= RAGE_POKES && !reduced) {
      pokeTimes.current = [];
      rage();
      return;
    }
    const tipped = brainRef.current?.poke(t);
    if (!tipped) setCaption("ow");
  };

  const raging = phase === "rage";
  /** Knocked away fast, put back with a bounce. */
  const knock = (transform: string): React.CSSProperties => ({
    transform: raging ? transform : "none",
    transition: raging
      ? "transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1)"
      : "transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  });
  const setKeen = (on: boolean) => {
    keen.current = on;
  };

  return (
    <HeroFrame
      sectionRef={sectionRef}
      className={`transition-colors duration-200 ${
        raging ? "bg-ink text-accent" : "bg-accent text-ink"
      }`}
    >
      <div className="flex flex-1 flex-col justify-between px-[var(--gutter)] pb-8 pt-6 lg:min-h-0">
        <div
          className="flex items-start justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={knock("translateY(-520%) rotate(-3deg)")}
        >
          {/* The page's real heading; the giant word below is the picture. */}
          <h1 className="font-normal">
            <span className="font-display block text-xl font-bold normal-case leading-none tracking-[-0.02em] sm:text-2xl lg:text-[1.75rem]">
              {name}
            </span>
            <span className="mt-2 block opacity-70">{positioning}</span>
          </h1>
          <p className="text-right opacity-60">
            Agadir, Morocco
            <br />
            working worldwide
          </p>
        </div>

        <p
          ref={wordRef}
          role="img"
          aria-label={`Look ${DEFAULT_CAPTION}`}
          className="font-display flex select-none items-center justify-center font-bold leading-none tracking-[-0.06em]"
          style={{ fontSize: "clamp(6rem, min(31vw, 54vh), 34rem)" }}
        >
          <span aria-hidden className="inline-block" style={knock("translate(-9%, 3%) rotate(-11deg)")}>
            L
          </span>
          <span aria-hidden className="mx-[0.02em] flex items-center gap-[0.03em]">
            <Eye index={0} onPoke={poke} />
            <Eye index={1} onPoke={poke} />
          </span>
          <span aria-hidden className="inline-block" style={knock("translate(9%, 2%) rotate(10deg)")}>
            K
          </span>
        </p>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p
            aria-live="polite"
            className="origin-bottom-left leading-none"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: raging ? 700 : 500,
              fontSize: "clamp(2rem, min(5vw, 8vh), 4.5rem)",
              ...knock("scale(1.18) rotate(-2deg)"),
            }}
          >
            {caption}
            {/[?!.…]$/.test(caption) ? null : <span className="not-italic">.</span>}
          </p>
          <div
            className="flex flex-col items-start gap-4 sm:items-end"
            style={knock("translate(6%, 150%) rotate(14deg)")}
          >
            <p className="max-w-sm text-lg leading-snug sm:text-right">{headline}</p>
            <div
              ref={ctaRef}
              className="flex flex-wrap gap-3"
              onPointerEnter={() => setKeen(true)}
              onPointerLeave={() => setKeen(false)}
            >
              <button
                type="button"
                onClick={() => go("hire")}
                className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
              >
                Hire me for a team
              </button>
              <button
                type="button"
                onClick={() => go("project")}
                className="rounded-full border-2 border-current px-7 py-3 text-sm font-medium transition-colors duration-200 hover:bg-ink hover:text-bg"
              >
                Work with me on a project
              </button>
            </div>
          </div>
        </div>
      </div>
    </HeroFrame>
  );
}
