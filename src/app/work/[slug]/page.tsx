import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { caseStudies, getProject } from "@/content/projects";
import { mediaOrUndefined, withExistingMedia } from "@/lib/media";
import { SITE_URL } from "@/lib/site-url";
import type { StoryProps } from "@/components/case-study/stories/shared";
import { FaslStory } from "@/components/case-study/stories/FaslStory";
import { HekayaStory } from "@/components/case-study/stories/HekayaStory";
import { ResoStory } from "@/components/case-study/stories/ResoStory";
import { WebTradeStory } from "@/components/case-study/stories/WebTradeStory";
import { BelmoStory } from "@/components/case-study/stories/BelmoStory";
import { LaktaStory } from "@/components/case-study/stories/LaktaStory";
import { DefaultStory } from "@/components/case-study/stories/DefaultStory";

/** Each featured project tells its story in its own format. */
const STORIES: Record<string, React.FC<StoryProps>> = {
  fasl: FaslStory,
  "magical-hekaya": HekayaStory,
  "reso-khdma": ResoStory,
  webtrade: WebTradeStory,
  belmo: BelmoStory,
  lakta: LaktaStory,
};

/** Dark-world pages need the light nav treatment until scroll. */
const DARK_STORIES = new Set(["fasl", "magical-hekaya", "reso-khdma", "webtrade", "lakta"]);

/**
 * Hand-tuned search metadata per case study — titles lead with what the
 * project is (the searched phrase), descriptions pair problem with outcome.
 */
const SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  fasl: {
    title: "FASL — Multi-Agent AI for Moroccan Legal Appeals (Case Study)",
    description:
      "How FASL drafts Moroccan appeal memos end-to-end with a multi-agent pipeline and RAG over legal codes — Arabic-first, human-in-the-loop, 58.4K search impressions in 28 days.",
    keywords: ["legal AI Morocco", "multi-agent pipeline", "RAG legal codes", "Arabic legal tech", "AI appeal drafting"],
  },
  "magical-hekaya": {
    title: "Magical Hekaya — AI-Personalized Kids' Storybooks (Case Study)",
    description:
      "Building a consumer AI product where kids star in their own printed storybooks: photo-based character consistency, agent contracts for narrative state, narration, video, and print-on-demand — with real paying customers.",
    keywords: ["AI storybooks", "personalized children books", "character consistency", "Gemini", "print on demand"],
  },
  "reso-khdma": {
    title: "RESO Khdma — WhatsApp AI Job-Matching in Darija (Case Study)",
    description:
      "A conversational agent living entirely in WhatsApp that matches Moroccan workers to jobs — Gemini embeddings, semantic search across Arabic, Darija, and French, plus a recruiter dashboard.",
    keywords: ["WhatsApp AI agent", "job matching Morocco", "Darija NLP", "semantic search", "Gemini embeddings"],
  },
  webtrade: {
    title: "WebTrade — Real-Time Trading Platform UI (Case Study)",
    description:
      "Sub-100ms candlestick charts over WebSockets and race-condition-safe transactions with real user money — how WebTrade treats concurrency as a product feature.",
    keywords: ["real-time trading UI", "WebSockets", "candlestick charts", "race conditions", "funds locking"],
  },
  belmo: {
    title: "Belmo — Arabic-First K-Beauty E-Commerce for Morocco (Case Study)",
    description:
      "A full RTL storefront tuned for how Moroccans buy — cash on delivery, 24–48h delivery — with admin merchandising and a self-hosted Hetzner stack, live at belmo.ma.",
    keywords: ["e-commerce Morocco", "RTL storefront", "cash on delivery", "K-beauty", "self-hosted Next.js"],
  },
  lakta: {
    title: "Lakta — AI-Generated Darija Video Ads (Case Study)",
    description:
      "Feed Lakta a brand kit and it renders finished Darija video ads and Instagram carousels — Gemini scripts, FFmpeg-in-WASM rendering, Inngest pipelines, end to end.",
    keywords: ["AI video ads", "Darija content", "FFmpeg wasm", "Gemini", "Inngest pipelines"],
  },
};

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const seo = SEO[slug];
  const title = seo?.title ?? `${project.name} — Case Study`;
  const description = seo?.description ?? project.tagline;
  const ogImage = project.screenshots.desktop[0] ?? "/og/default.png";
  return {
    title,
    description,
    keywords: seo ? [...seo.keywords, ...project.stack] : project.stack,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${title} · Faouzi El Bakri`,
      description,
      url: `/work/${project.slug}`,
      images: [{ url: ogImage, alt: project.alt }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const raw = getProject(slug);
  if (!raw || raw.tier !== "case-study" || !raw.caseStudy) notFound();
  const project = withExistingMedia(raw);

  const siblings = caseStudies;
  const index = siblings.findIndex((p) => p.slug === project.slug);
  const prev = siblings[(index - 1 + siblings.length) % siblings.length];
  const next = siblings[(index + 1) % siblings.length];

  // Optional generated hero art ("screenshot popping off the paper") — the
  // story falls back to the framed capture until the render lands on disk.
  const art = mediaOrUndefined(`/media/case-${project.slug}.avif`);

  // Lakta's ad videos, straight from its own pipeline.
  const videos =
    project.slug === "lakta"
      ? [1, 2, 3]
          .map((n) => ({
            src: `/projects/lakta/ad-${n}.mp4`,
            poster: mediaOrUndefined(`/projects/lakta/ad-${n}-poster.avif`),
          }))
          .filter((v) => mediaOrUndefined(v.src))
      : undefined;

  const Story = STORIES[project.slug] ?? DefaultStory;
  const seo = SEO[project.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#work` },
          {
            "@type": "ListItem",
            position: 3,
            name: project.name,
            item: `${SITE_URL}/work/${project.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: seo?.title ?? `${project.name} — Case Study`,
        description: seo?.description ?? project.tagline,
        url: `${SITE_URL}/work/${project.slug}`,
        image: project.screenshots.desktop[0]
          ? `${SITE_URL}${project.screenshots.desktop[0]}`
          : `${SITE_URL}/og/default.png`,
        keywords: [...(seo?.keywords ?? []), ...project.stack].join(", "),
        author: {
          "@type": "Person",
          name: "Faouzi El Bakri",
          url: SITE_URL,
        },
        about: {
          "@type": "SoftwareApplication",
          name: project.name,
          ...(project.url ? { url: project.url } : {}),
          applicationCategory: "WebApplication",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav tone={DARK_STORIES.has(project.slug) ? "dark" : "light"} />
      <main className="flex-1">
        <Story
          project={project}
          prev={{ slug: prev.slug, name: prev.name }}
          next={{ slug: next.slug, name: next.name }}
          art={art}
          extras={videos ? { videos } : undefined}
        />
      </main>
      <Footer />
    </>
  );
}
