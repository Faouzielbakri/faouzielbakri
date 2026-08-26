import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/content/site";

/**
 * Channel data the browser collected on the visitor's first page (see
 * lib/attribution.ts). Every field is optional and length-capped: this arrives
 * from the client, so it is treated as untrusted decoration on the email, never
 * as anything the server acts on.
 */
const AttributionSchema = z
  .object({
    source: z.string().max(160).optional(),
    medium: z.string().max(160).optional(),
    campaign: z.string().max(160).optional(),
    term: z.string().max(160).optional(),
    content: z.string().max(160).optional(),
    referrer: z.string().max(400).optional(),
    landingPath: z.string().max(300).optional(),
    submittedFrom: z.string().max(300).optional(),
    firstSeen: z.string().max(40).optional(),
    clickId: z.string().max(40).optional(),
  })
  .optional();

const ContactPayloadSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.email(),
  message: z.string().min(10).max(5000),
  intent: z.enum(["hire", "project"]).nullable().optional(),
  attribution: AttributionSchema,
});

type Attribution = NonNullable<z.infer<typeof AttributionSchema>>;

/** Crude but useful: enough to know whether to expect a phone-typed reply. */
function describeDevice(userAgent: string | null): string | undefined {
  if (!userAgent) return undefined;
  const platform = /iPhone|iPad|iPod/.test(userAgent)
    ? "iOS"
    : /Android/.test(userAgent)
      ? "Android"
      : /Macintosh/.test(userAgent)
        ? "Mac"
        : /Windows/.test(userAgent)
          ? "Windows"
          : /Linux/.test(userAgent)
            ? "Linux"
            : undefined;
  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /OPR\//.test(userAgent)
      ? "Opera"
      : /Chrome\//.test(userAgent)
        ? "Chrome"
        : /Safari\//.test(userAgent)
          ? "Safari"
          : /Firefox\//.test(userAgent)
            ? "Firefox"
            : undefined;
  return [platform, browser].filter(Boolean).join(" · ") || undefined;
}

/**
 * One readable line per fact, so the channel is obvious at a glance in the
 * inbox instead of being a blob of query parameters.
 */
function attributionBlock(
  attribution: Attribution | undefined,
  request: Request,
): string {
  const rows: [string, string | undefined][] = [];

  const source = attribution?.source;
  const medium = attribution?.medium;
  const channel =
    source && medium && medium !== "referral"
      ? `${source} / ${medium}`
      : (source ?? "Unknown");
  rows.push(["Channel", attribution?.clickId ? `${channel} (paid click — ${attribution.clickId})` : channel]);
  rows.push(["Campaign", attribution?.campaign]);
  rows.push([
    "Ad content",
    [attribution?.content, attribution?.term].filter(Boolean).join(" · ") || undefined,
  ]);
  rows.push(["Referrer", attribution?.referrer]);
  rows.push(["Landed on", attribution?.landingPath]);
  rows.push(["Wrote from", attribution?.submittedFrom]);
  rows.push(["First seen", attribution?.firstSeen]);
  // Cloudflare fronts the site, so the country arrives for free and no IP is
  // ever read or stored.
  rows.push(["Country", request.headers.get("cf-ipcountry") ?? undefined]);
  rows.push(["Device", describeDevice(request.headers.get("user-agent"))]);

  const lines = rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label.padEnd(11)} ${value}`);

  return lines.length ? `\n\n${"─".repeat(34)}\n${lines.join("\n")}` : "";
}

export async function POST(request: Request) {
  let payload: z.infer<typeof ContactPayloadSchema>;
  try {
    payload = ContactPayloadSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — the client falls back to a mailto link. Log the
    // message anyway: a lead that reaches the server should never be lost to
    // a missing env var.
    console.warn("[contact] RESEND_API_KEY missing — message not sent", {
      name: payload.name,
      email: payload.email,
      intent: payload.intent ?? null,
      message: payload.message,
    });
    return NextResponse.json({ error: "Email not configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const subject =
    payload.intent === "hire"
      ? `Portfolio — role inquiry from ${payload.name}`
      : payload.intent === "project"
        ? `Portfolio — project inquiry from ${payload.name}`
        : `Portfolio — message from ${payload.name}`;

  // Sending domain, once faouzielbakri.com is verified in Resend. Until then
  // the shared sandbox sender works, but only delivers to the address that
  // owns the Resend account.
  const from = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: site.email,
    replyTo: payload.email,
    subject,
    text:
      `From: ${payload.name} <${payload.email}>\n` +
      `Intent: ${payload.intent ?? "unspecified"}\n\n` +
      payload.message +
      attributionBlock(payload.attribution, request),
  });

  if (error) {
    // Same reasoning as above: keep the message where it can be recovered.
    console.error("[contact] send failed", error, {
      name: payload.name,
      email: payload.email,
      intent: payload.intent ?? null,
      message: payload.message,
    });
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
