"use client";

/**
 * AI Visibility Checker — a scanner console with three acts:
 * idle (the invitation) → scanning (terminal theater) → report (the stamp).
 * Every state change is choreographed; reduced motion gets instant states.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks";

type Check = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  points: number;
  max: number;
  detail: string;
  fix?: string;
};

type Report = {
  url: string;
  domain: string;
  score: number;
  grade: string;
  checks: Check[];
};

const ENGINES = ["ChatGPT", "Claude", "Perplexity", "Google AI"];

const SCAN_LINES = [
  "resolving domain & fetching homepage",
  "reading robots.txt — knocking as GPTBot, ClaudeBot, PerplexityBot",
  "looking for llms.txt — the AI content map",
  "extracting structured data — who are you, in machine language?",
  "measuring titles, descriptions & social tags",
  "hunting for the sitemap",
];

const STATUS = {
  pass: { color: "#2f9e44", label: "PASS" },
  warn: { color: "#e8a13c", label: "WARN" },
  fail: { color: "#e03131", label: "FAIL" },
} as const;

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "#2f9e44";
  if (grade === "B") return "#74b816";
  if (grade === "C") return "#f08c00";
  return "#e03131";
}

/* ── Animated score numeral ─────────────────────────────────────── */
function ScoreCounter({ to, reduced }: { to: number; reduced: boolean }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    if (reduced) {
      mv.set(to);
      return;
    }
    const controls = animate(mv, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 });
    return () => controls.stop();
  }, [to, mv, reduced]);
  return <motion.span>{rounded}</motion.span>;
}

