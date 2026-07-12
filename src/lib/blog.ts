import "server-only";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

/**
 * File-based blog: one markdown file per post in content/blog/, frontmatter
 * delimited by `---` lines. Kept dependency-free on purpose — the renderer in
 * lib/markdown.tsx covers the subset of markdown the posts use.
 */

const FrontmatterSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  keywords: z.string(),
  related: z.string().optional(),
});

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  /** Slugs of related case studies (projects.ts) */
  related: string[];
  readingMinutes: number;
  body: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function parsePost(slug: string, raw: string): BlogPost {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`blog post ${slug}: missing frontmatter`);

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const value = line.slice(i + 1).trim();
    meta[line.slice(0, i).trim()] = value.replace(/^"(.*)"$/, "$1");
  }
  const fm = FrontmatterSchema.parse(meta);
  const body = match[2].trim();

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    keywords: fm.keywords.split(",").map((k) => k.trim()),
    related: fm.related ? fm.related.split(",").map((s) => s.trim()) : [],
    readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    body,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) =>
      parsePost(f.replace(/\.md$/, ""), fs.readFileSync(path.join(BLOG_DIR, f), "utf-8")),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): BlogPost | undefined {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  return parsePost(slug, fs.readFileSync(file, "utf-8"));
}
