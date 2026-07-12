import type { Project } from "@/content/schema";
import { Chip } from "@/components/ui/Chip";
import { DeviceFrame } from "@/components/ui/DeviceFrame";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,18,16,0.25)]">
      <DeviceFrame
        src={project.screenshots.desktop[0]}
        alt={project.alt}
        accent={project.accent}
        kind="desktop"
        monogram={project.name.charAt(0)}
        sizes="(min-width: 640px) 45vw, 90vw"
      />
      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl font-bold">{project.name}</h3>
          <p className="shrink-0 font-mono text-xs text-muted">{project.role}</p>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {project.tagline}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-ink-soft underline decoration-line underline-offset-4 transition-colors group-hover:text-accent"
          >
            Visit live ↗
          </a>
        )}
      </div>
    </article>
  );
}
