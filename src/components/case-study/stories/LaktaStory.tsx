"use client";

/**
 * Lakta — the case study as an edit timeline. The product renders video ads,
 * so the page is cut like one: a dark studio hero with the generated ads
 * playing in phones, then the story laid out as clips on a timeline —
 * BRIEF → SCRIPT → RENDER → PUBLISH.
 */
import { useEffect, useRef } from "react";
import { WORLDS, WorldBackdrop } from "@/components/sections/worlds";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { useReducedMotionSafe } from "@/lib/hooks";
import { BackRow, HeroArt, StoryChips, StoryPrevNext, type StoryProps } from "./shared";

const ORANGE = "#ff8a3d";
const MAGENTA = "#d6336c";
const PAGE_BG = "#140c10";
const CLIP_BG = "#1d1216";
const CLIP_BORDER = "rgba(255,138,61,0.22)";

function AdPhone({ src, poster, delay }: { src: string; poster?: string; delay: number }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const t = setTimeout(() => video.play().catch(() => {}), delay);
        return () => clearTimeout(t);
      }
      video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced, delay]);

  return (
    <figure className="overflow-hidden rounded-[1.1rem] border-4 border-black/70 bg-black shadow-2xl">
      <div className="relative aspect-[390/844]">
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
        <span
          aria-hidden
          className="absolute left-1/2 top-0 z-10 h-[3.1%] w-[38%] -translate-x-1/2 rounded-b-[0.55rem] bg-black"
        />
      </div>
    </figure>
  );
}

/** A clip on the timeline: timecode chip + track content. */
function Clip({
  timecode,
  track,
  color,
  children,
}: {
  timecode: string;
  track: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative border-l pl-8" style={{ borderColor: CLIP_BORDER }}>
      <span
        aria-hidden
        className="absolute -left-[5px] top-1 size-2.5 rounded-full"
        style={{ background: color }}
      />
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
        <span
          className="rounded px-2 py-0.5 font-bold"
          style={{ background: `${color}22`, color }}
        >
          {timecode}
        </span>
        <span className="text-white/50">{track}</span>
      </p>
      <div className="mt-4 pb-12">{children}</div>
    </div>
  );
}

/** Fake timeline ruler with tick marks. */
function Ruler() {
  return (
    <div aria-hidden className="flex items-end gap-0 overflow-hidden border-b pb-1" style={{ borderColor: CLIP_BORDER }}>
      {Array.from({ length: 60 }, (_, i) => (
        <span
          key={i}
          className="w-[1.6667%] border-l"
          style={{
            borderColor: i % 5 === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)",
            height: i % 5 === 0 ? 14 : 7,
          }}
        />
      ))}
    </div>
  );
}

export function LaktaStory({ project, prev, next, art, extras }: StoryProps) {
  const world = WORLDS.lakta;
  const study = project.caseStudy!;
  const videos = extras?.videos ?? [];

  // Map story beats onto timeline clips.
  const tc = (n: number) => `00:${String(n * 2).padStart(2, "0")}`;
  const clips = [
    { timecode: tc(0), track: "BRIEF — the problem", color: MAGENTA, items: [study.problem] },
    ...study.approach.map((item, i) => ({
      timecode: tc(i + 1),
      track: ["SCRIPT", "RENDER", "PIPELINE", "CAROUSELS"][i] ?? "RENDER",
      color: ORANGE,
      items: [item],
    })),
    {
      timecode: tc(study.approach.length + 1),
      track: "PUBLISH — the outcome",
      color: MAGENTA,
      items: study.outcome,
    },
  ];

  return (
    <div style={{ background: PAGE_BG }}>
      {/* ── The studio — hero with the ads playing ────────────────────── */}
      <header className="relative flex min-h-screen flex-col overflow-hidden">
        <WorldBackdrop world={world} priority />
        <div className="rail relative z-10 flex w-full flex-1 flex-col justify-center py-28">
          <BackRow world={world} className="absolute left-[var(--gutter)] top-24" />
          <div className="grid items-center gap-12 lg:grid-cols-[5fr_6fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: world.muted }}>
                {project.role}
              </p>
              <h1
                className="font-display mt-4 font-bold uppercase leading-none"
                style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", color: world.fg }}
              >
                Lakta<span style={{ color: world.link }}>.</span>
              </h1>
              <p
                className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em]"
                style={{ color: world.muted }}
              >
                براند كيت ← إعلان فيديو بالدارجة
              </p>
              <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: world.body }}>
                {project.tagline}
              </p>
              {videos.length > 0 && (
                <p className="mt-4 max-w-md text-sm" style={{ color: world.muted }}>
                  Every ad playing on this page came out of the pipeline itself — no
                  human editor touched them.
                </p>
              )}
              <div className="mt-8">
                <a
                  href="#timeline"
                  className="rounded-full px-7 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.04]"
                  style={{ background: world.cta.bg, color: world.cta.fg }}
                >
                  Scrub the timeline ↓
                </a>
              </div>
            </div>

            {videos.length > 0 ? (
              <div className="hidden items-center justify-center gap-4 lg:flex">
                {videos.slice(0, 3).map((v, i) => (
                  <div
                    key={v.src}
                    className={`w-[30%] max-w-[200px] ${
                      i === 1 ? "translate-y-8" : i === 2 ? "-translate-y-6" : "-translate-y-2"
                    }`}
                  >
                    <AdPhone src={v.src} poster={v.poster} delay={i * 400} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="hidden lg:block">
                <HeroArt art={art} project={project} monogram="L" />
              </div>
            )}
            <div className="lg:hidden">
              {videos.length > 0 ? (
                <div className="mx-auto w-2/3 max-w-[240px]">
                  <AdPhone src={videos[0].src} poster={videos[0].poster} delay={0} />
                </div>
              ) : (
                <HeroArt art={art} project={project} monogram="L" sizes="90vw" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── The timeline ──────────────────────────────────────────────── */}
      <main id="timeline" className="rail py-20">
        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          <span>lakta_case_study.prproj</span>
          <span>
            <span style={{ color: ORANGE }}>●</span> rec
          </span>
        </div>
        <Ruler />

        <div className="mt-12 space-y-0">
          {clips.map((clip) => (
            <Reveal key={clip.timecode + clip.track}>
              <Clip timecode={clip.timecode} track={clip.track} color={clip.color}>
                {clip.items.map((item) => (
                  <p
                    key={item}
                    className="max-w-2xl rounded-xl border p-5 text-lg leading-relaxed text-white/85"
                    style={{ background: CLIP_BG, borderColor: CLIP_BORDER }}
                  >
                    {item}
                  </p>
                ))}
              </Clip>
            </Reveal>
          ))}
        </div>

        {/* Render settings — the stack */}
        <Reveal className="mt-4 rounded-xl border border-[rgba(255,138,61,0.22)] bg-[#1d1216] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            Render settings
          </p>
          <StoryChips project={project} world={world} className="mt-4" />
        </Reveal>

        {/* The app itself */}
        <Reveal group className="mt-16 grid items-start gap-8 lg:grid-cols-[3fr_1fr]">
          <RevealItem>
            <p className="font-mono mb-3 text-xs uppercase tracking-[0.2em] text-white/50">
              The cutting room — where brands become campaigns
            </p>
            <HeroArt art={art} project={project} monogram="L" />
          </RevealItem>
          {project.screenshots.mobile[0] && (
            <RevealItem className="lg:pt-8">
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
      </main>

      <StoryPrevNext prev={prev} next={next} world={world} />
    </div>
  );
}
