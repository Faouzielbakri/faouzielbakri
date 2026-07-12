"use client";

import Link from "next/link";
import type { Project } from "@/content/schema";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { DEFAULT_WORLD, WORLDS, WorldBackdrop } from "./worlds";

/**
 * One full-screen Tier-1 project panel. Each project renders inside its own
 * "world" — palette + atmosphere from worlds.tsx — so the stack feels like
 * walking through four different rooms.
 */
export function CaseStudyPanel({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const metric = project.metrics[0];
  const world = WORLDS[project.slug] ?? DEFAULT_WORLD;
  const { Accent } = world;

  return (
    <article className="relative flex h-full min-h-screen items-center overflow-hidden">
      <WorldBackdrop world={world} priority={index === 0} />
      <Accent />
      <div className="rail relative z-10 grid w-full items-center gap-10 py-24 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div>
          <p
            className="font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: world.muted }}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} —{" "}
            {project.role}
          </p>
          <h3
            className="font-display mt-4 font-bold leading-none"
            style={{ fontSize: "var(--text-display)", color: world.fg }}
          >
            {project.name}
          </h3>
          <p
            className="mt-4 max-w-md text-lg leading-relaxed"
            style={{ color: world.body }}
          >
            {project.tagline}
          </p>
          {metric && (
            <p className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold" style={{ color: world.link }}>
                {metric.value}
              </span>
              <span className="text-sm" style={{ color: world.muted }}>
                {metric.label}
              </span>
            </p>
          )}
          <ul className="mt-6 flex max-w-md flex-wrap gap-2">
            {project.stack.slice(0, 6).map((tech) => (
              <li key={tech}>
                <span
                  className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs"
                  style={{
                    background: world.chip.bg,
                    color: world.chip.fg,
                    borderColor: world.chip.border,
                  }}
                >
                  {tech}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-5">
            <Link
              href={`/work/${project.slug}`}
              className="rounded-full px-6 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.04]"
              style={{ background: world.cta.bg, color: world.cta.fg }}
            >
              Read case study →
            </Link>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4 transition-opacity hover:opacity-75"
                style={{ color: world.link }}
              >
                Visit live
              </a>
            )}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram={project.name.charAt(0)}
          />
          {project.screenshots.mobile[0] && (
            <div className="absolute -bottom-8 -left-8 w-[22%]">
              <DeviceFrame
                src={project.screenshots.mobile[0]}
                alt={`${project.name} on mobile`}
                accent={project.accent}
                kind="mobile"
              />
            </div>
          )}
        </div>

        {/* Mobile: single flat screenshot */}
        <div className="lg:hidden">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram={project.name.charAt(0)}
            sizes="90vw"
          />
        </div>
      </div>
    </article>
  );
}
