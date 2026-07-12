import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
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
  },
  {
    title: "RAG over your own data",
    detail:
      "Retrieval pipelines over documents, legal codes, catalogs, or knowledge bases — so the model cites your facts, not its imagination.",
  },
  {
    title: "Full-stack AI products, zero to launch",
    detail:
      "Next.js / TypeScript / PostgreSQL from empty repo to paying customers: payments, auth, admin, analytics, deployment on Vercel or your own server.",
  },
  {
    title: "Arabic-first & multilingual builds",
    detail:
      "RTL-native interfaces and models that actually understand Arabic, Darija, and French — for the markets most agencies get wrong.",
  },
];

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
        {/* Hero */}
        <section className="rail">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Hire · freelance & consulting
          </p>
          <h1
            className="font-display mt-3 max-w-4xl font-bold leading-[1.1]"
            style={{ fontSize: "var(--text-title)" }}
          >
            Hire an AI developer who ships to production
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            LLM agents, RAG pipelines, and the full-stack product around them —
            built end-to-end by one engineer with real systems in production,
            not a slide deck. Remote from Agadir, Morocco.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
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

          {/* Proof strip */}
          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
            {[
              { v: "16", l: "products live in production" },
              { v: "58.4K", l: "search impressions / 28 days — FASL" },
              { v: "6+", l: "years shipping real software" },
              { v: "4", l: "languages built for, RTL-first" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-display text-3xl font-bold leading-none">{s.v}</dd>
                <dd className="mt-2 text-[13px] leading-snug text-muted">{s.l}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* What you can hire me for */}
        <section className="rail mt-24">
          <h2 className="font-display max-w-2xl text-2xl font-bold leading-snug sm:text-3xl">
            What you can hire me for
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.title} className="rounded-2xl border border-line p-7">
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2.5 leading-relaxed text-muted">{s.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Evidence */}
        <section className="rail mt-24">
          <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
            The proof is running in production
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            Don&apos;t take the landing page&apos;s word for it — read the case
            studies, or use the products.
          </p>
          <ul className="mt-8 grid gap-5 lg:grid-cols-3">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group block h-full rounded-2xl border border-line p-7 transition-colors hover:border-ink/30"
                >
                  <span
                    className="font-display text-xl font-bold transition-colors group-hover:text-[var(--acc)]"
                    style={{ "--acc": p.accent } as React.CSSProperties}
                  >
                    {p.name}
                  </span>
                  <p className="mt-2 leading-relaxed text-muted">{p.tagline}</p>
                  {p.metrics[0] && (
                    <p className="mt-4 font-mono text-xs text-muted">
                      <span className="font-semibold text-ink">{p.metrics[0].value}</span>{" "}
                      — {p.metrics[0].label}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section className="rail mt-24">
          <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
            How an engagement works
          </h2>
          <ol className="mt-8 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Scope", d: "A short call or email thread: your problem, your data, what “working” means. You get a concrete plan and quote." },
              { t: "Build", d: "Short iterations with something clickable early. You see progress weekly, not at the end." },
              { t: "Ship", d: "Deployed on Vercel or your own infrastructure, with payments, analytics, and admin where needed." },
              { t: "Handover", d: "Documentation, credentials, and a codebase your team can own. No lock-in, no mystery boxes." },
            ].map((step, i) => (
              <li key={step.t}>
                <p className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</p>
                <p className="font-display mt-1 text-lg font-bold">{step.t}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{step.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="rail mt-24">
          <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
            Questions clients actually ask
          </h2>
          <div className="mt-8 max-w-3xl">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-t border-line py-5">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-display text-lg font-bold marker:hidden">
                  {f.q}
                  <span aria-hidden className="text-accent transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="rail mt-24">
          <div className="rounded-2xl border border-line bg-surface p-10 text-center sm:p-14">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Tell me what you&apos;re building
              <span className="text-accent">.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
              One honest paragraph about your problem is enough — I reply to
              everything myself, within 24 hours.
            </p>
            <Link
              href="/#contact"
              className="mt-7 inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
            >
              Start the conversation →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
