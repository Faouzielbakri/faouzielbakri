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
    // Not configured yet — the client falls back to a mailto link.
    return NextResponse.json({ error: "Email not configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const subject =
    payload.intent === "hire"
      ? `Portfolio — role inquiry from ${payload.name}`
      : payload.intent === "project"
        ? `Portfolio — project inquiry from ${payload.name}`
        : `Portfolio — message from ${payload.name}`;

  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: site.email,
    replyTo: payload.email,
    subject,
    text: `From: ${payload.name} <${payload.email}>\nIntent: ${payload.intent ?? "unspecified"}\n\n${payload.message}`,
  });

  if (error) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
