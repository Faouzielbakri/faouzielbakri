"use client";

import type { z } from "zod";
import type { ArchStepSchema } from "@/content/schema";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

type ArchStep = z.infer<typeof ArchStepSchema>;

/** Simple animated pipeline diagram for case studies. */
export function ArchDiagram({ steps, accent }: { steps: ArchStep[]; accent: string }) {
  return (
    <Reveal group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <RevealItem key={step.title} className="relative">
          <div className="h-full rounded-2xl border border-line bg-surface p-6">
            <span
              className="font-mono text-xs font-bold"
              style={{ color: accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display mt-2 font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
          </div>
          {i < steps.length - 1 && (
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
  );
}
