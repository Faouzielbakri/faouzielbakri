"use client";

import type { Project } from "@/content/schema";
import { ProjectCard } from "./ProjectCard";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
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
      <div className="rail">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          More work
        </p>
        <h2
          className="font-display mt-3 max-w-2xl font-bold leading-tight"
          style={{ fontSize: "var(--text-title)" }}
        >
          Shipped for clients, founded on weekends.
        </h2>
        <Reveal group className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <RevealItem key={project.slug}>
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
