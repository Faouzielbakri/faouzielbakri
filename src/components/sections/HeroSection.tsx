"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { IntentToggle } from "@/components/ui/IntentToggle";
import { LocalTime } from "@/components/layout/LocalTime";
import { duration, easeOut } from "@/lib/motion";
import { useReducedMotionSafe, useSectionSpy } from "@/lib/hooks";

type HeroSectionProps = {
  name: string;
  headline: string;
  positioning: string;
  microline: string;
  videoSrc?: string;
  posterSrc?: string;
};

/* ── The build script the agent executes ─────────────────────────────────
 * Not a portfolio masthead: the visitor lands inside the agent's workspace
 * while it assembles the scene. Each line advances `stage`, and every
 * element of the canvas is gated on a stage:
 *   1 system bar + manifest · 2 name · 3 film · 4 statement/toggle · 5 done
 */
const FINAL_STAGE = 5;
const SESSION_KEY = "feb-hero-built";

const SCRIPT: { text: string; stage: number; pause: number }[] = [
  { text: "▸ boot workspace — agadir · online ✓", stage: 1, pause: 520 },
  { text: "▸ printing name…", stage: 2, pause: 950 },
  { text: "▸ rendering film — gemini omni ✓ (2.0 MB)", stage: 3, pause: 780 },
  { text: "▸ hydrating proof — fasl.ma 58.4K impressions ✓", stage: 4, pause: 620 },
];

const BOOT_CMD = "$ agent run build-hero";

/* ── Per-character masked reveal, gated on stage ─────────────────────── */

const charVariants = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: duration.cinematic, ease: easeOut, delay: 0.03 * i },
  }),
};

