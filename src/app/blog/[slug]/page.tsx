import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { extractHeadings, Markdown } from "@/lib/markdown";
import { getAllPosts, getPost } from "@/lib/blog";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} · ${site.name}`,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [site.name],
      images: [{ url: "/og/default.png" }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = post.related
    .map((s) => getProject(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const headings = extractHeadings(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${post.slug}#post`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        url: `${SITE_URL}/blog/${post.slug}`,
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        keywords: post.keywords.join(", "),
        isPartOf: { "@id": `${SITE_URL}/blog#blog` },
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
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
        <article className="rail">
          <header className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <Link href="/blog" className="hover:text-ink">The blog</Link>
            </p>
            <h1
              className="font-display mt-4 font-bold leading-[1.15]"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
            >
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              <span className="text-ink">{site.name}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{post.date}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </header>

          <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,48rem)_1fr] lg:gap-14">
            <div className="max-w-3xl text-[16.5px]">
              <Markdown source={post.body} />
            </div>

            {/* Fahras — sticky table of contents, desktop only */}
            {headings.length > 1 && (
              <nav
                aria-label="Table of contents"
                className="hidden lg:block"
              >
                <div className="sticky top-28 border-l border-line pl-6">
                  <p className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                    <span aria-hidden className="font-display text-sm normal-case tracking-normal text-accent">
                      فهرس
                    </span>
                    Contents
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="block text-[13px] leading-snug text-muted transition-colors hover:text-accent"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            )}
          </div>

          {/* The receipts — the production systems the post draws on */}
          {related.length > 0 && (
            <aside className="mt-16 max-w-3xl border-t border-line pt-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                The systems behind this post
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/work/${project.slug}`}
                      className="group block rounded-xl border border-line p-5 transition-colors hover:border-ink/30"
                    >
                      <span
                        className="font-display text-lg font-bold transition-colors group-hover:text-[var(--acc)]"
                        style={{ "--acc": project.accent } as React.CSSProperties}
                      >
                        {project.name}
                      </span>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {project.tagline}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {others.length > 0 && (
            <aside className="mt-12 max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Keep reading
              </p>
              <ul className="mt-4 space-y-3">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
