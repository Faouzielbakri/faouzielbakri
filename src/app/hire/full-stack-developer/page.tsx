import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { caseStudies, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

/**
 * The full-stack contract page.
 *
 * /hire sells the AI work, /hire/small-business sells the first automation,
 * /hire/europe answers a recruiter. This one answers the search that is
 * simply "hire a full-stack / React / Next.js developer" — stack-led rather
 * than AI-led intent, and the highest-value commercial cluster the site
 * wasn't addressing.
 */

export const metadata: Metadata = {
  title: "Hire a Full-Stack Developer — React, Next.js & TypeScript",
  description:
    "Hire a senior full-stack developer for contract work: React, Next.js, TypeScript, Node and PostgreSQL, from architecture to deployment. 6+ years, 16 products live in production. Remote, worldwide.",
  keywords: [
    "hire full stack developer",
    "hire react developer",
    "hire nextjs developer",
    "hire next js developer",
    "freelance full stack developer",
    "senior react developer for hire",
    "typescript developer for hire",
    "contract web developer",
    "hire mvp developer",
    "remote full stack engineer",
  ],
  alternates: { canonical: "/hire/full-stack-developer" },
  openGraph: {
    type: "website",
    title: "Hire a Full-Stack Developer — React, Next.js & TypeScript",
    description:
      "One engineer, the whole stack: React and Next.js on the front, Node and PostgreSQL behind, deployed and maintained. 16 products live in production.",
    url: "/hire/full-stack-developer",
    images: [{ url: "/og/default.png" }],
  },
};

/** What "full-stack" actually covers here — no hand-offs, no gaps. */
const LAYERS = [
  {
    kicker: "Interface",
    title: "React & Next.js, built to last",
    body: "App Router, server components, streaming, and the accessibility and performance work that usually gets skipped. Interfaces that survive a real content load and a real device, not just a design file.",
  },
  {
    kicker: "Backend",
    title: "APIs and business logic",
    body: "Node and TypeScript end to end, typed contracts between client and server, background jobs, webhooks, and third-party integrations that fail gracefully when the other side goes down.",
  },
  {
    kicker: "Data",
    title: "PostgreSQL, modelled properly",
    body: "Schema design, migrations, indexing, and transactions that hold under concurrency. The database is where products quietly rot — getting it right early is the cheapest work you'll ever buy.",
  },
  {
    kicker: "Ship",
    title: "Deployment and what comes after",
    body: "Docker, Vercel or self-hosted on Hetzner with Dokploy, CI, logging, and monitoring. The job isn't done when it works on my machine — it's done when it's running and you can see that it is.",
  },
];

/** Systems with a hard constraint — the interesting part of each build. */
const RECEIPTS = [
  {
    value: "Real money",
    label: "A trading interface where a race condition costs cash",
    detail:
      "WebTrade — real-time price streams over WebSockets, an order flow that stays consistent under concurrency, and UI that keeps up with the feed instead of fighting it.",
    slug: "webtrade",
  },
  {
    value: "~500",
    label: "Suppliers on a B2B marketplace with sub-second search",
    detail:
      "Maroc Fournisseurs — Algolia-backed search across the catalogue plus real-time negotiation chat between buyers and providers, on Next.js and Prisma.",
    slug: "maroc-fournisseurs",
  },
  {
    value: "629",
    label: "Orders fulfilled in the first two months of a new store",
    detail:
      "Belmo — storefront, cash-on-delivery checkout, inventory and admin, self-hosted on Hetzner to keep the monthly running cost near zero.",
    slug: "belmo",
  },
  {
    value: "~500",
    label: "Students on a platform with video, quizzes and payments",
    detail:
      "Magic Hands LMS — Laravel and Next.js, Stripe and PayPal enrolment, Bunny Stream video delivery, and an instructor dashboard replacing a spreadsheet.",
    slug: "magic-hands-lms",
  },
];

const STACK = [
  "TypeScript",
  "React 19",
  "Next.js (App Router)",
  "Node.js",
  "PostgreSQL · Prisma",
  "Tailwind CSS",
  "WebSockets",
  "Stripe · PayPal",
  "Algolia",
  "Docker",
  "Hetzner · Dokploy",
  "Vercel",
];

/** How a contract engagement runs. */
const PROCESS = [
  {
    step: "A call, free",
    body: "Thirty minutes on what you're building and where it's stuck. You'll get a straight read on scope and risk, whether or not we work together.",
  },
  {
    step: "A written scope",
    body: "What gets built, what I need from you, when it lands, and one fixed number. Agreed before code, so nobody discovers the budget halfway through.",
  },
  {
    step: "Weekly, visible",
    body: "Work lands on a staging URL you can open any day of the week. No status meetings needed to find out where things stand — you can just look.",
  },
  {
    step: "Yours at the end",
    body: "Your repository, your infrastructure, documented handover. Ongoing maintenance is available and optional — never something I build in as a dependency.",
  },
];

const FAQ = [
  {
    q: "Contract or full-time?",
    a: "Contract and freelance work through this page — project-based, fixed scope, remote. If you're hiring for a permanent role instead, the relocation page covers that: I'm open to full-time positions in the Netherlands and Germany.",
  },
  {
    q: "What do you charge?",
    a: "Fixed price against a written scope, quoted after a free call, rather than an hourly rate with an open meter. Any number quoted before seeing the project would be a guess, and guesses are what turn into change requests later. Smaller, well-scoped projects are quoted as a single figure; longer engagements as monthly blocks.",
  },
  {
    q: "Front-end only, or the whole thing?",
    a: "Either. Plenty of the work is a React or Next.js front end against an API someone else owns. But the reason to hire one engineer for the whole stack is that most real bugs live at the seams — between the client and the API, or the API and the database — and those are cheapest to fix when one person owns both sides.",
  },
  {
    q: "Do you work with existing codebases?",
    a: "Yes, and it's most of the work. Inheriting a codebase, finding out why it's slow or fragile, and shipping without a rewrite is a specific skill. I'll tell you honestly if a rewrite is genuinely the cheaper path — it usually isn't.",
  },
  {
    q: "React or Next.js — which should I pick?",
    a: "Next.js by default: routing, server rendering, and image and font handling are solved for you, and SEO is real work you don't have to invent. Plain React with a separate API makes sense when the app sits behind a login and search visibility is irrelevant. It's a twenty-minute conversation, not a religious question.",
  },
  {
    q: "Where are you, and how does the time zone work?",
    a: "Agadir, Morocco. That's the same clock as London most of the year and one hour behind Berlin and Amsterdam in summer, so the European working day overlaps almost entirely and the American morning is covered. I work in English, French, Arabic, and Darija. Every project on this site was delivered remotely.",
  },
  {
    q: "Can you do the AI parts too?",
    a: "That's the other half of what I do — LLM agents, RAG over your own data, and the pipelines around them, running in production on FASL and RESO Khdma. If AI is the point of the project rather than a feature of it, the main hire page covers that work directly.",
  },
  {
    q: "How fast can you start?",
    a: "Usually within a week or two, depending on what's in flight. If a project needs to start sooner than that I'll say so on the call rather than take it and stretch it.",
  },
];

const WORLD_ART: Record<string, string> = {
  fasl: "/media/world-fasl.avif",
  "magical-hekaya": "/media/world-hekaya.avif",
  belmo: "/media/world-belmo.avif",
  laqta: "/media/world-laqta.avif",
  "reso-khdma": "/media/world-reso.avif",
  webtrade: "/media/world-webtrade.avif",
};

export default function HireFullStackDeveloperPage() {
  const featured = caseStudies.filter((p) =>
    ["webtrade", "belmo", "fasl"].includes(p.slug),
  );
  const personId = `${SITE_URL}/#person`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/hire/full-stack-developer#service`,
        name: "Full-Stack Development — React, Next.js & TypeScript",
        description:
          "Contract full-stack web development: React and Next.js interfaces, Node and TypeScript APIs, PostgreSQL data layers, and deployment — delivered by one senior engineer.",
        url: `${SITE_URL}/hire/full-stack-developer`,
        provider: { "@id": personId },
        areaServed: "Worldwide (remote)",
        serviceType: "Full-stack web development",
        availableLanguage: ["English", "French", "Arabic"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Full-stack engagements",
          itemListElement: LAYERS.map((l) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: l.title, description: l.body },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/hire/full-stack-developer#faq`,
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
          {
            "@type": "ListItem",
            position: 3,
            name: "Full-stack developer",
            item: `${SITE_URL}/hire/full-stack-developer`,
          },
        ],
      },
    ],
  };

  const mailSubject = encodeURIComponent("Full-stack project — first call");

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
              Full-stack · React · Next.js · TypeScript
            </p>
          </Reveal>
          <Reveal>
            <h1
              className="font-display mt-5 max-w-5xl font-bold leading-[1.04]"
              style={{ fontSize: "var(--text-display)" }}
            >
              Hire one developer
              <br />
              for the{" "}
              <em
                className="not-italic"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                }}
              >
                whole
              </em>{" "}
              stack
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
              React and Next.js on the front, Node and PostgreSQL behind it,
              deployed and monitored — by one senior engineer instead of a
              front-end contractor, a back-end contractor, and a project manager
              translating between them. Six years, sixteen products live in
              production, four of them my own.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href={`mailto:${site.email}?subject=${mailSubject}`}
                className="rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
              >
                Book a free 30-minute call →
              </a>
              <Link
                href="/hire"
                className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                Looking for the AI work? →
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── The layers ───────────────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              What full-stack means here
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              Four layers, one person accountable for all of them
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              Most expensive bugs live at the seams between layers. When one
              engineer owns every side of the seam, they get found in an
              afternoon instead of in a thread between two agencies.
            </p>
          </Reveal>
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-2">
            {LAYERS.map((l) => (
              <RevealItem key={l.title}>
                <li className="h-full rounded-2xl border border-line bg-surface/60 p-7">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                    {l.kicker}
                  </p>
                  <h3 className="font-display mt-3 text-lg font-bold leading-snug">
                    {l.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{l.body}</p>
                </li>
              </RevealItem>
            ))}
          </Reveal>
          <Reveal>
            <ul className="mt-8 flex flex-wrap gap-2">
              {STACK.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-muted"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ── Receipts ─────────────────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              The receipts
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              Shipped systems, each with a hard constraint
              <span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-2">
            {RECEIPTS.map((r) => {
              const project = getProject(r.slug);
              return (
                <RevealItem key={r.slug}>
                  <li className="h-full rounded-2xl border border-line bg-surface/60 p-7">
                    <p
                      className="font-display font-bold leading-none text-accent"
                      style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)" }}
                    >
                      {r.value}
                    </p>
                    <p className="mt-3 font-display text-[15px] font-bold leading-snug">
                      {r.label}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">
                      {r.detail}
                    </p>
                    {project ? (
                      <Link
                        href={`/work/${r.slug}`}
                        className="mt-4 inline-block font-mono text-xs text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                      >
                        Read the {project.name} case study →
                      </Link>
                    ) : null}
                  </li>
                </RevealItem>
              );
            })}
          </Reveal>
        </section>

        {/* ── Process ──────────────────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              How it runs
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              Fixed scope, visible progress, clean handover
              <span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <RevealItem key={p.step}>
                <li className="h-full rounded-2xl border border-line bg-surface/60 p-7">
                  <p className="font-mono text-xs tracking-[0.2em] text-accent">
                    Step {i + 1}
                  </p>
                  <h3 className="font-display mt-3 text-lg font-bold leading-snug">
                    {p.step}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
                </li>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        {/* ── Case studies ─────────────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Written up properly
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              How three of them were actually built
              <span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((p) => (
              <RevealItem key={p.slug}>
                <li className="h-full">
                  <Link
                    href={`/work/${p.slug}`}
                    className="group relative block h-[22rem] overflow-hidden rounded-2xl border border-line bg-ink"
                  >
                    <Image
                      src={WORLD_ART[p.slug] ?? "/media/world-fasl.avif"}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      quality={90}
                      className="object-cover object-[77%_50%] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
                        {p.role}
                      </p>
                      <p className="font-display mt-1.5 text-2xl font-bold text-white">
                        {p.name}
                      </p>
                      <p className="mt-3 text-[13px] leading-snug text-white/70">
                        {p.tagline}
                      </p>
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

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="rail mt-24">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[2fr_3fr]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                The questions
              </p>
              <h2
                className="font-display mt-3 font-bold leading-tight"
                style={{ fontSize: "var(--text-title)" }}
              >
                Asked before every contract
                <span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted">
                Starting from nothing?{" "}
                <Link
                  href="/blog/how-to-build-an-mvp"
                  className="text-accent underline decoration-accent/40 underline-offset-4"
                >
                  How to build an MVP that ships
                </Link>{" "}
                covers scoping a first version before you hire anyone.
              </p>
            </Reveal>
            <Reveal>
              <div>
                {FAQ.map((f) => (
                  <details
                    key={f.q}
                    className="group border-t border-line py-5 first:border-t-0"
                  >
                    <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-display text-lg font-bold">
                      {f.q}
                      <span
                        aria-hidden
                        className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
                      >
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

        {/* ── Closing ──────────────────────────────────────────── */}
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
                  Free call · fixed quote · no retainer
                </p>
                <h2
                  className="font-display mx-auto mt-4 max-w-3xl font-bold leading-[1.1]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  Send me the spec
                  <br />
                  and I&apos;ll send you{" "}
                  <em
                    className="not-italic"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      fontStyle: "italic",
                      fontWeight: 500,
                      color: "var(--color-accent)",
                    }}
                  >
                    a number
                  </em>
                  .
                </h2>
                <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
                  Or send me a half-formed idea — the first call is for working
                  out what the project actually is. I answer every email myself,
                  within 24 hours.
                </p>
                <a
                  href={`mailto:${site.email}?subject=${mailSubject}`}
                  className="mt-8 inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
                >
                  Email {site.email} →
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
