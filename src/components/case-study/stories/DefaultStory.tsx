"use client";

/**
 * Fallback story for a future featured project without a bespoke page yet:
 * the original editorial case-study layout, world-tinted at the edges.
 */
import { ArchDiagram } from "@/components/case-study/ArchDiagram";
import { ScreenshotGallery } from "@/components/case-study/ScreenshotGallery";
import { Chip } from "@/components/ui/Chip";
import { DEFAULT_WORLD } from "@/components/sections/worlds";
import { Reveal } from "@/components/ui/Reveal";
import { BackRow, HeroArt, StoryPrevNext, type StoryProps } from "./shared";

export function DefaultStory({ project, prev, next, art }: StoryProps) {
  const study = project.caseStudy!;
  const metric = project.metrics[0];

  return (
    <>
      <header
        className="pb-16 pt-32"
        style={{
          background: `linear-gradient(160deg, var(--color-bg) 40%, ${project.accent}14 100%)`,
        }}
      >
        <div className="rail">
          <BackRow world={DEFAULT_WORLD} />
          <h1
            className="font-display mt-6 font-bold leading-none"
            style={{ fontSize: "var(--text-display)" }}
          >
            {project.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            {project.tagline}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {project.role}
            </p>
            {metric && (
              <p className="flex items-baseline gap-2">
                <span
                  className="font-display text-2xl font-bold"
                  style={{ color: project.accent }}
                >
                  {metric.value}
                </span>
                <span className="text-sm text-muted">
                  {metric.label} · {metric.source}
                </span>
              </p>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline decoration-line underline-offset-4 hover:text-accent"
              >
                Visit live ↗
              </a>
            )}
          </div>
          <div className="mt-10">
            <HeroArt art={art} project={project} priority sizes="(min-width: 1280px) 1184px, 92vw" />
          </div>
        </div>
      </header>

      <section className="rail grid gap-8 py-16 lg:grid-cols-[1fr_2fr]">
        <h2 className="font-display text-xl font-bold">The problem</h2>
        <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">{study.problem}</p>
      </section>

      <section className="rule bg-surface py-16">
        <div className="rail grid gap-8 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-xl font-bold">The approach</h2>
          <ul className="max-w-2xl space-y-5">
            {study.approach.map((item) => (
              <li key={item} className="flex gap-4 leading-relaxed text-ink-soft">
                <span
                  aria-hidden
                  className="mt-2.5 size-1.5 shrink-0 rounded-full"
                  style={{ background: project.accent }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        {study.architecture && (
          <div className="rail mt-14">
            <h3 className="font-mono mb-6 text-xs uppercase tracking-[0.2em] text-muted">
              How it flows
            </h3>
            <ArchDiagram steps={study.architecture} accent={project.accent} />
          </div>
        )}
      </section>

      {(project.screenshots.desktop.length > 0 || project.screenshots.mobile.length > 0) && (
        <section className="rail py-16">
          <h2 className="font-mono mb-8 text-xs uppercase tracking-[0.2em] text-muted">
            In the wild
          </h2>
          <ScreenshotGallery project={project} />
        </section>
      )}

      <section className="rule bg-surface py-16">
        <Reveal className="rail grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold">Stack</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Chip>{tech}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Outcome</h2>
            <ul className="mt-5 space-y-4">
              {study.outcome.map((item) => (
                <li key={item} className="flex gap-4 leading-relaxed text-ink-soft">
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full"
                    style={{ background: project.accent }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <StoryPrevNext prev={prev} next={next} world={DEFAULT_WORLD} />
    </>
  );
}
