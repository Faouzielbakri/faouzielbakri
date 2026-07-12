import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /mock pages exist only for screenshot capture — keep them out of the index
      { userAgent: "*", allow: "/", disallow: "/mock/" },
      // AI crawlers, explicitly welcome — being read (and cited) by AI search
      // engines is a distribution channel, same as Google.
      ...[
        "GPTBot",
        "OAI-SearchBot",
        "ChatGPT-User",
        "ClaudeBot",
        "Claude-User",
        "PerplexityBot",
        "Google-Extended",
        "Applebot-Extended",
      ].map((userAgent) => ({ userAgent, allow: "/", disallow: "/mock/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
