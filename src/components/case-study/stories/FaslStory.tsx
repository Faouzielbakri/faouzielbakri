"use client";

/**
 * FASL — the case study as a legal case file. A ceremonial emerald hall
 * opens the dossier; the body reads like a court record on paper: numbered
 * articles, a procedure timeline, exhibits, and a verdict.
 */
import { WORLDS } from "@/components/sections/worlds";
import { WorldBackdrop } from "@/components/sections/worlds";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Chip } from "@/components/ui/Chip";
import { BackRow, HeroArt, StoryPrevNext, type StoryProps } from "./shared";

const GOLD = "#b8860b";
const EMERALD = "#0e7a5f";

export function FaslStory({ project, prev, next, art }: StoryProps) {
  const world = WORLDS.fasl;
  const study = project.caseStudy!;
  const metric = project.metrics[0];

  return (
    <>
      {/* ── The hall — ceremonial opening ─────────────────────────────── */}
      <header className="relative flex min-h-screen flex-col overflow-hidden">
        <WorldBackdrop world={world} priority />
        <div className="rail relative z-10 flex w-full flex-1 flex-col justify-center py-28 text-center">
          <BackRow world={world} className="absolute left-[var(--gutter)] top-24" />
          <p
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: world.muted }}
          >
            Case file 01 — {project.role}
          </p>
          <p
            aria-hidden
            className="mt-6 leading-none"
            style={{
              fontFamily: "var(--font-amiri)",
              fontSize: "clamp(5rem, 12vw, 11rem)",
              color: world.link,
            }}
          >
            فصل
          </p>
          <h1
            className="font-display mt-2 font-bold uppercase tracking-[0.4em]"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: world.fg }}
          >
            {project.name}
          </h1>
          <span
            aria-hidden
            className="mx-auto mt-6 h-px w-28"
            style={{ background: world.chip.border }}
          />
          <p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
            style={{ color: world.body }}
          >
            {project.tagline}
          </p>
          {metric && (
            <p className="mt-8 flex items-baseline justify-center gap-3">
              <span className="font-display text-4xl font-bold" style={{ color: world.link }}>
                {metric.value}
              </span>
              <span className="text-sm" style={{ color: world.muted }}>
                {metric.label} · {metric.source}
              </span>
            </p>
          )}
          <div className="mt-10 flex items-center justify-center gap-6">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-7 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.04]"
                style={{ background: world.cta.bg, color: world.cta.fg }}
              >
                Visit fasl.ma ↗
              </a>
            )}
            <a
              href="#dossier"
              className="font-mono text-xs uppercase tracking-[0.2em] underline-offset-4 hover:underline"
              style={{ color: world.link }}
            >
              Open the dossier ↓
            </a>
          </div>
        </div>
      </header>

      {/* ── The dossier — court record on paper ───────────────────────── */}
      <main id="dossier" className="bg-bg">
        {/* Article 01 — the problem */}
        <Reveal className="rail grid gap-10 py-20 lg:grid-cols-[1fr_2fr]">
          <div>
            <p aria-hidden className="text-6xl" style={{ fontFamily: "var(--font-amiri)", color: GOLD }}>
              ٠١
            </p>
            <h2 className="font-display mt-2 text-xl font-bold">
              Article 01 — The problem
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">{study.problem}</p>
        </Reveal>

        {/* Article 02 — the procedure */}
        <section className="rule bg-surface py-20">
          <Reveal className="rail grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p aria-hidden className="text-6xl" style={{ fontFamily: "var(--font-amiri)", color: GOLD }}>
                ٠٢
              </p>
              <h2 className="font-display mt-2 text-xl font-bold">
                Article 02 — The procedure
              </h2>
            </div>
            <ol className="max-w-2xl space-y-6">
              {study.approach.map((item, i) => (
                <li key={item} className="flex gap-5 leading-relaxed text-ink-soft">
                  <span
                    className="font-mono mt-1 text-xs font-bold"
                    style={{ color: EMERALD }}
                  >
                    §{i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Due process — the agent pipeline as a procedure timeline */}
          {study.architecture && (
            <div className="rail mt-16">
              <h3 className="font-mono mb-8 text-xs uppercase tracking-[0.2em] text-muted">
                Due process — how a case moves through the agents
              </h3>
              <Reveal group className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
                {study.architecture.map((step, i) => (
                  <RevealItem key={step.title} className="relative border-l pl-6 pb-10 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-6 lg:pr-6" >
                    <span
                      aria-hidden
                      className="absolute -left-[5px] top-0 size-2.5 rounded-full lg:-top-[5px] lg:left-0"
                      style={{ background: GOLD }}
                    />
                    <p className="font-mono text-xs" style={{ color: GOLD }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h4 className="font-display mt-1 font-bold">{step.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          )}
        </section>

        {/* Exhibits */}
        <section className="rail py-20">
          <h2 className="font-mono mb-10 text-xs uppercase tracking-[0.2em] text-muted">
            Exhibits — entered into evidence
          </h2>
          <Reveal group className="grid items-start gap-10 lg:grid-cols-[3fr_1fr]">
            <RevealItem>
              <p className="font-mono mb-3 text-xs" style={{ color: GOLD }}>
                Exhibit A — the platform
              </p>
              <HeroArt art={art} project={project} monogram="ف" priority={false} />
            </RevealItem>
            {project.screenshots.mobile[0] && (
              <RevealItem>
                <p className="font-mono mb-3 text-xs" style={{ color: GOLD }}>
                  Exhibit B — in hand
                </p>
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

        {/* The verdict */}
        <section className="rule bg-surface py-20">
          <Reveal className="rail text-center">
            <p
              aria-hidden
              className="text-5xl"
              style={{ fontFamily: "var(--font-amiri)", color: GOLD }}
            >
              الحكم
            </p>
            <h2 className="font-display mt-2 text-xl font-bold">The verdict</h2>
            <ul className="mx-auto mt-8 max-w-xl space-y-4 text-left">
              {study.outcome.map((item) => (
                <li key={item} className="flex gap-4 leading-relaxed text-ink-soft">
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full"
                    style={{ background: EMERALD }}
                  />
                  {item}
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
          </Reveal>
        </section>
      </main>

      <div style={{ background: world.fallbackBg }}>
        <StoryPrevNext prev={prev} next={next} world={world} />
      </div>
    </>
  );
}
