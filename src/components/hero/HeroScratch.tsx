"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotionSafe } from "@/lib/hooks";
import { played } from "@/lib/track";
import { HeroFrame, fitCanvas, useIntentGo, type HeroProps } from "./shared";

/**
 * scratch.
 *
 * The page opens on the hero every developer portfolio has: grey, centred,
 * "passionate developer". It is painted on a canvas, and moving the cursor
 * scratches it off for good, uncovering the real page underneath: the work
 * itself, in colour. Past roughly half, the rest peels away by itself.
 */

const WORLDS = [
  { slug: "fasl", name: "FASL", note: "legal AI · 217K impressions / 28 days", src: "/media/world-fasl.avif" },
  { slug: "magical-hekaya", name: "Magical Hekaya", note: "AI storybooks · paying customers", src: "/media/world-hekaya.avif" },
  { slug: "belmo", name: "Belmo", note: "818 clients · 629 orders · two months", src: "/media/world-belmo.avif" },
  { slug: "laqta", name: "Laqta", note: "seven agents · one video ad", src: "/media/world-laqta.avif" },
  { slug: "reso-khdma", name: "RESO Khdma", note: "WhatsApp agent in Darija", src: "/media/world-reso.avif" },
];

const BRUSH = 64;
const CELL = 40;
const DONE_AT = 0.5;

/** Paints the deliberately generic hero that gets scratched away. */
function paintCover(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.globalCompositeOperation = "source-over";
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#eceef1");
  g.addColorStop(1, "#d9dce1");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const s = Math.min(1, w / 900);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#b9bec6";
  ctx.beginPath();
  ctx.arc(cx, h * 0.27, 46 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#565c66";
  ctx.font = `700 ${Math.round(46 * s)}px Arial, Helvetica, sans-serif`;
  ctx.fillText("Hi, I'm a passionate developer", cx, h * 0.42);
  ctx.fillStyle = "#8a909a";
  ctx.font = `400 ${Math.round(20 * s)}px Arial, Helvetica, sans-serif`;
  ctx.fillText("I love crafting beautiful digital experiences", cx, h * 0.5);
  ctx.fillText("with clean code and modern technologies.", cx, h * 0.5 + 30 * s);

  const bw = 190 * s;
  const bh = 48 * s;
  ctx.fillStyle = "#9aa0aa";
  ctx.beginPath();
  ctx.roundRect(cx - bw - 10 * s, h * 0.62, bw, bh, 8 * s);
  ctx.fill();
  ctx.strokeStyle = "#9aa0aa";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cx + 10 * s, h * 0.62, bw, bh, 8 * s);
  ctx.stroke();
  ctx.fillStyle = "#f4f5f7";
  ctx.font = `700 ${Math.round(16 * s)}px Arial, Helvetica, sans-serif`;
  ctx.fillText("View my work", cx - bw / 2 - 10 * s, h * 0.62 + bh / 2);
  ctx.fillStyle = "#8a909a";
  ctx.fillText("Contact me", cx + bw / 2 + 10 * s, h * 0.62 + bh / 2);

  // Skill "progress bars", because of course.
  const labels = ["HTML", "CSS", "JavaScript"];
  labels.forEach((label, i) => {
    const y = h * 0.78 + i * 26 * s;
    ctx.textAlign = "right";
    ctx.font = `400 ${Math.round(13 * s)}px Arial, Helvetica, sans-serif`;
    ctx.fillStyle = "#8a909a";
    ctx.fillText(label, cx - 130 * s, y);
    ctx.fillStyle = "#c6cad1";
    ctx.fillRect(cx - 118 * s, y - 4 * s, 240 * s, 8 * s);
    ctx.fillStyle = "#9aa0aa";
    ctx.fillRect(cx - 118 * s, y - 4 * s, (200 - i * 25) * s, 8 * s);
  });
}

