import "server-only";

/**
 * AI Visibility Checker — server-side checks for how visible a site is to
 * AI search engines (ChatGPT, Claude, Perplexity, Google AI). No LLM calls:
 * plain HTTP fetches scored against the practices those engines reward.
 */

export type CheckStatus = "pass" | "warn" | "fail";

export type Check = {
  id: string;
  label: string;
  status: CheckStatus;
  points: number;
  max: number;
  detail: string;
  fix?: string;
};

export type VisibilityReport = {
  url: string;
  domain: string;
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  checks: Check[];
};

export const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
] as const;

/** Reject URLs that could reach private infrastructure (SSRF guard). */
export function validateTargetUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only http(s) URLs are supported.");
  }
  const host = url.hostname.toLowerCase();
  const privatePatterns = [
    /^localhost$/,
    /\.local$/,
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^169\.254\./,
    /^0\./,
    /^\[?::1\]?$/,
    /^\[?f[cd]/i, // IPv6 unique-local
  ];
  if (privatePatterns.some((p) => p.test(host))) {
    throw new Error("Private and local addresses can't be checked.");
  }
  return url;
}

type FetchResult = {
  ok: boolean;
  status: number;
  text: string;
  contentType: string;
};

async function fetchText(url: string): Promise<FetchResult> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8_000),
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AIVisibilityChecker/1.0; +https://faouzielbakri.com/tools/ai-visibility-checker)",
        Accept: "text/html,application/xhtml+xml,text/plain,*/*",
      },
    });
    // Cap read size — we only need the head-ish portion of any page.
    const raw = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      text: raw.slice(0, 600_000),
      contentType: res.headers.get("content-type") ?? "",
    };
  } catch {
    return { ok: false, status: 0, text: "", contentType: "" };
  }
}

