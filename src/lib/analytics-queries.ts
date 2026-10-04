import { db } from "@/lib/db";

/**
 * Read side of the site's analytics: everything the /admin dashboard shows.
 * Visitor ids rotate daily, so over several days "visitors" means the sum of
 * each day's unique visitors, not unique people.
 */
export const RANGES = {
  "24h": { label: "24 hours", hours: 24, bucket: "hour" },
  "7d": { label: "7 days", hours: 24 * 7, bucket: "day" },
  "30d": { label: "30 days", hours: 24 * 30, bucket: "day" },
  "90d": { label: "90 days", hours: 24 * 90, bucket: "day" },
} as const;
export type RangeKey = keyof typeof RANGES;

const n = (value: unknown) => Number(value ?? 0);

export type Dashboard = NonNullable<Awaited<ReturnType<typeof loadDashboard>>>;

export async function loadDashboard(range: RangeKey) {
  const prisma = db();
  if (!prisma) return null;
  const { hours, bucket } = RANGES[range];
  const since = new Date(Date.now() - hours * 3600_000);

  const [totals, series, funnel, heroes, plays, pages, sources, countries, devices, recent] =
    await Promise.all([
      prisma.$queryRaw<Record<string, bigint>[]>`
        SELECT
          count(DISTINCT visitor) FILTER (WHERE name = 'pageview') AS visitors,
          count(*) FILTER (WHERE name = 'pageview') AS pageviews,
          count(DISTINCT visitor) FILTER (WHERE name = 'cta') AS clickers,
          count(DISTINCT visitor) FILTER (WHERE name = 'hero_play') AS players,
          count(*) FILTER (WHERE name = 'lead') AS leads
        FROM "Event" WHERE "createdAt" >= ${since}`,
      prisma.$queryRaw<{ t: Date; visitors: bigint; pageviews: bigint }[]>`
        SELECT date_trunc(${bucket}, "createdAt") AS t,
          count(DISTINCT visitor) AS visitors, count(*) AS pageviews
        FROM "Event" WHERE name = 'pageview' AND "createdAt" >= ${since}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw<Record<string, bigint>[]>`
        WITH home AS (
          SELECT DISTINCT visitor FROM "Event"
          WHERE name = 'pageview' AND path = '/' AND "createdAt" >= ${since}
        ), acts AS (
          SELECT e.visitor, e.name, e.props->>'id' AS section
          FROM "Event" e JOIN home USING (visitor) WHERE e."createdAt" >= ${since}
        )
        SELECT
          (SELECT count(*) FROM home) AS landed,
          count(DISTINCT visitor) FILTER (WHERE name = 'section' AND section = 'work') AS work,
          count(DISTINCT visitor) FILTER (WHERE name = 'section' AND section = 'contact') AS contact,
          count(DISTINCT visitor) FILTER (WHERE name = 'cta') AS clicked,
          count(DISTINCT visitor) FILTER (WHERE name = 'lead') AS sent
        FROM acts`,
      prisma.$queryRaw<{ hero: string; visitors: bigint; played: bigint; next: bigint; clicked: bigint }[]>`
        SELECT hero,
          count(DISTINCT visitor) FILTER (WHERE name = 'pageview') AS visitors,
          count(DISTINCT visitor) FILTER (WHERE name = 'hero_play') AS played,
          count(DISTINCT visitor) FILTER (WHERE name = 'hero_next') AS next,
          count(DISTINCT visitor) FILTER (WHERE name = 'cta') AS clicked
        FROM "Event" WHERE hero IS NOT NULL AND "createdAt" >= ${since}
        GROUP BY hero ORDER BY visitors DESC`,
      prisma.$queryRaw<{ hero: string; kind: string; visitors: bigint }[]>`
        SELECT hero, props->>'kind' AS kind, count(DISTINCT visitor) AS visitors
        FROM "Event" WHERE name = 'hero_play' AND hero IS NOT NULL AND "createdAt" >= ${since}
        GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 24`,
      prisma.$queryRaw<{ label: string; visitors: bigint }[]>`
        SELECT path AS label, count(DISTINCT visitor) AS visitors
        FROM "Event" WHERE name = 'pageview' AND "createdAt" >= ${since}
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      prisma.$queryRaw<{ label: string; visitors: bigint }[]>`
        SELECT coalesce(source, 'Direct / unknown') AS label, count(DISTINCT visitor) AS visitors
        FROM "Event" WHERE name = 'pageview' AND "createdAt" >= ${since}
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      prisma.$queryRaw<{ label: string; visitors: bigint }[]>`
        SELECT coalesce(country, 'Unknown') AS label, count(DISTINCT visitor) AS visitors
        FROM "Event" WHERE name = 'pageview' AND "createdAt" >= ${since}
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      prisma.$queryRaw<{ label: string; visitors: bigint }[]>`
        SELECT coalesce(device, 'Unknown') AS label, count(DISTINCT visitor) AS visitors
        FROM "Event" WHERE name = 'pageview' AND "createdAt" >= ${since}
        GROUP BY 1 ORDER BY 2 DESC`,
      prisma.event.findMany({
        where: { createdAt: { gte: since }, name: { in: ["cta", "lead", "hero_next", "hero_play", "outbound"] } },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

  // Fill the gaps so a quiet day shows as an empty slot, not a missing one.
  const step = bucket === "hour" ? 3600_000 : 86_400_000;
  const found = new Map(series.map((row) => [new Date(row.t).getTime(), row]));
  const start = Math.floor(since.getTime() / step) * step + step;
  const points: { t: number; visitors: number; pageviews: number }[] = [];
  for (let t = start; t <= Date.now(); t += step) {
    const row = found.get(t);
    points.push({ t, visitors: n(row?.visitors), pageviews: n(row?.pageviews) });
  }

  const rows = (list: { label: string; visitors: bigint }[]) =>
    list.map((r) => ({ label: r.label, visitors: n(r.visitors) }));
  const f = funnel[0] ?? {};

  return {
    bucket,
    totals: {
      visitors: n(totals[0]?.visitors),
      pageviews: n(totals[0]?.pageviews),
      clickers: n(totals[0]?.clickers),
      players: n(totals[0]?.players),
      leads: n(totals[0]?.leads),
    },
    points,
    funnel: [
      { step: "Opened the homepage", count: n(f.landed) },
      { step: "Scrolled to the work", count: n(f.work) },
      { step: "Reached the contact section", count: n(f.contact) },
      { step: "Clicked a button", count: n(f.clicked) },
      { step: "Sent a message", count: n(f.sent) },
    ],
    heroes: heroes.map((h) => ({
      hero: h.hero,
      visitors: n(h.visitors),
      played: n(h.played),
      next: n(h.next),
      clicked: n(h.clicked),
    })),
    plays: plays.map((p) => ({ hero: p.hero, kind: p.kind, visitors: n(p.visitors) })),
    pages: rows(pages),
    sources: rows(sources),
    countries: rows(countries),
    devices: rows(devices),
    recent: recent.map((e) => ({
      id: e.id,
      at: e.createdAt.toISOString(),
      name: e.name,
      path: e.path,
      hero: e.hero,
      source: e.source,
      country: e.country,
      props: (e.props ?? {}) as Record<string, string | number | boolean>,
    })),
  };
}
