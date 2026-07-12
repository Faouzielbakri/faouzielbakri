"use client";

/**
 * RESO Khdma — the case study as a WhatsApp conversation. The product lives
 * inside WhatsApp, so the story does too: the problem arrives as worker
 * messages in Darija, the approach is the agent replying, and the message
 * flow is the architecture.
 */
import { WORLDS, WorldBackdrop } from "@/components/sections/worlds";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Chip } from "@/components/ui/Chip";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { BackRow, HeroArt, StoryPrevNext, type StoryProps } from "./shared";

const WA_GREEN = "#25d366";
const WA_DEEP = "#075e54";
/** Classic WhatsApp chat wallpaper tone */
const WALLPAPER = "#efeae2";

function Timestamp({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-black/40">
      {children} <span className="text-[#53bdeb]">✓✓</span>
    </span>
  );
}

/** Incoming bubble — the worker (white, like WhatsApp received). */
function Incoming({
  children,
  translation,
}: {
  children: React.ReactNode;
  translation?: string;
}) {
  return (
    <div className="max-w-md">
      <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[15px] leading-relaxed text-[#111b21] shadow-sm">
        <span dir="rtl" className="block text-right">
          {children}
        </span>
        {translation && (
          <span className="mt-2 block border-t border-black/5 pt-2 text-xs italic text-black/45">
            {translation}
          </span>
        )}
      </div>
    </div>
  );
}

/** Outgoing bubble — the agent (green, like WhatsApp sent). */
function Outgoing({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="ml-auto max-w-md">
      <div className="rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-4 py-3 text-[15px] leading-relaxed text-[#111b21] shadow-sm">
        {label && (
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: WA_DEEP }}>
            {label}
          </span>
        )}
        {children}
        <Timestamp>14:02</Timestamp>
      </div>
    </div>
  );
}

/** Centered system pill, like WhatsApp date/system notices. */
function SystemPill({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto w-fit rounded-lg bg-[#ffffffcc] px-3 py-1 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-black/50 shadow-sm">
      {children}
    </p>
  );
}

export function ResoStory({ project, prev, next, art }: StoryProps) {
  const world = WORLDS["reso-khdma"];
  const study = project.caseStudy!;
  const metric = project.metrics[0];

  return (
    <>
      {/* ── The workshop — hero ───────────────────────────────────────── */}
      <header className="relative flex min-h-screen flex-col overflow-hidden">
        <WorldBackdrop world={world} priority />
        <div className="rail relative z-10 flex w-full flex-1 flex-col justify-center py-28">
          <BackRow world={world} className="absolute left-[var(--gutter)] top-24" />
          <p
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: world.muted }}
          >
            {project.role} — built for WhatsApp
          </p>
          <h1
            className="font-display mt-4 font-bold leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", color: world.fg }}
          >
            RESO Khdma
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: world.body }}>
            {project.tagline}
          </p>
          {metric && (
            <p className="mt-8 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold" style={{ color: world.link }}>
                {metric.value}
              </span>
              <span className="text-sm" style={{ color: world.muted }}>
                {metric.label}
              </span>
            </p>
          )}
          <div className="mt-10 flex items-center gap-6">
            <a
              href="#conversation"
              className="rounded-full px-7 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.04]"
              style={{ background: world.cta.bg, color: world.cta.fg }}
            >
              Open the conversation ↓
            </a>
          </div>
        </div>
      </header>

      {/* ── The conversation — problem & approach as a chat thread ───── */}
      <main>
        <section
          id="conversation"
          className="py-20"
          style={{ background: WALLPAPER }}
        >
          <div className="rail max-w-3xl">
            {/* Chat header */}
            <div className="flex items-center gap-3 rounded-t-2xl px-5 py-3" style={{ background: WA_DEEP }}>
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
                R
              </span>
              <div>
                <p className="text-sm font-semibold text-white">RESO Khdma — agent</p>
                <p className="text-[11px] text-white/70">online · replies in Darija</p>
              </div>
            </div>

            <div className="space-y-4 rounded-b-2xl border border-black/5 bg-black/[0.02] p-5 sm:p-8">
              <SystemPill>The problem</SystemPill>
              <Reveal group className="space-y-4">
                <RevealItem>
                  <Incoming translation="“I'm looking for carpentry work… I'm not on any job site, just WhatsApp.”">
                    كنقلب على خدمة ديال النجارة… ماكاينش فشي موقع، غير الواتساب 🙏
                  </Incoming>
                </RevealItem>
                <RevealItem>
                  <div className="max-w-md rounded-2xl bg-white/70 px-4 py-3 text-sm leading-relaxed text-black/70 shadow-sm">
                    {study.problem}
                  </div>
                </RevealItem>
              </Reveal>

              <SystemPill>The approach — the agent replies</SystemPill>
              <Reveal group className="space-y-4">
                {study.approach.map((item, i) => (
                  <RevealItem key={item}>
                    <Outgoing label={`step ${i + 1}`}>{item}</Outgoing>
                  </RevealItem>
                ))}
              </Reveal>

              <SystemPill>Delivered ✓✓</SystemPill>
              <Reveal group className="space-y-4">
                {study.outcome.map((item) => (
                  <RevealItem key={item}>
                    <Outgoing>{item}</Outgoing>
                  </RevealItem>
                ))}
                <RevealItem>
                  <Incoming translation="“We found you 3 opportunities near you ✨” — the reply that matters.">
                    لقينا ليك 3 فرص قريبة منك ✨
                  </Incoming>
                </RevealItem>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── How a message flows — architecture ───────────────────────── */}
        {study.architecture && (
          <section className="rule bg-bg py-20">
            <div className="rail">
              <h2 className="font-mono mb-8 text-xs uppercase tracking-[0.2em] text-muted">
                How a message flows
              </h2>
              <Reveal group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {study.architecture.map((step, i) => (
                  <RevealItem key={step.title} className="relative">
                    <div className="h-full rounded-2xl border border-line bg-surface p-6">
                      <span className="font-mono text-xs font-bold" style={{ color: WA_GREEN }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display mt-2 font-bold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
                    </div>
                    {i < study.architecture!.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 text-muted lg:block"
                      >
                        →
                      </span>
                    )}
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </section>
        )}

        {/* ── The dashboard side ────────────────────────────────────────── */}
        <section className="rule bg-surface py-20">
          <div className="rail">
            <h2 className="font-mono mb-8 text-xs uppercase tracking-[0.2em] text-muted">
              The recruiter side — where matches become hires
            </h2>
            <Reveal group className="grid items-start gap-10 lg:grid-cols-[3fr_1fr]">
              <RevealItem>
                <HeroArt art={art} project={project} monogram="R" />
              </RevealItem>
              {project.screenshots.mobile[0] && (
                <RevealItem>
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
            <ul className="mt-10 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Chip>{tech}</Chip>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <div style={{ background: world.fallbackBg }}>
        <StoryPrevNext prev={prev} next={next} world={world} />
      </div>
    </>
  );
}
