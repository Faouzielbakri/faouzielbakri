"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks";
import { played } from "@/lib/track";
import { createBrain, type BrainEvent, type Mood } from "./brain";
import { BigName, HeroFrame, HeroStatement, SystemBar, type HeroProps } from "./shared";

/**
 * The watcher.
 *
 * An ink-drawn agent that looks at the visitor's cursor and has a temper: it
 * comments on what you point at, squints when you crowd it, gets annoyed when
 * poked, seasick when shaken, and falls asleep when left alone (then denies
 * it). Its antenna can be pulled and twangs back; holding it down squashes it.
 * A plain click still gets a receipt.
 */

const FACTS = [
  "217K search impressions in 28 days. That was FASL.",
  "Four agents draft one legal appeal. I am not one of them.",
  "818 clients and 629 orders in Belmo's first two months.",
  "A WhatsApp agent that interviews people in Darija. Shipped.",
  "Seven agents turn a product photo into a video ad.",
  "16 products in production. Four are his own.",
];

const ZONE_LINES = {
  idle: "I'm the agent. I watch the cursor, he ships the products.",
  name: "That's him. He builds, I watch.",
  cta: "Good choice. He answers within 24 hours.",
};

const EVENT_LINES: Record<BrainEvent, string> = {
  edge: "Was that a noise?",
  target: "The button. It's right there. Just saying.",
  roll: "I count pixels when it's quiet.",
  shifty: "Nothing to see. Carry on.",
  sleepy: "Long day of watching…",
  asleep: "zzz…",
  wake: "I was NOT sleeping. I was caching.",
  dizzy: "Stop shaking it. I get seasick.",
  annoyed1: "Hey. I'm working here.",
  annoyed2: "That's my face you're poking.",
  annoyed3: "Fine. Take a receipt and go.",
  gone: "Hey. Come back.",
  ignored: "Still there? Blink twice.",
  resume: "",
};

/** Events whose line should not be replaced by a hover line straight away. */
const HELD: Partial<Record<BrainEvent, number>> = {
  wake: 2200,
  dizzy: 2200,
  annoyed1: 2400,
  annoyed2: 2400,
  annoyed3: 2600,
};

/** How each mood draws: lids, pupil size, brow tilt and lift, mouth. */
const FACE: Record<Mood | "close" | "happy", { lid: number; pupil: number; brow: number; lift: number; mouth: string }> = {
  calm: { lid: 0, pupil: 1, brow: 0, lift: 0, mouth: "M172 248 Q210 257 248 248" },
  happy: { lid: 0, pupil: 1.15, brow: -0.5, lift: -6, mouth: "M168 244 Q210 274 252 244" },
  close: { lid: 0.45, pupil: 1.25, brow: 0.6, lift: 0, mouth: "M176 250 Q210 244 244 250" },
  bored: { lid: 0.3, pupil: 0.9, brow: 0.5, lift: 2, mouth: "M178 250 L242 250" },
  sleepy: { lid: 0.62, pupil: 0.9, brow: -0.3, lift: 5, mouth: "M184 250 L236 250" },
  asleep: { lid: 1, pupil: 0.9, brow: -0.2, lift: 7, mouth: "M200 250 a10 8 0 1 0 20 0 a10 8 0 1 0 -20 0" },
  startled: { lid: 0, pupil: 0.55, brow: -1, lift: -14, mouth: "M196 250 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0" },
  dizzy: { lid: 0.1, pupil: 0.8, brow: -0.4, lift: -4, mouth: "M168 250 q10 -10 21 0 t21 0 t21 0 t21 0" },
  annoyed: { lid: 0.4, pupil: 0.9, brow: 1.5, lift: 4, mouth: "M176 254 Q210 240 244 254" },
  sad: { lid: 0.2, pupil: 1.1, brow: -1.3, lift: -2, mouth: "M178 256 Q210 244 242 256" },
};

const EYES = [
  { cx: 150, cy: 172 },
  { cx: 270, cy: 172 },
];
const EYE_R = 44;
const ANTENNA = { x: 210, y: 72, rest: 44 };

