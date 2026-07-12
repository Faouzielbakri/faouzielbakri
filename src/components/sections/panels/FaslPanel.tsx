"use client";

/**
 * FASL — monumental, bilingual, ceremonial. Centered like an engraved
 * plaque in the hall of justice; Amiri serif carries the Arabic.
 */
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { ChipRow, CtaRow, IndexLabel, PanelShell, type PanelProps } from "./shared";

export function FaslPanel(props: PanelProps) {
  const { project, world } = props;
  const metric = project.metrics[0];

  return (
    <PanelShell world={world} priority={props.index === 0}>
      <div className="grid items-center gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
        {/* Ceremonial column */}
        <div className="flex flex-col items-center text-center">
          <IndexLabel {...props} />
          <p
            className="mt-4 leading-none"
            style={{
              fontFamily: "var(--font-amiri)",
              fontSize: "clamp(3.5rem, 6.5vw, 6rem)",
              color: world.link,
            }}
          >
            فصل
          </p>
          <h3
            className="font-display mt-1 font-bold uppercase tracking-[0.35em]"
            style={{ fontSize: "clamp(1.25rem, 2vw, 1.9rem)", color: world.fg }}
          >
            {project.name}
          </h3>
          <span aria-hidden className="mt-4 h-px w-24" style={{ background: world.chip.border }} />
          <p className="mt-4 max-w-md leading-relaxed" style={{ color: world.body }}>
            {project.tagline}
          </p>
          {metric && (
            <p className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold" style={{ color: world.link }}>
                {metric.value}
              </span>
              <span className="text-sm" style={{ color: world.muted }}>
                {metric.label}
              </span>
            </p>
          )}
          <ChipRow project={project} world={world} className="mt-5 justify-center" max={5} />
          <CtaRow project={project} world={world} className="mt-6" />
        </div>

        {/* The court record */}
        <div className="relative hidden lg:block">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram="ف"
          />
          {project.screenshots.mobile[0] && (
            <div className="absolute -bottom-8 -left-8 w-[22%]">
              <DeviceFrame
                src={project.screenshots.mobile[0]}
                alt={`${project.name} on mobile`}
                accent={project.accent}
                kind="mobile"
              />
            </div>
          )}
        </div>
        <div className="lg:hidden">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram="ف"
            sizes="90vw"
          />
        </div>
      </div>
    </PanelShell>
  );
}
