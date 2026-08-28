import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

/**
 * The recruiter page.
 *
 * /hire sells project work to clients. This one answers the questions a
 * European hiring manager actually asks before a first call — can he do the
 * work, and what does the paperwork cost me — because "AI engineer open to
 * relocation, Netherlands / Germany" is a search nobody on this site was
 * answering.
 */

export const metadata: Metadata = {
  title:
    "AI Engineer Open to Relocation — Netherlands & Germany | Faouzi El Bakri",
  description:
    "AI engineer with 6+ years of production work — LLM agents, RAG, Next.js/TypeScript — open to relocating to the Netherlands or Germany. M.Sc in Big Data & AI, EU Blue Card and Highly Skilled Migrant eligible, English/French/Arabic, CET working hours.",
  keywords: [
    "AI engineer open to relocation",
    "AI engineer visa sponsorship Netherlands",
    "AI engineer visa sponsorship Germany",
    "EU Blue Card AI engineer",
    "highly skilled migrant developer Netherlands",
    "hire LLM engineer Europe",
    "relocate software engineer Morocco Europe",
    "Next.js engineer Amsterdam Berlin",
    "machine learning engineer relocation package",
  ],
  alternates: { canonical: "/hire/europe" },
  openGraph: {
    type: "profile",
    title: "AI Engineer Open to Relocation — Netherlands & Germany",
    description:
      "Six years of shipped production software, four of them my own products. M.Sc in Big Data & AI, Blue Card eligible, ready to relocate.",
    url: "/hire/europe",
    images: [{ url: "/og/default.png" }],
  },
};

/** Questions a hiring manager asks before booking a call — answered flatly. */
const FAQ = [
  {
    q: "Are you open to relocating to the Netherlands or Germany?",
    a: "Yes — those two first, and I'd move for the right team. I'm in Agadir, Morocco today, working with clients across Europe. Relocation is the plan, not a maybe: it's why this page exists.",
  },
  {
    q: "Do you need visa sponsorship, and how hard is it?",
    a: "Yes, I need sponsorship — I'm a Moroccan national. It's the routine path, not an exotic one: I hold an M.Sc in Big Data & Artificial Intelligence, which satisfies the degree requirement for the EU Blue Card in Germany and the Dutch Highly Skilled Migrant permit. On your side it's a salary at or above the annual threshold and, in the Netherlands, IND-recognised sponsor status — which most tech employers hiring internationally already hold.",
  },
  {
    q: "How long does the paperwork take?",
    a: "For a recognised sponsor in the Netherlands the IND decision usually lands within a few weeks of a complete application; the German Blue Card runs longer because of the consulate appointment. I can start remotely as a contractor while it's processing, so the work begins before the move does.",
  },
  {
    q: "What would I actually be hiring?",
    a: "An engineer who has taken LLM products from empty repo to real users, alone: a multi-agent legal drafting platform used by Moroccan lawyers (FASL), a consumer AI storybook product with paying customers (Magical Hekaya), an e-commerce store doing hundreds of orders a month (Belmo), and a video-ad generation pipeline (Laqta). Architecture, build, deploy, and the operations after launch.",
  },
  {
    q: "Which languages do you work in?",
    a: "English and French fluently, Arabic and Moroccan Darija natively. Every team I've worked with ran in English or French. I have no German or Dutch yet — I'd start learning the day a contract is signed.",
  },
  {
    q: "What are the time zones like before you move?",
    a: "Agadir runs on the same clock as Amsterdam and Berlin in winter and one hour behind in summer, so the working day overlaps almost completely. Nothing about a trial period has to wait for the relocation.",
  },
  {
    q: "Are you looking for AI-specific roles only?",
    a: "AI engineering is where I'm strongest and where I want to grow — agents, RAG, evaluation, the product around a model. But I've shipped as a full-stack product engineer for six years, so a role that is 70% product and 30% AI is a good fit too.",
  },
  {
    q: "Remote, hybrid, or onsite?",
    a: "Onsite or hybrid once I've moved — building a team relationship in person matters more to me than the flexibility does. Remote-first works too if that's how your team runs.",
  },
];

/** What sponsorship buys, with the receipt attached to each claim. */
const EVIDENCE = [
  {
    title: "Production LLM systems, not demos",
    detail:
      "Multi-agent pipelines with structured-output contracts between stages, RAG grounded in a real legal corpus, and human review where a wrong answer is expensive.",
    receipt: "FASL — live, lawyers inbound",
    href: "/work/fasl",
  },
  {
    title: "Products with customers, owned end-to-end",
    detail:
      "Generation, payments, rendering, fulfilment, analytics and the server it all runs on — built and operated by one person.",
    receipt: "Magical Hekaya — paying customers",
    href: "/work/magical-hekaya",
  },
  {
    title: "Ops that survive contact with real money",
    detail:
      "A storefront doing hundreds of cash-on-delivery orders across Morocco, self-hosted on Hetzner with Dokploy, plus the admin tooling the business runs on daily.",
    receipt: "Belmo — 629 orders in two months",
    href: "/work/belmo",
  },
  {
    title: "Organic growth as an engineering discipline",
    detail:
      "SEO treated as part of the build: schema, crawl paths, content architecture. 217K search impressions in 28 days on FASL with zero ad spend.",
    receipt: "Google Search Console",
    href: "/work/fasl",
  },
];

