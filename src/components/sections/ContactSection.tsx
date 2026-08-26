"use client";

/**
 * Contact — a letter you finish, not a form you fill. One giant editorial
 * sentence with inline blanks; the mailto fallback keeps it unbreakable.
 */
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotionSafe, useSectionSpy } from "@/lib/hooks";
import { readAttribution } from "@/lib/attribution";
import { useUiStore } from "@/lib/store";

const ContactFormSchema = z.object({
  name: z.string().min(2, "your name"),
  email: z.email("a real email"),
  message: z.string().min(10, "a bit more about it"),
});

type Status = "idle" | "sending" | "sent" | "failed";

function Blank({
  name,
  value,
  onChange,
  placeholder,
  width,
  type = "text",
  error,
  invite = false,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  width: string;
  type?: string;
  error?: boolean;
  /** Show a blinking ink caret inviting the visitor to start writing. */
  invite?: boolean;
}) {
  const reduced = useReducedMotionSafe();
  const [focused, setFocused] = useState(false);

  return (
    <span className="relative inline-block align-baseline" style={{ width }}>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`inline-block w-full border-0 border-b-2 bg-transparent px-1 text-center font-display font-bold text-accent caret-accent !outline-none transition-[box-shadow,border-color] duration-300 placeholder:font-normal placeholder:text-muted/50 ${
          error ? "border-accent-deep placeholder:text-accent-deep/60" : "border-line"
        } ${
          focused
            ? "border-accent shadow-[0_12px_16px_-14px_rgba(232,89,12,0.6)]"
            : ""
        }`}
        style={{ fontSize: "inherit", lineHeight: "inherit" }}
      />
      {/* The letter awaits ink — blinking caret until the first keystroke. */}
      {invite && !value && !focused && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-2 top-1/2 h-[0.95em] w-[2.5px] -translate-y-1/2 rounded-full bg-accent"
          animate={reduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
          transition={
            reduced ? undefined : { duration: 1.1, times: [0, 0.55, 0.56, 1], repeat: Infinity }
          }
        />
      )}
    </span>
  );
}

export function ContactSection({ email }: { email: string }) {
  const spyRef = useSectionSpy<HTMLElement>("contact");
  const intent = useUiStore((s) => s.audienceIntent);
  const setIntent = useUiStore((s) => s.setAudienceIntent);

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const liveRef = useRef<HTMLParagraphElement | null>(null);

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    intent === "hire" ? "Full-time / role" : intent === "project" ? "Project inquiry" : "Hello",
  )}`;

  async function submit() {
    const parsed = ContactFormSchema.safeParse({ name, email: visitorEmail, message });
    if (!parsed.success) {
      const errs: Record<string, boolean> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = true;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          message: `${message}${from ? `\n\n— from ${from}` : ""}`,
          intent,
          // Which channel brought them here, captured on their first page.
          attribution: readAttribution(),
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <section id="contact" ref={spyRef} className="rule bg-surface py-28">
      <div className="rail">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Contact</p>
        </Reveal>

        {status === "sent" ? (
          <div className="mt-10">
            <h2
              className="font-display max-w-3xl font-bold leading-tight"
              style={{ fontSize: "var(--text-display)" }}
            >
              It&apos;s in my inbox<span className="text-accent">.</span>
            </h2>
            <p className="mt-4 max-w-md text-lg text-ink-soft">
              I read everything myself — expect a reply within 24 hours,{" "}
              {name.split(" ")[0] || "friend"}.
            </p>
          </div>
        ) : (
          <>
            {/* The letter */}
            <p
              ref={liveRef}
              className="font-display mt-10 max-w-4xl font-bold leading-[1.6] text-ink"
              style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)" }}
            >
              Salam Faouzi — I&apos;m{" "}
              <Blank
                name="name"
                value={name}
                onChange={setName}
                placeholder="your name"
                width="9ch"
                error={errors.name}
                invite
              />{" "}
              from{" "}
              <Blank
                name="from"
                value={from}
                onChange={setFrom}
                placeholder="company / city"
                width="12ch"
              />
              , and I want to{" "}
              <span className="inline-flex gap-2 align-baseline">
                <button
                  type="button"
                  onClick={() => setIntent("hire")}
                  className={`border-b-2 px-1 transition-colors ${
                    intent === "hire"
                      ? "border-accent text-accent"
                      : "border-line text-muted hover:text-ink"
                  }`}
                >
                  hire you
                </button>
                <span className="text-muted">/</span>
                <button
                  type="button"
                  onClick={() => setIntent("project")}
                  className={`border-b-2 px-1 transition-colors ${
                    intent === "project"
                      ? "border-accent text-accent"
                      : "border-line text-muted hover:text-ink"
                  }`}
                >
                  build something
                </button>
              </span>
              . Here&apos;s the idea:{" "}
              <Blank
                name="message"
                value={message}
                onChange={setMessage}
                placeholder="tell me in one honest line…"
                width="min(24ch, 60vw)"
                error={errors.message}
              />{" "}
              — you can reach me at{" "}
              <Blank
                name="email"
                value={visitorEmail}
                onChange={setVisitorEmail}
                placeholder="me@company.com"
                width="14ch"
                type="email"
                error={errors.email}
              />
              .
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={submit}
                disabled={status === "sending"}
                className="rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent disabled:opacity-60"
              >
                {status === "sending" ? "Sealing the letter…" : "Send it →"}
              </button>
              <a
                href={mailtoHref}
                className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                or write a normal email
              </a>
            </div>
            {Object.keys(errors).length > 0 && (
              <p role="alert" className="mt-4 text-sm text-accent-deep">
                A few blanks still need ink — {Object.keys(errors).length} left.
              </p>
            )}
            {status === "failed" && (
              <p role="alert" className="mt-4 text-sm text-accent-deep">
                Sending didn&apos;t work —{" "}
                <a className="underline" href={mailtoHref}>
                  email me directly at {email}
                </a>
                .
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
