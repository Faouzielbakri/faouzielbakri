"use client";

/**
 * WebTrade — an order ticket on the trading floor. Everything mono,
 * everything gridded; the name reads like a ticker symbol.
 */
import Link from "next/link";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { PanelShell, type PanelProps } from "./shared";

export function WebTradePanel(props: PanelProps) {
  const { project, world } = props;

  const rows: [string, string][] = [
    ["ROLE", project.role.toUpperCase()],
    ["RENDER LATENCY", "SUB-100MS"],
    ["STAKES", "REAL MONEY — FUNDS-LOCKED TX"],
    ["STACK", project.stack.slice(0, 4).join(" · ").toUpperCase()],
    ["STATUS", "LIVE · MAINTAINED"],
  ];

  return (
    <PanelShell world={world}>
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_6fr]">
        <div className="font-mono">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: world.muted }}>
            {String(props.index + 1).padStart(2, "0")}/{String(props.total).padStart(2, "0")} ·
            ORDER TICKET
          </p>
          <h3
            className="mt-4 font-bold leading-none tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: world.fg }}
          >
            WEBTRADE
            <span className="animate-pulse" style={{ color: world.link }}>
              _
            </span>
          </h3>
          <p
            className="mt-4 max-w-md text-base leading-relaxed"
            style={{ color: world.body, fontFamily: "var(--font-geist-sans)" }}
          >
            {project.tagline}
          </p>

          <div
            className="mt-6 max-w-md divide-y border text-[12px]"
            style={{ borderColor: world.chip.border }}
          >
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-6 px-4 py-2.5"
                style={{ borderColor: world.chip.border }}
              >
                <span style={{ color: world.muted }}>{k}</span>
                <span className="text-right" style={{ color: world.chip.fg }}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href={`/work/${project.slug}`}
              className="inline-block rounded-sm px-6 py-3 text-sm font-bold uppercase tracking-widest transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: world.cta.bg, color: world.cta.fg }}
            >
              ▸ Open position
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram="W"
          />
          {project.screenshots.mobile[0] && (
            <div className="absolute -bottom-8 -right-6 w-[22%]">
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
            monogram="W"
            sizes="90vw"
          />
        </div>
      </div>
    </PanelShell>
  );
}
