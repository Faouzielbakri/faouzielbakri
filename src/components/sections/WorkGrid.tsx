"use client";

/**
 * More Work — an editorial index, not a card grid. Each project is a huge
 * typographic row; hovering a row summons a floating preview that trails
 * the cursor. Mobile gets compact rows with inline thumbnails.
 */
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import type { Project } from "@/content/schema";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { useReducedMotionSafe, useSectionSpy } from "@/lib/hooks";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotionSafe();
  const spyRef = useSectionSpy<HTMLElement>("more-work");
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);

  /* Preview follows the cursor with a lazy spring */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 120, damping: 22 });
  const py = useSpring(my, { stiffness: 120, damping: 22 });

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <section
      id="more-work"
      ref={(el) => {
        sectionRef.current = el;
        spyRef.current = el;
      }}
      onMouseMove={onMouseMove}
      aria-label="More work"
      className="rule relative z-10 overflow-hidden bg-bg py-24"
    >
      <div className="rail">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          The index
        </p>
        <h2
          className="font-display mt-3 max-w-2xl font-bold leading-tight"
          style={{ fontSize: "var(--text-title)" }}
        >
          Everything else that shipped.
        </h2>
      </div>

      <Reveal group className="rail mt-12" as="ul">
        {projects.map((project, i) => (
          <RevealItem key={project.slug}>
            <IndexRow
              project={project}
              index={i}
              hovered={hovered?.slug === project.slug}
              anyHovered={hovered !== null}
              onEnter={() => setHovered(project)}
              onLeave={() => setHovered(null)}
            />
          </RevealItem>
        ))}
      </Reveal>

      {/* Floating preview (desktop pointer only) */}
      {!reduced && (
        <AnimatePresence>
          {hovered && hovered.screenshots.desktop[0] && (
            <motion.div
              key={hovered.slug}
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden w-[26rem] overflow-hidden rounded-xl border border-line shadow-[0_32px_64px_-24px_rgba(20,18,16,0.4)] lg:block"
              style={{ x: px, y: py, translateX: "4%", translateY: "-110%" }}
            >
              <div className="relative aspect-[16/10] bg-surface">
                <Image
                  src={hovered.screenshots.desktop[0]}
                  alt=""
                  fill
                  sizes="416px"
                  className="object-cover object-top"
                />
                <span
                  className="absolute bottom-3 left-3 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white"
                  style={{ background: hovered.accent }}
                >
                  {hovered.role}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}

function IndexRow({
  project,
  index,
  hovered,
  anyHovered,
  onEnter,
  onLeave,
}: {
  project: Project;
  index: number;
  hovered: boolean;
  anyHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const dimmed = anyHovered && !hovered;
  const href = project.url;

  const row = (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-t border-line py-6 transition-all duration-300 sm:grid-cols-[4rem_1fr_minmax(0,18rem)_auto]"
      style={{ opacity: dimmed ? 0.35 : 1 }}
    >
      <span className="font-mono text-xs text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3
        className="font-display font-bold leading-none transition-transform duration-300 group-hover:translate-x-3"
        style={{
          fontSize: "clamp(1.75rem, 4vw, 3.25rem)",
          color: hovered ? project.accent : "var(--color-ink)",
          transition: "color 0.3s, transform 0.3s",
        }}
      >
        {project.name}
      </h3>
      <p className="hidden truncate text-sm leading-snug text-muted sm:block">
        {project.tagline}
      </p>
      <span className="font-mono text-xs text-muted transition-colors group-hover:text-ink">
        {href ? "visit ↗" : "→"}
      </span>

      {/* Mobile thumbnail */}
      {project.screenshots.desktop[0] && (
        <div className="col-span-3 mt-3 sm:hidden">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-line">
            <Image
              src={project.screenshots.desktop[0]}
              alt={project.alt}
              fill
              sizes="90vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      )}
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — visit live site`}>
      {row}
    </a>
  ) : (
    <div aria-label={project.name}>{row}</div>
  );
}
