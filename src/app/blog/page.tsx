import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Notes from Production — AI Engineering Blog",
  description:
    "Field notes on LLM agents, RAG, and multi-agent pipelines from systems running in production — by Faouzi El Bakri, AI engineer in Agadir, Morocco.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Notes from Production · Faouzi El Bakri",
    description:
      "Field notes on LLM agents, RAG, and multi-agent pipelines from systems running in production.",
    url: "/blog",
    images: [{ url: "/og/default.png" }],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: "Notes from Production",
    description:
      "Field notes on LLM agents, RAG, and multi-agent pipelines from systems running in production.",
    url: `${SITE_URL}/blog`,
    author: { "@id": `${SITE_URL}/#person` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="rail min-h-screen pb-28 pt-32">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">The blog</p>
        <h1
          className="font-display mt-3 max-w-3xl font-bold leading-tight"
          style={{ fontSize: "var(--text-title)" }}
        >
          Notes from production<span className="text-accent">.</span>
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted">
          LLM agents, RAG, and multi-agent pipelines — written from systems with
          real users, not demos. Everything here is running somewhere on{" "}
          <Link href="/#work" className="text-accent underline decoration-accent/40 underline-offset-4">
            this site
          </Link>
          .
        </p>

        <ul className="mt-16 max-w-3xl space-y-0">
          {posts.map((post) => (
            <li key={post.slug} className="group border-t border-line">
              <Link href={`/blog/${post.slug}`} className="block py-9">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  <time dateTime={post.date}>{post.date}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h2
                  className="font-display mt-3 font-bold leading-snug transition-colors duration-300 group-hover:text-accent"
                  style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)" }}
                >
                  {post.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{post.description}</p>
                <span className="mt-4 inline-block font-mono text-xs text-accent">
                  Read it →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-20 max-w-3xl rounded-2xl border border-line bg-surface p-8">
          <p className="font-display text-lg font-bold">
            Building with LLM agents{site.name ? "" : ""}?
          </p>
          <p className="mt-2 leading-relaxed text-muted">
            I take on a small number of projects — AI-heavy, Arabic-first, or
            zero-to-launch products.{" "}
            <Link href="/#contact" className="text-accent underline decoration-accent/40 underline-offset-4">
              Tell me about yours
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
