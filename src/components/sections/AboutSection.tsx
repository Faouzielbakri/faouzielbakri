"use client";

/**
 * About — "Teacher / Builder". Two lives split by a seam the visitor drags
 * with their cursor: by day a CS teacher for the Ministry of National
 * Education, by night the engineer founding and shipping the products on
 * this page. Touch/reduced-motion: a static balanced split (stacked on
 * small screens).
 */
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Site } from "@/content/schema";
import { useReducedMotionSafe, useSectionSpy } from "@/lib/hooks";

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

  /** Seam position as % of width, spring-smoothed toward the cursor */
  const seamTarget = useMotionValue(50);
  const seam = useSpring(seamTarget, { stiffness: 70, damping: 20 });
  const clip = useTransform(seam, (v) => `inset(0 0 0 ${v}%)`);
  const seamLeft = useTransform(seam, (v) => `${v}%`);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seamTarget.set(Math.min(82, Math.max(18, pct)));
  }

  const teacherFacts = [
    "Computer Science teacher — Ministry of National Education, Agadir",
    "200+ students a year since 2021",
    "M.Sc. Big Data & AI — thesis at 96.96% mAP50 (YOLO + PSO)",
  ];
  const builderFacts = [
    "Co-founder of FASL · founder of Magical Hekaya & Belmo",
    "5+ years shipping — freelance platforms with real users and real money",
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
          By day I teach Morocco&apos;s next engineers.
          <br />
          By night I build what they&apos;ll study.
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          {site.summary}
        </p>
      </div>

      {/* The seam — desktop interactive */}
      <div className="rail mt-12 hidden lg:block">
        <div
          ref={frameRef}
          onMouseMove={onMouseMove}
          onMouseLeave={() => !reduced && seamTarget.set(50)}
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
              stat="200+"
              statLabel="students a year, Ministry of National Education"
              title="the teacher"
              facts={teacherFacts}
            />
          </div>

          {/* Builder — clipped layer */}
          <motion.div className="absolute inset-0" style={reduced ? { clipPath: "inset(0 0 0 50%)" } : { clipPath: clip }}>
            {builderSrc && (
              <Image src={builderSrc} alt="" fill sizes="90vw" className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="flex h-full justify-end">
              <div className="w-full max-w-xl">
                <SideContent
                  kicker="By night"
                  stat="6"
                  statLabel="products live in production, three of them my own"
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
            style={reduced ? { left: "50%" } : { left: seamLeft }}
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

      {/* Mobile: stacked cards */}
      <div className="rail mt-10 space-y-6 lg:hidden">
        {[
          {
            src: teacherSrc,
            kicker: "By day",
            stat: "200+",
            statLabel: "students a year, Ministry of National Education",
            title: "the teacher",
            facts: teacherFacts,
          },
          {
            src: builderSrc,
            kicker: "By night",
            stat: "6",
            statLabel: "products live in production, three of them my own",
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

      {/* Credentials strip */}
      <div className="rail mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
        {site.education.map((edu) => (
          <div key={edu.degree}>
            <p className="font-medium">{edu.degree}</p>
            <p className="mt-1 text-sm text-muted">
              {edu.school} · {edu.years}
            </p>
            {edu.note && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{edu.note}</p>}
          </div>
        ))}
        <div>
          <p className="font-medium">Languages</p>
          <p className="mt-1 text-sm text-muted">{site.languages.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}
