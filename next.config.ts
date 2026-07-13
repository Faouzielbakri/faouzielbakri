import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimized images barely change — let browsers & Cloudflare hold them a month.
    minimumCacheTTL: 2_678_400,
  },
  async headers() {
    return [
      {
        // Media assets (hero film, world art, portraits). Not "immutable":
        // some files (hero-ambient.mp4) are replaced in place on redeploys.
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Project screenshots are recaptured in place too.
        source: "/projects/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/(llms\\.txt|llms-full\\.txt|resume\\.pdf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
