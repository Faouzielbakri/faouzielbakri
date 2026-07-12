"use client";

import type { Metric } from "@/content/schema";
import { useReducedMotionSafe } from "@/lib/hooks";

function MetricItem({ metric }: { metric: Metric }) {
  return (
    <span className="mx-8 inline-flex items-baseline gap-3 whitespace-nowrap">
      <span className="font-display text-2xl font-bold text-ink sm:text-3xl">
        {metric.value}
      </span>
      <span className="text-sm text-muted">{metric.label}</span>
      <span aria-hidden className="ml-6 text-accent">
        ●
      </span>
    </span>
  );
}

/**
 * Full-bleed marquee of verifiable numbers. Reduced motion → static grid.
 */
export function ProofStrip({ proof }: { proof: Metric[] }) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <section aria-label="Track record" className="rule bg-surface py-10">
        <ul className="rail grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proof.map((m) => (
            <li key={m.label} className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold">{m.value}</span>
              <span className="text-sm text-muted">{m.label}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      aria-label="Track record"
      className="rule group overflow-hidden bg-surface py-10"
    >
      <div className="marquee flex w-max group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex">
            {proof.map((m) => (
              <MetricItem key={`${copy}-${m.label}`} metric={m} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