function MaskedLine({
  text,
  show,
  instant,
  offset = 0,
  className = "",
}: {
  text: string;
  show: boolean;
  instant: boolean;
  offset?: number;
  className?: string;
}) {
  if (instant) {
    return <span className={`block ${className}`}>{text}</span>;
  }
  return (
    <span aria-hidden className={`block ${className}`}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            custom={offset + i}
            initial="hidden"
            animate={show ? "visible" : "hidden"}
            variants={charVariants}
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Staged block ─────────────────────────────────────────────────────── */

function Staged({
  show,
  instant,
  delay = 0,
  className,
  children,
}: {
  show: boolean;
  instant: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  if (instant) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: duration.standard, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Console dock — bottom-left pane, IDE style ──────────────────────── */

function ConsoleDock({
  typedCmd,
  lines,
  onSkip,
}: {
  typedCmd: string;
  lines: string[];
  onSkip: () => void;
}) {
  return (
    <motion.div
      key="console"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.4, ease: easeOut } }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="w-full max-w-md"
    >
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-surface/85 shadow-[0_24px_60px_-28px_rgba(20,18,16,0.4)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-ink/10 px-3.5 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            console — faouzi@agadir
          </span>
          <button
            type="button"
            onClick={onSkip}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
          >
            skip ↦
          </button>
        </div>
        <div className="px-4 py-3 font-mono text-xs leading-6 text-ink-soft">
          <p className="text-ink">
            {typedCmd}
            <span className="ml-0.5 inline-block h-[1em] w-[6px] translate-y-[2px] animate-pulse bg-accent" />
          </p>
          {lines.map((line, i) => (
            <motion.p
              key={`${i}-${line}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
              className={line.startsWith("✓") ? "text-accent-deep" : undefined}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Build manifest — the system readout on the right edge ───────────── */

function ManifestRow({
  label,
  value,
  show,
  instant,
}: {
  label: string;
  value: string;
  show: boolean;
  instant: boolean;
}) {
  return (
    <Staged show={show} instant={instant} className="flex items-baseline gap-2">
      <span className="text-muted">{label}</span>
      <span aria-hidden className="flex-1 border-b border-dotted border-ink/20" />
      <span className="text-ink">
        {value} <span className="text-accent-deep">✓</span>
      </span>
    </Staged>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

export function HeroSection({
  name,
  headline,
  positioning,
  microline,
  videoSrc,
  posterSrc,
}: HeroSectionProps) {
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement | null>(null);
  const spyRef = useSectionSpy<HTMLElement>("hero");

  /* Build director state */
  const [stage, setStage] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [instant, setInstant] = useState(false);
  const [buildSeconds, setBuildSeconds] = useState("3.2");
  const timers = useRef<number[]>([]);
  const startedAt = useRef(0);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  /* One build, one deploy line. The scroll handler below fires `skip()` on
   * every scroll event, and `running` stays true for another 650ms after the
   * build lands — without this latch each of those events appended another
   * "hero deployed" line (and reset the 650ms timer, so a continuous scroll
   * never stopped appending). */
  const finished = useRef(false);

  const finish = useCallback((seconds?: string) => {
    if (finished.current) return;
    finished.current = true;
    clearTimers();
    if (seconds) setBuildSeconds(seconds);
    setLines((prev) =>
      prev.length >= SCRIPT.length
        ? [...prev, `✓ hero deployed in ${seconds ?? "3.2"}s`]
        : [...SCRIPT.map((s) => s.text), `✓ hero deployed in ${seconds ?? "3.2"}s`],
    );
    setStage(FINAL_STAGE);
    timers.current.push(
      window.setTimeout(() => {
        setRunning(false);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      }, 650),
    );
  }, []);

  const skip = useCallback(() => {
    const elapsed = startedAt.current
      ? Math.max(0.4, (performance.now() - startedAt.current) / 1000).toFixed(1)
      : undefined;
    finish(elapsed);
  }, [finish]);

  const run = useCallback(() => {
    clearTimers();
    finished.current = false;
    setStage(0);
    setLines([]);
    setTypedCmd("");
    setRunning(true);
    startedAt.current = performance.now();

    /* 1 — type the command */
    BOOT_CMD.split("").forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => setTypedCmd(BOOT_CMD.slice(0, i + 1)), 320 + i * 26),
      );
    });
    let at = 320 + BOOT_CMD.length * 26 + 300;

    /* 2 — execute the script beats */
    for (const step of SCRIPT) {
      timers.current.push(
        window.setTimeout(() => {
          setLines((prev) => [...prev, step.text]);
          setStage(step.stage);
        }, at),
      );
      at += step.pause;
    }

    /* 3 — deploy */
    timers.current.push(
      window.setTimeout(() => {
        const elapsed = ((performance.now() - startedAt.current) / 1000).toFixed(1);
        finish(elapsed);
      }, at),
    );
  }, [finish]);

  /* Decide before first paint: run the theater, or restore the built hero.
   * Setting state here is deliberate — the choice must land before paint so
   * returning visitors never see a flash of the unbuilt hero. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    let alreadyBuilt = false;
    try {
      alreadyBuilt = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    if (reduced || alreadyBuilt) {
      setInstant(true);
      setStage(FINAL_STAGE);
      setRunning(false);
      return;
    }
    run();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* Scrolling away mid-theater completes the build instantly. */
  useEffect(() => {
    if (!running) return;
    const onScroll = () => window.scrollY > 40 && skip();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [running, skip]);

  const replay = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setInstant(false);
    run();
  }, [run]);

  /* Scroll-out: type drifts up, film scales into itself */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const typeOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  /* Mouse parallax: name and film drift on opposite vectors */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const nameX = useSpring(useTransform(mx, [-1, 1], [-7, 7]), { stiffness: 60, damping: 18 });
  const filmX = useSpring(useTransform(mx, [-1, 1], [10, -10]), { stiffness: 60, damping: 18 });
  const filmY = useSpring(useTransform(my, [-1, 1], [7, -7]), { stiffness: 60, damping: 18 });

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  const [first, ...rest] = name.split(" ");
  const lineTwo = rest.join(" ");
  const showTheater = running && !reduced;
  const deployed = stage >= FINAL_STAGE && !running;

  return (
    <section
      id="hero"
      ref={(el) => {
        sectionRef.current = el;
        spyRef.current = el;
      }}
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen flex-col overflow-hidden pt-16"
    >
      {/* ── The film — full-bleed canvas the whole scene lives on ────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={instant ? undefined : { scale: filmScale, x: filmX, y: filmY }}
        initial={instant ? false : { opacity: 0 }}
        animate={stage >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.4, ease: easeOut }}
      >
        <div className="grain absolute inset-[-2%]">
          <AmbientVideo
            src={videoSrc}
            poster={posterSrc}
            alt="Generated film — ink wireframes assembling into a finished product"
            className="h-full w-full"
          />
        </div>
        {/* Legibility scrims: the canvas fades into the page at its edges */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg/95 via-bg/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-bg/70 to-transparent" />
      </motion.div>

      {/* ── Viewfinder chrome — instrument frame, not a masthead ─────── */}
      <div aria-hidden className="pointer-events-none absolute inset-3 z-20 sm:inset-5">
        <div className="absolute inset-0 rounded-sm border border-ink/10" />
        {/* Corner ticks */}
        {[
          "left-0 top-0 border-l-2 border-t-2",
          "right-0 top-0 border-r-2 border-t-2",
          "bottom-0 left-0 border-b-2 border-l-2",
          "bottom-0 right-0 border-b-2 border-r-2",
        ].map((pos) => (
          <span key={pos} className={`absolute size-4 border-ink/40 ${pos}`} />
        ))}
      </div>

      {/* Right-edge caption — rotated, like a film canister label */}
      <Staged
        show={stage >= 3}
        instant={instant}
        className="pointer-events-none absolute right-7 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
          style={{ writingMode: "vertical-rl" }}
        >
          Film rendered by the build agent — Gemini Omni
        </p>
      </Staged>

      {/* ── System bar — stage 1 ─────────────────────────────────────── */}
      <Staged show={stage >= 1} instant={instant} className="rail relative z-10 w-full">
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-full border border-ink/10 bg-surface/60 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur-sm sm:text-[11px]">
          <span className="inline-flex items-center gap-2 text-ink">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            sys online — available for work
          </span>
          <span className="hidden sm:inline">{positioning}</span>
          <span>
            Agadir · <LocalTime /> · 30.42°N 9.60°W
          </span>
        </div>
      </Staged>

      {/* ── The name — printed in ink onto the film ──────────────────── */}
      <div className="rail relative z-10 flex w-full flex-1 flex-col justify-center">
        <motion.h1
          aria-label={name}
          className="font-display relative z-10 font-bold uppercase leading-[0.85] tracking-[-0.03em]"
          style={{
            fontSize: "clamp(3.5rem, 10.5vw, 11rem)",
            mixBlendMode: "multiply",
            ...(instant ? {} : { y: typeY, opacity: typeOpacity, x: nameX }),
          }}
        >
          <MaskedLine text={first} show={stage >= 2} instant={instant} />
          <MaskedLine
            text={lineTwo}
            show={stage >= 2}
            instant={instant}
            offset={first.length}
            className="lg:pl-[10vw]"
          />
        </motion.h1>
        <Staged show={stage >= 2} instant={instant} delay={0.3} className="mt-4">
          <p className="max-w-md font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted">
            {microline}
          </p>
        </Staged>

        {/* Build manifest — system readout, right side */}
        <div className="pointer-events-none absolute bottom-4 right-[var(--gutter)] z-10 hidden w-60 flex-col gap-2 font-mono text-[11px] lg:flex">
          <p className="mb-1 border-b border-ink/15 pb-2 text-[10px] uppercase tracking-[0.25em] text-muted">
            build manifest
          </p>
          <ManifestRow label="cv" value="6+ yrs" show={stage >= 1} instant={instant} />
          <ManifestRow label="name" value="printed" show={stage >= 2} instant={instant} />
          <ManifestRow label="film" value="gemini omni" show={stage >= 3} instant={instant} />
          <ManifestRow label="proof" value="58.4K reach" show={stage >= 4} instant={instant} />
          <Staged show={deployed} instant={instant} className="flex items-baseline gap-2">
            <span className="text-muted">status</span>
            <span aria-hidden className="flex-1 border-b border-dotted border-ink/20" />
            <span className="text-accent-deep">deployed {buildSeconds}s</span>
          </Staged>
        </div>
      </div>

      {/* ── Base: console dock + statement + intent ──────────────────── */}
      <div className="rail relative z-10 w-full pb-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Console dock: theater while running, status line once idle */}
          <div className="min-h-10 flex-1">
            <AnimatePresence mode="wait">
              {showTheater ? (
                <ConsoleDock typedCmd={typedCmd} lines={lines} onSkip={skip} />
              ) : (
                <motion.div
                  key="idle"
                  initial={instant ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-surface/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur-sm"
                >
                  <span className="size-1.5 rounded-full bg-accent" />
                  agent idle — hero deployed in {buildSeconds}s
                  {!reduced && (
                    <button
                      type="button"
                      onClick={replay}
                      className="text-muted underline decoration-dotted underline-offset-4 transition-colors hover:text-accent"
                    >
                      ↺ replay
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Staged
            show={stage >= 4}
            instant={instant}
            className="flex flex-col items-start gap-5 sm:items-end"
          >
            <p
              className="max-w-md leading-snug text-ink-soft sm:text-right"
              style={{ fontSize: "var(--text-lead)" }}
            >
              {headline}
              <span className="text-muted"> Shipped from Agadir, used worldwide.</span>
            </p>
            <IntentToggle />
          </Staged>
        </div>

        <Staged show={deployed} instant={instant} className="mt-6 flex justify-center">
          <a
            href="#work"
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
          >
            <span className="h-px w-10 bg-line" aria-hidden />
            Enter the work
            <motion.span
              aria-hidden
              animate={instant ? undefined : { y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
            <span className="h-px w-10 bg-line" aria-hidden />
          </a>
        </Staged>
      </div>
    </section>
  );
}