/** The permit routes, described as they actually work. */
const ROUTES = [
  {
    flag: "🇳🇱",
    title: "Netherlands — Highly Skilled Migrant",
    body: "Your company applies as an IND-recognised sponsor; the salary threshold is the main condition. Decisions are typically weeks, not months, and the permit covers the 30% ruling application separately.",
  },
  {
    flag: "🇩🇪",
    title: "Germany — EU Blue Card",
    body: "A recognised university degree plus a contract above the annual salary threshold. My M.Sc in Big Data & Artificial Intelligence is the degree side; the consulate appointment is usually the longest step.",
  },
  {
    flag: "⏳",
    title: "Before the move",
    body: "I can start as a remote contractor while the permit is processed, so onboarding, codebase context, and the first shipped feature all happen before the flight.",
  },
];

/** slug → world artwork (same map /hire uses; slugs and filenames differ). */
const WORLD_ART: Record<string, string> = {
  fasl: "/media/world-fasl.avif",
  "magical-hekaya": "/media/world-hekaya.avif",
  belmo: "/media/world-belmo.avif",
  laqta: "/media/world-laqta.avif",
  "reso-khdma": "/media/world-reso.avif",
  webtrade: "/media/world-webtrade.avif",
};

const STACK = [
  "TypeScript",
  "Next.js (App Router)",
  "React",
  "Node.js",
  "PostgreSQL · Prisma",
  "Claude & Gemini APIs",
  "Agents & tool calling",
  "RAG pipelines",
  "Docker",
  "Hetzner · Dokploy",
  "Vercel",
  "WebSockets",
];

export default function HireEuropePage() {
  const featured = caseStudies.slice(0, 3);
  const personId = `${SITE_URL}/#person`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        jobTitle: site.positioning,
        url: SITE_URL,
        email: `mailto:${site.email}`,
        knowsLanguage: ["ar", "fr", "en"],
        // The relocation intent, stated in the graph and not only in prose.
        seeks: {
          "@type": "Demand",
          name: "Full-time AI / full-stack engineering role with relocation to the Netherlands or Germany",
          availableAtOrFrom: [
            { "@type": "Country", name: "Netherlands" },
            { "@type": "Country", name: "Germany" },
          ],
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/hire/europe#page`,
        url: `${SITE_URL}/hire/europe`,
        name: "AI Engineer Open to Relocation — Netherlands & Germany",
        about: { "@id": personId },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/hire/europe#faq`,
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
            name: "Relocation to Europe",
            item: `${SITE_URL}/hire/europe`,
          },
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
              For hiring teams · Netherlands &amp; Germany
            </p>
          </Reveal>
          <Reveal>
            <h1
              className="font-display mt-5 max-w-5xl font-bold leading-[1.04]"
              style={{ fontSize: "var(--text-display)" }}
            >
              An AI engineer who has
              <br />
              already{" "}
              <em
                className="not-italic"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                }}
              >
                shipped
              </em>{" "}
              it — and is ready to move
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Six years building production software, four products of my own
              live with real users and real money. M.Sc in Big Data &amp;
              Artificial Intelligence. Open to relocating to the Netherlands or
              Germany, Blue Card and Highly Skilled Migrant eligible, and able
              to start remotely while the permit is processed.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent("Role in the Netherlands / Germany")}`}
                className="rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
              >
                Talk about a role →
              </a>
              <a
                href={site.links.resume}
                className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                Download the résumé (PDF)
              </a>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>
        </section>

        {/* ── The paperwork, plainly ───────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              The part recruiters ask first
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              The visa question, answered before you ask it
              <span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-3">
            {ROUTES.map((r) => (
              <RevealItem key={r.title}>
                <li className="h-full rounded-2xl border border-line bg-surface/60 p-7">
                  <p className="text-2xl" aria-hidden>
                    {r.flag}
                  </p>
                  <h3 className="font-display mt-3 text-lg font-bold leading-snug">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{r.body}</p>
                </li>
              </RevealItem>
            ))}
          </Reveal>
          <Reveal>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
              Thresholds and processing times change every year — treat the
              numbers your legal team quotes as the authority, not this page.
              What doesn&apos;t change: the degree requirement is met, and the
              English is fluent.
            </p>
          </Reveal>
        </section>

        {/* ── Evidence ─────────────────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              The receipts
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              What sponsorship actually buys you
              <span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal group as="ul" className="mt-10">
            {EVIDENCE.map((e, i) => (
              <RevealItem key={e.title}>
                <li className="group grid gap-3 border-t border-line py-8 sm:grid-cols-[3rem_1fr_1.2fr] sm:gap-8 lg:grid-cols-[4rem_1fr_1.2fr]">
                  <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-snug transition-colors group-hover:text-accent sm:text-2xl">
                      <Link href={e.href}>{e.title}</Link>
                    </h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                      {e.receipt}
                    </p>
                  </div>
                  <p className="leading-relaxed text-muted">{e.detail}</p>
                </li>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        {/* ── Stack ────────────────────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Day one
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              What I bring without ramp-up
              <span className="text-accent">.</span>
            </h2>
          </Reveal>
          <Reveal>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {STACK.map((tech) => (
                <li key={tech}>
                  <span className="inline-flex items-center rounded-full border border-line px-4 py-1.5 font-mono text-xs text-ink-soft">
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ── Case studies ─────────────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Read the work
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              Three systems, written up properly
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
                Asked by every recruiter
                <span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted">
                Hiring for a team rather than a project?{" "}
                <Link
                  href="/hire"
                  className="text-accent underline decoration-accent/40 underline-offset-4"
                >
                  The freelance page
                </Link>{" "}
                covers contract work instead.
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
                  Agadir today · Amsterdam or Berlin next
                </p>
                <h2
                  className="font-display mx-auto mt-4 max-w-3xl font-bold leading-[1.1]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  Send me the job
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
                    the code
                  </em>
                  .
                </h2>
                <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
                  Every system on this site is one I can walk you through line
                  by line. Start with an email — I answer all of them myself,
                  within 24 hours.
                </p>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Role in the Netherlands / Germany")}`}
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
