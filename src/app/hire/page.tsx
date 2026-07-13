import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Hire an AI Developer — LLM Agents, RAG & Full-Stack | Faouzi El Bakri",
  description:
    "Hire an AI developer who ships to production: LLM agents, RAG pipelines, and full-stack products with real users. Freelance AI developer & consultant — remote from Agadir, Morocco.",
  keywords: [
    "hire ai developer",
    "ai developer for hire",
    "freelance ai developer",
    "hire ai agent developer",
    "hire generative ai developer",
    "ai consultant",
    "ai consultant for small business",
    "hire llm developer",
  ],
  alternates: { canonical: "/hire" },
  openGraph: {
    type: "website",
    title: "Hire an AI Developer · Faouzi El Bakri",
    description:
      "LLM agents, RAG pipelines, and full-stack AI products that ship — 16 products in production, 58.4K search impressions in 28 days on the flagship.",
    url: "/hire",
    images: [{ url: "/og/default.png" }],
  },
};

const FAQ = [
  {
    q: "What kind of AI developer are you?",
    a: "A full-stack engineer specialized in LLM-powered products: AI agents with tool use, multi-agent pipelines, RAG over domain documents, and the product around them — Next.js, TypeScript, PostgreSQL. I build the whole thing, not just the model calls.",
  },
  {
    q: "Can I hire you to build an AI agent?",
    a: "Yes — that's the core of what I do. I've built production agent systems: a multi-agent legal drafting pipeline (FASL), a WhatsApp job-matching agent that interviews workers in Darija (RESO Khdma), and an automated video-ad generation pipeline (Lakta).",
  },
  {
    q: "Do you work with small businesses or only startups?",
    a: "Both. Small businesses usually need one well-scoped AI capability wired into how they already work — a support agent, document automation, search over their own data. I scope small, ship fast, and you own everything.",
  },
  {
    q: "How do you charge — freelance projects or ongoing consulting?",
    a: "Both models work: fixed-scope projects (an agent, a pipeline, an MVP) or an ongoing consulting/engineering arrangement. Every engagement starts with a short scoping conversation so the quote reflects the actual problem.",
  },
  {
    q: "Do you build Arabic-first or multilingual AI products?",
    a: "Natively. I'm an Arabic and Darija native speaker; FASL runs Arabic-first with full RTL, and RESO Khdma understands Arabic, Darija, and French. If your market speaks Arabic or French, it's built for it — not translated as an afterthought.",
  },
  {
    q: "Where are you based, and do you work remotely?",
    a: "Agadir, Morocco (GMT+1 — European hours overlap). I work remotely with clients anywhere, and everything ships with documentation, deployment, and a clean handover.",
  },
];

const SERVICES = [
  {
    title: "AI agents & multi-agent pipelines",
    detail:
      "Tool-using agents and staged pipelines with structured-output contracts, grounding, and human-in-the-loop review — the architecture running FASL in production.",
    receipt: "FASL · RESO Khdma",
  },
  {
    title: "RAG over your own data",
    detail:
      "Retrieval pipelines over documents, legal codes, catalogs, or knowledge bases — so the model cites your facts, not its imagination.",
    receipt: "FASL — grounded in Moroccan law",
  },
  {
    title: "Full-stack AI products, zero to launch",
    detail:
      "Next.js / TypeScript / PostgreSQL from empty repo to paying customers: payments, auth, admin, analytics, deployment on Vercel or your own server.",
    receipt: "Belmo · Magical Hekaya",
  },
  {
    title: "Arabic-first & multilingual builds",
    detail:
      "RTL-native interfaces and models that actually understand Arabic, Darija, and French — for the markets most agencies get wrong.",
    receipt: "4 languages · RTL-first",
  },
];

const PROCESS = [
  { t: "Scope", d: "A short call or email thread: your problem, your data, what “working” means. You get a concrete plan and quote." },
  { t: "Build", d: "Short iterations with something clickable early. You see progress weekly, not at the end." },
  { t: "Ship", d: "Deployed on Vercel or your own infrastructure, with payments, analytics, and admin where needed." },
  { t: "Iterate", d: "Documentation, credentials, and a codebase your team can own. No lock-in, no mystery boxes." },
];

