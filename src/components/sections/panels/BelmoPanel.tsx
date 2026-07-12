"use client";

/**
 * Belmo — a beauty-magazine cover. Playfair italic masthead, bilingual
 * wordmark, screenshots presented like an editorial spread.
 */
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { ChipRow, CtaRow, IndexLabel, PanelShell, type PanelProps } from "./shared";

export function BelmoPanel(props: PanelProps) {
  const { project, world } = props;

  return (
    <PanelShell world={world}>
      <div className="grid items-center gap-12 lg:grid-cols-[6fr_5fr]">
        <div>
          <IndexLabel {...props} />
          <div className="mt-6 flex items-baseline gap-5">
            <h3
              className="font-black italic leading-none"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(3.5rem, 7.5vw, 7rem)",
                color: world.fg,
              }}
            >
              Belmo
            </h3>
            <span
              className="hidden text-3xl sm:block"
              style={{ fontFamily: "var(--font-amiri)", color: world.link }}
            >
              بيلمو
            </span>
          </div>
          <p
            className="mt-2 font-mono text-[11px] uppercase tracking-[0.35em]"
            style={{ color: world.muted }}
          >
            Seoul → Agadir · K-beauty · Cash on delivery
          </p>
          <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: world.body }}>
            {project.tagline}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed" style={{ color: world.muted }}>
            Own product, own storefront, own server — designed, built, and
            self-hosted end-to-end.
          </p>
          <ChipRow project={project} world={world} className="mt-6" max={5} />
          <CtaRow project={project} world={world} className="mt-8" />
        </div>

        <div className="relative hidden lg:block">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram="B"
          />
          {project.screenshots.mobile[0] && (
            <div className="absolute -bottom-10 -left-10 w-[24%] -rotate-3">
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
            monogram="B"
            sizes="90vw"
          />
        </div>
      </div>
    </PanelShell>
  );
}
