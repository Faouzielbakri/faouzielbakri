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
 * The small-business page.
 *
 * /hire sells project work to people who already know they want an AI build.
 * /hire/europe answers a recruiter. This one answers the owner of a real
 * business who has heard "you should use AI" fifty times and has never been
 * told which one thing to do first — "ai consultant for small business" is a
 * 480/mo search at difficulty 1 that nothing on this site was answering.
 */

export const metadata: Metadata = {
  title: "AI Consultant for Small Business — One Thing That Pays for Itself",
  description:
    "Freelance AI consultant and developer for small businesses: one automation that saves real hours, built and shipped in weeks, not a transformation roadmap. Fixed scope, fixed price, live systems with receipts.",
  keywords: [
    "ai consultant for small business",
    "ai consultant",
    "small business ai automation",
    "hire ai agent developer",
    "hire generative ai developer",
    "ai developer for hire",
    "freelance ai developer",
    "ai automation consultant",
    "chatbot developer for small business",
    "how to use ai for my business",
  ],
  alternates: { canonical: "/hire/small-business" },
  openGraph: {
    type: "website",
    title: "AI Consultant for Small Business — One Thing That Pays for Itself",
    description:
      "Not a strategy deck. One automation that saves real hours, built and shipped in weeks — by the engineer who writes the code.",
    url: "/hire/small-business",
    images: [{ url: "/og/default.png" }],
  },
};

/** What a small business can actually buy — scoped small enough to finish. */
const OFFERS = [
  {
    kicker: "01",
    title: "The assistant that answers for you",
    body: "A bot on WhatsApp, your site, or both — trained on your catalogue, prices, and policies, not on the open internet. It answers the same forty questions your team retypes every day, hands over to a human the moment it should, and logs every conversation you'd otherwise never see.",
    fit: "Best if you lose evenings to the same customer questions.",
  },
  {
    kicker: "02",
    title: "The paperwork that fills itself",
    body: "Quotes, invoices, contracts, reports, product descriptions — generated from your own templates and your own data, with a human approving before anything goes out. The model drafts; you stay the one who signs.",
    fit: "Best if someone bills hours for copy-paste.",
  },
  {
    kicker: "03",
    title: "Search that understands the question",
    body: "Retrieval over your documents, catalogue, or archive so staff and customers find the right answer by meaning instead of exact keywords — with citations back to the source document, so nobody has to trust it blindly.",
    fit: "Best if the answer exists but nobody can find it.",
  },
  {
    kicker: "04",
    title: "The store or platform underneath it",
    body: "Sometimes the AI is not the problem — the business needs the product first. Storefront, payments, cash on delivery, admin, deployment. I build the whole thing, then add the AI where it actually earns its place.",
    fit: "Best if you're starting from nothing.",
  },
];

/** Every claim on this page has a live system behind it. */
const RECEIPTS = [
  {
    value: "818 / 629",
    label: "Registered clients and orders in the first two months",
    detail:
      "Belmo — a K-beauty store built from an empty repo: storefront, cash on delivery, 24–48h fulfilment across Morocco, self-hosted to keep the running cost low.",
    slug: "belmo",
  },
  {
    value: "~500",
    label: "Students enrolled on a live e-learning platform",
    detail:
      "Magic Hands LMS — courses, video lessons, quizzes, instructor dashboard, and Stripe/PayPal enrolment for a training academy that was running on spreadsheets.",
    slug: "magic-hands-lms",
  },
  {
    value: "~500",
    label: "Suppliers onboarded to a B2B marketplace",
    detail:
      "Maroc Fournisseurs — sub-second search across the catalogue and real-time negotiation chat between buyers and providers.",
    slug: "maroc-fournisseurs",
  },
  {
    value: "Darija",
    label: "A WhatsApp agent that talks like your customers do",
    detail:
      "RESO Khdma — an AI agent matching workers to jobs entirely inside WhatsApp, in the dialect people actually type, because that's where the users already were.",
    slug: "reso-khdma",
  },
];

/** How the engagement runs, start to finish. */
const PROCESS = [
  {
    step: "A call, free",
    body: "Thirty minutes. You describe where the hours go; I tell you which part is worth automating and — often — which part isn't. If nothing here fits, I say so and you've lost half an hour.",
  },
  {
    step: "A fixed scope",
    body: "One page: what gets built, what it will and won't do, what I need from you, when it lands, and what it costs. One number, agreed before any code is written. No hourly meter running in the background.",
  },
  {
    step: "The build",
    body: "Weeks, not quarters. You see it working while it's being built, not at the end — so if it's going the wrong way, we find out in week one instead of month three.",
  },
  {
    step: "Handover that holds",
    body: "It ships to your hosting or mine, with the documentation to run it and the option to keep me on call. You own the code either way. Nothing is locked to a platform you have to keep renting from me.",
  },
];

