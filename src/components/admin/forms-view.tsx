import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown, Inbox, PencilLine, Trash2 } from "lucide-react";
import { removeFormResponse } from "@/app/admin/actions";
import type { FormsReport } from "@/lib/dashboard-extras";
import { DeviceIcon, Eyebrow, Flag, Tile, ago, countryName } from "./bits";

/** Sent, or only an autosaved draft so far, and whether it changed after sending. */
function SentBadge({ sentAt, last, sends, now }: { sentAt: number | null; last: number; sends: number; now: number }) {
  if (sentAt === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-saffron/20 px-2 py-0.5 text-[11px] font-medium text-[#8a5a00]">
        <PencilLine className="size-3" aria-hidden />
        Draft, not sent yet
      </span>
    );
  }
  const editedAfter = last - sentAt > 10_000;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#0fa37a]/12 px-2 py-0.5 text-[11px] font-medium text-[#0b7d5e]">
      <Check className="size-3" aria-hidden />
      Sent {ago(sentAt, now)}
      {sends > 1 ? ` · ${sends} times` : ""}
      {editedAfter ? " · edited since" : ""}
    </span>
  );
}

/** The Forms view: what each client answered, question by question. */
export function FormsView({ report, now }: { report: FormsReport; now: number }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {report.map((form) => (
        <Tile key={form.slug} className="col-span-12">
          <div id={form.slug} className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Eyebrow>{form.client}</Eyebrow>
              <h2 className="font-display mt-2 text-2xl font-bold leading-tight">{form.title}</h2>
              <p className="mt-1 text-sm text-muted">
                {form.responses.length
                  ? `${form.responses.length} ${form.responses.length === 1 ? "response" : "responses"}, last ${ago(form.responses[0].last, now)}`
                  : "No answers yet"}
              </p>
            </div>
            <Link
              href={`/forms/${form.slug}`}
              target="_blank"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1 text-[12px] text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              Open form <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          {form.responses.length ? (
            <div className="mt-5 space-y-3">
              {form.responses.map((r, index) => (
                <details key={r.id} open={index === 0} className="group rounded-2xl bg-bg">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
                    <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" aria-hidden />
                    <span className="font-medium tabular-nums">
                      {r.filled} of {r.answers.length} answered
                    </span>
                    <span className="flex items-center gap-2 text-ink-soft">
                      <Flag code={r.country} className="h-3.5 w-5 shrink-0" />
                      {[r.city, countryName(r.country)].filter(Boolean).join(", ")}
                    </span>
                    <span className="flex items-center gap-2 text-ink-soft">
                      <DeviceIcon device={r.device} className="size-4 shrink-0 text-muted" />
                      {[r.browser, r.os].filter(Boolean).join(" · ") || r.device}
                    </span>
                    <SentBadge sentAt={r.sentAt} last={r.last} sends={r.sends} now={now} />
                    <span className="ml-auto whitespace-nowrap text-[12px] text-muted" title={new Date(r.last).toISOString()}>
                      {ago(r.last, now)}
                    </span>
                  </summary>

                  <dl className="grid gap-x-8 border-t border-line px-4 py-4 md:grid-cols-2">
                    {r.answers.map(({ q, a }, i) => {
                      const value = Array.isArray(a) ? a.join(", ") : a;
                      return (
                        <div key={i} className="border-b border-line/60 py-2.5 last:border-0">
                          <dt className="text-[12px] text-muted">{q}</dt>
                          <dd className={`mt-0.5 whitespace-pre-wrap break-words text-sm ${value ? "text-ink" : "text-muted"}`}>
                            {value || "–"}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>

                  <div className="flex justify-end border-t border-line px-4 py-2">
                    <form action={removeFormResponse}>
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        title="Delete this response (a test of yours)"
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] text-muted transition-colors hover:bg-surface hover:text-accent-deep"
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                        Delete response
                      </button>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <p className="mt-5 flex items-center gap-3 rounded-2xl bg-bg px-4 py-5 text-sm text-muted">
              <Inbox className="size-4 shrink-0" aria-hidden />
              Answers show up here while the client types (as a draft), and you get an email when they press send.
            </p>
          )}
        </Tile>
      ))}
      <p className="col-span-12 px-2 text-[12px] text-muted">
        All time. One row per browser: drafts save as the client types, and sending again updates the same row.
      </p>
    </div>
  );
}
