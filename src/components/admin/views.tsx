import {
  ExternalLink,
  FileText,
  Gamepad2,
  Link2,
  Mail,
  MousePointerClick,
  Send,
  Sparkles,
  StepForward,
} from "lucide-react";
import { HERO_KEYS, PRIMARY_HERO } from "@/components/hero/variants";
import { RANGES, type Dashboard, type RangeKey } from "@/lib/analytics-queries";
import { BarRow, Delta, DeviceIcon, Eyebrow, Flag, HeroGlyph, Tile, ago, countryName, fmt, pct } from "./bits";
import { DeviceDonut, TrafficChart } from "./charts";
import { DEVICE_COLORS, OTHER_COLOR, SERIES } from "./palette";

/**
 * The dashboard's four views. Each is laid out to fit one desktop screen, so
 * the sidebar switches between them instead of the page scrolling through all
 * of it.
 */

type ViewProps = { data: Dashboard; range: RangeKey };

const top = (rows: { visitors: number }[]) => Math.max(1, ...rows.map((r) => r.visitors));
const sourceLabel = (label: string | null) => label || "Direct";

function heroRows(data: Dashboard) {
  return HERO_KEYS.map(
    (key) =>
      data.heroes.find((h) => h.hero === key) ?? { hero: key, visitors: 0, played: 0, next: 0, clicked: 0, plays: [] },
  );
}

/* ── Funnel ─────────────────────────────────────────────────────────────── */

