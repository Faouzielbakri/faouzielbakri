import type { Metadata } from "next";
import Link from "next/link";
import {
  ExternalLink,
  FileText,
  Gamepad2,
  Link2,
  LogOut,
  Mail,
  MousePointerClick,
  Send,
  Sparkles,
  StepForward,
} from "lucide-react";
import { BarRow, Delta, DeviceIcon, Eyebrow, Flag, HeroGlyph, Tile, ago, countryName, fmt, pct } from "@/components/admin/bits";
import { DeviceDonut, TrafficChart } from "@/components/admin/charts";
import { DEVICE_COLORS, OTHER_COLOR, SERIES } from "@/components/admin/palette";
import { HERO_KEYS } from "@/components/hero/variants";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { loadDashboard, RANGES, type Dashboard, type RangeKey } from "@/lib/analytics-queries";
import { signIn, signOut } from "./actions";

/**
 * The owner's dashboard: who came, from where and on what, which hero they
 * met, what they did, and where they left. Private (password, noindex) and
 * read straight from the site's own Event table.
 */
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto min-h-screen w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">{children}</main>;
}

/* ── Funnel ─────────────────────────────────────────────────────────────── */

function Funnel({ steps }: { steps: Dashboard["funnel"] }) {
  const first = Math.max(1, steps[0]?.count ?? 0);
  const W = 1000;
  const H = 150;
  const col = W / steps.length;
  // A band that narrows step by step, drawn as one shape with a soft waist.
  const half = (count: number) => Math.max(3, (count / first) * (H / 2 - 4));
  const xs = steps.map((_, i) => i * col);
  const top = steps
    .map((s, i) => {
      const x0 = xs[i];
      const x1 = x0 + col * 0.62;
      const y = H / 2 - half(s.count);
      const next = steps[i + 1];
      const ny = next ? H / 2 - half(next.count) : y;
      return `${i ? "L" : "M"}${x0} ${y} L${x1} ${y} C${x1 + col * 0.19} ${y} ${x1 + col * 0.19} ${ny} ${x0 + col} ${ny}`;
    })
    .join(" ");
  const bottom = [...steps]
    .map((s, i) => ({ s, i }))
    .reverse()
    .map(({ s, i }) => {
      const x0 = xs[i];
      const x1 = x0 + col * 0.62;
      const y = H / 2 + half(s.count);
      const next = steps[i + 1];
      const ny = next ? H / 2 + half(next.count) : y;
      return `L${x0 + col} ${ny} C${x1 + col * 0.19} ${ny} ${x1 + col * 0.19} ${y} ${x1} ${y} L${x0} ${y}`;
    })
    .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-36 w-full" role="img" aria-label="Homepage funnel">
        <defs>
          <linearGradient id="funnel-fill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#141210" />
            <stop offset="1" stopColor={SERIES.orange} />
          </linearGradient>
        </defs>
        {xs.slice(1).map((x) => (
          <line key={x} x1={x} x2={x} y1="0" y2={H} stroke="var(--color-line)" strokeDasharray="3 5" />
        ))}
        <path d={`${top} ${bottom} Z`} fill="url(#funnel-fill)" />
      </svg>
      <ol className="mt-4 grid grid-cols-5 gap-2">
        {steps.map((s, i) => {
          const previous = i ? steps[i - 1].count : s.count;
          const kept = pct(s.count, previous);
          return (
            <li key={s.step} className="min-w-0" title={s.step}>
              <p className="font-display text-2xl font-bold leading-none tabular-nums">{fmt.format(s.count)}</p>
              <p className="mt-1.5 truncate text-[13px] text-ink-soft">{s.short}</p>
              <p className="mt-1 text-[12px] tabular-nums text-muted">
                {i === 0 ? "everyone" : `${kept}% of the step before`}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── Conversion ring ────────────────────────────────────────────────────── */

function Ring({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 88 88" className="size-[88px] shrink-0 -rotate-90" aria-hidden>
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="9" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(Math.min(100, value) / 100) * c} ${c}`}
      />
    </svg>
  );
}

const SOURCE_LABEL = (label: string) => label || "Direct";

const ACTION: Record<string, { label: string; Icon: typeof Mail }> = {
  cta: { label: "Clicked a button", Icon: MousePointerClick },
  lead: { label: "Sent a message", Icon: Send },
  hero_next: { label: "Opened the next hero", Icon: StepForward },
  hero_play: { label: "Played with the hero", Icon: Gamepad2 },
  outbound: { label: "Left through a link", Icon: ExternalLink },
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;

  if (!adminConfigured()) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-4 max-w-md text-muted">
          Set <code className="font-mono text-ink">ADMIN_PASSWORD</code> in the environment to open the
          dashboard.
        </p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <form action={signIn} className="mx-auto mt-[16vh] max-w-sm rounded-[28px] border border-line bg-surface p-8">
          <HeroGlyph hero="look" className="size-12" />
          <h1 className="font-display mt-5 text-3xl font-bold leading-none">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">Owner only.</p>
          <label className="mt-6 block">
            <Eyebrow>Password</Eyebrow>
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

  const header = (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <HeroGlyph hero="look" className="size-12" />
        <div>
          <Eyebrow>faouzielbakri.com</Eyebrow>
          <h1 className="font-display mt-1 text-3xl font-bold leading-none">Dashboard</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {data ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px]">
            <span className="relative flex size-2">
              {data.live > 0 ? (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0fa37a] opacity-60" />
              ) : null}
              <span className={`relative inline-flex size-2 rounded-full ${data.live > 0 ? "bg-[#0fa37a]" : "bg-line"}`} />
            </span>
            <span className="tabular-nums font-medium">{data.live}</span>
            <span className="text-muted">on the site now</span>
          </span>
        ) : null}
        <nav className="inline-flex rounded-full border border-line bg-surface p-1 text-sm" aria-label="Period">
          {(Object.keys(RANGES) as RangeKey[]).map((key) => (
            <Link
              key={key}
              href={`/admin?range=${key}`}
              title={`Last ${RANGES[key].long}`}
              className={`rounded-full px-3.5 py-1.5 tabular-nums transition-colors ${
                key === range ? "bg-ink text-bg" : "text-ink-soft hover:text-ink"
              }`}
            >
              {RANGES[key].label}
            </Link>
          ))}
        </nav>
        <form action={signOut}>
          <button
            type="submit"
            title="Sign out"
            className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink"
          >
            <LogOut className="size-4" aria-hidden />
            <span className="sr-only">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );

  if (!data) {
    return (
      <Shell>
        {header}
        <p className="mt-10 max-w-md text-muted">
          No database connected. Set <code className="font-mono text-ink">DATABASE_URL</code> to start
          recording visits.
        </p>
      </Shell>
    );
  }

  const { totals, previous } = data;
  const chart = data.points.map((p) => ({
    label:
      data.bucket === "hour"
        ? `${String(new Date(p.t).getUTCHours()).padStart(2, "0")}:00`
        : new Date(p.t).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
    visitors: p.visitors,
    pageviews: p.pageviews,
  }));
  const heroes = HERO_KEYS.map(
    (key) => data.heroes.find((h) => h.hero === key) ?? { hero: key, visitors: 0, played: 0, next: 0, clicked: 0, plays: [] },
  );
  const heroMax = Math.max(1, ...heroes.map((h) => h.visitors));
  const top = (rows: { visitors: number }[]) => Math.max(1, ...rows.map((r) => r.visitors));
  const clickRate = pct(totals.clickers, totals.visitors);

  return (
    <Shell>
      {header}

      <div className="mt-6 grid grid-cols-12 gap-4">
        {/* ── Traffic ───────────────────────────────────────────── */}
        <Tile className="col-span-12 lg:col-span-8 lg:row-span-2">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Visitors · last {RANGES[range].long}</Eyebrow>
              <div className="mt-3 flex items-end gap-3">
                <p className="font-display text-7xl font-bold leading-[0.85] tabular-nums">{fmt.format(totals.visitors)}</p>
                <Delta now={totals.visitors} before={previous.visitors} className="mb-1 text-ink-soft" />
              </div>
            </div>
            <dl className="flex gap-6 text-right">
              <div>
                <dt className="text-[12px] text-muted">Page views</dt>
                <dd className="font-display text-2xl font-bold tabular-nums">{fmt.format(totals.pageviews)}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-muted">Per visitor</dt>
                <dd className="font-display text-2xl font-bold tabular-nums">
                  {totals.visitors ? (totals.pageviews / totals.visitors).toFixed(1) : "–"}
                </dd>
              </div>
            </dl>
          </div>
          <div className="mt-6">
            <TrafficChart data={chart} />
          </div>
          <p className="mt-2 text-[12px] text-muted">
            Per {data.bucket}, UTC. Your own visits are not counted while you are signed in here.
          </p>
        </Tile>

        {/* ── Clicked ───────────────────────────────────────────── */}
        <Tile tone="accent" className="col-span-12 sm:col-span-6 lg:col-span-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow className="opacity-80">Clicked a button</Eyebrow>
              <div className="mt-3 flex items-end gap-3">
                <p className="font-display text-6xl font-bold leading-[0.85] tabular-nums">{fmt.format(totals.clickers)}</p>
                <Delta now={totals.clickers} before={previous.clickers} className="mb-1" />
              </div>
              <p className="mt-4 max-w-[16rem] text-sm text-white/85">
                {clickRate}% of visitors pressed “Hire me”, “Work with me” or an email link.
              </p>
            </div>
            <div className="relative">
              <Ring value={clickRate} />
              <MousePointerClick className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2" aria-hidden />
            </div>
          </div>
        </Tile>

        {/* ── Messages ──────────────────────────────────────────── */}
        <Tile tone="ink" className="col-span-6 sm:col-span-3 lg:col-span-2">
          <Mail className="size-5 text-accent" aria-hidden />
          <p className="font-display mt-6 text-5xl font-bold leading-none tabular-nums">{fmt.format(totals.leads)}</p>
          <p className="mt-2 text-sm text-bg/70">messages sent</p>
          <Delta now={totals.leads} before={previous.leads} className="mt-3 text-bg/80" />
        </Tile>

        {/* ── Played ────────────────────────────────────────────── */}
        <Tile tone="sand" className="col-span-6 sm:col-span-3 lg:col-span-2">
          <Gamepad2 className="size-5 text-accent-deep" aria-hidden />
          <p className="font-display mt-6 text-5xl font-bold leading-none tabular-nums">{fmt.format(totals.players)}</p>
          <p className="mt-2 text-sm text-ink-soft">played with a hero</p>
          <p className="mt-3 text-[12px] tabular-nums text-muted">{pct(totals.players, totals.visitors)}% of visitors</p>
        </Tile>

        {/* ── Funnel ────────────────────────────────────────────── */}
        <Tile className="col-span-12 lg:col-span-7">
          <Eyebrow>Where homepage visitors drop off</Eyebrow>
          <p className="mt-1 text-[13px] text-muted">From landing to a message in your inbox.</p>
          <div className="mt-5">
            <Funnel steps={data.funnel} />
          </div>
        </Tile>

        {/* ── Heroes ────────────────────────────────────────────── */}
        <Tile className="col-span-12 lg:col-span-5">
          <div className="flex items-baseline justify-between">
            <Eyebrow>The five openings</Eyebrow>
            <p className="flex items-center gap-3 text-[11px] text-muted">
              <span>seen</span>
              <span className="w-12 text-right">played</span>
              <span className="w-12 text-right">clicked</span>
            </p>
          </div>
          <ul className="mt-4 space-y-2.5">
            {heroes.map((h) => (
              <li key={h.hero} className="flex items-center gap-3" title={h.plays.map((p) => `${p.kind}: ${p.visitors}`).join(" · ")}>
                <HeroGlyph hero={h.hero} className="size-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display font-bold capitalize">{h.hero}</span>
                    <span className="flex items-center gap-3 text-sm tabular-nums">
                      <span className="font-medium">{fmt.format(h.visitors)}</span>
                      <span className="w-12 text-right text-muted">{pct(h.played, h.visitors)}%</span>
                      <span className="w-12 text-right text-muted">{pct(h.clicked, h.visitors)}%</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg">
                    <div className="h-full rounded-full bg-ink" style={{ width: `${(h.visitors / heroMax) * 100}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Tile>

        {/* ── Countries ─────────────────────────────────────────── */}
        <Tile className="col-span-12 md:col-span-6 lg:col-span-4">
          <Eyebrow>Where they are</Eyebrow>
          {data.countries.length ? (
            <ul className="mt-4 space-y-1">
              {data.countries.map((c) => (
                <BarRow
                  key={c.label || "unknown"}
                  lead={<Flag code={c.label} className="h-3.5 w-5" />}
                  label={countryName(c.label)}
                  value={c.visitors}
                  max={top(data.countries)}
                  total={totals.visitors}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No visits yet.</p>
          )}
        </Tile>

        {/* ── Devices ───────────────────────────────────────────── */}
        <Tile className="col-span-12 md:col-span-6 lg:col-span-4">
          <Eyebrow>What they use</Eyebrow>
          {data.devices.length ? (
            <>
              <DeviceDonut data={data.devices.map((d) => ({ label: d.label || "unknown", visitors: d.visitors }))} />
              <ul className="mt-1 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px]">
                {data.devices.map((d) => (
                  <li key={d.label} className="flex items-center gap-1.5 capitalize">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-[3px]"
                      style={{ background: DEVICE_COLORS[d.label] ?? OTHER_COLOR }}
                    />
                    <DeviceIcon device={d.label} className="size-3.5 text-muted" />
                    {d.label || "unknown"}
                    <span className="tabular-nums text-muted">{pct(d.visitors, totals.visitors)}%</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-[13px]">
                {[
                  { title: "Browser", rows: data.browsers },
                  { title: "System", rows: data.systems },
                ].map((group) => (
                  <div key={group.title}>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted">{group.title}</p>
                    <ul className="mt-2 space-y-1">
                      {group.rows.slice(0, 4).map((r) => (
                        <li key={r.label} className="flex justify-between gap-2">
                          <span className="truncate">{r.label || "Unknown"}</span>
                          <span className="tabular-nums text-muted">{pct(r.visitors, totals.visitors)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">No visits yet.</p>
          )}
        </Tile>

        {/* ── Sources ───────────────────────────────────────────── */}
        <Tile className="col-span-12 lg:col-span-4">
          <Eyebrow>How they found you</Eyebrow>
          {data.sources.length ? (
            <ul className="mt-4 space-y-1">
              {data.sources.map((s) => (
                <BarRow
                  key={s.label || "direct"}
                  lead={
                    <span className="flex size-6 items-center justify-center rounded-md border border-line bg-surface font-display text-[11px] font-bold uppercase">
                      {s.label ? s.label[0] : <Link2 className="size-3 text-muted" aria-hidden />}
                    </span>
                  }
                  label={SOURCE_LABEL(s.label)}
                  value={s.visitors}
                  max={top(data.sources)}
                  total={totals.visitors}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No visits yet.</p>
          )}
        </Tile>

        {/* ── People ────────────────────────────────────────────── */}
        <Tile className="col-span-12 lg:col-span-8 lg:row-span-2">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Latest visitors</Eyebrow>
            <p className="text-[12px] text-muted">No names, no addresses: one row per visitor per day.</p>
          </div>
          {data.people.length ? (
            <div className="-mx-2 mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-[0.15em] text-muted">
                    <th className="px-2 pb-2 font-normal">From</th>
                    <th className="px-2 pb-2 font-normal">On</th>
                    <th className="px-2 pb-2 font-normal">Came via</th>
                    <th className="px-2 pb-2 font-normal">Landed on</th>
                    <th className="px-2 pb-2 text-right font-normal">Pages</th>
                    <th className="px-2 pb-2 font-normal">Did</th>
                    <th className="px-2 pb-2 text-right font-normal">Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {data.people.map((p) => (
                    <tr key={p.id} className="border-t border-line">
                      <td className="px-2 py-2.5">
                        <span className="flex items-center gap-2">
                          <Flag code={p.country} className="h-3.5 w-5 shrink-0" />
                          <span className="truncate">{[p.city, countryName(p.country)].filter(Boolean).join(", ")}</span>
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className="flex items-center gap-2 text-ink-soft">
                          <DeviceIcon device={p.device} className="size-4 shrink-0 text-muted" />
                          <span className="truncate">{[p.browser, p.os].filter(Boolean).join(" · ") || p.device}</span>
                        </span>
                      </td>
                      <td className="max-w-[9rem] truncate px-2 py-2.5 text-ink-soft">{SOURCE_LABEL(p.source ?? "")}</td>
                      <td className="px-2 py-2.5">
                        <span className="flex items-center gap-1.5">
                          {p.heroes[0] ? <HeroGlyph hero={p.heroes[0]} className="size-5 shrink-0" /> : <FileText className="size-4 shrink-0 text-muted" aria-hidden />}
                          <span className="max-w-[9rem] truncate font-mono text-[12px]">{p.landing ?? "–"}</span>
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums">{p.views}</td>
                      <td className="px-2 py-2.5">
                        <span className="flex gap-1">
                          {p.played ? <Badge icon={<Gamepad2 className="size-3" aria-hidden />}>played</Badge> : null}
                          {p.clicked ? <Badge tone="accent" icon={<MousePointerClick className="size-3" aria-hidden />}>clicked</Badge> : null}
                          {p.sent ? <Badge tone="ink" icon={<Send className="size-3" aria-hidden />}>wrote</Badge> : null}
                          {!p.played && !p.clicked && !p.sent ? <span className="text-muted">looked</span> : null}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-right text-[12px] text-muted">{ago(p.last, data.now)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Nobody yet in this period.</p>
          )}
        </Tile>

        {/* ── Pages ─────────────────────────────────────────────── */}
        <Tile className="col-span-12 md:col-span-6 lg:col-span-4">
          <Eyebrow>Most-read pages</Eyebrow>
          {data.pages.length ? (
            <ul className="mt-4 space-y-1">
              {data.pages.map((p) => (
                <BarRow
                  key={p.label}
                  label={p.label}
                  value={p.visitors}
                  max={top(data.pages)}
                  total={totals.visitors}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No page views yet.</p>
          )}
        </Tile>

        {/* ── Feed ──────────────────────────────────────────────── */}
        <Tile tone="ink" className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" aria-hidden />
            <Eyebrow>Latest actions</Eyebrow>
          </div>
          {data.recent.length ? (
            <ul className="mt-4 space-y-3">
              {data.recent.slice(0, 7).map((e) => {
                const action = ACTION[e.name] ?? { label: e.name, Icon: Sparkles };
                const detail = [e.hero, ...Object.entries(e.props).filter(([k]) => k !== "from").map(([, v]) => String(v))]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li key={e.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-bg/10">
                      <action.Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block leading-tight">{action.label}</span>
                      <span className="block truncate text-[12px] text-bg/55">{detail || e.path}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[12px] text-bg/55">
                      <Flag code={e.country} className="h-3 w-[18px]" />
                      {ago(e.at, data.now)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-bg/60">Nothing yet in this period.</p>
          )}
        </Tile>
      </div>
    </Shell>
  );
}

function Badge({
  children,
  icon,
  tone = "paper",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tone?: "paper" | "accent" | "ink";
}) {
  const tones = {
    paper: "bg-bg text-ink-soft",
    accent: "bg-accent/12 text-accent-deep",
    ink: "bg-ink text-bg",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {icon}
      {children}
    </span>
  );
}
