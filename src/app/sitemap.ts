import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/projects";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/hire`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/ai-visibility-checker`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...getAllPosts().map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
