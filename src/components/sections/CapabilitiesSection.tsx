"use client";

import Image from "next/image";
import type { Capability } from "@/content/schema";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { useSectionSpy } from "@/lib/hooks";
import { useUiStore } from "@/lib/store";

type CapabilitiesSectionProps = {
  capabilities: Capability[];
  /** Which pillar visuals exist on disk (id → public path) */
  visuals: Record<string, string | undefined>;
};

export function CapabilitiesSection({ capabilities, visuals }: CapabilitiesSectionProps) {
  const spyRef = useSectionSpy<HTMLElement>("capabilities");
  const intent = useUiStore((s) => s.audienceIntent);

  return (
    <section
      id="capabilities"
      ref={spyRef}
      aria-label="Capabilities"
      className="rule bg-bg py-24"
    >
      <div className="rail grid gap-12 lg:grid-cols-[2fr_3fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Capabilities
          </p>
          <h2
            className="font-display mt-3 font-bold leading-tight"
            style={{ fontSize: "var(--text-title)" }}
          >
            {intent === "hire"
              ? "What I bring to a team."
              : intent === "project"
                ? "What I can build for you."
                : "What I do best."}
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-muted">
            Three things, done deeply — not forty logos on a grid.
          </p>
        </div>

        <Reveal group className="space-y-6">
          {capabilities.map((cap) => {
            const visual = visuals[cap.id];
            return (
              <RevealItem key={cap.id}>
                <article className="grid gap-6 rounded-2xl border border-line bg-surface p-8 sm:grid-cols-[1fr_120px]">
                  <div>
                    <h3 className="font-display text-xl font-bold">{cap.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {intent ? cap.copy[intent] : cap.copy.base}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {cap.points.map((point) => (
                        <li key={point} className="flex gap-3 text-sm leading-relaxed">
                          <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative hidden overflow-hidden rounded-xl border border-line sm:block">
                    {visual ? (
                      <Image
                        src={visual}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="h-full w-full"
                        style={{
                          background:
                            "linear-gradient(160deg, #e8a30c22, #e8590c33)",
                        }}
                      />
                    )}
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