/** The questions owners actually ask before booking a call. */
const FAQ = [
  {
    q: "My business is small. Is AI even worth it for me?",
    a: "Often it isn't, and I'll tell you that on the call. AI is worth it when the same task is repeated many times a week and the cost of getting it slightly wrong is low — customer questions, drafting, sorting, searching. It's a bad idea when the task is rare, or when a wrong answer is expensive and nobody will check the output. Small doesn't disqualify you; the shape of the work does.",
  },
  {
    q: "What does it cost?",
    a: "It depends entirely on scope, so any number I put on a web page would be a lie. What I can commit to is the shape: fixed price agreed in writing before the build starts, quoted after a free call, not an open-ended hourly arrangement. If the honest answer is that your idea costs more than it will return, that's part of what the call is for.",
  },
  {
    q: "Do I need my data organised first?",
    a: "No — that's usually part of the job. Most small businesses arrive with the knowledge spread across a WhatsApp history, a few spreadsheets, a website, and one person's head. Getting that into a shape a model can use is normal work, and I've done it for a legal corpus, a supplier catalogue, and a job board.",
  },
  {
    q: "Will it invent things and embarrass me?",
    a: "That's the real risk, and it's an engineering problem, not a prompt problem. I ground answers in your documents and show the source, keep a human approving anything that goes out under your name, and design the system to say 'I don't know, here's a human' rather than guess. On FASL — legal drafting, where a wrong answer is expensive — that structure is the entire product.",
  },
  {
    q: "Who actually does the work?",
    a: "I do. There's no agency, no account manager, no junior the work is quietly passed to. You talk to the person writing the code, which is why the scope is honest — I'm the one who has to build what I promised.",
  },
  {
    q: "Where are you, and does that matter?",
    a: "Agadir, Morocco, working remotely with clients worldwide. Practically: I overlap the full European working day, most of the American morning, and I work in English, French, Arabic, and Darija. Every project on this site was delivered remotely.",
  },
  {
    q: "What if I need a website or app before any AI?",
    a: "Then that's what we build. Belmo, Magic Hands LMS, and Maroc Fournisseurs were product builds first — the interesting technology only matters if there's a working business under it. I'd rather build you the thing that makes money than the thing that sounds modern.",
  },
  {
    q: "What happens after it's delivered?",
    a: "You own the code and it runs on infrastructure you control. I can stay on for maintenance and iteration if you want it, but it's an option you choose monthly, not a dependency I build in on purpose.",
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

export default function HireSmallBusinessPage() {
  const featured = caseStudies.filter((p) =>
    ["belmo", "reso-khdma", "magical-hekaya"].includes(p.slug),
  );
  const personId = `${SITE_URL}/#person`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/hire/small-business#service`,
        name: "AI Consulting & Development for Small Business",
        description:
          "Freelance AI consultant and developer for small businesses: customer-facing assistants, document generation, retrieval over company data, and the products underneath them — fixed scope, fixed price.",
        url: `${SITE_URL}/hire/small-business`,
        provider: { "@id": personId },
        areaServed: "Worldwide (remote)",
        audience: { "@type": "Audience", audienceType: "Small and medium businesses" },
        serviceType: "AI consulting",
        availableLanguage: ["English", "French", "Arabic"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Small-business AI engagements",
          itemListElement: OFFERS.map((o) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: o.title, description: o.body },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/hire/small-business#faq`,
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
            name: "For small business",
            item: `${SITE_URL}/hire/small-business`,
          },
        ],
      },
    ],
  };

  const mailSubject = encodeURIComponent("AI for my business — first call");

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
              AI consultant · for small business
            </p>
          </Reveal>
          <Reveal>
            <h1
              className="font-display mt-5 max-w-5xl font-bold leading-[1.04]"
              style={{ fontSize: "var(--text-display)" }}
            >
              You don&apos;t need an AI strategy.
              <br />
              You need{" "}
              <em
                className="not-italic"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                }}
              >
                one thing
              </em>{" "}
              that works
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Most small businesses are sold a roadmap and a slide deck. What
              actually moves the number is one automation that removes a job
              somebody does by hand every single day — built properly, shipped
              in weeks, and handed over so you own it. I&apos;m the engineer who
              writes it, not the consultant who bills for the meeting about it.
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
                Bigger build? The freelance page
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── What you can buy ─────────────────────────────────── */}
        <section className="rail mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              The work
            </p>
            <h2
              className="font-display mt-3 max-w-2xl font-bold leading-tight"
              style={{ fontSize: "var(--text-title)" }}
            >
              Four things small enough to finish
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              Each one is scoped to ship on its own. Start with whichever
              removes the most hours from your week — the rest can wait until
              the first one has paid for itself.
            </p>
          </Reveal>
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-2">
            {OFFERS.map((o) => (
              <RevealItem key={o.title}>
                <li className="h-full rounded-2xl border border-line bg-surface/60 p-7">
                  <p className="font-mono text-xs tracking-[0.2em] text-accent">
                    {o.kicker}
                  </p>
                  <h3 className="font-display mt-3 text-lg font-bold leading-snug">
                    {o.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{o.body}</p>
                  <p className="mt-4 border-t border-line pt-4 font-mono text-xs leading-relaxed text-ink-soft">
                    {o.fit}
                  </p>
                </li>
              </RevealItem>
            ))}
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
              Small businesses, live systems, real numbers
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
              No retainer, no discovery phase, no surprise invoice
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
              Three builds, from empty repo to paying customers
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
                Asked before every first call
                <span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted">
                Still deciding whether to build anything at all?{" "}
                <Link
                  href="/blog/how-to-build-an-mvp"
                  className="text-accent underline decoration-accent/40 underline-offset-4"
                >
                  How to build an MVP that ships
                </Link>{" "}
                walks through scoping a first version honestly.
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
                  Free call · no deck, no pitch
                </p>
                <h2
                  className="font-display mx-auto mt-4 max-w-3xl font-bold leading-[1.1]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  Tell me where the
                  <br />
                  hours{" "}
                  <em
                    className="not-italic"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      fontStyle: "italic",
                      fontWeight: 500,
                      color: "var(--color-accent)",
                    }}
                  >
                    go
                  </em>
                  .
                </h2>
                <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
                  Thirty minutes, no charge, and an honest answer at the end —
                  including &ldquo;don&apos;t build this.&rdquo; I read and
                  answer every email myself, within 24 hours.
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
