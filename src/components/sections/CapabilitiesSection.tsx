"use client";

/**
 * Capabilities — "full-stack" taken literally: an exploded isometric stack
 * of five layers that assembles as you scroll. Hovering a layer lifts it
 * and reveals what lives inside. Reduced motion → a clean list.
 */
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LayerArt } from "@/components/sections/LayerArt";
import { useReducedMotionSafe, useSectionSpy } from "@/lib/hooks";
import { useUiStore } from "@/lib/store";

type Layer = {
  id: string;
  title: string;
  color: string;
  items: string[];
  note: string;
};

const LAYERS: Layer[] = [
  {
    id: "interface",
    title: "Interface",
    color: "#e8590c",
    items: ["Next.js App Router", "React 19", "TypeScript", "Tailwind", "motion"],
    note: "Interfaces people enjoy — RTL-first when the market needs it.",
  },
  {
    id: "agents",
    title: "AI Agents",
    color: "#b83d05",
    items: ["Claude & Gemini APIs", "Multi-agent pipelines", "RAG", "Tool calling", "Evals"],
    note: "The layer that made FASL, Hekaya, and RESO possible.",
  },
  {
    id: "api",
    title: "API & Realtime",
    color: "#9c36b5",
    items: ["Node.js", "Server Actions", "REST", "WebSockets", "Race-safe transactions"],
    note: "Real money moved through this layer on WebTrade.",
  },
  {
    id: "data",
    title: "Data",
    color: "#1971c2",
    items: ["PostgreSQL", "Prisma", "Supabase", "Redis", "S3"],
    note: "Typed schemas end-to-end — zod at the edges, Prisma underneath.",
  },
  {
    id: "infra",
    title: "Infrastructure",
    color: "#0e7a5f",
    items: ["Vercel", "Docker", "Hetzner + Dokploy", "n8n", "GitHub Actions"],
    note: "Self-hosted when it should be — belmo.ma runs on my own server.",
  },
];

export function CapabilitiesSection() {
  const reduced = useReducedMotionSafe();
  const spyRef = useSectionSpy<HTMLElement>("capabilities");
  const containerRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<Layer>(LAYERS[1]);
  const intent = useUiStore((s) => s.audienceIntent);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  /** 0 → collapsed pancake, 1 → exploded view */
  const explode = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  const heading =
    intent === "hire"
      ? "Every layer, one engineer."
      : intent === "project"
        ? "Your whole product, one pair of hands."
        : "Full-stack, taken literally.";

  return (
    <section
      id="capabilities"
      ref={(el) => {
        containerRef.current = el;
        spyRef.current = el;
      }}
      className="rule bg-bg py-24"
    >
      <div className="rail grid gap-14 lg:grid-cols-[5fr_6fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Capabilities
          </p>
          <h2
            className="font-display mt-3 font-bold leading-tight"
            style={{ fontSize: "var(--text-title)" }}
          >
            {heading}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Hover the stack — every layer is one I design, build, and run in
            production myself.
          </p>

          {/* Active layer detail */}
          <div
            key={active.id}
            className="mt-8 rounded-2xl border border-line bg-surface p-6"
            style={{ borderLeft: `3px solid ${active.color}` }}
          >
            <h3 className="font-display text-lg font-bold">{active.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{active.note}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {active.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-bg px-3 py-1 font-mono text-xs text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The stack */}
        {reduced ? (
          <ul className="space-y-3">
            {LAYERS.map((layer) => (
              <li
                key={layer.id}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4"
                style={{ borderLeft: `3px solid ${layer.color}` }}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold">{layer.title}</p>
                  <p className="mt-1 font-mono text-xs text-muted">{layer.items.join(" · ")}</p>
                </div>
                <div className="h-14 w-24 shrink-0" aria-hidden>
                  <LayerArt id={layer.id} color={layer.color} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="relative mx-auto hidden h-[26rem] w-full max-w-md lg:block"
            style={{ perspective: "1200px" }}
          >
            {LAYERS.map((layer, i) => (
              <StackLayer
                key={layer.id}
                layer={layer}
                index={i}
                explode={explode}
                active={active.id === layer.id}
                onActivate={() => setActive(layer)}
              />
            ))}
          </div>
        )}

        {/* Mobile: simple tap list */}
        <ul className="space-y-3 lg:hidden">
          {LAYERS.map((layer) => (
            <li
              key={layer.id}
              className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4"
              style={{ borderLeft: `3px solid ${layer.color}` }}
            >
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold">{layer.title}</p>
                <p className="mt-1 font-mono text-xs text-muted">{layer.items.join(" · ")}</p>
              </div>
              <div className="h-14 w-24 shrink-0" aria-hidden>
                <LayerArt id={layer.id} color={layer.color} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StackLayer({
  layer,
  index,
  explode,
  active,
  onActivate,
}: {
  layer: Layer;
  index: number;
  explode: ReturnType<typeof useTransform<number, number>>;
  active: boolean;
  onActivate: () => void;
}) {
  // Collapsed: layers nearly touching. Exploded: fanned out vertically.
  const y = useTransform(explode, (v) => 150 + (index - 2) * (18 + v * 60));

  return (
    <motion.button
      type="button"
      aria-label={`${layer.title} layer`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className="absolute left-1/2 top-0 block h-40 w-[19rem] -translate-x-1/2 cursor-pointer overflow-hidden rounded-2xl border text-left"
      style={{
        y,
        zIndex: 10 - index,
        transform: "translateX(-50%)",
        rotateX: 55,
        rotate: -42,
        borderColor: active ? layer.color : "var(--color-line)",
        boxShadow: active
          ? `0 24px 48px -20px ${layer.color}66`
          : "0 16px 32px -20px rgba(20,18,16,0.25)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* What the layer actually is — a literal miniature, not a texture */}
      <span
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: active ? "var(--color-surface)" : "var(--color-bg)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 p-2 transition-opacity duration-300"
        style={{ opacity: active ? 1 : 0.55 }}
      >
        <LayerArt id={layer.id} color={layer.color} />
      </span>
      <span
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${layer.color}1f, transparent 60%)`,
          opacity: active ? 1 : 0.4,
        }}
      />
      <span
        className="absolute left-4 top-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{
          color: active ? layer.color : "var(--color-ink-soft)",
          transform: "rotate(42deg) rotateX(-55deg)",
          transformOrigin: "left top",
          display: "inline-block",
          textShadow: "0 1px 8px rgba(250,247,242,0.9)",
        }}
      >
        {layer.title}
      </span>
    </motion.button>
  );
}
