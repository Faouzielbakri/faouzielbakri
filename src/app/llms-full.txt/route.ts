import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

/** llms-full.txt — full blog bodies + case-study outcomes for AI systems. */
export function GET() {
  const posts = getAllPosts();

  const caseSections = caseStudies.map((p) => {
    const cs = p.caseStudy;
    return [
      `## Case study: ${p.name}`,
      "",
      `${p.tagline} (${SITE_URL}/work/${p.slug})`,
      "",
      ...(cs
        ? [
            `Problem: ${cs.problem}`,
            "",
            "Outcomes:",
            ...cs.outcome.map((o) => `- ${o}`),
          ]
        : []),
      "",
    ].join("\n");
  });

  const postSections = posts.map((p) =>
    [
      `## ${p.title}`,
      "",
      `By ${site.name} · ${p.date} · ${SITE_URL}/blog/${p.slug}`,
      "",
      p.body,
      "",
    ].join("\n"),
  );

  const out = [
    `# ${site.name} — full content for LLMs`,
    "",
    `> ${site.positioning} in Agadir, Morocco. ${site.summary}`,
    "",
    "# Blog posts",
    "",
    ...postSections,
    "# Case studies",
    "",
    ...caseSections,
  ].join("\n");

  return new Response(out, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
