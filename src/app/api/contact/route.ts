import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/content/site";

const ContactPayloadSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.email(),
  message: z.string().min(10).max(5000),
  intent: z.enum(["hire", "project"]).nullable().optional(),
});

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
    text: `From: ${payload.name} <${payload.email}>\nIntent: ${payload.intent ?? "unspecified"}\n\n${payload.message}`,
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
