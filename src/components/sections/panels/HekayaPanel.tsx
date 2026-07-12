"use client";

/**
 * Magical Hekaya — a storybook spread. Fraunces italic reads like a
 * fairytale title; the app screenshot sits as a tilted page on the left,
 * the story text on the right, like an open book.
 */
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { ChipRow, CtaRow, IndexLabel, PanelShell, type PanelProps } from "./shared";

export function HekayaPanel(props: PanelProps) {
  const { project, world } = props;
  const metric = project.metrics[0];

  return (
    <PanelShell world={world}>
      {/* Text sits LEFT — the scrim darkens the left side and the artwork's
          floating book stays visible on the right. */}
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_6fr]">
        {/* Left page — the story */}
        <div>
          <IndexLabel {...props} />
          <p
            className="mt-6 text-lg italic"
            style={{ fontFamily: "var(--font-fraunces)", color: world.muted }}
          >
            Once upon a bedtime…
          </p>
          <h3
            className="mt-2 font-black italic leading-[1.02]"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(2.75rem, 5.5vw, 5rem)",
              color: world.fg,
            }}
          >
            Magical
            <br />
            Hekaya
          </h3>
          <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: world.body }}>
            {project.tagline}
          </p>
          {metric && (
            <p className="mt-6 flex items-baseline gap-3">
              <span
                className="text-3xl font-black italic"
                style={{ fontFamily: "var(--font-fraunces)", color: world.link }}
              >
                {metric.value}
              </span>
              <span className="text-sm" style={{ color: world.muted }}>
                {metric.label}
              </span>
            </p>
          )}
          <ChipRow project={project} world={world} className="mt-6" max={5} />
          <CtaRow project={project} world={world} className="mt-8" />
        </div>

        {/* Right page — the artifact, tilted like a page mid-turn */}
        <div className="relative hidden lg:block">
          <div className="rotate-2 transition-transform duration-500 hover:rotate-0">
            <DeviceFrame
              src={project.screenshots.desktop[0]}
              alt={project.alt}
              accent={project.accent}
              kind="desktop"
              monogram="H"
            />
          </div>
          {project.screenshots.mobile[0] && (
            <div className="absolute -bottom-10 -left-6 w-[24%] -rotate-6">
              <DeviceFrame
                src={project.screenshots.mobile[0]}
                alt={`${project.name} on mobile`}
                accent={project.accent}
                kind="mobile"
              />
            </div>
          )}
        </div>

        {/* Mobile fallback visual */}
        <div className="lg:hidden">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram="H"
            sizes="90vw"
          />
        </div>
      </div>
    </PanelShell>
  );
}
