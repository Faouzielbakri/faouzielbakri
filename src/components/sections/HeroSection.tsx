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

/* ── The build script the "agent" executes ───────────────────────────────
 * Each line advances `stage`, and every hero element is gated on a stage:
 *   1 masthead · 2 name · 3 film · 4 statement/toggle · 5 done (dock)
 */
const FINAL_STAGE = 5;
const SESSION_KEY = "feb-hero-built";

const SCRIPT: { text: string; stage: number; pause: number }[] = [
  { text: "▸ reading cv — 5+ yrs · next.js · llm agents ✓", stage: 1, pause: 520 },
  { text: "▸ writing name…", stage: 2, pause: 950 },
  { text: "▸ generating film — gemini omni ✓ (2.0 MB)", stage: 3, pause: 780 },
  { text: "▸ hydrating proof — fasl.ma ~37K impressions ✓", stage: 4, pause: 620 },
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
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Staged block: mounts its content when `show` flips ──────────────── */

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

/* ── Terminal card ───────────────────────────────────────────────────── */

function Terminal({
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
      key="terminal"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96, transition: { duration: 0.45, ease: easeOut } }}
      transition={{ duration: 0.6, ease: easeOut }}
      className="absolute left-1/2 top-[38%] z-30 w-[min(92vw,34rem)] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="overflow-hidden rounded-xl border border-line bg-surface/90 shadow-[0_32px_80px_-32px_rgba(20,18,16,0.35)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-accent/60" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            faouzi@agadir — agent
          </span>
          <button
            type="button"
            onClick={onSkip}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
          >
            skip ↦
          </button>
        </div>
        <div className="px-5 py-4 font-mono text-[13px] leading-7 text-ink-soft">
          <p className="text-ink">
            {typedCmd}
            <span className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-accent" />
          </p>
          {lines.map((line) => (
            <motion.p
              key={line}
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

  const finish = useCallback((seconds?: string) => {
    clearTimers();
    if (seconds) setBuildSeconds(seconds);
    setLines((prev) =>
      prev.length >= SCRIPT.length
        ? [...prev, `✓ hero deployed in ${seconds ?? "3.2"}s`]
        : [...SCRIPT.map((s) => s.text), `✓ hero deployed in ${seconds ?? "3.2"}s`],
    );
    setStage(FINAL_STAGE);
    // Let the ✓ line land, then dissolve the terminal.
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

  /* Decide before first paint: run the theater, or restore the built hero. */
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
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  /* Mouse parallax: name and film drift on opposite vectors */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const nameX = useSpring(useTransform(mx, [-1, 1], [-7, 7]), { stiffness: 60, damping: 18 });
  const filmX = useSpring(useTransform(mx, [-1, 1], [12, -12]), { stiffness: 60, damping: 18 });
  const filmY = useSpring(useTransform(my, [-1, 1], [9, -9]), { stiffness: 60, damping: 18 });

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  const [first, ...rest] = name.split(" ");
  const lineTwo = rest.join(" ");
  const showTheater = running && !reduced;

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

      {/* Masthead meta row — stage 1 */}
      <Staged show={stage >= 1} instant={instant} className="rail relative z-10 w-full">
        <div className="rule mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span>Portfolio — 2026</span>
          <span className="inline-flex items-center gap-2 text-ink">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Available for work
          </span>
          <span>
            Agadir, Morocco — <LocalTime />
          </span>
        </div>
        <div className="rule mt-3 pt-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {positioning} · {microline}
          </p>
        </div>
      </Staged>

      {/* Composition: colossal name printed in ink over the film */}
      <div className="rail relative z-10 flex w-full flex-1 flex-col justify-center">
        {/* The name — stage 2, ink printed onto the film */}
        <motion.h1
          aria-label={name}
          className="font-display relative z-10 font-bold uppercase leading-[0.85] tracking-[-0.03em]"
          style={{
            fontSize: "clamp(3.75rem, 11vw, 11.5rem)",
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
            className="lg:pl-[14vw]"
          />
        </motion.h1>

        {/* The film — a cinema band beneath the name; ink prints onto its top edge */}
        <motion.div
          className="relative -mt-[3vw]"
          style={instant ? undefined : { scale: filmScale, x: filmX, y: filmY }}
          initial={instant ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          animate={
            stage >= 3
              ? { clipPath: "inset(0 0 0% 0)", opacity: 1 }
              : { clipPath: "inset(0 0 100% 0)", opacity: 0 }
          }
          transition={{ duration: 1.1, ease: easeOut }}
        >
          <div className="grain relative h-[30vh] overflow-hidden rounded-2xl sm:h-[34vh]">
            <AmbientVideo
              src={videoSrc}
              poster={posterSrc}
              alt="Generated film — ink wireframes assembling into a finished product"
              className="h-full w-full"
            />
          </div>
        </motion.div>

        {/* The theater */}
        <AnimatePresence>
          {showTheater && <Terminal typedCmd={typedCmd} lines={lines} onSkip={skip} />}
        </AnimatePresence>
      </div>

      {/* Base row: statement + intent — stage 4 */}
      <div className="rail relative z-10 w-full pb-5">
        <Staged show={stage >= 3} instant={instant} className="flex justify-end pb-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Film generated by the build agent — Gemini Omni
          </p>
        </Staged>
        <Staged
          show={stage >= 4}
          instant={instant}
          className="rule flex flex-col gap-6 pt-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md leading-snug text-ink-soft" style={{ fontSize: "var(--text-lead)" }}>
            {headline}
            <span className="text-muted"> Shipped from Agadir, used worldwide.</span>
          </p>
          <IntentToggle />
        </Staged>
        <Staged show={stage >= 5} instant={instant} className="mt-5 flex items-center justify-center gap-6">
          <a
            href="#work"
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
          >
            <span className="h-px w-10 bg-line" aria-hidden />
            Scroll to explore
            <motion.span
              aria-hidden
              animate={instant ? undefined : { y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
            <span className="h-px w-10 bg-line" aria-hidden />
          </a>
          {!reduced && stage >= FINAL_STAGE && !running && (
            <button
              type="button"
              onClick={replay}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
            >
              ✓ deployed in {buildSeconds}s · ↺ replay
            </button>
          )}
        </Staged>
      </div>
    </section>
  );
}
