import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { caseStudies, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

/**
 * The shared body of a /hire landing page.
 *
 * /hire/small-business and /hire/full-stack-developer were written by hand
 * with the same seven sections. Every page after them is content only: this
 * component owns the layout and the JSON-LD (Service + FAQPage +
 * BreadcrumbList), the page file owns the words.
 */

export type HireOffer = { kicker: string; title: string; body: string; fit: string };
export type HireReceipt = { value: string; label: string; detail: string; slug: string };
export type HireStep = { step: string; body: string };
export type HireFaq = { q: string; a: string };

export type HireLandingContent = {
  /** Path of the page, e.g. "/hire/mvp". */
  path: string;
  /** Short name used in the breadcrumb. */
  breadcrumb: string;
  /** BCP 47 language of the page copy. */
  lang?: string;
  service: {
    name: string;
    description: string;
    serviceType: string;
    audience: string;
    catalogName: string;
  };
  hero: {
    eyebrow: string;
    title: ReactNode;
    lede: string;
    cta: string;
    mailSubject: string;
    secondary: { label: string; href: string };
  };
  offers: { title: string; intro: string; items: HireOffer[] };
  receipts: { title: string; items: HireReceipt[] };
  process: { title: string; items: HireStep[] };
  /** Slugs of case studies to show as cards; omit to drop the section. */
  caseStudies?: { title: string; slugs: string[] };
  faq: { title: string; aside: ReactNode; items: HireFaq[] };
  closing: { eyebrow: string; title: ReactNode; body: string };
  labels?: Partial<typeof DEFAULT_LABELS>;
};

const DEFAULT_LABELS = {
  home: "Home",
  hire: "Hire",
  work: "The work",
  receipts: "The receipts",
  process: "How it runs",
  step: "Step",
  caseStudies: "Written up properly",
  readCaseStudy: (name: string) => `Read the ${name} case study →`,
  readCard: "Read the case study →",
  questions: "The questions",
  email: (address: string) => `Email ${address} →`,
};

const WORLD_ART: Record<string, string> = {
  fasl: "/media/world-fasl.avif",
  "magical-hekaya": "/media/world-hekaya.avif",
  belmo: "/media/world-belmo.avif",
  laqta: "/media/world-laqta.avif",
  "reso-khdma": "/media/world-reso.avif",
  webtrade: "/media/world-webtrade.avif",
};

/** The italic accent word inside a headline. */
export function Accent({ children }: { children: ReactNode }) {
  return (
    <em
      className="not-italic"
      style={{
        fontFamily: "var(--font-fraunces)",
        fontStyle: "italic",
        fontWeight: 500,
        color: "var(--color-accent)",
      }}
    >
      {children}
    </em>
  );
}

/** An inline link in the page's accent colour, for FAQ asides. */
export function AsideLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-accent underline decoration-accent/40 underline-offset-4">
      {children}
    </Link>
  );
}

function SectionHead({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <Reveal>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{kicker}</p>
      <h2
        className="font-display mt-3 max-w-2xl font-bold leading-tight"
        style={{ fontSize: "var(--text-title)" }}
      >
        {title}
        <span className="text-accent">.</span>
      </h2>
      {intro ? <p className="mt-4 max-w-2xl leading-relaxed text-muted">{intro}</p> : null}
    </Reveal>
  );
}

