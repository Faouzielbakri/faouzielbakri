"use client";

import Link from "next/link";
import type { Project } from "@/content/schema";
import type { World } from "../worlds";
import { WorldBackdrop } from "../worlds";

export type PanelProps = {
  project: Project;
  index: number;
  total: number;
  world: World;
  /** Extra media resolved server-side (e.g. Laqta's generated ad videos) */
  extras?: { laqtaVideos?: { src: string; poster?: string }[] };
};

/** Article wrapper: backdrop + accent + centered rail. Panels own the inside. */
export function PanelShell({
  world,
  priority,
  children,
}: {
  world: World;
  priority?: boolean;
  children: React.ReactNode;
}) {
  const { Accent } = world;
  return (
    <article className="relative flex h-full min-h-screen items-center overflow-hidden">
      <WorldBackdrop world={world} priority={priority} />
      <Accent />
      <div className="rail relative z-10 w-full py-24">{children}</div>
    </article>
  );
}

export function IndexLabel({
  project,
  index,
  total,
  world,
  className = "",
}: PanelProps & { className?: string }) {
  return (
    <p
      className={`font-mono text-xs uppercase tracking-[0.2em] ${className}`}
      style={{ color: world.muted }}
    >
      {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} — {project.role}
    </p>
  );
}

export function ChipRow({
  project,
  world,
  className = "",
  max = 6,
}: {
  project: Project;
  world: World;
  className?: string;
  max?: number;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {project.stack.slice(0, max).map((tech) => (
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
  );
}

export function CtaRow({
  project,
  world,
  className = "",
}: {
  project: Project;
  world: World;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
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
  );
}
