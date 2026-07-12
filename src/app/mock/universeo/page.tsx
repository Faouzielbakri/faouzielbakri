import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

/**
 * Redesigned Universeo hero, built purely to be screenshotted for the
 * portfolio (the client's live landing doesn't do the product justice, and we
 * don't touch client code). Not linked anywhere, not indexed.
 */
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Universeo — Briefs, grounded in the SERP",
  robots: { index: false, follow: false },
};

const VIOLET = "#5f3dc4";
const VIOLET_SOFT = "#7048e8";
const INK = "#1a1523";

function BoltIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden>
      <path d="M13 2 4.5 13.5H11l-1 8.5L20 9.5h-6.5L13 2Z" />
    </svg>
  );
}

function CheckIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function CoverageBar({ label, pct, you }: { label: string; pct: number; you: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-[11px] font-medium" style={{ color: "rgba(26,21,35,0.6)" }}>
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(95,61,196,0.1)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: you ? `linear-gradient(90deg, ${VIOLET_SOFT}, ${VIOLET})` : "rgba(26,21,35,0.2)",
          }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-[11px] font-semibold" style={{ color: you ? VIOLET : "rgba(26,21,35,0.4)" }}>
        {pct}%
      </span>
    </div>
  );
}

function BriefCard() {
  return (
    <div className="relative w-[440px]">
      <div
        className="overflow-hidden rounded-2xl border bg-white shadow-2xl"
        style={{ borderColor: "rgba(26,21,35,0.08)", boxShadow: "0 30px 60px -30px rgba(95,61,196,0.4)" }}
      >
        {/* Card top bar */}
        <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "rgba(26,21,35,0.06)" }}>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] font-semibold" style={{ color: "rgba(26,21,35,0.45)" }}>
            brief · &ldquo;best crm for startups&rdquo;
          </span>
          <span
            className="ml-auto flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
            style={{ background: VIOLET }}
          >
            <BoltIcon className="size-2.5" /> Generated
          </span>
        </div>

        {/* Card body */}
        <div className={`${inter.className} space-y-4 p-5`}>
          {/* Outline */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: VIOLET }}>
              Recommended outline
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: INK }}>
                  H1
                </span>
                <span className="text-[13px] font-semibold" style={{ color: INK }}>
                  The Best CRM for Startups in 2026
                </span>
              </div>
              {[
                { tag: "H2", text: "What to look for in a startup CRM" },
                { tag: "H2", text: "Top 7 CRMs compared" },
                { tag: "H3", text: "Pricing at seed vs. Series A" },
                { tag: "H2", text: "How to migrate without losing data" },
              ].map((row) => (
                <div key={row.text} className="flex items-center gap-2" style={{ paddingLeft: row.tag === "H3" ? 18 : 0 }}>
                  <span
                    className="rounded px-1.5 py-0.5 text-[9px] font-bold"
                    style={{ background: "rgba(95,61,196,0.12)", color: VIOLET }}
                  >
                    {row.tag}
                  </span>
                  <span className="text-[12px]" style={{ color: "rgba(26,21,35,0.75)" }}>
                    {row.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* People also ask */}
          <div className="rounded-xl border p-3" style={{ borderColor: "rgba(26,21,35,0.07)", background: "#fbfaff" }}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(26,21,35,0.5)" }}>
              People also ask
            </p>
            <div className="space-y-1.5">
              {[
                "Is HubSpot free for startups?",
                "What CRM do YC companies use?",
                "Do I need a CRM before product-market fit?",
              ].map((q) => (
                <div key={q} className="flex items-center gap-2">
                  <CheckIcon className="size-3 shrink-0" style={{ color: VIOLET }} />
                  <span className="text-[11.5px]" style={{ color: "rgba(26,21,35,0.7)" }}>
                    {q}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor coverage */}
          <div>
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(26,21,35,0.5)" }}>
              Topic coverage vs. top 3 results
            </p>
            <div className="space-y-2">
              <CoverageBar label="Your draft" pct={92} you />
              <CoverageBar label="salesloft.com" pct={71} you={false} />
              <CoverageBar label="hubspot.com" pct={64} you={false} />
              <CoverageBar label="pipedrive.com" pct={58} you={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating grounding badge */}
      <div
        className="absolute -right-6 -top-5 flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 shadow-xl"
        style={{ borderColor: "rgba(26,21,35,0.08)" }}
      >
        <span className="flex size-6 items-center justify-center rounded-full" style={{ background: "rgba(95,61,196,0.12)" }}>
          <BoltIcon className="size-3" style={{ color: VIOLET }} />
        </span>
        <span className="text-[11px] font-semibold" style={{ color: INK }}>
          Grounded in 10 live results
        </span>
      </div>
    </div>
  );
}

export default function UniverseoMockPage() {
  return (
    <div
      lang="en"
      className={`${grotesk.className} min-h-screen`}
      style={{
        background: "linear-gradient(170deg, #ffffff 0%, #f6f3ff 60%, #efe9ff 100%)",
        color: INK,
      }}
    >
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-9 items-center justify-center rounded-xl text-white"
            style={{ background: `linear-gradient(140deg, ${VIOLET_SOFT}, ${VIOLET})` }}
          >
            <BoltIcon className="size-4.5" />
          </span>
          <p className="text-lg font-bold tracking-tight">Universeo</p>
        </div>
        <nav className={`${inter.className} hidden items-center gap-8 text-sm font-medium opacity-70 md:flex`}>
          <span>How it works</span>
          <span>Features</span>
          <span>Pricing</span>
          <span>Docs</span>
        </nav>
        <span
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
          style={{ background: VIOLET, boxShadow: "0 10px 24px -12px rgba(95,61,196,0.7)" }}
        >
          Start free
        </span>
      </header>

      {/* Hero */}
      <main className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-20 pt-10 lg:grid-cols-[6fr_5fr]">
        <div>
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: "rgba(95,61,196,0.1)", color: VIOLET }}
          >
            <span className="size-2 rounded-full" style={{ background: VIOLET }} />
            Briefs, grounded in the SERP
          </p>
          <h1 className="text-[2.7rem] font-bold leading-[1.07] tracking-tight md:text-[3.7rem]">
            Content briefs your
            <br />
            writers can{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${VIOLET_SOFT}, ${VIOLET})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              actually execute.
            </span>
          </h1>
          <p className={`${inter.className} mt-6 max-w-lg text-lg leading-relaxed opacity-70`}>
            Universeo reads the live search results for your keyword, then builds a brief with the
            outline, questions, and topics you need to outrank the page one that&apos;s already there.
          </p>
          <div className={`${inter.className} mt-8 flex flex-wrap items-center gap-4`}>
            <span
              className="flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg"
              style={{ background: VIOLET, boxShadow: "0 14px 30px -12px rgba(95,61,196,0.7)" }}
            >
              <BoltIcon className="size-5" /> Generate a brief
            </span>
            <span
              className="rounded-full border-2 px-7 py-3 text-base font-semibold"
              style={{ borderColor: "rgba(26,21,35,0.15)", color: INK }}
            >
              See a sample
            </span>
          </div>
          <div className={`${inter.className} mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm`}>
            {["Live SERP analysis", "Real competitor gaps", "Export to Docs & CMS"].map((f) => (
              <span key={f} className="flex items-center gap-2 font-medium opacity-70">
                <CheckIcon className="size-4" style={{ color: VIOLET }} />
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="relative hidden justify-center lg:flex">
          <div
            className="absolute -right-10 -top-8 size-72 rounded-full opacity-30 blur-3xl"
            style={{ background: VIOLET_SOFT }}
          />
          <div
            className="absolute -bottom-6 left-0 size-56 rounded-full opacity-20 blur-3xl"
            style={{ background: "#4dabf7" }}
          />
          <BriefCard />
        </div>
      </main>
    </div>
  );
}
