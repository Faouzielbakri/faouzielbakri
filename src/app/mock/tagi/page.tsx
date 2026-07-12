import type { Metadata } from "next";
import { Sora } from "next/font/google";

/**
 * Redesigned TAGi hero, built purely to be screenshotted for the portfolio
 * (the client's live landing doesn't do the product justice, and we don't
 * touch client code). Not linked anywhere, not indexed.
 */
const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "TAGi — One tap. Every detail.",
  robots: { index: false, follow: false },
};

const BLUE = "#3b5bdb";
const BLUE_LIGHT = "#5c7cfa";
const INK = "#0a0a0f";

function ChipIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" strokeLinecap="round" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  );
}

function WaveIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} style={style} aria-hidden>
      <path d="M6 8.5a8 8 0 0 1 0 7M10 6a12 12 0 0 1 0 12M14 4a16 16 0 0 1 0 16" />
    </svg>
  );
}

function NfcCard() {
  return (
    <div
      className="relative h-[220px] w-[350px] rotate-[-8deg] rounded-3xl p-6"
      style={{
        background: "linear-gradient(145deg, #16161d 0%, #0a0a0f 60%, #101018 100%)",
        boxShadow: "0 40px 80px -30px rgba(59,91,219,0.55), 0 2px 0 0 rgba(255,255,255,0.06) inset, 0 -1px 0 0 rgba(0,0,0,0.5) inset",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
        style={{ background: "linear-gradient(120deg, transparent 30%, rgba(92,124,250,0.15) 50%, transparent 70%)" }}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              TAG<span style={{ color: BLUE_LIGHT }}>i</span>
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
              Smart Card
            </p>
          </div>
          <WaveIcon className="size-6" style={{ color: BLUE_LIGHT }} />
        </div>

        {/* embossed chip */}
        <div
          className="flex size-11 items-center justify-center rounded-lg"
          style={{
            background: "linear-gradient(145deg, #d4af37, #b8860b)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)",
          }}
        >
          <ChipIcon className="size-7 text-black/60" />
        </div>

        <div>
          <p
            className="text-xl font-bold tracking-wide text-white"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.15), 0 -1px 1px rgba(0,0,0,0.6)" }}
          >
            YASSINE A.
          </p>
          <p className="mt-0.5 text-xs font-medium text-white/45">Product Designer · Casablanca</p>
        </div>
      </div>
    </div>
  );
}

function ContactPopup() {
  return (
    <div className="relative w-[230px] rounded-[2rem] border-[8px] border-[#16161d] bg-[#16161d] shadow-2xl">
      <div className="overflow-hidden rounded-[1.5rem] bg-[#0d0d12]">
        {/* status bar */}
        <div className="flex items-center justify-between px-5 pt-3 text-[9px] font-semibold text-white/50">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <WaveIcon className="size-2.5" style={{ color: BLUE_LIGHT }} />
            TAGi
          </span>
        </div>

        {/* "tapped" toast */}
        <div className="px-4 pt-3">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: "rgba(59,91,219,0.15)", border: "1px solid rgba(92,124,250,0.25)" }}
          >
            <span className="flex size-5 items-center justify-center rounded-full" style={{ background: BLUE }}>
              <WaveIcon className="size-3 text-white" />
            </span>
            <span className="text-[10px] font-semibold text-white">Card tapped · new contact</span>
          </div>
        </div>

        {/* profile */}
        <div className="px-4 pb-5 pt-4">
          <div className="flex flex-col items-center text-center">
            <div
              className="flex size-16 items-center justify-center rounded-full text-xl font-extrabold text-white"
              style={{ background: `linear-gradient(140deg, ${BLUE_LIGHT}, ${BLUE})` }}
            >
              YA
            </div>
            <p className="mt-2.5 text-sm font-bold text-white">Yassine A.</p>
            <p className="text-[11px] text-white/50">Product Designer</p>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="rounded-md px-2 py-0.5 text-[9px] font-semibold" style={{ background: "rgba(92,124,250,0.15)", color: BLUE_LIGHT }}>
                Design Studio 21
              </span>
            </div>
          </div>

          {/* details */}
          <div className="mt-4 space-y-2">
            {[
              { label: "Email", value: "yassine@studio21.ma" },
              { label: "Phone", value: "+212 6 •• •• •• 44" },
              { label: "LinkedIn", value: "/in/yassine-a" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-[9px] font-medium uppercase tracking-wide text-white/40">{row.label}</span>
                <span className="text-[10px] font-semibold text-white/85">{row.value}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-4 rounded-xl py-2.5 text-center text-[11px] font-bold text-white"
            style={{ background: `linear-gradient(90deg, ${BLUE_LIGHT}, ${BLUE})` }}
          >
            Save to contacts
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TagiMockPage() {
  return (
    <div
      lang="en"
      className={`${sora.className} min-h-screen`}
      style={{
        background: "radial-gradient(120% 90% at 80% 0%, #14141c 0%, #0a0a0f 55%, #060608 100%)",
        color: "#ffffff",
      }}
    >
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-9 items-center justify-center rounded-xl"
            style={{ background: `linear-gradient(140deg, ${BLUE_LIGHT}, ${BLUE})` }}
          >
            <WaveIcon className="size-4 text-white" />
          </span>
          <p className="text-lg font-extrabold tracking-tight">
            TAG<span style={{ color: BLUE_LIGHT }}>i</span>
          </p>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
          <span>Product</span>
          <span>For teams</span>
          <span>Cards</span>
          <span>Pricing</span>
        </nav>
        <span
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
          style={{ background: BLUE, boxShadow: "0 10px 26px -10px rgba(59,91,219,0.8)" }}
        >
          Get your card
        </span>
      </header>

      {/* Hero */}
      <main className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[6fr_5fr]">
        <div>
          <p
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: "rgba(59,91,219,0.15)", color: BLUE_LIGHT, border: "1px solid rgba(92,124,250,0.2)" }}
          >
            <span className="size-2 rounded-full" style={{ background: BLUE_LIGHT }} />
            NFC networking · app + web dashboard
          </p>
          <h1 className="text-[3rem] font-extrabold leading-[1.02] tracking-tight md:text-[4.3rem]">
            One tap.
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${BLUE_LIGHT}, #9db4ff)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Every detail.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
            Tap your TAGi card to any phone and your full profile appears instantly — no app to
            install for them. Track every connection from the dashboard and update your card in
            real time.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <span
              className="flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg"
              style={{ background: BLUE, boxShadow: "0 16px 34px -12px rgba(59,91,219,0.85)" }}
            >
              <WaveIcon className="size-5" /> Order your TAGi
            </span>
            <span className="rounded-full border px-7 py-3 text-base font-semibold text-white/90" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
              See the dashboard
            </span>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/50">
            {["Works on iPhone & Android", "No app for the receiver", "Update anytime"].map((f) => (
              <span key={f} className="flex items-center gap-2 font-medium">
                <span className="flex size-4 items-center justify-center rounded-full" style={{ background: "rgba(92,124,250,0.2)" }}>
                  <svg viewBox="0 0 24 24" className="size-2.5" style={{ color: BLUE_LIGHT }} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Visual: card tapping phone */}
        <div className="relative hidden h-[440px] items-center justify-center lg:flex">
          <div className="absolute right-4 top-6 size-80 rounded-full opacity-40 blur-3xl" style={{ background: BLUE }} />

          {/* phone back-right */}
          <div className="absolute right-0 top-4 z-10">
            <ContactPopup />
          </div>

          {/* tap ripple */}
          <div className="absolute left-[46%] top-[44%] z-20 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inline-flex size-16 animate-ping rounded-full opacity-40" style={{ background: BLUE_LIGHT }} />
            <span className="relative flex size-16 items-center justify-center rounded-full" style={{ background: "rgba(59,91,219,0.25)", border: "1px solid rgba(92,124,250,0.4)" }}>
              <WaveIcon className="size-7" style={{ color: BLUE_LIGHT }} />
            </span>
          </div>

          {/* card front-left */}
          <div className="absolute -left-6 bottom-6 z-0">
            <NfcCard />
          </div>
        </div>
      </main>
    </div>
  );
}
