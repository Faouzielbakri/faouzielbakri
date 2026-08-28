import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/site-url";
import { Checker } from "./Checker";

export const metadata: Metadata = {
  title: "Free AI Visibility Checker — Is Your Website Visible to ChatGPT?",
  description:
    "Check if ChatGPT, Claude, and Perplexity can actually read and recommend your website. Free instant audit: AI crawler access, llms.txt, structured data, metadata — with fixes.",
  keywords: [
    "ai visibility checker",
    "is my website visible to chatgpt",
    "llms.txt checker",
    "ai seo audit",
    "geo audit tool",
    "gptbot robots.txt",
    "ai search optimization",
  ],
  alternates: { canonical: "/tools/ai-visibility-checker" },
  openGraph: {
    type: "website",
    title: "AI Visibility Checker — can AI search engines see your site?",
    description:
      "Free instant audit: AI crawler access, llms.txt, structured data, metadata — graded, with fixes.",
    url: "/tools/ai-visibility-checker",
    images: [{ url: "/og/default.png" }],
  },
};

const FAQ = [
  {
    q: "What does the AI Visibility Checker test?",
    a: "Five things AI search engines depend on: whether AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended) are allowed in your robots.txt; whether you publish an llms.txt content map; whether your pages carry structured data (JSON-LD); the quality of your titles, descriptions, Open Graph and canonical tags; and whether a sitemap exists. You get a 0–100 score with a specific fix for every failed check.",
  },
  {
    q: "Why does AI visibility matter for my business?",
    a: "A growing share of buying research now happens inside ChatGPT, Perplexity, and Google's AI results instead of classic search. Those engines can only recommend businesses they can crawl, parse, and understand. If your robots.txt blocks GPTBot or your pages have no structured data, you're invisible exactly where your next customers are asking for recommendations.",
  },
  {
    q: "What is llms.txt?",
    a: "An emerging standard (llmstxt.org): a markdown file at /llms.txt that gives AI systems a curated map of your site — who you are, what you offer, and which pages matter. It costs nothing to add and ensures AI systems describe your business in your own words.",
  },
  {
    q: "Is this checker really free?",
    a: "Yes — the full audit and every fix suggestion, no signup required. If you'd like the fixes implemented for you, that's the kind of work I take on.",
  },
];

export default function AiVisibilityCheckerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/tools/ai-visibility-checker#app`,
        name: "AI Visibility Checker",
        applicationCategory: "SEOApplication" as const,
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          "Free instant audit of how visible a website is to AI search engines: crawler access, llms.txt, structured data, metadata, sitemap.",
        url: `${SITE_URL}/tools/ai-visibility-checker`,
        author: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/tools/ai-visibility-checker#faq`,
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
          { "@type": "ListItem", position: 2, name: "AI Visibility Checker", item: `${SITE_URL}/tools/ai-visibility-checker` },
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
      <main className="rail min-h-screen pb-28 pt-32">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Free tool · no signup
        </p>
        <h1
          className="font-display mt-3 max-w-4xl font-bold leading-[1.1]"
          style={{ fontSize: "var(--text-title)" }}
        >
          Is your website visible to ChatGPT
          <span className="text-accent">?</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Your next customers ask AI engines for recommendations — but AI can
          only recommend sites it can read. This checks the five things that
          decide whether ChatGPT, Claude, Perplexity, and Google AI can see
          you, and tells you exactly how to fix what&apos;s broken.
        </p>

        <Checker />

        {/* What gets checked */}
        <section className="mt-24 max-w-3xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            The five checks
          </h2>
          <ol className="mt-6 space-y-4">
            {[
              ["AI crawler access — 30 pts", "Do GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot & Google-Extended have permission to read your site — or does robots.txt turn them away at the door?"],
              ["llms.txt — 15 pts", "The emerging standard for telling AI systems what your site is about, in your own words."],
              ["Structured data — 25 pts", "JSON-LD is how machines learn who you are, what you sell, and why to trust you. No schema, no entity."],
              ["Metadata & social tags — 20 pts", "Titles, descriptions, Open Graph, canonical, H1 — the basics that both classic SEO and AI extraction depend on."],
              ["Sitemap — 10 pts", "The index that guarantees crawlers find every page you care about."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="font-mono text-sm font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="leading-relaxed">
                  <strong className="font-semibold">{t}</strong>
                  <span className="text-muted"> — {d}</span>
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">FAQ</h2>
          <div className="mt-4">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-t border-line py-5">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-display text-lg font-bold">
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

        <p className="mt-16 max-w-2xl text-sm leading-relaxed text-muted">
          Built by{" "}
          <Link href="/" className="text-accent underline decoration-accent/40 underline-offset-4">
            Faouzi El Bakri
          </Link>{" "}
          — the AI engineer behind{" "}
          <Link href="/work/fasl" className="text-accent underline decoration-accent/40 underline-offset-4">
            FASL
          </Link>{" "}
          (217K search impressions in 28 days, zero ad spend). This site
          scores an A+ on its own audit — that&apos;s the point.
        </p>
      </main>
      <Footer />
    </>
  );
}