/** Minimal robots.txt parser: user-agent sections → disallow/allow rules. */
function parseRobots(text: string) {
  const sections: { agents: string[]; disallow: string[]; allow: string[]; sitemaps: string[] }[] = [];
  let current: (typeof sections)[number] | null = null;
  let lastWasAgent = false;
  const sitemaps: string[] = [];

  for (const rawLine of text.split("\n")) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const i = line.indexOf(":");
    if (i === -1) continue;
    const field = line.slice(0, i).trim().toLowerCase();
    const value = line.slice(i + 1).trim();

    if (field === "sitemap") {
      sitemaps.push(value);
      continue;
    }
    if (field === "user-agent") {
      if (!lastWasAgent || !current) {
        current = { agents: [], disallow: [], allow: [], sitemaps: [] };
        sections.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (field === "disallow") current.disallow.push(value);
    if (field === "allow") current.allow.push(value);
  }
  return { sections, sitemaps };
}

function botIsBlocked(robots: ReturnType<typeof parseRobots>, bot: string): boolean {
  const lower = bot.toLowerCase();
  const specific = robots.sections.find((s) => s.agents.some((a) => a === lower));
  const fallback = robots.sections.find((s) => s.agents.includes("*"));
  const section = specific ?? fallback;
  if (!section) return false;
  // Blanket block, not overridden by a blanket allow.
  return section.disallow.some((d) => d === "/") && !section.allow.some((a) => a === "/");
}

export async function runVisibilityChecks(target: string): Promise<VisibilityReport> {
  const url = validateTargetUrl(target);
  const origin = url.origin;
  const checks: Check[] = [];

  const [home, robotsRes, llms, llmsFull, sitemapRes] = await Promise.all([
    fetchText(origin + "/"),
    fetchText(`${origin}/robots.txt`),
    fetchText(`${origin}/llms.txt`),
    fetchText(`${origin}/llms-full.txt`),
    fetchText(`${origin}/sitemap.xml`),
  ]);

  if (!home.ok) {
    throw new Error(
      home.status > 0
        ? `The site responded with HTTP ${home.status} — can't run the audit.`
        : "Couldn't reach that site. Is the domain live?",
    );
  }

  /* ── 1 · AI crawler access (30) ─────────────────────────────── */
  if (robotsRes.ok) {
    const robots = parseRobots(robotsRes.text);
    const blocked = AI_BOTS.filter((b) => botIsBlocked(robots, b));
    if (blocked.length === 0) {
      const explicit = AI_BOTS.filter((b) =>
        robots.sections.some((s) => s.agents.includes(b.toLowerCase())),
      );
      checks.push({
        id: "ai-access",
        label: "AI crawlers can read the site",
        status: "pass",
        points: 30,
        max: 30,
        detail:
          explicit.length > 0
            ? `All ${AI_BOTS.length} AI crawlers checked are allowed — ${explicit.length} of them explicitly welcomed (${explicit.join(", ")}).`
            : `robots.txt doesn't block any of the ${AI_BOTS.length} AI crawlers checked (GPTBot, ClaudeBot, PerplexityBot…).`,
      });
    } else {
      checks.push({
        id: "ai-access",
        label: "AI crawlers are blocked",
        status: blocked.length >= 4 ? "fail" : "warn",
        points: Math.round(30 * (1 - blocked.length / AI_BOTS.length)),
        max: 30,
        detail: `${blocked.length} of ${AI_BOTS.length} AI crawlers are blocked in robots.txt: ${blocked.join(", ")}. Those engines can't read — or recommend — this site.`,
        fix: "Remove the Disallow rules for AI user-agents (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended) so AI search engines can index and cite the site.",
      });
    }
  } else {
    checks.push({
      id: "ai-access",
      label: "No robots.txt found",
      status: "warn",
      points: 24,
      max: 30,
      detail:
        "Without robots.txt, crawlers are allowed by default — but you're missing the chance to declare your sitemap and explicitly welcome AI crawlers.",
      fix: "Add a robots.txt that allows AI user-agents and points to your sitemap.",
    });
  }

  /* ── 2 · llms.txt (15) ──────────────────────────────────────── */
  const llmsLooksReal =
    llms.ok && llms.text.trim().length > 40 && llms.text.trimStart().startsWith("#") && !/^<!doctype|^<html/i.test(llms.text.trim());
  if (llmsLooksReal) {
    checks.push({
      id: "llms-txt",
      label: "llms.txt present",
      status: "pass",
      points: 15,
      max: 15,
      detail: `Found a curated AI content map at /llms.txt${llmsFull.ok ? " — plus llms-full.txt for deep reading" : ""}. AI systems get a clean summary of what this site offers.`,
    });
  } else {
    checks.push({
      id: "llms-txt",
      label: "No llms.txt",
      status: "warn",
      points: 0,
      max: 15,
      detail:
        "No /llms.txt found. It's an emerging standard — a markdown map that tells AI systems what your site is about and what to read first.",
      fix: "Publish /llms.txt: an H1 with your name, a one-paragraph summary, and links to your key pages with one-line descriptions.",
    });
  }

  /* ── 3 · Structured data (25) ───────────────────────────────── */
  const jsonLdBlocks = [...home.text.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set<string>();
  for (const block of jsonLdBlocks) {
    for (const t of block[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g)) types.add(t[1]);
  }
  if (jsonLdBlocks.length > 0 && types.size > 0) {
    checks.push({
      id: "structured-data",
      label: "Structured data (JSON-LD) present",
      status: "pass",
      points: 25,
      max: 25,
      detail: `${jsonLdBlocks.length} JSON-LD block(s) declaring: ${[...types].slice(0, 8).join(", ")}. AI engines and Google can extract entities instead of guessing.`,
    });
  } else if (jsonLdBlocks.length > 0) {
    checks.push({
      id: "structured-data",
      label: "JSON-LD present but unreadable",
      status: "warn",
      points: 10,
      max: 25,
      detail: "Found JSON-LD script tags but couldn't extract any @type from them.",
      fix: "Validate your JSON-LD with Google's Rich Results Test — a malformed block is invisible to machines.",
    });
  } else {
    checks.push({
      id: "structured-data",
      label: "No structured data",
      status: "fail",
      points: 0,
      max: 25,
      detail:
        "No JSON-LD found on the homepage. AI engines have to guess who you are, what you sell, and whether to trust you.",
      fix: "Add JSON-LD (schema.org): Organization or Person, WebSite, and FAQPage/Service where relevant. This is the single biggest machine-readability upgrade.",
    });
  }

  /* ── 4 · Metadata & social (20) ─────────────────────────────── */
  const title = home.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const desc =
    home.text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ??
    home.text.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1] ??
    "";
  const hasOg = /<meta[^>]+property=["']og:(title|description|image)["']/i.test(home.text);
  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(home.text);
  const hasH1 = /<h1[\s>]/i.test(home.text);

  let metaPoints = 0;
  const metaMisses: string[] = [];
  if (title.length >= 10 && title.length <= 75) metaPoints += 5;
  else metaMisses.push(title ? `title is ${title.length} chars (aim for 10–75)` : "missing <title>");
  if (desc.length >= 50 && desc.length <= 170) metaPoints += 5;
  else metaMisses.push(desc ? `meta description is ${desc.length} chars (aim for 50–170)` : "missing meta description");
  if (hasOg) metaPoints += 5;
  else metaMisses.push("no Open Graph tags");
  if (hasCanonical) metaPoints += 3;
  else metaMisses.push("no canonical URL");
  if (hasH1) metaPoints += 2;
  else metaMisses.push("no <h1>");

  checks.push({
    id: "metadata",
    label:
      metaPoints === 20 ? "Titles, descriptions & social tags dialed in" : "Metadata gaps",
    status: metaPoints === 20 ? "pass" : metaPoints >= 12 ? "warn" : "fail",
    points: metaPoints,
    max: 20,
    detail:
      metaPoints === 20
        ? "Title, meta description, Open Graph, canonical, and H1 all present and well-sized."
        : `Issues found: ${metaMisses.join("; ")}.`,
    fix:
      metaPoints === 20
        ? undefined
        : "Every page needs a specific title (10–75 chars), a meta description (50–170), Open Graph tags, a canonical URL, and one clear H1.",
  });

  /* ── 5 · Sitemap (10) ───────────────────────────────────────── */
  const robotsDeclaresSitemap = robotsRes.ok && /sitemap:/i.test(robotsRes.text);
  const sitemapOk = sitemapRes.ok && /<(urlset|sitemapindex)/i.test(sitemapRes.text);
  if (sitemapOk) {
    checks.push({
      id: "sitemap",
      label: "Sitemap found",
      status: "pass",
      points: 10,
      max: 10,
      detail: `/sitemap.xml is live${robotsDeclaresSitemap ? " and declared in robots.txt" : ""}. Crawlers know every page you want indexed.`,
    });
  } else if (robotsDeclaresSitemap) {
    checks.push({
      id: "sitemap",
      label: "Sitemap declared but not at /sitemap.xml",
      status: "warn",
      points: 7,
      max: 10,
      detail: "robots.txt declares a sitemap, but /sitemap.xml itself didn't return valid XML.",
      fix: "Make sure the sitemap URL in robots.txt resolves to valid XML.",
    });
  } else {
    checks.push({
      id: "sitemap",
      label: "No sitemap",
      status: "fail",
      points: 0,
      max: 10,
      detail: "No /sitemap.xml and none declared in robots.txt — crawlers must discover pages by luck.",
      fix: "Generate a sitemap.xml and declare it in robots.txt.",
    });
  }

  const score = checks.reduce((s, c) => s + c.points, 0);
  const grade =
    score >= 95 ? "A+" : score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";

  return { url: origin, domain: url.hostname, score, grade, checks };
}
