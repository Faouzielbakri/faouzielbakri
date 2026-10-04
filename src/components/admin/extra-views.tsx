import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Clock,
  Eye,
  Inbox,
  Mail,
  MessageCircle,
  MousePointerClick,
  Printer,
  Send,
  Share2,
  ThumbsUp,
  X,
} from "lucide-react";
import { removeProposalRead } from "@/app/admin/actions";
import type { EmailReport, ProposalReport } from "@/lib/dashboard-extras";
import { DeviceIcon, Eyebrow, Flag, Tile, ago, countryName, fmt } from "./bits";

/** The dashboard views that are not about site traffic: proposals and mail. */

function duration(seconds: number) {
  if (!seconds) return "–";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  return m < 60 ? `${m}m ${String(seconds % 60).padStart(2, "0")}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

const PROPOSAL_ACTION: Record<string, { label: string; Icon: typeof Mail }> = {
  approve: { label: "Went to approve", Icon: ThumbsUp },
  whatsapp: { label: "Opened WhatsApp", Icon: MessageCircle },
  email: { label: "Clicked your email", Icon: Mail },
  share: { label: "Shared it", Icon: Share2 },
  print: { label: "Printed it", Icon: Printer },
  language: { label: "Switched language", Icon: MousePointerClick },
};

export function ProposalsView({ report, now }: { report: ProposalReport; now: number }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {report.map((p) => (
        <Tile key={p.slug} className="col-span-12">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <Eyebrow>{p.client}</Eyebrow>
              <div className="mt-2 flex items-start justify-between gap-3">
                <h2 className="font-display text-2xl font-bold leading-tight">{p.title}</h2>
                <Link
                  href={`/proposals/${p.slug}`}
                  target="_blank"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1 text-[12px] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  Open <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              </div>

              {p.opens ? (
                <>
                  <dl className="mt-5 grid grid-cols-4 gap-2">
                    {[
                      { label: "times opened", value: fmt.format(p.opens) },
                      { label: "last opened", value: p.lastOpened ? ago(p.lastOpened, now) : "–" },
                      { label: "longest read", value: duration(p.longest) },
                      { label: "read down to", value: `${p.deepest}%` },
                    ].map((m) => (
                      <div key={m.label} className="rounded-2xl bg-bg px-3 py-3">
                        <dd className="font-display text-xl font-bold leading-none tabular-nums">{m.value}</dd>
                        <dt className="mt-1.5 text-[11px] leading-tight text-muted">{m.label}</dt>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.actions.length ? (
                      p.actions.map((a) => {
                        const action = PROPOSAL_ACTION[a] ?? { label: a, Icon: MousePointerClick };
                        const strong = a === "approve" || a === "whatsapp";
                        return (
                          <li
                            key={a}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${
                              strong ? "bg-accent text-white" : "bg-bg text-ink-soft"
                            }`}
                          >
                            <action.Icon className="size-3.5" aria-hidden />
                            {action.label}
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-[13px] text-muted">Read, but no button pressed yet.</li>
                    )}
                  </ul>
                </>
              ) : (
                <p className="mt-5 rounded-2xl bg-bg px-4 py-5 text-sm text-muted">
                  Not opened yet. When the client opens the link, the visit shows up here with how long
                  they read and what they pressed.
                </p>
              )}
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted">Each time it was read</p>
              {p.reads.length ? (
                <ul className="mt-2 max-h-[11.5rem] divide-y divide-line overflow-auto">
                  {p.reads.map((r) => (
                    <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-sm">
                      <span className="flex w-44 items-center gap-2">
                        <Flag code={r.country} className="h-3.5 w-5 shrink-0" />
                        <span className="truncate">{[r.city, countryName(r.country)].filter(Boolean).join(", ")}</span>
                      </span>
                      <span className="flex w-40 items-center gap-2 text-ink-soft">
                        <DeviceIcon device={r.device} className="size-4 shrink-0 text-muted" />
                        <span className="truncate">{[r.browser, r.os].filter(Boolean).join(" · ") || r.device}</span>
                      </span>
                      <span className="flex items-center gap-1.5 tabular-nums">
                        <Clock className="size-3.5 text-muted" aria-hidden />
                        {duration(r.seconds)}
                      </span>
                      <span className="tabular-nums text-muted">
                        {r.depth}% · {r.sections} sections
                      </span>
                      <span className="ml-auto whitespace-nowrap text-[12px] text-muted">{ago(r.last, now)}</span>
                      <form action={removeProposalRead}>
                        <input type="hidden" name="slug" value={p.slug} />
                        <input type="hidden" name="visitor" value={r.visitor} />
                        <button
                          type="submit"
                          title="Remove this read (a test, or your own device)"
                          className="flex size-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-bg hover:text-accent-deep"
                        >
                          <X className="size-3.5" aria-hidden />
                          <span className="sr-only">Remove this read</span>
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">No reads recorded.</p>
              )}
            </div>
          </div>
        </Tile>
      ))}
      <p className="col-span-12 px-2 text-[12px] text-muted">
        All time. Reading time counts only while the proposal&apos;s tab is in view. Your own browsers are not counted.
      </p>
    </div>
  );
}

