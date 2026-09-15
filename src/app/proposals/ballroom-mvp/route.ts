import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "proposals",
    "ballroom-mvp.html"
  );
  const html = await fs.readFile(filePath, "utf-8");

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
