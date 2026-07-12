"use client";

import type { Project } from "@/content/schema";
import { DEFAULT_WORLD, WORLDS } from "./worlds";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { FaslPanel } from "./panels/FaslPanel";
import { HekayaPanel } from "./panels/HekayaPanel";
import { ResoPanel } from "./panels/ResoPanel";
import { WebTradePanel } from "./panels/WebTradePanel";
import { BelmoPanel } from "./panels/BelmoPanel";
import { LaktaPanel } from "./panels/LaktaPanel";
import {
  ChipRow,
  CtaRow,
  IndexLabel,
  PanelShell,
  type PanelProps,
} from "./panels/shared";

const PANELS: Record<string, React.FC<PanelProps>> = {
  fasl: FaslPanel,
  "magical-hekaya": HekayaPanel,
  "reso-khdma": ResoPanel,
  webtrade: WebTradePanel,
  belmo: BelmoPanel,
  lakta: LaktaPanel,
};

/** Generic fallback for any future featured project without a bespoke panel. */
function DefaultPanel(props: PanelProps) {
  const { project, world } = props;
  const metric = project.metrics[0];
  return (
    <PanelShell world={world}>
      <div className="grid items-center gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div>
          <IndexLabel {...props} />
          <h3
            className="font-display mt-4 font-bold leading-none"
            style={{ fontSize: "var(--text-display)", color: world.fg }}
          >
            {project.name}
          </h3>
          <p className="mt-4 max-w-md text-lg leading-relaxed" style={{ color: world.body }}>
            {project.tagline}
          </p>
          {metric && (
            <p className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold" style={{ color: world.link }}>
                {metric.value}
              </span>
              <span className="text-sm" style={{ color: world.muted }}>
                {metric.label}
              </span>
            </p>
          )}
          <ChipRow project={project} world={world} className="mt-6" />
          <CtaRow project={project} world={world} className="mt-8" />
        </div>
        <div>
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram={project.name.charAt(0)}
          />
        </div>
      </div>
    </PanelShell>
  );
}

export function CaseStudyPanel({
  project,
  index,
  total,
  extras,
}: {
  project: Project;
  index: number;
  total: number;
  extras?: PanelProps["extras"];
}) {
  const world = WORLDS[project.slug] ?? DEFAULT_WORLD;
  const Panel = PANELS[project.slug] ?? DefaultPanel;
  return <Panel project={project} index={index} total={total} world={world} extras={extras} />;
}
