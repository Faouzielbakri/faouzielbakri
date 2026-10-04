import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { loadDashboard, RANGES, type Dashboard, type RangeKey } from "@/lib/analytics-queries";
import { signIn, signOut } from "./actions";

/**
 * The owner's dashboard: who came, which hero they met, what they did, and
 * where they left. Private (password, noindex) and read straight from the
 * site's own Event table.
 */
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const number = new Intl.NumberFormat("en-US");
const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "–");

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="rail min-h-screen py-10">{children}</main>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">{children}</p>;
}

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <Label>{title}</Label>
      {note ? <p className="mt-1 text-[13px] text-muted">{note}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <Label>{label}</Label>
      <p className="font-display mt-3 text-4xl font-bold leading-none tabular-nums">{value}</p>
      {note ? <p className="mt-2 text-[13px] text-muted">{note}</p> : null}
    </div>
  );
}

/** Visitors over time: one series, so one ink colour and no legend. */
function VisitorsChart({ points, bucket }: Pick<Dashboard, "points" | "bucket">) {
  const W = 960;
  const H = 220;
  const pad = { top: 16, right: 8, bottom: 26, left: 34 };
  const max = Math.max(4, ...points.map((p) => p.visitors));
  const top = Math.ceil(max / 4) * 4;
  const slot = (W - pad.left - pad.right) / Math.max(1, points.length);
  const bar = Math.max(2, Math.min(28, slot - 2));
  const y = (v: number) => pad.top + (1 - v / top) * (H - pad.top - pad.bottom);
  const label = (t: number) =>
    bucket === "hour"
      ? `${String(new Date(t).getUTCHours()).padStart(2, "0")}:00`
      : new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const every = Math.ceil(points.length / 8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Visitors over time">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line
            x1={pad.left}
            x2={W - pad.right}
            y1={y(top * f)}
            y2={y(top * f)}
            stroke="var(--color-line)"
            strokeWidth="1"
          />
          <text x={pad.left - 8} y={y(top * f) + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">
            {number.format(top * f)}
          </text>
        </g>
      ))}
      {points.map((p, i) => {
        const x = pad.left + i * slot + (slot - bar) / 2;
        const h = Math.max(p.visitors ? 2 : 0, H - pad.bottom - y(p.visitors));
        return (
          <g key={p.t} className="group">
            {/* Full-height hit area so thin bars are easy to hover */}
            <rect x={pad.left + i * slot} y={pad.top} width={slot} height={H - pad.top - pad.bottom} fill="transparent" />
            <rect
              x={x}
              y={H - pad.bottom - h}
              width={bar}
              height={h}
              rx={Math.min(4, bar / 2)}
              className="fill-ink transition-colors group-hover:fill-accent"
            />
            {/* One string: several text nodes inside <title> break hydration. */}
            <title>{`${label(p.t)}: ${p.visitors} visitors, ${p.pageviews} page views`}</title>
            {i % every === 0 ? (
              <text x={x + bar / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--color-muted)">
                {label(p.t)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function Funnel({ steps }: { steps: Dashboard["funnel"] }) {
  const first = steps[0]?.count ?? 0;
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const previous = i ? steps[i - 1].count : s.count;
        const lost = previous - s.count;
        return (
          <li key={s.step} className="grid grid-cols-[13rem_1fr_auto] items-center gap-4 text-sm">
            <span className="text-ink-soft">{s.step}</span>
            <span className="h-3 overflow-hidden rounded-full bg-bg">
              <span
                className="block h-full rounded-full bg-ink"
                style={{ width: first ? `${Math.max(s.count ? 1.5 : 0, (s.count / first) * 100)}%` : 0 }}
              />
            </span>
            <span className="w-44 text-right tabular-nums">
              <span className="font-medium">{number.format(s.count)}</span>
              <span className="ml-2 text-muted">{pct(s.count, first)}</span>
              {i > 0 && lost > 0 ? (
                <span className="ml-2 text-accent-deep">−{number.format(lost)}</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function RankList({ rows, empty }: { rows: { label: string; visitors: number }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.visitors));
  if (!rows.length) return <p className="text-sm text-muted">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <span className="truncate text-ink-soft">{r.label}</span>
            <span className="tabular-nums">{number.format(r.visitors)}</span>
          </div>
          <div className="mt-1 h-1 rounded-full bg-bg">
            <div className="h-full rounded-full bg-ink/70" style={{ width: `${(r.visitors / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const EVENT_LABEL: Record<string, string> = {
  cta: "Clicked a button",
  lead: "Sent a message",
  hero_next: "Opened the next hero",
  hero_play: "Played with the hero",
  outbound: "Left through a link",
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;

  if (!adminConfigured()) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-4 max-w-md text-muted">
          Set <code className="font-mono text-ink">ADMIN_PASSWORD</code> in the environment to open
          the dashboard.
        </p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <form action={signIn} className="mx-auto mt-[18vh] max-w-sm rounded-2xl border border-line bg-surface p-8">
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">Owner only.</p>
          <label className="mt-6 block">
            <Label>Password</Label>
            <input name="password" type="password" required autoFocus className="field mt-2" />
          </label>
          {params.wrong ? <p className="mt-3 text-sm text-accent-deep">Wrong password.</p> : null}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent"
          >
            Open
          </button>
        </form>
      </Shell>
    );
  }

  const range = (typeof params.range === "string" && params.range in RANGES ? params.range : "7d") as RangeKey;
  const data = await loadDashboard(range);

  return (
    <Shell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>faouzielbakri.com</Label>
          <h1 className="font-display mt-2 text-4xl font-bold leading-none">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <nav className="inline-flex rounded-full border border-line bg-surface p-1 text-sm" aria-label="Period">
            {(Object.keys(RANGES) as RangeKey[]).map((key) => (
              <Link
                key={key}
                href={`/admin?range=${key}`}
                className={`rounded-full px-4 py-1.5 transition-colors ${
                  key === range ? "bg-ink text-bg" : "text-ink-soft hover:text-ink"
                }`}
              >
                {RANGES[key].label}
              </Link>
            ))}
          </nav>
          <form action={signOut}>
            <button type="submit" className="text-sm text-muted underline decoration-dotted underline-offset-4 hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {!data ? (
        <p className="mt-10 max-w-md text-muted">
          No database connected. Set <code className="font-mono text-ink">DATABASE_URL</code> to start
          recording visits.
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <Tile label="Visitors" value={number.format(data.totals.visitors)} note={`${number.format(data.totals.pageviews)} page views`} />
            <Tile label="Played with a hero" value={number.format(data.totals.players)} note={`${pct(data.totals.players, data.totals.visitors)} of visitors`} />
            <Tile label="Clicked a button" value={number.format(data.totals.clickers)} note={`${pct(data.totals.clickers, data.totals.visitors)} of visitors`} />
            <Tile label="Messages sent" value={number.format(data.totals.leads)} note="through the contact form" />
            <Tile label="Views per visitor" value={data.totals.visitors ? (data.totals.pageviews / data.totals.visitors).toFixed(1) : "–"} />
          </div>

          <Card title="Visitors" note={`Per ${data.bucket}, UTC. Your own visits are not counted while you are signed in here.`}>
            <VisitorsChart points={data.points} bucket={data.bucket} />
          </Card>

          <Card title="Where homepage visitors drop off" note="Share of everyone who opened the homepage, and how many were lost at each step.">
            <Funnel steps={data.funnel} />
          </Card>

          <Card title="Heroes" note="Look is what everyone lands on; the others are reached with “next opening”.">
            {data.heroes.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    <th className="pb-2 font-normal">Hero</th>
                    <th className="pb-2 text-right font-normal">Visitors</th>
                    <th className="pb-2 text-right font-normal">Played with it</th>
                    <th className="pb-2 text-right font-normal">Went to next</th>
                    <th className="pb-2 text-right font-normal">Clicked a button</th>
                    <th className="pb-2 pl-6 font-normal">What they did</th>
                  </tr>
                </thead>
                <tbody>
                  {data.heroes.map((h) => (
                    <tr key={h.hero} className="border-b border-line last:border-0">
                      <td className="py-3 font-display text-base font-bold capitalize">{h.hero}</td>
                      <td className="py-3 text-right tabular-nums">{number.format(h.visitors)}</td>
                      <td className="py-3 text-right tabular-nums">
                        {number.format(h.played)} <span className="text-muted">{pct(h.played, h.visitors)}</span>
                      </td>
                      <td className="py-3 text-right tabular-nums">
                        {number.format(h.next)} <span className="text-muted">{pct(h.next, h.visitors)}</span>
                      </td>
                      <td className="py-3 text-right tabular-nums">
                        {number.format(h.clicked)} <span className="text-muted">{pct(h.clicked, h.visitors)}</span>
                      </td>
                      <td className="py-3 pl-6 text-muted">
                        {data.plays
                          .filter((p) => p.hero === h.hero)
                          .map((p) => `${p.kind} ${p.visitors}`)
                          .join(" · ") || "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted">No homepage visits in this period yet.</p>
            )}
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="Pages">
              <RankList rows={data.pages} empty="No page views yet." />
            </Card>
            <Card title="Where they came from">
              <RankList rows={data.sources} empty="No visits yet." />
            </Card>
            <Card title="Countries">
              <RankList rows={data.countries} empty="No visits yet." />
            </Card>
            <Card title="Devices">
              <RankList rows={data.devices} empty="No visits yet." />
            </Card>
          </div>

          <Card title="Latest actions">
            {data.recent.length ? (
              <ul className="divide-y divide-line text-sm">
                {data.recent.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5">
                    <time className="w-36 shrink-0 font-mono text-[11px] text-muted" dateTime={e.at}>
                      {e.at.slice(0, 16).replace("T", " ")}
                    </time>
                    <span className="font-medium">{EVENT_LABEL[e.name] ?? e.name}</span>
                    <span className="text-muted">
                      {[
                        e.hero ? `hero: ${e.hero}` : e.path,
                        ...Object.values(e.props).map(String),
                        e.source,
                        e.country,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">Nothing yet in this period.</p>
            )}
          </Card>
        </div>
      )}
    </Shell>
  );
}
