"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/hooks";
import { played } from "@/lib/track";
import { HeroFrame, useHeroTone, useIntentGo, usePointer, type HeroProps } from "./shared";

/**
 * break it.
 *
 * A black wall with two words on it: IT WORKS. The letters are loose. Swipe
 * the cursor through them and they get knocked off, fall, bounce and pile up
 * on the floor. Then one button puts everything back, with a stopwatch:
 * breaking things is the visitor's part, fixing them is his.
 */

const LINES = ["IT", "WORKS."];
const LETTERS = LINES.flatMap((line, row) => line.split("").map((char) => ({ char, row })));

type Body = {
  x: number;
  y: number;
  rot: number;
  vx: number;
  vy: number;
  vr: number;
  loose: boolean;
  /** Home box, relative to the section. */
  left: number;
  top: number;
  w: number;
  h: number;
};

const QUIPS = [
  "Go ahead. Break it.",
  "One down. It still works. Mostly.",
  "That one was load-bearing.",
  "This is what a Friday deploy looks like.",
  "Keep going, I've seen worse.",
  "Almost nothing left to break.",
  "Completely broken. Now watch.",
];

export function HeroBreak({ name, headline, positioning }: HeroProps) {
  const reduced = useReducedMotionSafe();
  const go = useIntentGo();
  const [sectionRef, pointer] = usePointer<HTMLElement>();
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fixRequest = useRef(0);
  const [broken, setBroken] = useState(0);
  const [fixedIn, setFixedIn] = useState<string | null>(null);
  useHeroTone("dark");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;
    const els = letterRefs.current;
    const bodies: Body[] = LETTERS.map(() => ({
      x: 0, y: 0, rot: 0, vx: 0, vy: 0, vr: 0, loose: false, left: 0, top: 0, w: 0, h: 0,
    }));

    const measure = () => {
      const box = section.getBoundingClientRect();
      els.forEach((el, i) => {
        if (!el) return;
        const prev = el.style.transform;
        el.style.transform = "none";
        const r = el.getBoundingClientRect();
        el.style.transform = prev;
        bodies[i].left = r.left - box.left;
        bodies[i].top = r.top - box.top;
        bodies[i].w = r.width;
        bodies[i].h = r.height;
      });
    };
    measure();
    window.addEventListener("resize", measure);

    let raf = 0;
    let lastX = pointer.current.x;
    let lastY = pointer.current.y;
    let seenFix = fixRequest.current;
    let fixing = false;
    let fixStart = 0;
    let shieldUntil = 0;
    let lastCount = 0;
    let seenClicks = pointer.current.clicks;

    const frame = (now: number) => {
      const box = section.getBoundingClientRect();
      const p = pointer.current;
      const pvx = p.x - lastX;
      const pvy = p.y - lastY;
      lastX = p.x;
      lastY = p.y;
      const speed = Math.hypot(pvx, pvy);
      // A tap (touch screens have no swipe speed) knocks whatever is under it.
      const tapped = p.clicks !== seenClicks;
      seenClicks = p.clicks;

      if (fixRequest.current !== seenFix) {
        seenFix = fixRequest.current;
        fixing = true;
        fixStart = now;
      }

      let settled = true;
      bodies.forEach((b, i) => {
        const cx = b.left + b.w / 2 + b.x;
        const cy = b.top + b.h / 2 + b.y;

        if (fixing) {
          // Critically damped pull back to the home position.
          b.loose = false;
          b.vx = (b.vx + -b.x * 0.16) * 0.62;
          b.vy = (b.vy + -b.y * 0.16) * 0.62;
          b.vr = (b.vr + -b.rot * 0.16) * 0.62;
          b.x += b.vx;
          b.y += b.vy;
          b.rot += b.vr;
          if (Math.abs(b.x) + Math.abs(b.y) + Math.abs(b.rot) > 0.6) settled = false;
          else b.x = b.y = b.rot = b.vx = b.vy = b.vr = 0;
        } else {
          const inside =
            p.active &&
            Math.abs(p.x - cx) < b.w / 2 + 14 &&
            Math.abs(p.y - cy) < b.h * 0.42 + 14;
          if (inside && (speed > 5 || tapped) && now > shieldUntil) {
            // A swipe knocks the letter off its line, in the swipe's direction.
            b.loose = true;
            b.vx += pvx * 0.45 + (tapped ? (Math.random() - 0.5) * 14 : 0);
            b.vy += pvy * 0.45 - (tapped ? 9 : 2);
            b.vr += (Math.random() - 0.5) * 9 + pvx * 0.05;
          }
          if (b.loose) {
            b.vy += 0.9;
            b.vx *= 0.992;
            b.x += b.vx;
            b.y += b.vy;
            b.rot += b.vr;
            const floor = box.height - 8 - (b.top + b.h * 0.86);
            if (b.y > floor) {
              b.y = floor;
              b.vy *= -0.36;
              b.vx *= 0.8;
              b.vr *= 0.7;
              if (Math.abs(b.vy) < 1.6) b.vy = 0;
            }
            const minX = -b.left;
            const maxX = box.width - b.left - b.w;
            if (b.x < minX) {
              b.x = minX;
              b.vx *= -0.5;
            } else if (b.x > maxX) {
              b.x = maxX;
              b.vx *= -0.5;
            }
          }
        }
        const el = els[i];
        if (el) el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.rot}deg)`;
      });

      if (fixing && settled) {
        fixing = false;
        shieldUntil = now + 900;
        setFixedIn(((now - fixStart) / 1000).toFixed(1));
        setBroken(0);
        lastCount = 0;
      } else if (!fixing) {
        const count = bodies.filter((b) => b.loose).length;
        if (count !== lastCount) {
          lastCount = count;
          setBroken(count);
          if (count > 0) {
            setFixedIn(null);
            played("broke");
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [pointer, reduced, sectionRef]);

  const quip = fixedIn
    ? `Fixed in ${fixedIn}s. That's the job.`
    : QUIPS[Math.min(QUIPS.length - 1, Math.ceil((broken / LETTERS.length) * (QUIPS.length - 1)))];

  return (
    <HeroFrame sectionRef={sectionRef} className="bg-ink text-bg">
      <div className="relative z-10 flex items-start justify-between gap-6 px-[var(--gutter)] pt-6 font-mono text-[11px] uppercase tracking-[0.22em]">
        {/* The page's real heading; the giant words below are the toy. */}
        <h1 className="font-normal">
          <span className="font-display block text-xl font-bold normal-case leading-none tracking-[-0.02em] sm:text-2xl lg:text-[1.75rem]">
            {name}
          </span>
          <span className="mt-2 block text-bg/60">{positioning}</span>
        </h1>
        <p className="text-right text-bg/50">
          {broken} / {LETTERS.length} broken
        </p>
      </div>

      <p
        role="img"
        aria-label="It works."
        className="font-display relative z-0 flex min-h-0 flex-1 select-none flex-col justify-center px-[var(--gutter)] font-bold uppercase leading-[0.8] tracking-[-0.05em]"
        style={{ fontSize: "clamp(5.5rem, min(24.5vw, 36vh), 27rem)" }}
      >
        {LINES.map((line, row) => (
          <span key={row} aria-hidden className={`block whitespace-nowrap ${row === 1 ? "text-right" : ""}`}>
            {line.split("").map((char, col) => {
              const index = (row === 0 ? 0 : LINES[0].length) + col;
              return (
                <span
                  key={index}
                  ref={(el) => {
                    letterRefs.current[index] = el;
                  }}
                  className={`inline-block will-change-transform ${char === "." ? "text-accent" : ""}`}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </p>

      <div className="relative z-10 flex flex-col gap-6 px-[var(--gutter)] pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            aria-live="polite"
            className="leading-none"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(1.6rem, 3.4vw, 3rem)",
            }}
          >
            {quip}
          </p>
          <button
            type="button"
            onClick={() => {
              fixRequest.current += 1;
              played("fixed");
            }}
            disabled={broken === 0}
            className="mt-5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg transition-all duration-300 hover:bg-saffron hover:text-ink disabled:pointer-events-none disabled:opacity-0"
          >
            Fix it →
          </button>
        </div>
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-ink/85 p-1 backdrop-blur-sm sm:items-end">
          <p className="max-w-sm text-lg leading-snug text-bg/80 sm:text-right">{headline}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => go("hire")}
              className="rounded-full bg-bg px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-bg"
            >
              Hire me for a team
            </button>
            <button
              type="button"
              onClick={() => go("project")}
              className="rounded-full border-2 border-bg/70 px-7 py-3 text-sm font-medium text-bg transition-colors hover:border-accent hover:text-accent"
            >
              Work with me on a project
            </button>
          </div>
        </div>
      </div>
    </HeroFrame>
  );
}
