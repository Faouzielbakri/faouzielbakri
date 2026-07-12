"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { Project } from "@/content/schema";
import { CaseStudyPanel } from "./CaseStudyPanel";
import type { PanelProps } from "./panels/shared";
import { useReducedMotionSafe, useSectionSpy } from "@/lib/hooks";

type Extras = PanelProps["extras"];

/**
 * The centerpiece: a sticky stack where each Tier-1 project panel scrolls
 * over the previous one. Reduced motion → plain stacked sections.
 */
export function SelectedWork({ projects, extras }: { projects: Project[]; extras?: Extras }) {
  const reduced = useReducedMotionSafe();
  const containerRef = useRef<HTMLElement | null>(null);
  const spyRef = useSectionSpy<HTMLElement>("work");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (reduced) {
    return (
      <section id="work" ref={spyRef} aria-label="Selected work">
        <SectionHeading total={projects.length} />
        {projects.map((project, i) => (
          <div key={project.slug} className="min-h-screen">
            <CaseStudyPanel project={project} index={i} total={projects.length} extras={extras} />
          </div>
        ))}
      </section>
    );
  }

  const n = projects.length;

  return (
    <section
      id="work"
      ref={(el) => {
        containerRef.current = el;
        spyRef.current = el;
      }}
      aria-label="Selected work"
      className="relative"
      style={{ height: `${(n + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <SectionHeading total={n} />
        {projects.map((project, i) => (
          <StackedPanel
            key={project.slug}
            project={project}
            index={i}
            total={n}
            progress={scrollYProgress}
            extras={extras}
          />
        ))}
        <ProgressRail progress={scrollYProgress} total={n} />
      </div>
    </section>
  );
}

function SectionHeading({ total }: { total: number }) {
  // blend-difference keeps the label legible over both light and dark worlds
  return (
    <div className="rail pointer-events-none absolute inset-x-0 top-0 z-30 flex h-20 items-end justify-between mix-blend-difference">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
        Selected work
      </p>
      <p className="font-mono text-xs text-white/70">01 — {String(total).padStart(2, "0")}</p>
    </div>
  );
}

function StackedPanel({
  project,
  index,
  total,
  progress,
  extras,
}: {
  extras?: Extras;
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each panel owns a 1/total slice of the scroll; panel 0 starts in place.
  const start = index / total;
  const end = (index + 1) / total;

  const y = useTransform(
    progress,
    [Math.max(0, start - 1 / total), start],
    index === 0 ? ["0%", "0%"] : ["100%", "0%"],
  );
  // As the next panel arrives, this one recedes behind a scrim. Panels stay
  // fully opaque — dimming via opacity would let older panels bleed through.
  const scale = useTransform(progress, [start, end], [1, 0.94]);
  const scrim = useTransform(progress, [start, end], [0, 0.6]);

  return (
    <motion.div className="absolute inset-0" style={{ y, scale, zIndex: index + 1 }}>
      <CaseStudyPanel project={project} index={index} total={total} extras={extras} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-bg"
        style={{ opacity: scrim }}
      />
    </motion.div>
  );
}

function ProgressRail({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const scaleY = useTransform(progress, [0, 1], [1 / total, 1]);
  return (
    <div
      aria-hidden
      className="absolute right-4 top-1/2 z-40 hidden h-32 w-px -translate-y-1/2 bg-white/25 mix-blend-difference lg:block"
    >
      <motion.div
        className="w-full origin-top bg-white"
        style={{ scaleY, height: "100%" }}
      />
    </div>
  );
}
