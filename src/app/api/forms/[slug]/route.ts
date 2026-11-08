import { after } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { findForm } from "@/content/forms";
import { site } from "@/content/site";
import { db } from "@/lib/db";
import { browserOf, deviceOf, osOf } from "@/lib/user-agent";

/**
 * Intake for /forms/<slug> (the bridge script in src/lib/form-html.ts posts
 * here): autosaved drafts while the client types, and the real send.
 *
 * Answers arrive from the public internet, so they are stored as plain data
 * and only rendered as text. Values that are too long are cut, not refused:
 * a client's whole form should never bounce because one answer ran long. The
 * owner gets an email per send (never per draft), after the reply has gone.
 */

const MAX_TEXT = 20_000;
const cut = (text: string, max: number) => (text.length > max ? `${text.slice(0, max)}…` : text);

const Value = z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.unknown())]).catch("");

const Body = z.object({
  respondent: z.string().regex(/^[A-Za-z0-9]{8,64}$/),
  kind: z.enum(["draft", "sent"]).catch("sent"),
  answers: z.union([
    z.record(z.string(), Value),
    z.array(z.object({ q: z.string(), a: Value })),
  ]),
  summary: z.string().optional().catch(undefined),
});

type Answer = { q: string; a: string | string[] };

function text(value: unknown): string | string[] {
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => cut(String(item ?? ""), 1_000));
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === null || value === undefined) return "";
  return cut(String(value), MAX_TEXT);
}

function normalise(answers: z.infer<typeof Body>["answers"]): Answer[] {
  // JSON.parse keeps an object's key order, which is the order of the form.
  const pairs = Array.isArray(answers) ? answers.map(({ q, a }) => [q, a] as const) : Object.entries(answers);
  const seen = new Set<string>();
  return pairs.slice(0, 300).map(([rawQ, a]) => {
    const base = cut(String(rawQ).trim() || "Untitled", 290);
    let q = base;
    // Two questions with one name stay two answers.
    for (let n = 2; seen.has(q); n++) q = `${base} (${n})`;
    seen.add(q);
    return { q, a: text(a) };
  });
}

/* ── Abuse limits (one container, so memory is enough) ──────────────────── */

const hits = new Map<string, number[]>();
/** True when `key` has been seen `max` times in the last hour. Records the hit otherwise. */
function limited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < 3_600_000);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) {
    for (const [k, list] of hits) if (!list.some((at) => now - at < 3_600_000)) hits.delete(k);
  }
  return false;
}

/* ── Owner notification ─────────────────────────────────────────────────── */

async function notify(title: string, slug: string, answers: Answer[], sends: number) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const filled = answers.filter(({ a }) => (Array.isArray(a) ? a.length : a.trim()));
  const again = sends > 1;
  const text = [
    `${again ? `Sent again (${sends} times now)` : "New answers"}: "${title}".`,
    `${filled.length} of ${answers.length} questions answered.`,
    "",
    ...filled.map(({ q, a }) => `${q}: ${Array.isArray(a) ? a.join(", ") : a}`),
    "",
    `Dashboard: https://faouzielbakri.com/admin?view=forms#${slug}`,
  ].join("\n");
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: site.email,
      subject: `${again ? "Updated" : "New"} form answers: ${title}`,
      text,
    });
    if (error) console.error("[forms] notification refused:", error);
  } catch (error) {
    console.error("[forms] could not send the notification:", error);
  }
}

/* ── Intake ─────────────────────────────────────────────────────────────── */

export async function POST(request: Request, ctx: RouteContext<"/api/forms/[slug]">) {
  const { slug } = await ctx.params;
  const form = findForm(slug);
  if (!form) return Response.json({ ok: false }, { status: 404 });

  const prisma = db();
  if (!prisma) return Response.json({ ok: false, error: "No database" }, { status: 503 });

  const raw = await request.text();
  if (raw.length > 1_000_000) return Response.json({ ok: false, error: "Too large" }, { status: 413 });
  let parsed;
  try {
    // Drafts sent on page close come from sendBeacon as text/plain, so parse by hand.
    parsed = Body.safeParse(JSON.parse(raw));
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!parsed.success) return Response.json({ ok: false }, { status: 400 });

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  // Generous for one person typing (drafts every few seconds), tight for a script.
  if (limited(`all:${ip}`, 600)) return Response.json({ ok: false, error: "Slow down" }, { status: 429 });

  const { respondent, kind } = parsed.data;
  const sent = kind === "sent";
  const answers = normalise(parsed.data.answers);
  const summary = parsed.data.summary ? cut(parsed.data.summary, 100_000) : undefined;
  const agent = request.headers.get("user-agent") ?? "";
  const seenFrom = {
    country: request.headers.get("cf-ipcountry") ?? undefined,
    city: request.headers.get("cf-ipcity") ?? undefined,
    device: deviceOf(agent),
    browser: browserOf(agent),
    os: osOf(agent),
  };
  const key = { slug_respondent: { slug, respondent } };

  try {
    const exists = await prisma.formResponse.findUnique({ where: key, select: { id: true } });
    // New rows: a handful per address per hour is plenty for a real client.
    if (!exists && limited(`new:${ip}`, 10)) return Response.json({ ok: false, error: "Slow down" }, { status: 429 });

    const save = () =>
      prisma.formResponse.upsert({
        where: key,
        create: { slug, respondent, answers, summary, sentAt: sent ? new Date() : null, sends: sent ? 1 : 0, ...seenFrom },
        update: sent
          ? { answers, summary, sentAt: new Date(), sends: { increment: 1 }, ...seenFrom }
          : { answers, ...seenFrom },
        select: { sends: true },
      });
    let row;
    try {
      row = await save();
    } catch (error) {
      // Two requests from one browser creating the row at once: the loser updates instead.
      if ((error as { code?: string }).code !== "P2002") throw error;
      row = await save();
    }

    if (sent && !limited(`mail:${ip}`, 20)) {
      const sends = row.sends;
      after(() => notify(form.title, slug, answers, sends));
    }
  } catch (error) {
    console.error("[forms] could not store a response:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
  return Response.json({ ok: true });
}