/* ── The component ──────────────────────────────────────────────── */
export function Checker() {
  const reduced = useReducedMotionSafe();
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [lineCount, setLineCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  async function run() {
    if (!url.trim() || phase === "scanning") return;
    setError(null);
    setReport(null);
    setEmailStatus("idle");
    setPhase("scanning");
    setLineCount(1);
    timers.current.forEach(clearTimeout);
    timers.current = SCAN_LINES.slice(1).map((_, i) =>
      setTimeout(() => setLineCount((c) => Math.max(c, i + 2)), (i + 1) * 950),
    );

    const started = Date.now();
    try {
      const res = await fetch("/api/ai-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed");
      // Let the theater finish a beat before the reveal.
      const wait = reduced ? 0 : Math.max(0, 1600 - (Date.now() - started));
      timers.current.push(
        setTimeout(() => {
          setLineCount(SCAN_LINES.length);
          setReport(data as Report);
          setPhase("done");
        }, wait),
      );
    } catch (err) {
      timers.current.forEach(clearTimeout);
      setError((err as Error).message);
      setPhase("idle");
    }
  }

  async function sendReport() {
    if (!report || !email.includes("@")) return;
    setEmailStatus("sending");
    const summary = report.checks
      .map((c) => `[${c.status.toUpperCase()}] ${c.label} (${c.points}/${c.max})`)
      .join("\n");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `AI Visibility lead — ${report.domain}`,
          email,
          message: `Requested the full AI visibility report for ${report.url}\nScore: ${report.score}/100 (${report.grade})\n\n${summary}`,
          intent: "project",
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setEmailStatus("sent");
    } catch {
      setEmailStatus("failed");
    }
  }

  const scanning = phase === "scanning";

  return (
    <div className="mt-12">
      {/* ═══ The scanner console ═══════════════════════════════ */}
      <div className="max-w-3xl overflow-hidden rounded-2xl border border-line bg-ink shadow-[0_32px_80px_-40px_rgba(20,18,16,0.5)]">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-4">
            <span aria-hidden className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[11px] tracking-wide text-white/50">
              ~/ai-visibility-scan
            </span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            {ENGINES.map((e, i) => (
              <motion.span
                key={e}
                initial={reduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-white/60"
              >
                <motion.span
                  aria-hidden
                  className="size-1.5 rounded-full"
                  style={{ background: scanning ? "var(--color-accent)" : "rgba(255,255,255,0.3)" }}
                  animate={scanning && !reduced ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
                  transition={{ duration: 1.1, repeat: scanning ? Infinity : 0, delay: i * 0.22 }}
                />
                {e}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Console body */}
        <div className="relative p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {/* ── Act I: the invitation ── */}
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-sm leading-relaxed text-white/60">
                  <span className="text-accent">$</span> Four AI engines are
                  answering questions about your market right now.
                  <br />
                  <span className="text-accent">$</span> Let&apos;s see if they can
                  even read your site.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    run();
                  }}
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <div className="relative flex-1">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 font-mono text-sm text-accent"
                    >
                      ▸
                    </span>
                    <input
                      type="text"
                      inputMode="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="yourwebsite.com"
                      aria-label="Website URL to check"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.06] py-3.5 pl-10 pr-5 font-mono text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!url.trim()}
                    whileHover={reduced ? undefined : { scale: 1.03 }}
                    whileTap={reduced ? undefined : { scale: 0.97 }}
                    className="rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-40"
                  >
                    Run the scan →
                  </motion.button>
                </form>
                {error && (
                  <motion.p
                    role="alert"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 font-mono text-sm text-[#ff8787]"
                  >
                    ✗ {error}
                  </motion.p>
                )}
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Free · instant · no signup
                </p>
              </motion.div>
            )}

            {/* ── Act II: terminal theater ── */}
            {scanning && (
              <motion.div
                key="scan"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                aria-live="polite"
              >
                <p className="mb-4 truncate font-mono text-sm text-white/80">
                  <span className="text-accent">$</span> scan {url.trim()}
                </p>
                <ul className="space-y-2.5">
                  {SCAN_LINES.slice(0, lineCount).map((line, i) => {
                    const isLast = i === lineCount - 1;
                    return (
                      <motion.li
                        key={line}
                        initial={reduced ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-baseline gap-3 font-mono text-[13px]"
                      >
                        <span className={isLast ? "text-accent" : "text-[#2f9e44]"}>
                          {isLast ? "▸" : "✓"}
                        </span>
                        <span className={isLast ? "text-white/85" : "text-white/40"}>
                          {line}
                          {isLast && !reduced && (
                            <motion.span
                              aria-hidden
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.9, repeat: Infinity }}
                              className="ml-1 inline-block h-[1em] w-[7px] translate-y-[2px] bg-accent"
                            />
                          )}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
                {/* Progress rail */}
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: "4%" }}
                    animate={{ width: `${Math.min(94, (lineCount / SCAN_LINES.length) * 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* ── Act III: the verdict, stamped ── */}
            {phase === "done" && report && (
              <motion.div
                key="done"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-center gap-7"
              >
                <motion.div
                  initial={reduced ? false : { scale: 2.4, opacity: 0, rotate: 8 }}
                  animate={{ scale: 1, opacity: 1, rotate: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.15 }}
                  className="flex size-28 shrink-0 items-center justify-center rounded-full border-[5px] font-display text-5xl font-bold"
                  style={{
                    borderColor: gradeColor(report.grade),
                    color: gradeColor(report.grade),
                    boxShadow: `0 0 0 6px ${gradeColor(report.grade)}22`,
                  }}
                >
                  {report.grade}
                </motion.div>
                <div className="min-w-0">
                  <p className="truncate font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                    ai visibility — {report.domain}
                  </p>
                  <p className="font-display mt-1 text-4xl font-bold text-white">
                    <ScoreCounter to={report.score} reduced={reduced} />
                    <span className="text-xl text-white/40">/100</span>
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
                    {report.score >= 85
                      ? "AI engines can read, understand, and cite this site. Rare air."
                      : report.score >= 55
                        ? "Visible — but leaving AI-search traffic on the table. The fixes below are quick wins."
                        : "Mostly invisible to AI search. When ChatGPT answers questions in your space, this site isn't in the running."}
                  </p>
                  <button
                    onClick={() => {
                      setPhase("idle");
                      setReport(null);
                    }}
                    className="mt-4 font-mono text-xs text-white/40 underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent"
                  >
                    scan another site ↺
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══ The findings ══════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "done" && report && (
          <motion.div
            key="findings"
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
            className="max-w-3xl"
          >
            <ul className="mt-10 space-y-4">
              {report.checks.map((c) => {
                const pct = Math.round((c.points / c.max) * 100);
                return (
                  <motion.li
                    key={c.id}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="overflow-hidden rounded-xl border border-line bg-bg"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <p className="flex items-center gap-3 font-display font-bold">
                          <span
                            aria-hidden
                            className="size-2.5 rounded-full"
                            style={{ background: STATUS[c.status].color }}
                          />
                          {c.label}
                        </p>
                        <span className="font-mono text-xs" style={{ color: STATUS[c.status].color }}>
                          {STATUS[c.status].label} · {c.points}/{c.max}
                        </span>
                      </div>
                      {/* Meter */}
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
                        <motion.div
                          className="h-full origin-left rounded-full"
                          style={{ background: STATUS[c.status].color }}
                          initial={reduced ? { width: `${pct}%` } : { width: "0%" }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        />
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted">{c.detail}</p>
                      {c.fix && (
                        <p className="mt-3 rounded-lg border-l-2 border-accent bg-ink/[0.04] p-3.5 text-sm leading-relaxed">
                          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                            Fix:&nbsp;
                          </span>
                          {c.fix}
                        </p>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            {/* ═══ The lead letter ═══════════════════════════════ */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-12 overflow-hidden rounded-2xl border border-accent/30 bg-surface p-8 sm:p-10"
            >
              {/* Accent glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-accent/[0.07] blur-3xl"
              />
              <AnimatePresence mode="wait">
                {emailStatus === "sent" ? (
                  <motion.div
                    key="sealed"
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
                      <motion.circle
                        cx="36"
                        cy="36"
                        r="32"
                        stroke="var(--color-accent)"
                        strokeWidth="3"
                        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                      <motion.path
                        d="M22 37.5 L31.5 47 L50 27"
                        stroke="var(--color-accent)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
                      />
                    </svg>
                    <p className="font-display mt-5 text-2xl font-bold">
                      Sealed &amp; sent<span className="text-accent">.</span>
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                      Your prioritized fix plan for {report.domain} lands in your
                      inbox within a day — written by me, not a bot.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    exit={reduced ? undefined : { opacity: 0, y: -14 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                      {report.score >= 85 ? "Keep it that way" : "Want this fixed?"}
                    </p>
                    <p className="font-display mt-2 text-2xl font-bold leading-snug">
                      Get the prioritized fix plan for {report.domain}
                      <span className="text-accent">.</span>
                    </p>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                      Exactly what to change, in what order, and why it matters —
                      free. And if you&apos;d rather not touch it yourself, making
                      sites visible to AI search is literally{" "}
                      <Link
                        href="/hire"
                        className="text-accent underline decoration-accent/40 underline-offset-4"
                      >
                        what I do
                      </Link>
                      .
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendReport();
                      }}
                      className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        aria-label="Email for the full report"
                        className="flex-1 rounded-full border border-line bg-bg px-6 py-3.5 font-mono text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
                      />
                      <motion.button
                        type="submit"
                        disabled={emailStatus === "sending" || !email.includes("@")}
                        whileHover={reduced ? undefined : { scale: 1.03 }}
                        whileTap={reduced ? undefined : { scale: 0.97 }}
                        className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bg transition-colors hover:bg-accent disabled:opacity-50"
                      >
                        {emailStatus === "sending" ? "Sealing…" : "Send me the fix plan →"}
                      </motion.button>
                    </form>
                    {emailStatus === "failed" && (
                      <p role="alert" className="mt-3 text-sm text-accent-deep">
                        Sending didn&apos;t work —{" "}
                        <a
                          className="underline"
                          href={`mailto:faouzielbakri@gmail.com?subject=${encodeURIComponent(`AI visibility fix plan — ${report.domain}`)}`}
                        >
                          email me directly
                        </a>{" "}
                        instead.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
