"use client";

import { useState } from "react";
import { z } from "zod";
import { Reveal } from "@/components/ui/Reveal";
import { useSectionSpy } from "@/lib/hooks";
import { useUiStore } from "@/lib/store";

const ContactFormSchema = z.object({
  name: z.string().min(2, "Tell me your name"),
  email: z.email("That email doesn't look right"),
  message: z.string().min(10, "A sentence or two helps me reply usefully"),
});

type FormErrors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "failed";

export function ContactSection({ email }: { email: string }) {
  const spyRef = useSectionSpy<HTMLElement>("contact");
  const intent = useUiStore((s) => s.audienceIntent);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const subtitle =
    intent === "hire"
      ? "Looking for an AI engineer who ships? Let's talk about your team."
      : intent === "project"
        ? "Have a product in mind? Tell me what you're building."
        : "Whether it's a role or a project — I read everything myself.";

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    intent === "hire" ? "Full-time / role" : intent === "project" ? "Project inquiry" : "Hello",
  )}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = ContactFormSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, intent }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("failed");
    }
  }

  return (
    <section id="contact" ref={spyRef} className="rule bg-surface py-28">
      <div className="rail">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Contact</p>
          <h2
            className="font-display mt-3 font-bold leading-none"
            style={{ fontSize: "var(--text-display)" }}
          >
            {"Let's build something."}
          </h2>
          <p className="mt-4 max-w-md text-lg text-ink-soft">{subtitle}</p>
        </Reveal>

        <Reveal className="mt-12 max-w-xl">
          {status === "sent" ? (
            <p className="rounded-2xl border border-line bg-bg p-8 text-lg">
              Thanks — your message is in my inbox. I&apos;ll reply within a day.
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <Field label="Name" name="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  className="field"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email" name="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="field"
                  placeholder="you@company.com"
                />
              </Field>
              <Field label="Message" name="message" error={errors.message}>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="field resize-y"
                  placeholder={
                    intent === "hire"
                      ? "Tell me about the role and the team…"
                      : "Tell me what you're building…"
                  }
                />
              </Field>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
                <a
                  href={mailtoHref}
                  className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
                >
                  or email me directly
                </a>
              </div>
              {status === "failed" && (
                <p role="alert" className="text-sm text-accent-deep">
                  Sending didn&apos;t work — please{" "}
                  <a className="underline" href={mailtoHref}>
                    email me directly at {email}
                  </a>
                  .
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-sm text-accent-deep">
          {error}
        </p>
      )}
    </div>
  );
}