/** slug → world artwork file (media/world-*.avif) */
const WORLD_ART: Record<string, string> = {
  fasl: "/media/world-fasl.avif",
  "magical-hekaya": "/media/world-hekaya.avif",
  belmo: "/media/world-belmo.avif",
  lakta: "/media/world-lakta.avif",
  "reso-khdma": "/media/world-reso.avif",
  webtrade: "/media/world-webtrade.avif",
};

export default function HirePage() {
  const featured = caseStudies.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/hire#service`,
        name: `${site.name} — AI Development & Consulting`,
        description:
          "Freelance AI developer and consultant: LLM agents, RAG pipelines, and full-stack AI products shipped to production.",
        url: `${SITE_URL}/hire`,
        provider: { "@id": `${SITE_URL}/#person` },
        areaServed: "Worldwide (remote)",
        knowsAbout: ["LLM agents", "RAG", "Multi-agent pipelines", "Next.js", "Arabic NLP products"],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/hire#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hire", item: `${SITE_URL}/hire` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="min-h-screen pb-28 pt-32">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="rail">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
              <span aria-hidden className="h-px w-10 bg-accent" />
              Hire · freelance & consulting
            </p>
          </Reveal>
          <Reveal>
            <h1
              className="font-display mt-5 max-w-5xl font-bold leading-[1.04]"
              style={{ fontSize: "var(--text-display)" }}
            >
              Hire an AI developer
              <br />
              who actually{" "}
              <em
                className="not-italic"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                }}
              >
                ships
              </em>
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
              LLM agents, RAG pipelines, and the full-stack product around them —
              built end-to-end by one engineer with real systems in production,
              not a slide deck. Remote from Agadir, Morocco.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/#contact"
                className="rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
              >
                Start a project →
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                or email {site.email}
              </a>
            </div>
          </Reveal>
        </section>

        {/* ── The worlds — expanding film strip ────────────────── */}
        <Reveal className="rail mt-16">
          <div className="flex h-40 gap-1.5 overflow-hidden rounded-2xl sm:h-56 lg:h-72">
            {caseStudies.map((p) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                aria-label={`${p.name} case study`}
                className="group relative min-w-0 flex-1 overflow-hidden transition-[flex-grow] duration-500 ease-out hover:flex-[2.6]"
              >
                <Image
                  src={WORLD_ART[p.slug] ?? "/media/world-fasl.avif"}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 18vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 right-3 truncate font-display text-sm font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {p.name} <span aria-hidden className="text-white/60">→</span>
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Six worlds shipped — hover to enter one
          </p>
        </Reveal>

        {/* ── Proof band ───────────────────────────────────────── */}
        <section className="rail mt-20">
          <Reveal group as="div" className="grid grid-cols-2 gap-x-10 gap-y-10 border-y border-line py-10 lg:grid-cols-4">
            {[
              { v: "16", l: "products live in production — four of them my own" },
              { v: "58.4K", l: "search impressions in 28 days — FASL, zero ad spend" },
              { v: "818", l: "clients registered in Belmo's first two months" },
              { v: "6+", l: "years shipping software with real users and real money" },
            ].map((s) => (
              <RevealItem key={s.l}>
                <p
                  className="font-display font-bold leading-none"
                  style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)" }}
                >
                  {s.v}
                  <span className="text-accent">.</span>
                </p>
                <p className="mt-3 max-w-[15rem] text-[13px] leading-relaxed text-muted">{s.l}</p>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        {/* ── Services — editorial ledger ──────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">The work</p>
            <h2 className="font-display mt-3 max-w-2xl font-bold leading-tight" style={{ fontSize: "var(--text-title)" }}>
              What you can hire me for<span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal group as="ul" className="mt-10">
            {SERVICES.map((s, i) => (
              <RevealItem key={s.title}>
                <li className="group grid gap-3 border-t border-line py-8 transition-colors sm:grid-cols-[3rem_1fr_1.2fr] sm:gap-8 lg:grid-cols-[4rem_1fr_1.2fr]">
                  <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-snug transition-colors group-hover:text-accent sm:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                      {s.receipt}
                    </p>
                  </div>
                  <p className="leading-relaxed text-muted">{s.detail}</p>
                </li>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        {/* ── Evidence — world cards ───────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">The receipts</p>
            <h2 className="font-display mt-3 max-w-2xl font-bold leading-tight" style={{ fontSize: "var(--text-title)" }}>
              The proof is running in production<span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((p) => (
              <RevealItem key={p.slug}>
                <li className="h-full">
                  <Link
                    href={`/work/${p.slug}`}
                    className="group relative block h-[24rem] overflow-hidden rounded-2xl border border-line"
                  >
                    <Image
                      src={WORLD_ART[p.slug] ?? "/media/world-fasl.avif"}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, 90vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
                        {p.role}
                      </p>
                      <p className="font-display mt-1.5 text-2xl font-bold text-white">
                        {p.name}
                      </p>
                      {p.metrics[0] && (
                        <p className="mt-3 flex items-baseline gap-2.5">
                          <span
                            className="font-display text-3xl font-bold leading-none"
                            style={{ color: p.accent }}
                          >
                            {p.metrics[0].value}
                          </span>
                          <span className="text-[13px] leading-snug text-white/70">
                            {p.metrics[0].label}
                          </span>
                        </p>
                      )}
                      <p className="mt-4 font-mono text-xs text-white/70 transition-colors group-hover:text-white">
                        Read the case study →
                      </p>
                    </div>
                  </Link>
                </li>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        {/* ── Process — the rail ───────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">The method</p>
            <h2 className="font-display mt-3 max-w-2xl font-bold leading-tight" style={{ fontSize: "var(--text-title)" }}>
              How an engagement works<span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal className="relative mt-12">
            <span aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px bg-line sm:block" />
            <span aria-hidden className="absolute left-0 top-[5px] hidden h-px w-full origin-left bg-accent sm:block" />
            <ol className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step, i) => (
                <li key={step.t} className="relative pr-6">
                  <span aria-hidden className="hidden size-[11px] rounded-full border-2 border-accent bg-bg sm:block" />
                  <p className="mt-4 font-mono text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</p>
                  <p className="font-display mt-1 text-lg font-bold">
                    {step.t}
                    {i === PROCESS.length - 1 && (
                      <span aria-hidden className="ml-1.5 text-accent">↺</span>
                    )}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{step.d}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="rail mt-24">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[2fr_3fr]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">The questions</p>
              <h2 className="font-display mt-3 font-bold leading-tight" style={{ fontSize: "var(--text-title)" }}>
                Asked by every client<span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted">
                If yours isn&apos;t here, the letter at the bottom of the{" "}
                <Link href="/#contact" className="text-accent underline decoration-accent/40 underline-offset-4">
                  homepage
                </Link>{" "}
                takes about forty seconds.
              </p>
            </Reveal>
            <Reveal>
              <div>
                {FAQ.map((f) => (
                  <details key={f.q} className="group border-t border-line py-5 first:border-t-0">
                    <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-display text-lg font-bold">
                      {f.q}
                      <span aria-hidden className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Closing — the letter opener ──────────────────────── */}
        <section className="rail mt-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-line">
              <Image
                src="/media/about-texture.avif"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-[0.35]"
              />
              <div className="relative px-8 py-16 text-center sm:px-14 sm:py-20">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                  One engineer · the whole lifecycle
                </p>
                <h2
                  className="font-display mx-auto mt-4 max-w-3xl font-bold leading-[1.1]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  Salam — tell me what
                  <br />
                  you&apos;re{" "}
                  <em
                    className="not-italic"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      fontStyle: "italic",
                      fontWeight: 500,
                      color: "var(--color-accent)",
                    }}
                  >
                    building
                  </em>
                  .
                </h2>
                <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
                  One honest paragraph about your problem is enough — I reply to
                  everything myself, within 24 hours.
                </p>
                <Link
                  href="/#contact"
                  className="mt-8 inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
                >
                  Start the conversation →
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
