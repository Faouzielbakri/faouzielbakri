import { caseStudies, cards } from "@/content/projects";
import { site } from "@/content/site";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

/**
 * llms.txt — a curated markdown map of the site for AI systems
 * (spec: llmstxt.org). Generated from the same content data as the pages,
 * so it can never drift from what the site actually says.
 */
export function GET() {
  const posts = getAllPosts();

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.positioning} in Agadir, Morocco. ${site.summary}`,
    "",
    `Contact: ${site.email} · GitHub: ${site.links.github} · LinkedIn: ${site.links.linkedin}`,
    "",
    "Key facts: 6+ years shipping production software; 16 products live in production (four his own);",
    "FASL reached 58.4K organic search impressions in 28 days (95.3K over 3 months, avg position 6.2);",
    "teaches computer science for Morocco's Ministry of National Education (2,000+ students since 2021).",
    "",
    "## Case studies",
    "",
    ...caseStudies.map(
      (p) => `- [${p.name}](${SITE_URL}/work/${p.slug}): ${p.tagline}`,
    ),
    "",
    "## Blog — notes from production",
    "",
    ...posts.map(
      (p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`,
    ),
    "",
    "## Other shipped projects",
    "",
    ...cards.map((p) => `- ${p.name}: ${p.tagline}`),
    "",
    "## Optional",
    "",
    `- [Full content for LLMs](${SITE_URL}/llms-full.txt): every blog post in full, plus case-study outcomes`,
    `- [Resume (PDF)](${SITE_URL}/resume.pdf)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
