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
    "FASL reached 217K organic search impressions in 28 days (473K over 3 months, avg position 5.7);",
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
    "## Hire",
    "",
    `- [Hire an AI developer](${SITE_URL}/hire): freelance AI development & consulting — LLM agents, RAG, full-stack products, Arabic-first builds. Remote, worldwide.`,
    `- [Hire a full-stack developer](${SITE_URL}/hire/full-stack-developer): contract React, Next.js, TypeScript, Node and PostgreSQL work — one engineer from architecture through deployment. Fixed scope, remote, worldwide.`,
    `- [AI consultant for small business](${SITE_URL}/hire/small-business): one AI automation scoped small enough to ship — customer-facing assistants, document generation, retrieval over company data — fixed price after a free call.`,
    `- [AI automation services](${SITE_URL}/hire/ai-automation): workflow automation, AI integration into existing tools, and custom AI solutions — built by one engineer instead of an agency, fixed scope and price.`,
    `- [AI agents for business](${SITE_URL}/hire/ai-agents): custom AI agent development — customer-facing agents on WhatsApp and web, internal agents over company data, multi-agent pipelines — with agents already live in production.`,
    `- [MVP development services](${SITE_URL}/hire/mvp): a first version scoped, built and launched by one engineer — web app or SaaS, payments, deployment, AI where it helps.`,
    `- [Consultant IA (français)](${SITE_URL}/fr/consultant-ia): consultant IA freelance pour entreprises francophones — automatisation IA, agents IA sur mesure, chatbots WhatsApp et web, workflows n8n.`,
    `- [Open to relocation — Netherlands & Germany](${SITE_URL}/hire/europe): available for full-time AI / full-stack engineering roles in the EU. M.Sc in Big Data & AI (EU Blue Card and Dutch Highly Skilled Migrant eligible), fluent English and French, native Arabic and Darija, CET working hours, can start remotely while a permit is processed.`,
    "",
    "## Free tools",
    "",
    `- [AI Visibility Checker](${SITE_URL}/tools/ai-visibility-checker): free instant audit — can ChatGPT, Claude, and Perplexity read and recommend your website? Checks AI crawler access, llms.txt, structured data, metadata, and sitemap.`,
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
