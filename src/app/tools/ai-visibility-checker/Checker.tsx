"use client";

import { useRef, useState } from "react";
import Link from "next/link";

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

const SCAN_STEPS = [
  "reading robots.txt — are AI crawlers welcome?",
  "looking for llms.txt…",
  "extracting structured data (JSON-LD)…",
  "checking titles, descriptions & social tags…",
  "hunting for the sitemap…",
];

const STATUS_STYLE: Record<Check["status"], { dot: string; label: string }> = {
  pass: { dot: "bg-[#2f9e44]", label: "text-[#2f9e44]" },
  warn: { dot: "bg-saffron", label: "text-saffron" },
  fail: { dot: "bg-accent-deep", label: "text-accent-deep" },
};

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "#2f9e44";
  if (grade === "B") return "#74b816";
  if (grade === "C") return "#f08c00";
  return "#e03131";
}

export function Checker() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function run() {
    if (!url.trim() || busy) return;
    setBusy(true);
    setError(null);
    setReport(null);
    setEmailStatus("idle");
    setStep(0);
    stepTimer.current = setInterval(
      () => setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1)),
      1100,
    );
    try {
      const res = await fetch("/api/ai-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed");
      setReport(data as Report);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      if (stepTimer.current) clearInterval(stepTimer.current);
      setBusy(false);
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

  return (
    <div className="mt-10">
      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="flex max-w-2xl flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourwebsite.com"
          aria-label="Website URL to check"
          className="flex-1 rounded-full border border-line bg-bg px-6 py-3.5 font-mono text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy || !url.trim()}
          className="rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent disabled:opacity-50"
        >
          {busy ? "Auditing…" : "Check my site →"}
        </button>
      </form>

      {/* Scan progress */}
      {busy && (
        <p className="mt-6 font-mono text-sm text-muted" role="status">
          <span className="text-accent">▸</span> {SCAN_STEPS[step]}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 text-sm text-accent-deep">
          {error}
        </p>
      )}

      {/* Report */}
      {report && (
        <div className="mt-12">
          {/* Grade header */}
          <div className="flex flex-wrap items-center gap-8 rounded-2xl border border-line bg-surface p-8">
            <div
              className="flex size-24 shrink-0 items-center justify-center rounded-full border-4 font-display text-4xl font-bold"
              style={{ borderColor: gradeColor(report.grade), color: gradeColor(report.grade) }}
            >
              {report.grade}
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                AI visibility — {report.domain}
              </p>
              <p className="font-display mt-1 text-3xl font-bold">
                {report.score}
                <span className="text-lg text-muted">/100</span>
              </p>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">
                {report.score >= 85
                  ? "AI search engines can read, understand, and cite this site. Rare air."
                  : report.score >= 55
                    ? "Visible, but leaving AI-search traffic on the table — the fixes below are quick wins."
                    : "Mostly invisible to AI search. When ChatGPT or Perplexity answer questions in your space, this site isn't in the running."}
              </p>
            </div>
          </div>

          {/* Checks */}
          <ul className="mt-8 space-y-4">
            {report.checks.map((c) => (
              <li key={c.id} className="rounded-xl border border-line p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="flex items-center gap-3 font-display font-bold">
                    <span aria-hidden className={`size-2.5 rounded-full ${STATUS_STYLE[c.status].dot}`} />
                    {c.label}
                  </p>
                  <span className={`font-mono text-xs ${STATUS_STYLE[c.status].label}`}>
                    {c.points}/{c.max}
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{c.detail}</p>
                {c.fix && (
                  <p className="mt-3 rounded-lg bg-ink/[0.04] p-3.5 text-sm leading-relaxed">
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                      Fix:&nbsp;
                    </span>
                    {c.fix}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {/* Lead capture + CTA */}
          <div className="mt-10 rounded-2xl border border-line bg-surface p-8">
            <p className="font-display text-xl font-bold">
              Want this fixed — or want the detailed action plan?
            </p>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
              I&apos;ll send a prioritized fix list for {report.domain} — and if
              you&apos;d rather not touch it yourself, making sites visible to
              AI search is literally{" "}
              <Link href="/hire" className="text-accent underline decoration-accent/40 underline-offset-4">
                what I do
              </Link>
              .
            </p>
            {emailStatus === "sent" ? (
              <p className="mt-5 font-display font-bold text-accent">
                On its way — check your inbox within a day.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendReport();
                }}
                className="mt-5 flex max-w-xl flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-label="Email for the full report"
                  className="flex-1 rounded-full border border-line bg-bg px-6 py-3 font-mono text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={emailStatus === "sending" || !email.includes("@")}
                  className="rounded-full bg-ink px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent disabled:opacity-50"
                >
                  {emailStatus === "sending" ? "Sending…" : "Send me the fix plan"}
                </button>
              </form>
            )}
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
          </div>
        </div>
      )}
    </div>
  );
}
