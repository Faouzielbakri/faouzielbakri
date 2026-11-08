"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AlertTriangle, Check, ChevronDown, Copy, CloudOff, Loader2 } from "lucide-react";
import {
  choiceLabel,
  choiceValue,
  isNote,
  type Field,
  type FormDefinition,
} from "@/content/forms/types";
import { site } from "@/content/site";

/**
 * Fills one client form and makes sure nothing typed is lost:
 * - every change is kept in this browser at once, and restored on return;
 * - a draft reaches the server 3 s after the last change, and again when the
 *   page is hidden or closed, so the owner sees answers even if send is never
 *   pressed;
 * - a send that fails is kept and retried when the connection returns or the
 *   page is opened again, and the client gets a copy-paste fallback;
 * - requests run one at a time and send cannot be pressed twice.
 */

type Value = string | string[];
type Answers = Record<string, Value>;
type Payload = { respondent: string; kind: "draft" | "sent"; answers: { q: string; a: Value }[]; summary?: string };

const filled = (value: Value | undefined) => (Array.isArray(value) ? value.length > 0 : !!value?.trim());

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Private mode or full storage: the server draft still has the answers.
  }
}

function newId() {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
  return random.replace(/[^A-Za-z0-9]/g, "").slice(0, 64);
}

async function post(slug: string, payload: Payload, timeout: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`/api/forms/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Not saved (${res.status})`);
  } finally {
    clearTimeout(timer);
  }
}

const control =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-base text-ink transition-colors placeholder:text-muted/70 hover:border-ink/25 focus:border-accent focus:outline-none";

const noSubscribe = () => () => {};

