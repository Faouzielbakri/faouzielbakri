"use client";

/**
 * WebTrade — the case study as a trading terminal. The whole page runs dark:
 * a ticker across the hero, sections as terminal panes ([RISK], [EXEC],
 * [LEDGER]), prompt-prefixed lines, and green/red market accents.
 */
import { WORLDS, WorldBackdrop } from "@/components/sections/worlds";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { BackRow, HeroArt, StoryChips, StoryPrevNext, type StoryProps } from "./shared";

const UP = "#2ea87e";
const DOWN = "#e5484d";
const PAGE_BG = "#080b0f";
const PANE_BG = "#0d131a";
const PANE_BORDER = "rgba(46,168,126,0.18)";

function Pane({
  tag,
  title,
  children,
  className = "",
}: {
  tag: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-6 sm:p-8 ${className}`}
      style={{ background: PANE_BG, borderColor: PANE_BORDER }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em]">
        <span style={{ color: UP }}>[{tag}]</span>{" "}
        <span className="text-white/50">{title}</span>
      </p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function WebTradeStory({ project, prev, next, art }: StoryProps) {
  const world = WORLDS.webtrade;
  const study = project.caseStudy!;
  const metric = project.metrics[0];
  const { Accent } = world;

  return (
    <div style={{ background: PAGE_BG }}>
      {/* ── Hero — the trading floor ──────────────────────────────────── */}
      <header className="relative flex min-h-screen flex-col overflow-hidden">
        <WorldBackdrop world={world} priority />
        <Accent />
        <div className="rail relative z-10 flex w-full flex-1 flex-col justify-center py-28">
          <BackRow world={world} className="absolute left-[var(--gutter)] top-28" />
          <p
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: world.muted }}
          >
            {project.role} — real money on the line
          </p>
          <h1
            className="font-display mt-4 font-bold uppercase leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", color: world.fg }}
          >
            WebTrade
            <span style={{ color: UP }}>▲</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: world.body }}>
            {project.tagline}
          </p>
          {metric && (
            <p className="mt-8 flex items-baseline gap-3 font-mono">
              <span className="text-3xl font-bold" style={{ color: UP }}>
                {metric.value}
              </span>
              <span className="text-sm" style={{ color: world.muted }}>
                {metric.label} · {metric.source}
              </span>
            </p>
          )}
          <div className="mt-10">
            <a
              href="#terminal"
              className="rounded-full px-7 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.04]"
              style={{ background: world.cta.bg, color: world.cta.fg }}
            >
              Open the terminal ↓
            </a>
          </div>
        </div>
      </header>

      {/* ── The terminal panes ────────────────────────────────────────── */}
      <main id="terminal" className="rail space-y-6 py-20">
        <Reveal>
          <Pane tag="RISK" title="what could go wrong — the problem">
            <p className="max-w-3xl text-lg leading-relaxed text-white/80">{study.problem}</p>
          </Pane>
        </Reveal>

        <Reveal>
          <Pane tag="EXEC" title="execution — the approach">
            <ul className="max-w-3xl space-y-4 font-mono text-[15px] leading-relaxed text-white/80">
              {study.approach.map((item) => (
                <li key={item} className="flex gap-3">
                  <span style={{ color: UP }}>›</span>
                  <span className="font-sans">{item}</span>
                </li>
              ))}
            </ul>
          </Pane>
        </Reveal>

        {/* Order book — the two invariants */}
        <Reveal group className="grid gap-6 lg:grid-cols-2">
          <RevealItem>
            <Pane tag="BID" title="what users get" className="h-full">
              <ul className="space-y-3 font-mono text-sm">
                <li className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/60">chart render latency</span>
                  <span style={{ color: UP }}>&lt; 100ms ▲</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/60">price streaming</span>
                  <span style={{ color: UP }}>live · WebSocket ▲</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">uptime since launch</span>
                  <span style={{ color: UP }}>still running ▲</span>
                </li>
              </ul>
            </Pane>
          </RevealItem>
          <RevealItem>
            <Pane tag="ASK" title="what is never allowed" className="h-full">
              <ul className="space-y-3 font-mono text-sm">
                <li className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/60">double-spends</span>
                  <span style={{ color: DOWN }}>rejected ▼</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/60">race conditions</span>
                  <span style={{ color: DOWN }}>funds locked ▼</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">stuttering candles</span>
                  <span style={{ color: DOWN }}>dropped frames ▼</span>
                </li>
              </ul>
            </Pane>
          </RevealItem>
        </Reveal>

        {/* The screen itself */}
        <Reveal group className="grid items-start gap-6 lg:grid-cols-[3fr_1fr]">
          <RevealItem>
            <Pane tag="VIEW" title="the platform">
              <HeroArt art={art} project={project} monogram="W" />
            </Pane>
          </RevealItem>
          {project.screenshots.mobile[0] && (
            <RevealItem>
              <Pane tag="VIEW" title="mobile">
                <DeviceFrame
                  src={project.screenshots.mobile[0]}
                  alt={`${project.name} on mobile`}
                  accent={project.accent}
                  kind="mobile"
                  sizes="(min-width: 1024px) 18vw, 40vw"
                />
              </Pane>
            </RevealItem>
          )}
        </Reveal>

        <Reveal>
          <Pane tag="LEDGER" title="settled — the outcome">
            <ul className="max-w-3xl space-y-4">
              {study.outcome.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-white/80">
                  <span className="font-mono" style={{ color: UP }}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <StoryChips project={project} world={world} className="mt-8" />
          </Pane>
        </Reveal>
      </main>

      <StoryPrevNext prev={prev} next={next} world={world} />
    </div>
  );
}
