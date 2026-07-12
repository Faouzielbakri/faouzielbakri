import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/projects";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
