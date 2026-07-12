"use client";

/**
 * More Work — the index as an editorial contact sheet. Every entry lays its
 * screenshot on the table up front (no hover needed), with the full
 * description and the project's accent as a tinted mat behind the frame.
 * Hover lifts the sheet, colors the name, and pops the phone capture in.
 */
import type { CSSProperties } from "react";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import type { Project } from "@/content/schema";
import { useSectionSpy } from "@/lib/hooks";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const spyRef = useSectionSpy<HTMLElement>("more-work");

  return (
    <section
      id="more-work"
      ref={spyRef}
      aria-label="More work"
      className="rule relative z-10 bg-bg py-24"
    >
      <div className="rail flex flex-wrap items-end justify-between gap-4">
        <div>
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
        <p className="font-mono text-xs text-muted">
          {String(projects.length).padStart(2, "0")} projects — client work,
          own products, concept rebuilds
        </p>
      </div>

      {/* Mobile: a sticky deck — each sheet slides up and pins over the last.
          From sm up this is the untouched editorial contact-sheet grid. */}
      <Reveal
        group
        as="ul"
        className="rail mt-14 max-sm:space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-12 sm:gap-y-16"
      >
        {projects.map((project, i) => (
          <RevealItem key={project.slug} className="max-sm:sticky max-sm:top-20">
            <IndexEntry project={project} index={i} offset={i % 2 === 1} />
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}

function IndexEntry({
  project,
  index,
  offset,
}: {
  project: Project;
  index: number;
  offset: boolean;
}) {
  const phone = project.screenshots.mobile[0];
  const href = project.url;

  const entry = (
    <article
      className={`group max-sm:rounded-2xl max-sm:border max-sm:border-line max-sm:bg-bg max-sm:p-5 max-sm:shadow-[0_-18px_44px_-24px_rgba(20,18,16,0.4)] ${offset ? "sm:mt-10" : ""}`}
      style={{ "--acc": project.accent } as CSSProperties}
    >
      {/* Ledger line */}
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <span className="font-mono text-xs text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {project.role}
        </span>
      </div>

      {/* The sheet: accent mat + browser frame + phone pop-in */}
      <div className="relative mt-5">
        <span
          aria-hidden
          className="absolute -inset-x-2 -bottom-3 top-3 rounded-2xl opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.18]"
          style={{ background: "var(--acc)" }}
        />
        <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram={project.name.charAt(0)}
            sizes="(min-width: 640px) 45vw, 90vw"
          />
        </div>
        {phone && (
          <div className="pointer-events-none absolute -bottom-7 right-4 z-10 w-[23%] max-w-[7rem] translate-y-3 rotate-[5deg] scale-95 opacity-0 shadow-[0_24px_48px_-16px_rgba(20,18,16,0.45)] transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 max-sm:translate-y-0 max-sm:scale-100 max-sm:opacity-100">
            <DeviceFrame
              src={phone}
              alt=""
              accent={project.accent}
              kind="mobile"
              sizes="8rem"
            />
          </div>
        )}
      </div>

      {/* Name + full description — always readable, never truncated */}
      <h3
        className="font-display mt-8 font-bold leading-none transition-colors duration-300 group-hover:text-[var(--acc)]"
        style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)" }}
      >
        {project.name}
      </h3>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
        {project.tagline}
      </p>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[11px] text-muted">
          {project.stack.slice(0, 4).join(" · ")}
        </span>
        {href && (
          <span className="ml-auto font-mono text-xs text-muted transition-colors duration-300 group-hover:text-[var(--acc)] max-sm:text-[var(--acc)]">
            visit ↗
          </span>
        )}
      </div>
    </article>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} — visit live site`}
      className="block"
    >
      {entry}
    </a>
  ) : (
    <div aria-label={project.name}>{entry}</div>
  );
}