export function HeroWatcher({ name, headline, positioning, microline }: HeroProps) {
  const reduced = useReducedMotionSafe();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const stalkRef = useRef<SVGLineElement | null>(null);
  const bulbRef = useRef<SVGCircleElement | null>(null);
  const mouthRef = useRef<SVGPathElement | null>(null);
  const pupilRefs = useRef<(SVGGElement | null)[]>([]);
  const lidRefs = useRef<(SVGRectElement | null)[]>([]);
  const browRefs = useRef<(SVGLineElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const [line, setLine] = useState(ZONE_LINES.idle);
  const zone = useRef<keyof typeof ZONE_LINES>("idle");
  const factIndex = useRef(0);
  const holdUntil = useRef(0);
  const brainRef = useRef<ReturnType<typeof createBrain> | null>(null);
  /** Shared between the pointer handlers and the render loop. */
  const hands = useRef({ pulling: false, pressedAt: 0, skipClick: false, x: 0, y: 0 });

  /** A held line (a fact, a complaint) keeps hover lines off until it expires. */
  const say = (text: string, at: number, hold = 0) => {
    if (hold) holdUntil.current = at + hold;
    else if (at < holdUntil.current) return;
    setLine(text);
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const brain = createBrain(
      (event) => {
        const now = performance.now();
        if (event === "resume") say(ZONE_LINES[zone.current], now);
        else say(EVENT_LINES[event], now, HELD[event] ?? 0);
      },
      () =>
        Array.from(ctaRef.current?.querySelectorAll("button") ?? []).map((b) => {
          const r = b.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }),
    );
    brainRef.current = brain;

    const h = hands.current;
    const onMove = (e: PointerEvent) => {
      h.x = e.clientX;
      h.y = e.clientY;
      brain.move(e.clientX, e.clientY, e.timeStamp);
    };
    const onLeave = (e: PointerEvent) => brain.leave(e.timeStamp);
    const onUp = (e: PointerEvent) => {
      if (h.pulling) {
        h.pulling = false;
        say("Boing.", e.timeStamp, 1100);
      }
      h.pressedAt = 0;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let nextBlink = performance.now() + 1800;
    let wasClose = false;
    let squashed = false;
    const s = { x: 0, y: 0, lid: 0, pupil: 1, brow: 0, lift: 0, droop: 0, jump: 0, squash: 0 };
    const ant = { ang: 0, len: ANTENNA.rest, va: 0, vl: 0 };

    const frame = (now: number) => {
      const r = svg.getBoundingClientRect();
      const scale = r.width / 420;
      const hx = r.left + 210 * scale;
      const hy = r.top + 180 * scale;
      const gaze = brain.update(now, hx, hy);
      const dx = gaze.x - hx;
      const dy = gaze.y - hy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 500);
      s.x += ((dx / dist) * reach - s.x) * 0.14;
      s.y += ((dy / dist) * reach - s.y) * 0.14;

      const close = gaze.mood === "calm" && gaze.spin === null && dist < 95 * scale;
      if (close !== wasClose) {
        wasClose = close;
        say(close ? "That is very close." : ZONE_LINES[zone.current], now);
      }

      // Held down for a moment: it gets squashed and says so, once.
      const pressing = h.pressedAt > 0 && !h.pulling && now - h.pressedAt > 450;
      if (pressing && !squashed) {
        squashed = true;
        h.skipClick = true;
        say("Personal space.", now, 1800);
      } else if (!pressing) squashed = false;

      const key =
        gaze.mood === "calm" ? (close ? "close" : zone.current === "cta" ? "happy" : "calm") : gaze.mood;
      const face = FACE[key];
      const asleep = gaze.mood === "asleep";
      s.lid += (face.lid - s.lid) * 0.14;
      s.pupil += (face.pupil - s.pupil) * 0.2;
      s.brow += (face.brow - s.brow) * 0.14;
      s.lift += (face.lift - s.lift) * 0.14;
      s.droop += ((asleep ? 1 : gaze.mood === "sleepy" ? 0.5 : 0) - s.droop) * 0.06;
      s.jump += ((gaze.mood === "startled" ? 1 : 0) - s.jump) * 0.3;
      s.squash += ((pressing ? 1 : 0) - s.squash) * 0.25;

      const wobble =
        gaze.mood === "dizzy" ? Math.sin(now / 110) * 8 : gaze.mood === "annoyed" ? Math.sin(now / 40) * 1.5 : 0;
      const breathe = asleep ? Math.sin(now / 800) * 4 : 0;
      headRef.current?.setAttribute(
        "transform",
        `translate(${s.x * 16} ${s.y * 10 + s.droop * 12 + breathe - s.jump * 16}) ` +
          `rotate(${s.x * 5 + s.droop * 11 + wobble} 210 300) ` +
          `translate(210 300) scale(${1 + s.squash * 0.08} ${1 - s.squash * 0.16}) translate(-210 -300)`,
      );

      // Antenna: follows the hand while pulled, otherwise springs to its pose.
      let wantAng = -s.x * 14 + Math.sin(now / 420) * 3 + s.droop * 62;
      let wantLen = ANTENNA.rest + s.jump * 12;
      if (h.pulling) {
        const px = (h.x - r.left) / scale - ANTENNA.x;
        const py = ANTENNA.y - (h.y - r.top) / scale;
        wantAng = (Math.atan2(px, py) * 180) / Math.PI;
        wantLen = Math.max(24, Math.min(170, Math.hypot(px, py) - 10));
        ant.ang += (wantAng - ant.ang) * 0.5;
        ant.len += (wantLen - ant.len) * 0.5;
        ant.va = ant.vl = 0;
      } else {
        ant.va = (ant.va + (wantAng - ant.ang) * 0.14) * 0.88;
        ant.vl = (ant.vl + (wantLen - ant.len) * 0.2) * 0.8;
        ant.ang += ant.va;
        ant.len += ant.vl;
      }
      const rad = (ant.ang * Math.PI) / 180;
      const tipX = ANTENNA.x + Math.sin(rad) * ant.len;
      const tipY = ANTENNA.y - Math.cos(rad) * ant.len;
      stalkRef.current?.setAttribute("x2", String(tipX));
      stalkRef.current?.setAttribute("y2", String(tipY));
      bulbRef.current?.setAttribute("cx", String(tipX + Math.sin(rad) * 9));
      bulbRef.current?.setAttribute("cy", String(tipY - Math.cos(rad) * 9));

      let blink = 0;
      if (now > nextBlink) {
        const t = (now - nextBlink) / 150;
        if (t >= 1) nextBlink = now + 1600 + Math.random() * 3600;
        else blink = 1 - Math.abs(t * 2 - 1);
      }

      EYES.forEach((eye, i) => {
        let px: number;
        let py: number;
        if (gaze.spin !== null) {
          const dizzy = gaze.mood === "dizzy";
          const a = gaze.spin * (dizzy && i ? -1 : 1) + (dizzy ? i * 2 : 0);
          px = Math.cos(a) * 19;
          py = Math.sin(a) * 19;
        } else {
          // Each eye aims separately, so close targets make it go cross-eyed.
          const edx = gaze.x - (r.left + eye.cx * scale);
          const edy = gaze.y - (r.top + eye.cy * scale);
          const ed = Math.hypot(edx, edy) || 1;
          const travel = Math.min(1, ed / (140 * scale)) * 20;
          px = (edx / ed) * travel;
          py = (edy / ed) * travel;
        }
        pupilRefs.current[i]?.setAttribute(
          "transform",
          `translate(${eye.cx + px} ${eye.cy + py}) scale(${s.pupil})`,
        );
        lidRefs.current[i]?.setAttribute("height", String(EYE_R * 2 * Math.min(1, Math.max(blink, s.lid))));

        // Positive brow drops the inner end (a frown); negative raises it.
        const inner = i === 0 ? 1 : -1;
        const y = eye.cy - 62 + s.lift;
        const brow = browRefs.current[i];
        brow?.setAttribute("y1", String(y + (inner < 0 ? s.brow * 13 : -s.brow * 3)));
        brow?.setAttribute("y2", String(y + (inner > 0 ? s.brow * 13 : -s.brow * 3)));
      });

      mouthRef.current?.setAttribute("d", face.mouth);

      if (!reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  const point = (z: keyof typeof ZONE_LINES, at: number) => {
    zone.current = z;
    say(ZONE_LINES[z], at);
  };

  const onRobotDown = (e: React.PointerEvent) => {
    hands.current.pressedAt = e.timeStamp;
    hands.current.x = e.clientX;
    hands.current.y = e.clientY;
  };

  const onAntennaDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    hands.current.pulling = true;
    played("antenna");
    hands.current.skipClick = true;
    hands.current.x = e.clientX;
    hands.current.y = e.clientY;
    say("That is not a handle.", e.timeStamp, 60_000);
  };

  const onRobotClick = (e: React.MouseEvent) => {
    if (hands.current.skipClick) {
      hands.current.skipClick = false;
      return;
    }
    played("click");
    if (brainRef.current?.poke(e.timeStamp)) return;
    const fact = FACTS[factIndex.current % FACTS.length];
    factIndex.current += 1;
    say(fact, e.timeStamp, 3800);
  };

  return (
    <HeroFrame>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 76% 58%, rgba(232,163,12,0.20), transparent 70%)",
        }}
      />
      <SystemBar positioning={positioning} />

      <div className="rail relative z-10 grid w-full flex-1 items-center gap-6 py-8 lg:min-h-0 lg:grid-cols-[7fr_5fr] lg:py-2">
        <div
          onPointerEnter={(e) => point("name", e.timeStamp)}
          onPointerLeave={(e) => point("idle", e.timeStamp)}
        >
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            <span className="text-accent">●</span> {positioning}
          </p>
          <BigName name={name} style={{ fontSize: "clamp(3rem, min(8.2vw, 14vh), 8.5rem)" }} />
          <p className="mt-5 max-w-md font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted">
            {microline}
          </p>
          <div
            ref={ctaRef}
            className="mt-8 inline-block"
            onPointerEnter={(e) => point("cta", e.timeStamp)}
            onPointerLeave={(e) => point("name", e.timeStamp)}
          >
            <HeroStatement headline={headline} align="left" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[22rem] pt-16 lg:w-[min(26rem,52vh)] lg:max-w-none lg:pt-[7vh]">
          {/* Speech bubble */}
          <div className="absolute -top-2 right-[58%] z-10 w-56 sm:w-64" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={line}
                initial={reduced ? false : { opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                transition={{ duration: 0.22 }}
                className="relative rounded-2xl rounded-br-sm border-2 border-ink bg-surface px-4 py-3 text-[15px] leading-snug text-ink shadow-[5px_5px_0_0_var(--color-ink)]"
              >
                {line}
              </motion.p>
            </AnimatePresence>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 420 470"
            role="img"
            aria-label="An ink-drawn robot that watches the cursor"
            className="block w-full cursor-pointer touch-none select-none overflow-visible"
            onPointerDown={onRobotDown}
            onClick={onRobotClick}
          >
            <defs>
              {EYES.map((e, i) => (
                <clipPath key={i} id={`watcher-eye-${i}`}>
                  <circle cx={e.cx} cy={e.cy} r={EYE_R - 2} />
                </clipPath>
              ))}
            </defs>

            {/* Body */}
            <path d="M34 470 Q34 338 210 338 Q386 338 386 470 Z" fill="var(--color-ink)" />
            <circle cx="210" cy="412" r="15" fill="var(--color-accent)">
              {!reduced && (
                <animate attributeName="r" values="13;17;13" dur="2.4s" repeatCount="indefinite" />
              )}
            </circle>
            <rect x="182" y="296" width="56" height="48" fill="var(--color-ink)" />

            <g ref={headRef}>
              {/* Antenna: the bulb is a handle, whatever it says */}
              <line
                ref={stalkRef}
                x1={ANTENNA.x}
                y1={ANTENNA.y}
                x2={ANTENNA.x}
                y2={ANTENNA.y - ANTENNA.rest}
                stroke="var(--color-ink)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle
                ref={bulbRef}
                cx={ANTENNA.x}
                cy={ANTENNA.y - ANTENNA.rest - 9}
                r="12"
                fill="var(--color-accent)"
                // A wide invisible rim, so the bulb is easy to grab while it sways.
                stroke="transparent"
                strokeWidth="30"
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={onAntennaDown}
              />
              {/* Ears */}
              <rect x="46" y="150" width="26" height="62" rx="9" fill="var(--color-ink)" />
              <rect x="348" y="150" width="26" height="62" rx="9" fill="var(--color-ink)" />
              {/* Head */}
              <rect
                x="68"
                y="72"
                width="284"
                height="228"
                rx="62"
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth="5"
              />
              {/* Eyes */}
              {EYES.map((e, i) => (
                <g key={i}>
                  <line
                    ref={(el) => {
                      browRefs.current[i] = el;
                    }}
                    x1={e.cx - 30}
                    y1={e.cy - 62}
                    x2={e.cx + 30}
                    y2={e.cy - 62}
                    stroke="var(--color-ink)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={e.cx}
                    cy={e.cy}
                    r={EYE_R}
                    fill="var(--color-bg)"
                    stroke="var(--color-ink)"
                    strokeWidth="5"
                  />
                  <g clipPath={`url(#watcher-eye-${i})`}>
                    <g
                      ref={(el) => {
                        pupilRefs.current[i] = el;
                      }}
                      transform={`translate(${e.cx} ${e.cy})`}
                    >
                      <circle r="17" fill="var(--color-ink)" />
                      <circle cx="-5" cy="-6" r="5" fill="var(--color-surface)" />
                    </g>
                    <rect
                      ref={(el) => {
                        lidRefs.current[i] = el;
                      }}
                      x={e.cx - EYE_R}
                      y={e.cy - EYE_R}
                      width={EYE_R * 2}
                      height="0"
                      fill="var(--color-accent)"
                    />
                  </g>
                </g>
              ))}
              {/* Mouth */}
              <path
                ref={mouthRef}
                d={FACE.calm.mouth}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          </svg>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            click it for receipts · pull the antenna
          </p>
        </div>
      </div>
    </HeroFrame>
  );
}