function readDraft(key: string): Answers {
  try {
    const saved = JSON.parse(read(key) ?? "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

/**
 * The server renders the empty form; once the page is live in the browser it
 * is mounted again with this browser's saved draft already filled in.
 */
export function FormFiller({ form }: { form: FormDefinition }) {
  const live = useSyncExternalStore(noSubscribe, () => true, () => false);
  const initial = useMemo(() => (live ? readDraft(`form-draft:${form.slug}`) : {}), [live, form.slug]);
  return <Filler key={live ? "live" : "server"} form={form} initial={initial} live={live} />;
}

function Filler({ form, initial, live }: { form: FormDefinition; initial: Answers; live: boolean }) {
  const fields = useMemo(
    () => form.sections.flatMap((s) => s.blocks.filter((b): b is Field => !isNote(b))),
    [form],
  );
  const draftKey = `form-draft:${form.slug}`;
  const pendingKey = `form-pending:${form.slug}`;

  const [answers, setAnswers] = useState<Answers>(initial);
  const [draft, setDraft] = useState<"idle" | "saving" | "saved" | "local">("idle");
  const [send, setSend] = useState<"idle" | "sending" | "sent" | "failed" | "empty">("idle");
  const [sentKey, setSentKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const respondent = useRef("");
  const latest = useRef<Answers>(initial);
  const savedKey = useRef("");
  const dirty = useRef(false);
  const sending = useRef(false);
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  /** Runs requests one after another, so two can never race. */
  const enqueue = useCallback(<T,>(job: () => Promise<T>) => {
    const next = queue.current.then(job, job);
    queue.current = next.catch(() => {});
    return next;
  }, []);

  const toPayload = useCallback(
    (values: Answers) => fields.map((f) => ({ q: f.label, a: values[f.id] ?? (f.type === "multi" ? [] : "") })),
    [fields],
  );

  const summaryOf = useCallback(
    (values: Answers) =>
      [
        form.title.toUpperCase(),
        "",
        ...fields.map((f) => {
          const v = values[f.id];
          return `${f.label}\n→ ${filled(v) ? (Array.isArray(v) ? v.join(", ") : v) : "–"}`;
        }),
      ].join("\n\n"),
    [fields, form.title],
  );

  /* This browser's id, and a retry for a send that never arrived. */
  useEffect(() => {
    if (!live) return;
    respondent.current = read("form-respondent") ?? "";
    if (!/^[A-Za-z0-9]{8,64}$/.test(respondent.current)) {
      respondent.current = newId();
      write("form-respondent", respondent.current);
    }

    const retry = () => {
      const raw = read(pendingKey);
      if (!raw) return;
      enqueue(() => post(form.slug, JSON.parse(raw), 15_000))
        .then(() => {
          if (read(pendingKey) === raw) write(pendingKey, null);
        })
        .catch(() => {});
    };
    const first = setTimeout(retry, 1_500);
    window.addEventListener("online", retry);
    return () => {
      clearTimeout(first);
      window.removeEventListener("online", retry);
    };
  }, [live, pendingKey, form.slug, enqueue]);

  /** Sends the current answers as a draft. `beacon` is for a closing page. */
  const saveDraft = useCallback(
    (beacon: boolean) => {
      const values = latest.current;
      const key = JSON.stringify(values);
      if (key === savedKey.current || !Object.values(values).some(filled)) return;
      const payload: Payload = { respondent: respondent.current, kind: "draft", answers: toPayload(values) };
      dirty.current = false;
      if (beacon && navigator.sendBeacon) {
        const body = JSON.stringify(payload);
        if (body.length < 60_000 && navigator.sendBeacon(`/api/forms/${form.slug}`, body)) {
          savedKey.current = key;
          return;
        }
      }
      setDraft("saving");
      enqueue(() => post(form.slug, payload, 10_000))
        .then(() => {
          savedKey.current = key;
          setDraft(JSON.stringify(latest.current) === key ? "saved" : "saving");
        })
        .catch(() => {
          dirty.current = true;
          setDraft("local");
        });
    },
    [enqueue, form.slug, toPayload],
  );

  /* Every change: keep it in the browser now, and on the server a little later. */
  useEffect(() => {
    if (!live) return;
    latest.current = answers;
    write(draftKey, JSON.stringify(answers));
    if (JSON.stringify(answers) === savedKey.current) return;
    dirty.current = true;
    const timer = setTimeout(() => saveDraft(false), 3_000);
    return () => clearTimeout(timer);
  }, [answers, live, draftKey, saveDraft]);

  /* Leaving or hiding the page: one last save. */
  useEffect(() => {
    if (!live) return;
    const flush = () => {
      if (dirty.current) saveDraft(true);
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, [live, saveDraft]);

  const setValue = (id: string, value: Value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!live || sending.current) return;
    const values = latest.current;
    if (!Object.values(values).some(filled)) {
      setSend("empty");
      return;
    }
    sending.current = true;
    setSend("sending");
    const key = JSON.stringify(values);
    const payload: Payload = {
      respondent: respondent.current,
      kind: "sent",
      answers: toPayload(values),
      summary: summaryOf(values),
    };
    const raw = JSON.stringify(payload);
    // Kept until the server confirms, so a lost send is retried later.
    write(pendingKey, raw);
    try {
      await enqueue(() => post(form.slug, payload, 15_000));
      if (read(pendingKey) === raw) write(pendingKey, null);
      savedKey.current = key;
      dirty.current = false;
      setSentKey(key);
      setDraft("saved");
      setSend("sent");
    } catch {
      setSend("failed");
    } finally {
      sending.current = false;
    }
  }

  async function copyAnswers() {
    try {
      await navigator.clipboard.writeText(summaryOf(latest.current));
      setCopied(true);
      setTimeout(() => setCopied(false), 2_000);
    } catch {
      document.getElementById("form-summary")?.focus();
      (document.getElementById("form-summary") as HTMLTextAreaElement | null)?.select();
    }
  }

  const answered = fields.filter((f) => filled(answers[f.id])).length;
  const changedSinceSent = sentKey !== null && sentKey !== JSON.stringify(answers);
  let number = 0;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:gap-6">
      {/* Progress, pinned under the site nav. */}
      <div className="sticky top-16 z-30 -mx-[var(--gutter)] bg-bg/90 px-[var(--gutter)] py-3 backdrop-blur-md sm:mx-0 sm:rounded-full sm:border sm:border-line sm:px-5">
        <div className="flex items-center justify-between gap-3 text-[12px]">
          <span className="font-mono tabular-nums text-ink-soft">
            {answered} / {fields.length} answered
          </span>
          <DraftStatus state={draft} />
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${fields.length ? (answered / fields.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {form.sections.map((section, index) => (
        <section
          key={section.title}
          aria-labelledby={`section-${index}`}
          className="rounded-[28px] border border-line bg-surface p-5 sm:p-8"
        >
          <header className="flex items-baseline gap-3 border-b border-line pb-4">
            <span className="font-mono text-xs tabular-nums text-accent">{String(index + 1).padStart(2, "0")}</span>
            <h2 id={`section-${index}`} className="font-display text-2xl font-bold leading-tight sm:text-[1.75rem]">
              {section.title}
            </h2>
          </header>
          <div className="mt-6 grid gap-x-5 gap-y-7 sm:grid-cols-2">
            {section.blocks.map((block, i) =>
              isNote(block) ? (
                <p
                  key={`note-${i}`}
                  className="rounded-2xl border-l-2 border-accent bg-bg px-4 py-3 text-[14px] leading-relaxed text-ink-soft sm:col-span-2"
                >
                  {block.note}
                </p>
              ) : (
                <Question
                  key={block.id}
                  field={block}
                  number={++number}
                  value={answers[block.id]}
                  onChange={(value) => setValue(block.id, value)}
                />
              ),
            )}
          </div>
        </section>
      ))}

      {/* ── Send ─────────────────────────────────────────────── */}
      <div className="rounded-[28px] bg-ink p-6 text-bg sm:p-8">
        <h2 className="font-display text-2xl font-bold leading-tight">
          Ready<span className="text-accent">?</span>
        </h2>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-bg/70">
          Send what you have, even if some answers are empty. You can come back, change anything and send again.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={send === "sending"}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-bg hover:text-ink disabled:cursor-progress disabled:opacity-70"
          >
            {send === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {send === "sending" ? "Sending…" : sentKey ? "Send again" : "Send my answers"}
          </button>
          <span className="font-mono text-[12px] tabular-nums text-bg/60">
            {answered} of {fields.length} answered
          </span>
        </div>

        <div role="status" aria-live="polite">
          {send === "empty" ? (
            <p className="mt-5 text-sm text-saffron">Answer at least a few questions first, then send.</p>
          ) : null}
          {send === "sent" ? (
            <p className="mt-5 flex items-start gap-2 text-sm text-[#5cd6a6]">
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
              {changedSinceSent
                ? "You changed something since sending. Your changes are saved as a draft; press send again to confirm them."
                : "Sent. Faouzi has your answers and will come back to you with the price and timeline."}
            </p>
          ) : null}
        </div>

        {send === "failed" ? (
          <div role="alert" className="mt-5 rounded-2xl bg-bg/10 p-4 text-sm">
            <p className="flex items-start gap-2 text-saffron">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              Could not send right now. Your answers are kept on this device and will be sent when the connection is
              back.
            </p>
            <p className="mt-2 text-bg/70">
              To be safe, copy them and send them to Faouzi on WhatsApp or at{" "}
              <a href={`mailto:${site.email}?subject=${encodeURIComponent(form.title)}`} className="underline">
                {site.email}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={copyAnswers}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-bg/25 px-5 py-2.5 font-medium transition-colors hover:border-bg"
            >
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              {copied ? "Copied" : "Copy my answers"}
            </button>
            <textarea
              id="form-summary"
              readOnly
              aria-label="Your answers"
              value={summaryOf(answers)}
              className="mt-4 h-56 w-full rounded-xl border border-bg/20 bg-ink p-3 font-mono text-base text-bg/80 sm:text-[13px]"
            />
          </div>
        ) : null}
      </div>
    </form>
  );
}

function DraftStatus({ state }: { state: "idle" | "saving" | "saved" | "local" }) {
  if (state === "idle") return <span className="text-muted">Saves as you type</span>;
  if (state === "saving")
    return (
      <span className="inline-flex items-center gap-1.5 text-muted">
        <Loader2 className="size-3 animate-spin" aria-hidden /> Saving…
      </span>
    );
  if (state === "local")
    return (
      <span className="inline-flex items-center gap-1.5 text-accent-deep">
        <CloudOff className="size-3.5" aria-hidden /> Offline, kept on this device
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-[#0b7d5e]">
      <Check className="size-3.5" aria-hidden /> Saved
    </span>
  );
}

function Question({
  field,
  number,
  value,
  onChange,
}: {
  field: Field;
  number: number;
  value: Value | undefined;
  onChange: (value: Value) => void;
}) {
  const id = `q-${field.id}`;
  const span = field.half ? "" : "sm:col-span-2";
  const heading = (
    <>
      <span className="mr-2 font-mono text-[11px] tabular-nums text-muted">{number}.</span>
      {field.label}
    </>
  );
  const hint = field.hint ? (
    <p id={`${id}-hint`} className="mt-2 text-[13px] leading-relaxed text-muted">
      {field.hint}
    </p>
  ) : null;
  const describedBy = field.hint ? `${id}-hint` : undefined;

  if (field.type === "single" || field.type === "multi") {
    const multi = field.type === "multi";
    const selected = Array.isArray(value) ? value : value ? [value] : [];
    return (
      <fieldset className={`min-w-0 ${span}`} aria-describedby={describedBy}>
        <legend className="text-[15px] font-medium leading-snug text-ink">
          {heading}
          {multi ? <span className="ml-2 text-[12px] font-normal text-muted">Pick any</span> : null}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {field.options.map((choice) => {
            const v = choiceValue(choice);
            const on = selected.includes(v);
            return (
              <label key={v} className="relative cursor-pointer select-none">
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={field.id}
                  value={v}
                  checked={on}
                  onChange={() => onChange(multi ? (on ? selected.filter((s) => s !== v) : [...selected, v]) : v)}
                  // A second tap on the chosen answer clears it.
                  onClick={() => {
                    if (!multi && on) onChange("");
                  }}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-bg px-4 py-2 text-sm text-ink-soft transition-colors duration-150 hover:border-ink/40 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  {on ? <Check className="size-3.5 shrink-0" aria-hidden /> : null}
                  {choiceLabel(choice)}
                </span>
              </label>
            );
          })}
        </div>
        {hint}
      </fieldset>
    );
  }

  const text = typeof value === "string" ? value : "";
  let input: React.ReactNode;
  if (field.type === "textarea") {
    input = (
      <textarea
        id={id}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        aria-describedby={describedBy}
        rows={3}
        className={`${control} min-h-28 resize-y leading-relaxed`}
      />
    );
  } else if (field.type === "select") {
    input = (
      <div className="relative">
        <select
          id={id}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={describedBy}
          className={`${control} cursor-pointer appearance-none truncate pr-10 ${text ? "" : "text-muted"}`}
        >
          <option value="">Choose…</option>
          {field.options.map((option) => (
            <option key={option} value={option} className="text-ink">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </div>
    );
  } else if (field.type === "number") {
    input = (
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="text"
          inputMode={field.decimal ? "decimal" : "numeric"}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
          className={`${control} min-w-0 flex-1`}
        />
        {field.unit ? (
          <span className="shrink-0 whitespace-nowrap font-mono text-[12px] text-muted">{field.unit}</span>
        ) : null}
      </div>
    );
  } else {
    input = (
      <input
        id={id}
        type="text"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        aria-describedby={describedBy}
        className={control}
      />
    );
  }

  return (
    <div className={`flex min-w-0 flex-col ${span}`}>
      <label htmlFor={id} className="text-[15px] font-medium leading-snug text-ink">
        {heading}
      </label>
      {/* Half-width pairs line their inputs up even when one label wraps. */}
      <div className={`mt-3 ${field.half ? "sm:mt-auto sm:pt-3" : ""}`}>{input}</div>
      {hint}
    </div>
  );
}
