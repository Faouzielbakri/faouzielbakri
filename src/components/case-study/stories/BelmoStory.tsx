"use client";

/**
 * Belmo — the case study as a product detail page. A K-beauty storefront
 * sells skincare; this page "sells" the build: gallery, COD badge, add-to-
 * cart CTA, description, ingredients (the stack), and reviews (the outcome).
 */
import { WORLDS, WorldBackdrop } from "@/components/sections/worlds";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { BackRow, HeroArt, StoryPrevNext, type StoryProps } from "./shared";

const ROSE = "#b74d68";
const ROSE_SOFT = "#fdf1f4";
const ROSE_INK = "#4a1d2b";

function Stars() {
  return (
    <span aria-hidden className="tracking-[0.15em]" style={{ color: ROSE }}>
      ★★★★★
    </span>
  );
}

export function BelmoStory({ project, prev, next, art }: StoryProps) {
  const world = WORLDS.belmo;
  const study = project.caseStudy!;

  return (
    <div style={{ background: ROSE_SOFT, color: ROSE_INK }}>
      {/* ── The PDP hero ──────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <WorldBackdrop world={world} priority />
        <div className="rail relative z-10 pb-20 pt-28">
          <BackRow world={world} className="mb-10" />
          <div className="grid items-start gap-12 lg:grid-cols-[6fr_5fr]">
            {/* Product gallery */}
            <Reveal>
              <div className="rounded-3xl bg-white/60 p-4 shadow-[0_30px_80px_-40px_rgba(74,29,43,0.4)] backdrop-blur-sm sm:p-6">
                <HeroArt art={art} project={project} monogram="B" priority />
              </div>
              {project.screenshots.mobile[0] && (
                <div className="mt-4 w-[22%] min-w-24">
                  <div className="rounded-2xl bg-white/60 p-2 backdrop-blur-sm">
                    <DeviceFrame
                      src={project.screenshots.mobile[0]}
                      alt={`${project.name} on mobile`}
                      accent={project.accent}
                      kind="mobile"
                      sizes="18vw"
                    />
                  </div>
                </div>
              )}
            </Reveal>

            {/* Product info */}
            <Reveal className="lg:pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: world.muted }}>
                {project.role} · full build
              </p>
              <h1
                className="font-display mt-3 font-bold leading-none"
                style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", color: world.fg }}
              >
                Belmo
              </h1>
              <p className="mt-3 flex items-center gap-3 text-sm" style={{ color: world.muted }}>
                <Stars />
                orders fulfilled across Morocco
              </p>
              <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: world.body }}>
                {project.tagline}
              </p>

              {/* The "price block" — how Moroccans actually buy */}
              <div
                className="mt-8 space-y-3 rounded-2xl border bg-white/70 p-5 backdrop-blur-sm"
                style={{ borderColor: world.chip.border }}
              >
                <p className="flex items-center justify-between text-sm">
                  <span style={{ color: world.muted }}>Payment</span>
                  <span className="font-semibold">
                    الدفع عند الاستلام — cash on delivery
                  </span>
                </p>
                <p className="flex items-center justify-between border-t pt-3 text-sm" style={{ borderColor: world.chip.border }}>
                  <span style={{ color: world.muted }}>Delivery</span>
                  <span className="font-semibold">24–48h, nationwide</span>
                </p>
                <p className="flex items-center justify-between border-t pt-3 text-sm" style={{ borderColor: world.chip.border }}>
                  <span style={{ color: world.muted }}>Returns</span>
                  <span className="font-semibold">7 days</span>
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-8 py-4 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.04]"
                    style={{ background: ROSE }}
                  >
                    Visit the live store ↗
                  </a>
                )}
                <p className="flex items-center gap-2 text-sm" style={{ color: world.muted }}>
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: ROSE }} />
                    <span className="relative inline-flex size-2 rounded-full" style={{ background: ROSE }} />
                  </span>
                  In production — belmo.ma
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ── PDP tabs ──────────────────────────────────────────────────── */}
      <main className="rail space-y-16 pb-24 pt-8">
        {/* Description */}
        <Reveal className="grid gap-8 border-t border-[rgba(183,77,104,0.25)] pt-14 lg:grid-cols-[1fr_2fr]" >
          <h2 className="font-display text-xl font-bold">Description</h2>
          <p className="max-w-2xl text-lg leading-relaxed" style={{ color: world.body }}>
            {study.problem}
          </p>
        </Reveal>

        {/* How it's made */}
        <Reveal className="grid gap-8 border-t border-[rgba(183,77,104,0.25)] pt-14 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-xl font-bold">How it&apos;s made</h2>
          <ul className="max-w-2xl space-y-5">
            {study.approach.map((item) => (
              <li key={item} className="flex gap-4 leading-relaxed" style={{ color: world.body }}>
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full" style={{ background: ROSE }} />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Ingredients — the stack */}
        <Reveal className="grid gap-8 border-t border-[rgba(183,77,104,0.25)] pt-14 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-xl font-bold">Ingredients</h2>
          <div>
            <ul className="flex max-w-2xl flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <span
                    className="inline-flex items-center rounded-full border bg-white/70 px-3 py-1 font-mono text-xs"
                    style={{ borderColor: world.chip.border, color: world.chip.fg }}
                  >
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm" style={{ color: world.muted }}>
              100% self-hosted — Hetzner + Dokploy. No managed-platform additives.
            </p>
          </div>
        </Reveal>

        {/* Reviews — the outcome */}
        <div className="border-t border-[rgba(183,77,104,0.25)] pt-14">
          <h2 className="font-display text-xl font-bold">Reviews</h2>
          <Reveal group className="mt-8 grid gap-6 lg:grid-cols-2">
            {study.outcome.map((item) => (
              <RevealItem key={item}>
                <figure
                  className="h-full rounded-2xl border bg-white/70 p-6 backdrop-blur-sm"
                  style={{ borderColor: world.chip.border }}
                >
                  <Stars />
                  <blockquote className="mt-3 leading-relaxed" style={{ color: world.body }}>
                    {item}
                  </blockquote>
                  <figcaption className="mt-4 font-mono text-xs uppercase tracking-[0.15em]" style={{ color: world.muted }}>
                    — verified production
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </main>

      <StoryPrevNext prev={prev} next={next} world={world} />
    </div>
  );
}
