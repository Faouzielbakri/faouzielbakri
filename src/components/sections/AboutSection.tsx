"use client";

/**
 * About — "Teacher / Builder". Two lives split by a seam the visitor drags
 * with their cursor: by day a CS teacher for the Ministry of National
 * Education, by night the engineer founding and shipping the products on
 * this page. Touch/reduced-motion: a static balanced split (stacked on
 * small screens).
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { Site } from "@/content/schema";
import { useReducedMotionSafe, useSectionSpy } from "@/lib/hooks";

/* ------------------------------------------------------------------ */
/* Kinetic text: words rise out of a clip mask, one line after another */
/* ------------------------------------------------------------------ */

const accentWordStyle: React.CSSProperties = {
  fontFamily: "var(--font-fraunces)",
  fontStyle: "italic",
  fontWeight: 500,
  color: "var(--color-accent)",
  letterSpacing: "0",
};

function KineticLine({
  words,
  accent,
  delay = 0,
}: {
  words: string;
  /** word (exact match) set in italic Fraunces + accent color */
  accent?: string;
  delay?: number;
}) {
  const reduced = useReducedMotionSafe();
  const parts = words.split(" ");

  if (reduced) {
    return (
      <span className="block">
        {parts.map((word, i) => (
          <span key={`${word}-${i}`} style={word === accent ? accentWordStyle : undefined}>
            {word}
            {i < parts.length - 1 && " "}
          </span>
        ))}
      </span>
    );
  }

  return (
    // whileInView must live on the (unclipped) line — a word that starts
    // fully clipped by its mask never intersects, so it would never fire.
    <motion.span
      className="block"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {parts.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "115%" },
              visible: {
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            style={word === accent ? accentWordStyle : undefined}
          >
            {word}
          </motion.span>
          {i < parts.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

/* ------------------------------------------------------------------- */
/* The whole lifecycle, drawn instead of said: an accent line runs      */
/* through the four stages, each rising in turn; iterate loops back.    */
/* ------------------------------------------------------------------- */

const STAGES = [
  { n: "01", label: "Architecture", note: "system & schema design" },
  { n: "02", label: "Build", note: "Next.js · TS · LLM pipelines" },
  { n: "03", label: "Deploy", note: "Vercel or self-hosted" },
  { n: "04", label: "Iterate", note: "evals · analytics · feedback" },
];

function LifecycleRail({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="mt-8 max-w-3xl"
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: 0.16, delayChildren: 0.2 }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        The whole lifecycle
      </p>
      <div className="relative mt-4">
        {/* base rail + accent line drawing across */}
        <span aria-hidden className="absolute left-0 right-0 top-[5px] h-px bg-line" />
        <motion.span
          aria-hidden
          className="absolute left-0 top-[5px] h-px w-full origin-left bg-accent"
          variants={{
            hidden: { scaleX: 0 },
            visible: {
              scaleX: 1,
              transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        />
        <div className="relative grid grid-cols-2 gap-y-6 sm:grid-cols-4">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.n}
              className="pr-4"
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <span
                aria-hidden
                className="block size-[11px] rounded-full border-2 border-accent bg-bg"
              />
              <p className="mt-3 font-mono text-[10px] text-muted">{stage.n}</p>
              <p className="font-display mt-0.5 font-bold leading-tight">
                {stage.label}
                {i === STAGES.length - 1 && (
                  <span aria-hidden className="ml-1.5 text-accent">
                    ↺
                  </span>
                )}
              </p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">
                {stage.note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* --------------------------------------------------- */
/* Count-up numeral for the records (achievements) grid */
/* --------------------------------------------------- */

function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1.8,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const value = useMotionValue(0);
  const [text, setText] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(value, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, reduced, to, decimals, duration, value]);

  return (
    <span ref={ref}>
      {reduced ? to.toFixed(decimals) : text}
      {suffix}
    </span>
  );
}

type AboutSectionProps = {
  site: Site;
  teacherSrc?: string;
  builderSrc?: string;
};

function SideContent({
  kicker,
  stat,
  statLabel,
  title,
  facts,
  align = "start",
}: {
  kicker: string;
  stat: string;
  statLabel: string;
  title: string;
  facts: string[];
  align?: "start" | "end";
}) {
  const fg = "#f7f2e6";
  const muted = "rgba(247,242,230,0.72)";
  const faint = "rgba(247,242,230,0.45)";
  const end = align === "end";
  return (
    <div
      className={`pointer-events-none flex h-full flex-col justify-end p-8 sm:p-12 ${
        end ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <p
        className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] ${
          end ? "flex-row-reverse" : ""
        }`}
        style={{ color: muted }}
      >
        <span aria-hidden className="h-px w-10" style={{ background: faint }} />
        {kicker}
      </p>
      <p className="mt-3 flex items-baseline gap-3" style={end ? { flexDirection: "row-reverse" } : undefined}>
        <span
          className="font-display font-bold leading-none"
          style={{ fontSize: "clamp(3.5rem, 6vw, 6rem)", color: fg }}
        >
          {stat}
        </span>
        <span
          className="max-w-[12rem] text-sm leading-snug"
          style={{ color: muted }}
        >
          {statLabel}
        </span>
      </p>
      <h3
        className="mt-2 italic"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(1.35rem, 2vw, 1.8rem)",
          color: fg,
        }}
      >
        {title}
      </h3>
      <ul
        className={`mt-5 max-w-sm space-y-2 border-t pt-4 ${end ? "border-t" : ""}`}
        style={{ borderColor: faint }}
      >
        {facts.map((fact) => (
          <li key={fact} className="text-[13px] leading-relaxed" style={{ color: muted }}>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutSection({ site, teacherSrc, builderSrc }: AboutSectionProps) {
  const reduced = useReducedMotionSafe();
  const spyRef = useSectionSpy<HTMLElement>("about");
  const frameRef = useRef<HTMLDivElement | null>(null);

  /** Seam position as % of width, spring-smoothed toward the cursor.
   * Rests at 38% so the builder portrait's face is fully visible by default. */
  const SEAM_REST = 38;
  const seamTarget = useMotionValue(SEAM_REST);
  const seam = useSpring(seamTarget, { stiffness: 70, damping: 20 });
  const clip = useTransform(seam, (v) => `inset(0 0 0 ${v}%)`);
  const seamLeft = useTransform(seam, (v) => `${v}%`);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seamTarget.set(Math.min(82, Math.max(18, pct)));
  }

  /* Mobile seam: scroll walks it 25% → 75% while the frame crosses the
   * viewport; a finger on the handle takes over, release hands it back. */
  const mobileFrameRef = useRef<HTMLDivElement | null>(null);
  const mobileDragging = useRef(false);
  const mSeamTarget = useMotionValue(SEAM_REST);
  const mSeam = useSpring(mSeamTarget, { stiffness: 70, damping: 20 });
  const mClip = useTransform(mSeam, (v) => `inset(0 0 0 ${v}%)`);
  const mSeamLeft = useTransform(mSeam, (v) => `${v}%`);
  const { scrollYProgress: mobileScroll } = useScroll({
    target: mobileFrameRef,
    offset: ["start 85%", "end 15%"],
  });
  useMotionValueEvent(mobileScroll, "change", (v) => {
    if (reduced || mobileDragging.current) return;
    mSeamTarget.set(25 + v * 50);
  });

  function seamFromTouch(clientX: number) {
    const rect = mobileFrameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    mSeamTarget.set(Math.min(85, Math.max(15, pct)));
  }

  const teacherFacts = [
    "Computer Science teacher — Ministry of National Education, Agadir",
    "≈500 students a year since 2021 — 2,000+ taught so far",
    "M.Sc. Big Data & AI — thesis at 96.96% mAP50 (YOLO + PSO)",
  ];
  const builderFacts = [
    "Co-founder of FASL · founder of Magical Hekaya · founding engineer of Belmo",
    "6+ years shipping — freelance platforms with real users and real money",
    `Works in ${site.languages.length} languages — Arabic & Darija native, RTL-first`,
  ];

  return (
    <section id="about" ref={spyRef} className="rule bg-surface py-24">
      <div className="rail">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">About</p>
        <h2
          className="font-display mt-3 max-w-3xl font-bold leading-tight"
          style={{ fontSize: "var(--text-title)" }}
        >
          <KineticLine words="By day I teach Morocco's next engineers." accent="teach" />
          <KineticLine words="By night I build what they'll study." accent="build" delay={0.25} />
        </h2>
        <motion.p
          className="mt-5 max-w-xl leading-relaxed text-muted"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
        >
          AI-focused full-stack engineer — 6+ years shipping production web
          products end-to-end, specializing in LLM-powered applications on a
          Next.js / TypeScript stack.
        </motion.p>
        <LifecycleRail reduced={reduced} />
      </div>

      {/* The seam — desktop interactive */}
      <div className="rail mt-12 hidden lg:block">
        <div
          ref={frameRef}
          onMouseMove={onMouseMove}
          onMouseLeave={() => !reduced && seamTarget.set(SEAM_REST)}
          className="relative h-[70vh] cursor-col-resize overflow-hidden rounded-2xl border border-line"
        >
          {/* Teacher — base layer */}
          <div className="absolute inset-0">
            {teacherSrc && (
              <Image src={teacherSrc} alt="" fill sizes="90vw" className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <SideContent
              kicker="By day"
              stat="2000+"
              statLabel="students taught, Ministry of National Education"
              title="the teacher"
              facts={teacherFacts}
            />
          </div>

          {/* Builder — clipped layer */}
          <motion.div className="absolute inset-0" style={reduced ? { clipPath: "inset(0 0 0 38%)" } : { clipPath: clip }}>
            {builderSrc && (
              <Image src={builderSrc} alt="" fill sizes="90vw" className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="flex h-full justify-end">
              <div className="w-full max-w-xl">
                <SideContent
                  kicker="By night"
                  stat="16"
                  statLabel="products live in production, four of them my own"
                  title="the builder"
                  facts={builderFacts}
                  align="end"
                />
              </div>
            </div>
          </motion.div>

          {/* Seam line */}
          <motion.div
            aria-hidden
            className="absolute inset-y-0 z-10 w-px bg-white/70"
            style={reduced ? { left: "38%" } : { left: seamLeft }}
          >
            <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 font-mono text-[10px] text-white backdrop-blur">
              ⇄
            </span>
          </motion.div>
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Move your cursor — two lives, one engineer
        </p>
      </div>

      {/* Mobile: the same seam — scroll sweeps it, the handle overrides it.
          Reduced motion keeps the plain stacked cards. */}
      {reduced ? (
        <div className="rail mt-10 space-y-6 lg:hidden">
          {[
            {
              src: teacherSrc,
              kicker: "By day",
              stat: "2000+",
              statLabel: "students taught, Ministry of National Education",
              title: "the teacher",
              facts: teacherFacts,
            },
            {
              src: builderSrc,
              kicker: "By night",
              stat: "16",
              statLabel: "products live in production, four of them my own",
              title: "the builder",
              facts: builderFacts,
            },
          ].map((side) => (
            <div key={side.kicker} className="relative h-[52vh] overflow-hidden rounded-2xl border border-line">
              {side.src && <Image src={side.src} alt="" fill sizes="90vw" className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <SideContent
                kicker={side.kicker}
                stat={side.stat}
                statLabel={side.statLabel}
                title={side.title}
                facts={side.facts}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rail mt-10 lg:hidden">
          <div
            ref={mobileFrameRef}
            className="relative h-[62vh] overflow-hidden rounded-2xl border border-line"
          >
            {/* Teacher — base layer */}
            <div className="absolute inset-0">
              {teacherSrc && (
                <Image src={teacherSrc} alt="" fill sizes="100vw" className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <SideContent
                kicker="By day"
                stat="2000+"
                statLabel="students taught, Ministry of National Education"
                title="the teacher"
                facts={teacherFacts}
              />
            </div>

            {/* Builder — clipped layer */}
            <motion.div className="absolute inset-0" style={{ clipPath: mClip }}>
              {builderSrc && (
                <Image src={builderSrc} alt="" fill sizes="100vw" className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="flex h-full justify-end">
                <div className="w-full max-w-xl">
                  <SideContent
                    kicker="By night"
                    stat="16"
                    statLabel="products live in production, four of them my own"
                    title="the builder"
                    facts={builderFacts}
                    align="end"
                  />
                </div>
              </div>
            </motion.div>

            {/* Seam line + draggable handle */}
            <motion.div
              aria-hidden
              className="absolute inset-y-0 z-10 w-px bg-white/70"
              style={{ left: mSeamLeft }}
            >
              <span
                className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border border-white/40 bg-black/40 font-mono text-xs text-white backdrop-blur"
                onPointerDown={(e) => {
                  mobileDragging.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (mobileDragging.current) seamFromTouch(e.clientX);
                }}
                onPointerUp={(e) => {
                  mobileDragging.current = false;
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }}
                onPointerCancel={() => {
                  mobileDragging.current = false;
                }}
              >
                ⇄
              </span>
            </motion.div>
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Drag the handle — or just scroll
          </p>
        </div>
      )}

      {/* The records — achievements count up, education files in */}
      <div className="rail mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-[7fr_5fr]">
        {/* Achievements */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            The record
          </p>
          <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-8">
            {[
              { to: 96.96, decimals: 2, suffix: "%", label: "mAP50 — M.Sc thesis, solar-defect detection (YOLO + PSO)" },
              { to: 2000, suffix: "+", label: "students taught for the Ministry of National Education — ≈500 a year" },
              { to: 16, suffix: "", label: "products live in production — four of them my own" },
              { to: 6, suffix: "+", label: "years shipping software with real users and real money" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              >
                <p
                  className="font-display font-bold leading-none text-ink"
                  style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
                >
                  <CountUp to={stat.to} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
                </p>
                <p className="mt-2 max-w-[16rem] text-[13px] leading-relaxed text-muted">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            The papers
          </p>
          <ul className="mt-6 space-y-7">
            {site.education.map((edu, i) => (
              <motion.li
                key={edu.degree}
                className="relative pl-6"
                initial={reduced ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 }}
              >
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-1 h-[calc(100%-0.25rem)] w-[3px] rounded-full bg-accent origin-top"
                  initial={reduced ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.12 }}
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {edu.years}
                </p>
                <p className="mt-1 font-display font-bold leading-snug">{edu.degree}</p>
                <p className="text-sm text-muted">{edu.school}</p>
                {edu.note && (
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{edu.note}</p>
                )}
              </motion.li>
            ))}
            <motion.li
              className="relative pl-6"
              initial={reduced ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <motion.span
                aria-hidden
                className="absolute left-0 top-1 h-[calc(100%-0.25rem)] w-[3px] rounded-full bg-saffron origin-top"
                initial={reduced ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Languages
              </p>
              <p className="mt-1 font-display font-bold leading-snug">
                {site.languages.join(" · ")}
              </p>
            </motion.li>
          </ul>
        </div>
      </div>
    </section>
  );
}
