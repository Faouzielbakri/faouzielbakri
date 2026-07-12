"use client";

/**
 * Magical Hekaya — the case study as a storybook. A moonlit cover opens
 * into chapters set in Fraunces with drop caps, star-bullet story beats,
 * tilted page spreads, and a proper "The End".
 */
import { WORLDS, WorldBackdrop } from "@/components/sections/worlds";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Chip } from "@/components/ui/Chip";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { BackRow, HeroArt, StoryPrevNext, type StoryProps } from "./shared";

const PLUM = "#5f3a8f";
const CORAL = "#e8590c";

function ChapterHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="text-center">
      <p
        className="text-sm italic"
        style={{ fontFamily: "var(--font-fraunces)", color: PLUM }}
      >
        Chapter {index}
      </p>
      <h2
        className="mt-1 text-3xl font-black italic"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {title}
      </h2>
      <p aria-hidden className="mt-3 text-lg tracking-[0.5em]" style={{ color: PLUM }}>
        ✦ ✦ ✦
      </p>
    </div>
  );
}

export function HekayaStory({ project, prev, next, art }: StoryProps) {
  const world = WORLDS["magical-hekaya"];
  const study = project.caseStudy!;
  const metric = project.metrics[0];
  const { Accent } = world;

  return (
    <>
      {/* ── The cover ─────────────────────────────────────────────────── */}
      <header className="relative flex min-h-screen flex-col overflow-hidden">
        <WorldBackdrop world={world} priority />
        <Accent />
        <div className="rail relative z-10 flex w-full flex-1 flex-col justify-center py-28">
          <BackRow world={world} className="absolute left-[var(--gutter)] top-24" />
          <p
            className="text-xl italic"
            style={{ fontFamily: "var(--font-fraunces)", color: world.muted }}
          >
            Once upon a bedtime…
          </p>
          <h1
            className="mt-3 max-w-3xl font-black italic leading-[1.02]"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              color: world.fg,
            }}
          >
            Magical Hekaya
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: world.body }}>
            {project.tagline}
          </p>
          {metric && (
            <p className="mt-8 flex items-baseline gap-3">
              <span
                className="text-3xl font-black italic"
                style={{ fontFamily: "var(--font-fraunces)", color: world.link }}
              >
                {metric.value}
              </span>
              <span className="text-sm" style={{ color: world.muted }}>
                {metric.label} · {metric.source}
              </span>
            </p>
          )}
          <div className="mt-10 flex items-center gap-6">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-7 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.04]"
                style={{ background: world.cta.bg, color: world.cta.fg }}
              >
                Visit the storefront ↗
              </a>
            )}
            <a
              href="#chapter-one"
              className="font-mono text-xs uppercase tracking-[0.2em] underline-offset-4 hover:underline"
              style={{ color: world.link }}
            >
              Turn the page ↓
            </a>
          </div>
        </div>
      </header>

      {/* ── The chapters ──────────────────────────────────────────────── */}
      <main className="bg-bg">
        {/* Chapter one — the problem, with a drop cap */}
        <section id="chapter-one" className="rail max-w-3xl py-20">
          <Reveal>
            <ChapterHeading index="One" title="The impossible ask" />
            <p
              className="mt-10 text-lg leading-loose text-ink-soft first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-black first-letter:italic first-letter:leading-[0.8]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {study.problem}
            </p>
          </Reveal>
        </section>

        {/* Chapter two — the magic, as story beats */}
        <section className="rule bg-surface py-20">
          <div className="rail max-w-3xl">
            <Reveal>
              <ChapterHeading index="Two" title="How the magic works" />
            </Reveal>
            <Reveal group className="mt-10 space-y-8">
              {study.approach.map((item) => (
                <RevealItem key={item} className="flex gap-5">
                  <span aria-hidden className="mt-1 text-lg" style={{ color: CORAL }}>
                    ✦
                  </span>
                  <p
                    className="text-lg leading-relaxed text-ink-soft"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {item}
                  </p>
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </section>

        {/* The picture pages — tilted spreads */}
        <section className="rail py-20">
          <Reveal group className="grid items-center gap-12 lg:grid-cols-[3fr_1fr]">
            <RevealItem>
              <div className="rotate-1 transition-transform duration-500 hover:rotate-0">
                <HeroArt art={art} project={project} monogram="H" />
              </div>
              <p
                className="mt-4 text-center text-sm italic text-muted"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                — where every child becomes the hero of their own book —
              </p>
            </RevealItem>
            {project.screenshots.mobile[0] && (
              <RevealItem className="-rotate-2 transition-transform duration-500 hover:rotate-0">
                <DeviceFrame
                  src={project.screenshots.mobile[0]}
                  alt={`${project.name} on mobile`}
                  accent={project.accent}
                  kind="mobile"
                  sizes="(min-width: 1024px) 18vw, 40vw"
                />
              </RevealItem>
            )}
          </Reveal>
        </section>

        {/* Chapter three — happily shipped after */}
        <section className="rule bg-surface py-20">
          <div className="rail max-w-3xl">
            <Reveal>
              <ChapterHeading index="Three" title="Happily shipped after" />
              <ul className="mt-10 space-y-5">
                {study.outcome.map((item) => (
                  <li key={item} className="flex gap-5">
                    <span aria-hidden className="mt-1 text-lg" style={{ color: PLUM }}>
                      ✦
                    </span>
                    <p
                      className="text-lg leading-relaxed text-ink-soft"
                      style={{ fontFamily: "var(--font-fraunces)" }}
                    >
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
              <ul className="mt-10 flex flex-wrap justify-center gap-2">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Chip>{tech}</Chip>
                  </li>
                ))}
              </ul>
              <p
                className="mt-16 text-center text-4xl font-black italic"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                The End<span style={{ color: CORAL }}>*</span>
              </p>
              <p className="mt-3 text-center text-sm text-muted">
                *except it isn&apos;t — the product is live with paying customers at{" "}
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-accent"
                  >
                    magicalhekaya.com
                  </a>
                ) : (
                  "magicalhekaya.com"
                )}
                .
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <div style={{ background: world.fallbackBg }}>
        <StoryPrevNext prev={prev} next={next} world={world} />
      </div>
    </>
  );
}
