"use client";

/**
 * Shared primitives for the bespoke /work story pages. Each featured project
 * gets its own full-page "story" living inside its world — these are the few
 * pieces every story shares (back link, prev/next, chips, hero art slot).
 */
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/schema";
import type { World } from "@/components/sections/worlds";
import { DeviceFrame } from "@/components/ui/DeviceFrame";

export type StoryProps = {
  project: Project;
  prev: { slug: string; name: string };
  next: { slug: string; name: string };
  /** Generated "pops off the paper" hero art, present once generated */
  art?: string;
  /** Extra media resolved server-side (e.g. Lakta's generated ad videos) */
  extras?: { videos?: { src: string; poster?: string }[] };
};

/** Mono back-link row used at the top of every story hero. */
export function BackRow({ world, className = "" }: { world: World; className?: string }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Link
        href="/#work"
        className="font-mono text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
        style={{ color: world.muted }}
      >
        ← All work
      </Link>
    </div>
  );
}

/** World-tinted stack chips. */
export function StoryChips({
  project,
  world,
  className = "",
}: {
  project: Project;
  world: World;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {project.stack.map((tech) => (
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

/**
 * Primary hero visual: the generated "art" render when it exists (screenshot
 * bursting off the page), otherwise the framed screenshot capture.
 */
export function HeroArt({
  art,
  project,
  monogram,
  sizes = "(min-width: 1024px) 55vw, 92vw",
  priority,
}: {
  art?: string;
  project: Project;
  monogram?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (art) {
    return (
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={art}
          alt={project.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
        />
      </div>
    );
  }
  return (
    <DeviceFrame
      src={project.screenshots.desktop[0]}
      alt={project.alt}
      accent={project.accent}
      kind="desktop"
      monogram={monogram ?? project.name.charAt(0)}
      priority={priority}
      sizes={sizes}
    />
  );
}

/** Prev / next footer, tinted to the world the visitor is leaving. */
export function StoryPrevNext({
  prev,
  next,
  world,
  background,
}: {
  prev: { slug: string; name: string };
  next: { slug: string; name: string };
  world: World;
  background?: string;
}) {
  return (
    <nav
      aria-label="More case studies"
      style={{ background: background ?? "transparent" }}
    >
      <div
        className="rail flex items-center justify-between border-t py-10"
        style={{ borderColor: world.chip.border }}
      >
        <Link
          href={`/work/${prev.slug}`}
          className="group text-sm transition-opacity hover:opacity-70"
          style={{ color: world.muted }}
        >
          ←{" "}
          <span
            className="underline-offset-4 group-hover:underline"
            style={{ color: world.fg }}
          >
            {prev.name}
          </span>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group text-sm transition-opacity hover:opacity-70"
          style={{ color: world.muted }}
        >
          <span
            className="underline-offset-4 group-hover:underline"
            style={{ color: world.fg }}
          >
            {next.name}
          </span>{" "}
          →
        </Link>
      </div>
    </nav>
  );
}
