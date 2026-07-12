"use client";

/**
 * Per-project "worlds" for the Selected Work stack. Each Tier-1 panel is an
 * environment: a generated cinematic backdrop (Nano Banana 2), a legibility
 * scrim, a palette pulled from the artwork, and a light animated accent —
 * so scrolling from FASL to Hekaya to RESO to WebTrade changes rooms.
 */
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks";

export type World = {
  /** Generated backdrop (public path) */
  image?: string;
  /** Painted under the image; also the fallback if the image is missing */
  fallbackBg: string;
  /** Legibility gradient laid over the image on the text side */
  scrim: string;
  fg: string;
  body: string;
  muted: string;
  chip: { bg: string; fg: string; border: string };
  cta: { bg: string; fg: string };
  link: string;
  Accent: React.FC;
};

/* ── Accents ─────────────────────────────────────────────────────────── */

function HekayaStars() {
  const reduced = useReducedMotionSafe();
  const stars: [number, number, number][] = [
    [12, 18, 2], [26, 9, 1.5], [44, 14, 2], [58, 8, 1.5], [72, 16, 2], [86, 10, 1.5],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map(([x, y, s], i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#ffe9c4]"
          style={{ left: `${x}%`, top: `${y}%`, width: s * 2, height: s * 2 }}
          animate={reduced ? undefined : { opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.8 + (i % 3) * 0.8, delay: i * 0.35 }}
        />
      ))}
    </div>
  );
}

function ResoBubbles() {
  const reduced = useReducedMotionSafe();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-[38%] top-[10%] hidden w-72 xl:block"
      dir="rtl"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="ml-8 rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-4 py-2.5 text-sm text-[#111b21] shadow-lg"
      >
        كنقلب على خدمة ديال النجارة 🙏
        <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#111b21]/50">
          14:02 <span className="text-[#53bdeb]">✓✓</span>
        </span>
      </motion.div>
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 7, delay: 1, ease: "easeInOut" }}
        className="mr-8 mt-3 rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm text-[#111b21] shadow-lg"
      >
        لقينا ليك 3 فرص قريبة منك ✨
      </motion.div>
    </div>
  );
}

function WebTradeTicker() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[4.5rem] overflow-hidden border-y border-white/10 bg-black/30 py-2 opacity-70 backdrop-blur-sm"
    >
      <div className="marquee flex w-max font-mono text-[11px] uppercase tracking-[0.2em] text-[#7ee2b8]">
        {[0, 1].map((c) => (
          <span key={c} className="flex">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="mx-6">
                live prices ▲ · funds-locked transactions · sub-100ms candles · real money, zero double-spends ·
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

const NoAccent = () => null;

/* ── Registry ────────────────────────────────────────────────────────── */

export const WORLDS: Record<string, World> = {
  fasl: {
    image: "/media/world-fasl.avif",
    fallbackBg: "linear-gradient(165deg, #0d4636, #072e23)",
    scrim:
      "linear-gradient(100deg, rgba(5,28,22,0.93) 0%, rgba(5,28,22,0.72) 38%, rgba(5,28,22,0.28) 62%, rgba(5,28,22,0.08) 100%)",
    fg: "#f5f0e2",
    body: "rgba(245,240,226,0.9)",
    muted: "rgba(245,240,226,0.6)",
    chip: { bg: "rgba(245,240,226,0.07)", fg: "#f0e8d2", border: "rgba(212,175,55,0.4)" },
    cta: { bg: "#d4af37", fg: "#0b3b2e" },
    link: "#e5c65e",
    Accent: NoAccent,
  },
  "magical-hekaya": {
    image: "/media/world-hekaya.avif",
    fallbackBg: "linear-gradient(170deg, #2b2153, #141030)",
    scrim:
      "linear-gradient(100deg, rgba(17,12,42,0.92) 0%, rgba(17,12,42,0.7) 38%, rgba(17,12,42,0.25) 62%, rgba(17,12,42,0.05) 100%)",
    fg: "#fbf3e4",
    body: "rgba(251,243,228,0.9)",
    muted: "rgba(251,243,228,0.6)",
    chip: { bg: "rgba(255,214,140,0.08)", fg: "#ffe9c4", border: "rgba(255,214,140,0.35)" },
    cta: { bg: "#ff9d6b", fg: "#241c4a" },
    link: "#ffd68c",
    Accent: HekayaStars,
  },
  "reso-khdma": {
    image: "/media/world-reso.avif",
    fallbackBg: "linear-gradient(165deg, #2b2117, #1a2a20)",
    scrim:
      "linear-gradient(100deg, rgba(24,32,24,0.93) 0%, rgba(24,32,24,0.72) 40%, rgba(24,32,24,0.3) 65%, rgba(24,32,24,0.1) 100%)",
    fg: "#f2f8ee",
    body: "rgba(242,248,238,0.9)",
    muted: "rgba(242,248,238,0.6)",
    chip: { bg: "rgba(37,211,102,0.1)", fg: "#c9f3d6", border: "rgba(37,211,102,0.35)" },
    cta: { bg: "#25d366", fg: "#0b3d2c" },
    link: "#7ee2a8",
    Accent: ResoBubbles,
  },
  webtrade: {
    image: "/media/world-webtrade.avif",
    fallbackBg: "linear-gradient(170deg, #10161d, #080b0f)",
    scrim:
      "linear-gradient(100deg, rgba(4,8,12,0.92) 0%, rgba(4,8,12,0.7) 38%, rgba(4,8,12,0.25) 62%, rgba(4,8,12,0.05) 100%)",
    fg: "#e8eef2",
    body: "rgba(232,238,242,0.88)",
    muted: "rgba(232,238,242,0.55)",
    chip: { bg: "rgba(46,168,126,0.1)", fg: "#a9e8cd", border: "rgba(46,168,126,0.35)" },
    cta: { bg: "#2ea87e", fg: "#04120c" },
    link: "#7ee2b8",
    Accent: WebTradeTicker,
  },
};

/** Fallback world matching the site's light editorial base. */
export const DEFAULT_WORLD: World = {
  fallbackBg: "var(--color-bg)",
  scrim: "none",
  fg: "var(--color-ink)",
  body: "var(--color-ink-soft)",
  muted: "var(--color-muted)",
  chip: { bg: "var(--color-surface)", fg: "var(--color-ink-soft)", border: "var(--color-line)" },
  cta: { bg: "var(--color-ink)", fg: "var(--color-bg)" },
  link: "var(--color-accent)",
  Accent: NoAccent,
};

/** Backdrop layer shared by the panel — image + scrim over the fallback. */
export function WorldBackdrop({ world, priority }: { world: World; priority?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: world.fallbackBg }} />
      {world.image && (
        <Image
          src={world.image}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          className="object-cover"
        />
      )}
      {world.scrim !== "none" && (
        <div className="absolute inset-0" style={{ background: world.scrim }} />
      )}
    </div>
  );
}
