import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    // /mock pages exist only for screenshot capture — keep them out of the index
    rules: { userAgent: "*", allow: "/", disallow: "/mock/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