export function HeroScratch({ name, headline, positioning }: HeroProps) {
  const reduced = useReducedMotionSafe();
  const go = useIntentGo();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const [cleared, setCleared] = useState(reduced);
  const [progress, setProgress] = useState(0);
  const [round, setRound] = useState(0);

  const finish = useCallback(() => setCleared(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cleared) return;

    const { ctx, width, height } = fitCanvas(canvas);
    if (!ctx) return;
    paintCover(ctx, width, height);
    // The server-rendered veil has done its job once the canvas is painted.
    if (veilRef.current) veilRef.current.style.display = "none";

    const cols = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    const touched = new Uint8Array(cols * rows);
    let count = 0;
    let last: { x: number; y: number } | null = null;

    const mark = (x: number, y: number) => {
      const reach = Math.ceil(BRUSH / CELL);
      const ci = Math.floor(x / CELL);
      const cj = Math.floor(y / CELL);
      for (let j = cj - reach; j <= cj + reach; j++) {
        for (let i = ci - reach; i <= ci + reach; i++) {
          if (i < 0 || j < 0 || i >= cols || j >= rows) continue;
          const k = j * cols + i;
          if (touched[k]) continue;
          if (Math.hypot((i + 0.5) * CELL - x, (j + 0.5) * CELL - y) < BRUSH) {
            touched[k] = 1;
            count += 1;
          }
        }
      }
    };

    const scratch = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = BRUSH * 2;
      ctx.beginPath();
      ctx.moveTo(last?.x ?? x, last?.y ?? y);
      ctx.lineTo(x, y);
      ctx.stroke();
      // Walk the stroke so fast moves still count every cell they cross.
      const from = last ?? { x, y };
      const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / CELL));
      for (let s = 0; s <= steps; s++) {
        mark(from.x + ((x - from.x) * s) / steps, from.y + ((y - from.y) * s) / steps);
      }
      last = { x, y };
      const ratio = count / touched.length;
      setProgress(Math.min(100, Math.round((ratio / DONE_AT) * 100)));
      played("scratch");
      if (ratio >= DONE_AT) {
        played("scratched-off");
        finish();
      }
    };
    const lift = () => (last = null);

    canvas.addEventListener("pointermove", scratch);
    canvas.addEventListener("pointerdown", scratch);
    canvas.addEventListener("pointerleave", lift);
    return () => {
      canvas.removeEventListener("pointermove", scratch);
      canvas.removeEventListener("pointerdown", scratch);
      canvas.removeEventListener("pointerleave", lift);
    };
  }, [cleared, finish, round]);

  const again = () => {
    setProgress(0);
    setCleared(false);
    setRound((r) => r + 1);
  };

  return (
    <HeroFrame sectionRef={sectionRef} className="bg-ink !pt-0">
      {/* ── The real page ──────────────────────────────────────── */}
      <div className="relative flex min-h-screen flex-col bg-bg lg:h-full lg:min-h-0">
        <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col justify-center px-[var(--gutter)] pb-10 pt-28">
            <h1 className="font-normal">
              <span className="font-display block text-xl font-bold leading-none tracking-[-0.02em] text-ink sm:text-2xl lg:text-[1.75rem]">
                {name}
              </span>
              <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                {positioning}
              </span>
            </h1>
            <p
              className="mt-6 text-ink"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 500,
                fontSize: "clamp(3rem, min(7vw, 13vh), 7.5rem)",
                lineHeight: 0.94,
                letterSpacing: "-0.035em",
              }}
            >
              Not passionate.
              <br />
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                Shipped
              </em>
              .
            </p>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft">{headline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => go("hire")}
                className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bg transition-colors hover:bg-accent"
              >
                Hire me for a team
              </button>
              <button
                type="button"
                onClick={() => go("project")}
                className="rounded-full border-2 border-ink px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Work with me on a project
              </button>
            </div>
            {cleared && !reduced && (
              <button
                type="button"
                onClick={again}
                className="mt-8 self-start font-mono text-[11px] uppercase tracking-[0.2em] text-muted underline decoration-dotted underline-offset-4 hover:text-accent"
              >
                ↺ put the boring one back
              </button>
            )}
          </div>

          {/* The work, as a wall of colour */}
          <ul className="grid grid-cols-2 gap-1.5 p-1.5 lg:grid-cols-6 lg:grid-rows-2 lg:pt-[4.5rem]">
            {WORLDS.map((w, i) => (
              <li
                key={w.slug}
                className={`relative min-h-40 overflow-hidden lg:min-h-0 ${
                  i < 2 ? "lg:col-span-3" : "lg:col-span-2"
                } ${i === 4 ? "col-span-2 lg:col-span-2" : ""}`}
              >
                <Link href={`/work/${w.slug}`} className="group absolute inset-0 block">
                  <Image
                    src={w.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 26vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="font-display block text-xl font-bold text-white">{w.name}</span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-white/75">
                      {w.note}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Plain grey until the canvas paints, so the real page never flashes first. */}
      {!cleared && (
        <div
          ref={veilRef}
          aria-hidden
          className="absolute inset-0 z-20"
          style={{ background: "linear-gradient(#eceef1, #d9dce1)" }}
        />
      )}

      {/* ── The boring one, to be scratched off ─────────────────── */}
      <canvas
        key={round}
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 z-20 h-full w-full touch-none transition-opacity duration-700 ${
          cleared ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{ cursor: "crosshair" }}
      />
      {!cleared && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex flex-col items-center gap-3">
          <p className="rotate-[-2deg] border-2 border-ink bg-saffron px-4 py-2 font-mono text-[12px] uppercase tracking-[0.15em] text-ink shadow-[4px_4px_0_0_var(--color-ink)]">
            Boring, right? Scratch it off. {progress > 0 ? `${progress}%` : ""}
          </p>
          <button
            type="button"
            onClick={() => {
              played("skipped");
              finish();
            }}
            className="pointer-events-auto font-mono text-[11px] uppercase tracking-[0.2em] text-[#565c66] underline decoration-dotted underline-offset-4"
          >
            or skip it
          </button>
        </div>
      )}
    </HeroFrame>
  );
}