export function HireLanding({ content }: { content: HireLandingContent }) {
  const c = content;
  const labels = { ...DEFAULT_LABELS, ...c.labels };
  const url = `${SITE_URL}${c.path}`;
  const personId = `${SITE_URL}/#person`;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(c.hero.mailSubject)}`;
  const featured = c.caseStudies
    ? c.caseStudies.slugs
        .map((slug) => caseStudies.find((p) => p.slug === slug))
        .filter((p) => p !== undefined)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: c.service.name,
        description: c.service.description,
        url,
        provider: { "@id": personId },
        areaServed: "Worldwide (remote)",
        audience: { "@type": "Audience", audienceType: c.service.audience },
        serviceType: c.service.serviceType,
        availableLanguage: ["English", "French", "Arabic"],
        ...(c.lang ? { inLanguage: c.lang } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: c.service.catalogName,
          itemListElement: c.offers.items.map((o) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: o.title, description: o.body },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        ...(c.lang ? { inLanguage: c.lang } : {}),
        mainEntity: c.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: labels.home, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: labels.hire, item: `${SITE_URL}/hire` },
          { "@type": "ListItem", position: 3, name: c.breadcrumb, item: url },
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
      <main className="min-h-screen pb-28 pt-32" lang={c.lang}>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="rail">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
              <span aria-hidden className="h-px w-10 bg-accent" />
              {c.hero.eyebrow}
            </p>
          </Reveal>
          <Reveal>
            <h1
              className="font-display mt-5 max-w-5xl font-bold leading-[1.04]"
              style={{ fontSize: "var(--text-display)" }}
            >
              {c.hero.title}
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">{c.hero.lede}</p>
          </Reveal>
          <Reveal>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href={mailto}
                className="rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
              >
                {c.hero.cta}
              </a>
              <Link
                href={c.hero.secondary.href}
                className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                {c.hero.secondary.label}
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── What you can buy ─────────────────────────────────── */}
        <section className="rail mt-24">
          <SectionHead kicker={labels.work} title={c.offers.title} intro={c.offers.intro} />
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-2">
            {c.offers.items.map((o) => (
              <RevealItem key={o.title}>
                <li className="h-full rounded-2xl border border-line bg-surface/60 p-7">
                  <p className="font-mono text-xs tracking-[0.2em] text-accent">{o.kicker}</p>
                  <h3 className="font-display mt-3 text-lg font-bold leading-snug">{o.title}</h3>
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
          <SectionHead kicker={labels.receipts} title={c.receipts.title} />
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-2">
            {c.receipts.items.map((r) => {
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
                    <p className="mt-3 font-display text-[15px] font-bold leading-snug">{r.label}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{r.detail}</p>
                    {project?.tier === "case-study" ? (
                      <Link
                        href={`/work/${r.slug}`}
                        className="mt-4 inline-block font-mono text-xs text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                      >
                        {labels.readCaseStudy(project.name)}
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
          <SectionHead kicker={labels.process} title={c.process.title} />
          <Reveal group as="ul" className="mt-10 grid gap-5 lg:grid-cols-4">
            {c.process.items.map((p, i) => (
              <RevealItem key={p.step}>
                <li className="h-full rounded-2xl border border-line bg-surface/60 p-7">
                  <p className="font-mono text-xs tracking-[0.2em] text-accent">
                    {labels.step} {i + 1}
                  </p>
                  <h3 className="font-display mt-3 text-lg font-bold leading-snug">{p.step}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
                </li>
              </RevealItem>
            ))}
          </Reveal>
        </section>

        {/* ── Case studies ─────────────────────────────────────── */}
        {c.caseStudies && featured.length > 0 ? (
          <section className="rail mt-24">
            <SectionHead kicker={labels.caseStudies} title={c.caseStudies.title} />
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
                        <p className="font-display mt-1.5 text-2xl font-bold text-white">{p.name}</p>
                        <p className="mt-3 text-[13px] leading-snug text-white/70">{p.tagline}</p>
                        <p className="mt-4 font-mono text-xs text-white/70 transition-colors group-hover:text-white">
                          {labels.readCard}
                        </p>
                      </div>
                    </Link>
                  </li>
                </RevealItem>
              ))}
            </Reveal>
          </section>
        ) : null}

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="rail mt-24">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[2fr_3fr]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {labels.questions}
              </p>
              <h2
                className="font-display mt-3 font-bold leading-tight"
                style={{ fontSize: "var(--text-title)" }}
              >
                {c.faq.title}
                <span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted">{c.faq.aside}</p>
            </Reveal>
            <Reveal>
              <div>
                {c.faq.items.map((f) => (
                  <details key={f.q} className="group border-t border-line py-5 first:border-t-0">
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
                  {c.closing.eyebrow}
                </p>
                <h2
                  className="font-display mx-auto mt-4 max-w-3xl font-bold leading-[1.1]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  {c.closing.title}
                </h2>
                <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{c.closing.body}</p>
                <a
                  href={mailto}
                  className="mt-8 inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
                >
                  {labels.email(site.email)}
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