const STATUS: Record<string, { label: string; Icon: typeof Mail; className: string }> = {
  delivered: { label: "Delivered", Icon: Check, className: "bg-[#0fa37a]/12 text-[#0b7d5e]" },
  opened: { label: "Opened", Icon: Eye, className: "bg-[#1971c2]/12 text-[#1560a6]" },
  clicked: { label: "Clicked", Icon: MousePointerClick, className: "bg-accent/12 text-accent-deep" },
  bounced: { label: "Bounced", Icon: AlertTriangle, className: "bg-[#d92d20]/12 text-[#b42318]" },
  complained: { label: "Marked spam", Icon: AlertTriangle, className: "bg-[#d92d20]/12 text-[#b42318]" },
  delivery_delayed: { label: "Delayed", Icon: Clock, className: "bg-saffron/20 text-[#8a5a00]" },
  sent: { label: "Sent", Icon: Send, className: "bg-bg text-ink-soft" },
  forwarded: { label: "Forwarded", Icon: Check, className: "bg-[#0fa37a]/12 text-[#0b7d5e]" },
  dropped: { label: "Dropped", Icon: AlertTriangle, className: "bg-[#d92d20]/12 text-[#b42318]" },
  rejected: { label: "Rejected", Icon: AlertTriangle, className: "bg-[#d92d20]/12 text-[#b42318]" },
};

function Status({ value }: { value: string }) {
  const s = STATUS[value] ?? { label: value, Icon: Mail, className: "bg-bg text-ink-soft" };
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.className}`}>
      <s.Icon className="size-3" aria-hidden />
      {s.label}
    </span>
  );
}

export function EmailsView({ report, now }: { report: EmailReport; now: number }) {
  const { sent, received, domain } = report;
  const count = (status: string) => sent.emails.filter((e) => e.status === status).length;
  const reached = sent.emails.filter((e) => ["delivered", "opened", "clicked"].includes(e.status)).length;

  return (
    <div className="grid grid-cols-12 gap-4">
      <Tile className="col-span-12 xl:col-span-7">
        <div className="flex items-center gap-2">
          <Send className="size-4 text-accent" aria-hidden />
          <Eyebrow>Sent from @{domain}</Eyebrow>
        </div>
        <dl className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "sent", value: sent.emails.length },
            { label: "reached the inbox", value: reached },
            { label: "opened", value: count("opened") + count("clicked") },
            { label: "bounced", value: count("bounced") },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl bg-bg px-3 py-3">
              <dd className="font-display text-2xl font-bold leading-none tabular-nums">{fmt.format(m.value)}</dd>
              <dt className="mt-1.5 text-[11px] text-muted">{m.label}</dt>
            </div>
          ))}
        </dl>
        {sent.error ? <p className="mt-4 text-sm text-accent-deep">{sent.error}</p> : null}
        {sent.emails.length ? (
          <ul className="mt-4 max-h-[22rem] divide-y divide-line overflow-auto">
            {sent.emails.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{e.subject || "(no subject)"}</span>
                  <span className="block truncate text-[12px] text-muted">to {e.to.join(", ")}</span>
                </span>
                <Status value={e.status} />
                <span className="w-16 shrink-0 text-right text-[12px] text-muted">{ago(e.at, now)}</span>
              </li>
            ))}
          </ul>
        ) : !sent.error ? (
          <p className="mt-4 text-sm text-muted">Nothing sent from this domain in the period Resend keeps.</p>
        ) : null}
        <p className="mt-3 text-[12px] text-muted">
          From Resend, including what you send from Gmail as hello@{domain}. “Opened” only appears if open
          tracking is on for the domain in Resend.
        </p>
      </Tile>

      <Tile tone={received.configured ? "paper" : "sand"} className="col-span-12 xl:col-span-5">
        <div className="flex items-center gap-2">
          <Inbox className="size-4 text-accent-deep" aria-hidden />
          <Eyebrow>Received at @{domain}</Eyebrow>
        </div>
        {!received.configured ? (
          <div className="mt-4 text-sm leading-relaxed text-ink-soft">
            <p className="font-display text-xl font-bold text-ink">One token away</p>
            <p className="mt-2">
              Incoming mail goes through Cloudflare Email Routing. To list it here, the site needs two
              settings in Dokploy:
            </p>
            <ul className="mt-3 space-y-1.5 font-mono text-[12px]">
              <li>CLOUDFLARE_API_TOKEN</li>
              <li>CLOUDFLARE_ZONE_ID</li>
            </ul>
            <p className="mt-3 text-[13px] text-muted">
              The token only needs to read analytics for this one zone.
            </p>
          </div>
        ) : received.error ? (
          <p className="mt-4 text-sm text-accent-deep">Cloudflare said: {received.error}</p>
        ) : received.emails.length ? (
          <ul className="mt-4 max-h-[26rem] divide-y divide-line overflow-auto">
            {received.emails.map((e, i) => (
              <li key={`${e.at}-${i}`} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{e.subject || "(no subject)"}</span>
                  <span className="block truncate text-[12px] text-muted">
                    {e.from} → {e.to}
                  </span>
                </span>
                <Status value={e.status} />
                <span className="w-16 shrink-0 text-right text-[12px] text-muted">{ago(e.at, now)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Nothing received in the last 30 days.</p>
        )}
      </Tile>
    </div>
  );
}