function Funnel({ steps }: { steps: Dashboard["funnel"] }) {
  const first = Math.max(1, steps[0]?.count ?? 0);
  const W = 1000;
  const H = 130;
  const col = W / steps.length;
  // One band that narrows step by step, with a soft waist between steps.
  const half = (count: number) => Math.max(3, (count / first) * (H / 2 - 4));
  const xs = steps.map((_, i) => i * col);
  const edge = (sign: 1 | -1) =>
    steps.map((s, i) => {
      const x0 = xs[i];
      const x1 = x0 + col * 0.62;
      const y = H / 2 + sign * half(s.count);
      const next = steps[i + 1];
      const ny = next ? H / 2 + sign * half(next.count) : y;
      return { x0, x1, y, ny };
    });
  const upper = edge(-1)
    .map((p, i) => `${i ? "L" : "M"}${p.x0} ${p.y} L${p.x1} ${p.y} C${p.x1 + col * 0.19} ${p.y} ${p.x1 + col * 0.19} ${p.ny} ${p.x0 + col} ${p.ny}`)
    .join(" ");
  const lower = edge(1)
    .reverse()
    .map((p) => `L${p.x0 + col} ${p.ny} C${p.x1 + col * 0.19} ${p.ny} ${p.x1 + col * 0.19} ${p.y} ${p.x1} ${p.y} L${p.x0} ${p.y}`)
    .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-28 w-full" role="img" aria-label="Homepage funnel">
        <defs>
          <linearGradient id="funnel-fill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#141210" />
            <stop offset="1" stopColor={SERIES.orange} />
          </linearGradient>
        </defs>
        {xs.slice(1).map((x) => (
          <line key={x} x1={x} x2={x} y1="0" y2={H} stroke="var(--color-line)" strokeDasharray="3 5" />
        ))}
        <path d={`${upper} ${lower} Z`} fill="url(#funnel-fill)" />
      </svg>
      <ol className="mt-3 grid grid-cols-5 gap-2">
        {steps.map((s, i) => (
          <li key={s.step} className="min-w-0" title={s.step}>
            <p className="font-display text-2xl font-bold leading-none tabular-nums">{fmt.format(s.count)}</p>
            <p className="mt-1.5 truncate text-[13px] text-ink-soft">{s.short}</p>
            <p className="mt-0.5 truncate text-[12px] tabular-nums text-muted">
              {i === 0 ? "everyone" : `${pct(s.count, steps[i - 1].count)}% of the step before`}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 88 88" className="size-[84px] shrink-0 -rotate-90" aria-hidden>
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

function Badge({
  children,
  icon,
  tone = "paper",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tone?: "paper" | "accent" | "ink";
}) {
  const tones = { paper: "bg-bg text-ink-soft", accent: "bg-accent/12 text-accent-deep", ink: "bg-ink text-bg" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {icon}
      {children}
    </span>
  );
}

const ACTION: Record<string, { label: string; Icon: typeof Mail }> = {
  cta: { label: "Clicked a button", Icon: MousePointerClick },
  lead: { label: "Sent a message", Icon: Send },
  hero_next: { label: "Opened the next hero", Icon: StepForward },
  hero_play: { label: "Played with the hero", Icon: Gamepad2 },
  outbound: { label: "Left through a link", Icon: ExternalLink },
};

/* ── Overview ───────────────────────────────────────────────────────────── */

export function OverviewView({ data, range }: ViewProps) {
  const { totals, previous } = data;
  const chart = data.points.map((p) => ({
    label:
      data.bucket === "hour"
        ? `${String(new Date(p.t).getUTCHours()).padStart(2, "0")}:00`
        : new Date(p.t).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
    visitors: p.visitors,
    pageviews: p.pageviews,
  }));
  const heroes = heroRows(data);
  const heroMax = Math.max(1, ...heroes.map((h) => h.visitors));
  const clickRate = pct(totals.clickers, totals.visitors);

  return (
    <div className="grid grid-cols-12 gap-4">
      <Tile className="col-span-12 xl:col-span-8 xl:row-span-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Visitors · last {RANGES[range].long}</Eyebrow>
            <div className="mt-3 flex items-end gap-3">
              <p className="font-display text-6xl font-bold leading-[0.85] tabular-nums">{fmt.format(totals.visitors)}</p>
              <Delta now={totals.visitors} before={previous.visitors} className="mb-0.5 text-ink-soft" />
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
        <div className="mt-4">
          <TrafficChart data={chart} />
        </div>
      </Tile>

      <Tile tone="accent" className="col-span-12 md:col-span-6 xl:col-span-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Eyebrow className="opacity-80">Clicked a button</Eyebrow>
            <div className="mt-3 flex items-end gap-3">
              <p className="font-display text-5xl font-bold leading-[0.85] tabular-nums">{fmt.format(totals.clickers)}</p>
              <Delta now={totals.clickers} before={previous.clickers} className="mb-0.5" />
            </div>
            <p className="mt-3 max-w-[15rem] text-[13px] leading-snug text-white/85">
              {clickRate}% of visitors pressed “Hire me”, “Work with me” or an email link.
            </p>
          </div>
          <div className="relative">
            <Ring value={clickRate} />
            <MousePointerClick className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2" aria-hidden />
          </div>
        </div>
      </Tile>

      <Tile tone="ink" className="col-span-6 md:col-span-3 xl:col-span-2">
        <Mail className="size-5 text-accent" aria-hidden />
        <p className="font-display mt-4 text-4xl font-bold leading-none tabular-nums">{fmt.format(totals.leads)}</p>
        <p className="mt-2 text-sm text-bg/70">messages sent</p>
        <Delta now={totals.leads} before={previous.leads} className="mt-2 text-bg/80" />
      </Tile>

      <Tile tone="sand" className="col-span-6 md:col-span-3 xl:col-span-2">
        <Gamepad2 className="size-5 text-accent-deep" aria-hidden />
        <p className="font-display mt-4 text-4xl font-bold leading-none tabular-nums">{fmt.format(totals.players)}</p>
        <p className="mt-2 text-sm text-ink-soft">played with a hero</p>
        <p className="mt-2 text-[12px] tabular-nums text-muted">{pct(totals.players, totals.visitors)}% of visitors</p>
      </Tile>

      <Tile className="col-span-12 xl:col-span-7">
        <Eyebrow>Where homepage visitors drop off</Eyebrow>
        <div className="mt-4">
          <Funnel steps={data.funnel} />
        </div>
      </Tile>

      <Tile className="col-span-12 xl:col-span-5">
        <div className="flex items-baseline justify-between">
          <Eyebrow>The five openings</Eyebrow>
          <p className="flex items-center gap-3 text-[11px] text-muted">
            <span>seen</span>
            <span className="w-11 text-right">played</span>
            <span className="w-11 text-right">clicked</span>
          </p>
        </div>
        <ul className="mt-3 space-y-2">
          {heroes.map((h) => (
            <li key={h.hero} className="flex items-center gap-3">
              <HeroGlyph hero={h.hero} className="size-8 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-sm font-bold capitalize">{h.hero}</span>
                  <span className="flex items-center gap-3 text-[13px] tabular-nums">
                    <span className="font-medium">{fmt.format(h.visitors)}</span>
                    <span className="w-11 text-right text-muted">{pct(h.played, h.visitors)}%</span>
                    <span className="w-11 text-right text-muted">{pct(h.clicked, h.visitors)}%</span>
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-bg">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${(h.visitors / heroMax) * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Tile>
    </div>
  );
}

/* ── Audience ───────────────────────────────────────────────────────────── */

export function AudienceView({ data }: ViewProps) {
  const total = data.totals.visitors;
  return (
    <div className="grid grid-cols-12 gap-4">
      <Tile className="col-span-12 md:col-span-6 xl:col-span-4">
        <Eyebrow>Where they are</Eyebrow>
        {data.countries.length ? (
          <ul className="mt-3 space-y-0.5">
            {data.countries.slice(0, 7).map((c) => (
              <BarRow
                key={c.label || "unknown"}
                lead={<Flag code={c.label} className="h-3.5 w-5" />}
                label={countryName(c.label)}
                value={c.visitors}
                max={top(data.countries)}
                total={total}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No visits yet.</p>
        )}
      </Tile>

      <Tile className="col-span-12 md:col-span-6 xl:col-span-4">
        <Eyebrow>What they use</Eyebrow>
        {data.devices.length ? (
          <div className="mt-2 grid grid-cols-[auto_1fr] items-center gap-5">
            <DeviceDonut data={data.devices.map((d) => ({ label: d.label || "unknown", visitors: d.visitors }))} />
            <div className="space-y-4 text-[13px]">
              <ul className="space-y-1.5">
                {data.devices.map((d) => (
                  <li key={d.label} className="flex items-center gap-1.5 capitalize">
                    <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: DEVICE_COLORS[d.label] ?? OTHER_COLOR }} />
                    <DeviceIcon device={d.label} className="size-3.5 text-muted" />
                    <span className="flex-1">{d.label || "unknown"}</span>
                    <span className="tabular-nums text-muted">{pct(d.visitors, total)}%</span>
                  </li>
                ))}
              </ul>
              {[
                { title: "Browser", rows: data.browsers },
                { title: "System", rows: data.systems },
              ].map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted">{group.title}</p>
                  <ul className="mt-1 space-y-0.5">
                    {group.rows.slice(0, 3).map((r) => (
                      <li key={r.label} className="flex justify-between gap-2">
                        <span className="truncate">{r.label || "Unknown"}</span>
                        <span className="tabular-nums text-muted">{pct(r.visitors, total)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">No visits yet.</p>
        )}
      </Tile>

      <Tile className="col-span-12 xl:col-span-4">
        <Eyebrow>How they found you</Eyebrow>
        {data.sources.length ? (
          <ul className="mt-3 space-y-0.5">
            {data.sources.map((s) => (
              <BarRow
                key={s.label || "direct"}
                lead={
                  <span className="flex size-6 items-center justify-center rounded-md border border-line bg-surface font-display text-[11px] font-bold uppercase">
                    {s.label ? s.label[0] : <Link2 className="size-3 text-muted" aria-hidden />}
                  </span>
                }
                label={sourceLabel(s.label)}
                value={s.visitors}
                max={top(data.sources)}
                total={total}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No visits yet.</p>
        )}
      </Tile>

      <Tile className="col-span-12">
        <div className="flex items-baseline justify-between">
          <Eyebrow>Latest visitors</Eyebrow>
          <p className="text-[12px] text-muted">No names, no addresses: one row per visitor per day.</p>
        </div>
        {data.people.length ? (
          <div className="-mx-2 mt-3 max-h-[19rem] overflow-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="sticky top-0 bg-surface">
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
                    <td className="px-2 py-2">
                      <span className="flex items-center gap-2">
                        <Flag code={p.country} className="h-3.5 w-5 shrink-0" />
                        <span className="truncate">{[p.city, countryName(p.country)].filter(Boolean).join(", ")}</span>
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span className="flex items-center gap-2 text-ink-soft">
                        <DeviceIcon device={p.device} className="size-4 shrink-0 text-muted" />
                        <span className="truncate">{[p.browser, p.os].filter(Boolean).join(" · ") || p.device}</span>
                      </span>
                    </td>
                    <td className="max-w-[9rem] truncate px-2 py-2 text-ink-soft">{sourceLabel(p.source)}</td>
                    <td className="px-2 py-2">
                      <span className="flex items-center gap-1.5">
                        {p.heroes[0] ? (
                          <HeroGlyph hero={p.heroes[0]} className="size-5 shrink-0" />
                        ) : (
                          <FileText className="size-4 shrink-0 text-muted" aria-hidden />
                        )}
                        <span className="max-w-[11rem] truncate font-mono text-[12px]">{p.landing ?? "–"}</span>
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{p.views}</td>
                    <td className="px-2 py-2">
                      <span className="flex gap-1">
                        {p.played ? <Badge icon={<Gamepad2 className="size-3" aria-hidden />}>played</Badge> : null}
                        {p.clicked ? (
                          <Badge tone="accent" icon={<MousePointerClick className="size-3" aria-hidden />}>
                            clicked
                          </Badge>
                        ) : null}
                        {p.sent ? (
                          <Badge tone="ink" icon={<Send className="size-3" aria-hidden />}>
                            wrote
                          </Badge>
                        ) : null}
                        {!p.played && !p.clicked && !p.sent ? <span className="text-muted">looked</span> : null}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-right text-[12px] text-muted">{ago(p.last, data.now)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Nobody yet in this period.</p>
        )}
      </Tile>
    </div>
  );
}

/* ── Openings ───────────────────────────────────────────────────────────── */

export function OpeningsView({ data }: ViewProps) {
  const heroes = heroRows(data);
  const max = Math.max(1, ...heroes.map((h) => h.visitors));
  return (
    <div className="grid grid-cols-12 gap-4">
      {heroes.map((h) => (
        <Tile key={h.hero} className="col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-4">
          <div className="flex items-start justify-between gap-3">
            <HeroGlyph hero={h.hero} className="size-14" />
            {h.hero === PRIMARY_HERO ? (
              <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-bg">
                first
              </span>
            ) : null}
          </div>
          <p className="font-display mt-4 text-xl font-bold capitalize">{h.hero}</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="font-display text-5xl font-bold leading-none tabular-nums">{fmt.format(h.visitors)}</p>
            <p className="pb-1 text-[13px] text-muted">saw it</p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg">
            <div className="h-full rounded-full bg-ink" style={{ width: `${(h.visitors / max) * 100}%` }} />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "played", value: h.played },
              { label: "went next", value: h.next },
              { label: "clicked", value: h.clicked },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-bg px-2 py-2">
                <dd className="font-display text-lg font-bold leading-none tabular-nums">{pct(m.value, h.visitors)}%</dd>
                <dt className="mt-1 text-[11px] text-muted">{m.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-3 min-h-[1.25rem] truncate text-[12px] text-muted">
            {h.plays.length ? h.plays.map((p) => `${p.kind} ${p.visitors}`).join(" · ") : "No play recorded yet"}
          </p>
        </Tile>
      ))}
      <Tile tone="sand" className="col-span-12 sm:col-span-6 xl:col-span-4">
        <Sparkles className="size-5 text-accent-deep" aria-hidden />
        <p className="font-display mt-4 text-xl font-bold">How to read this</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Everyone lands on Look. The others are seen only by visitors who press “next opening”, so
          compare the percentages, not the visitor counts.
        </p>
      </Tile>
    </div>
  );
}

/* ── Activity ───────────────────────────────────────────────────────────── */

export function ActivityView({ data }: ViewProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Tile className="col-span-12 xl:col-span-6">
        <Eyebrow>Most-read pages</Eyebrow>
        {data.pages.length ? (
          <ul className="mt-3 space-y-0.5">
            {data.pages.map((p) => (
              <BarRow key={p.label} label={p.label} value={p.visitors} max={top(data.pages)} total={data.totals.visitors} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No page views yet.</p>
        )}
      </Tile>

      <Tile tone="ink" className="col-span-12 xl:col-span-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-accent" aria-hidden />
          <Eyebrow>Latest actions</Eyebrow>
        </div>
        {data.recent.length ? (
          <ul className="mt-4 space-y-3">
            {data.recent.map((e) => {
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
  );
}
