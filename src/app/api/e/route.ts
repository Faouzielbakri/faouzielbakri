import { createHash } from "node:crypto";
import { z } from "zod";
import { ADMIN_COOKIE, tokenIsValid } from "@/lib/admin-auth";
import { db } from "@/lib/db";

/**
 * Event intake for the site's own analytics.
 *
 * Cookieless: the visitor id is a hash of address + browser + date + a salt,
 * so it is stable for a day and cannot be reversed or joined across days. The
 * address itself is never stored. Bots and the signed-in owner are not counted.
 */
const EVENT_NAMES = [
  "pageview",
  "section",
  "scroll",
  "cta",
  "lead",
  "hero_next",
  "hero_play",
  "outbound",
] as const;

const Body = z.object({
  name: z.enum(EVENT_NAMES),
  path: z.string().min(1).max(200),
  hero: z.string().max(20).optional(),
  source: z.string().max(120).optional(),
  props: z.record(z.string().max(40), z.union([z.string().max(200), z.number(), z.boolean()])).optional(),
});

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|scrapy|httpclient/i;

function deviceOf(agent: string) {
  if (/ipad|tablet/i.test(agent)) return "tablet";
  if (/mobi|iphone|android/i.test(agent)) return "mobile";
  return "desktop";
}

export async function POST(request: Request) {
  const done = new Response(null, { status: 204 });
  const prisma = db();
  if (!prisma) return done;

  const agent = request.headers.get("user-agent") ?? "";
  if (!agent || BOT.test(agent)) return done;

  const cookie = request.headers.get("cookie") ?? "";
  const session = cookie.match(new RegExp(`${ADMIN_COOKIE}=([a-f0-9]+)`))?.[1];
  if (tokenIsValid(session)) return done;

  let parsed;
  try {
    // sendBeacon posts text/plain, so the body is parsed by hand.
    parsed = Body.safeParse(JSON.parse((await request.text()).slice(0, 4000)));
  } catch {
    return done;
  }
  if (!parsed.success) return done;
  const event = parsed.data;

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "";
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ANALYTICS_SALT ?? process.env.ADMIN_PASSWORD ?? "feb";
  const visitor = createHash("sha256").update(`${ip}|${agent}|${day}|${salt}`).digest("hex").slice(0, 16);

  try {
    await prisma.event.create({
      data: {
        name: event.name,
        path: event.path,
        hero: event.hero,
        visitor,
        source: event.source,
        country: request.headers.get("cf-ipcountry") ?? undefined,
        device: deviceOf(agent),
        props: event.props,
      },
    });
  } catch (error) {
    console.error("[analytics] could not store event:", error);
  }
  return done;
}
