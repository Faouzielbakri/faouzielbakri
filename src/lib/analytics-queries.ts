import { db } from "@/lib/db";

/**
 * Read side of the site's analytics: everything the /admin dashboard shows.
 * Visitor ids rotate daily, so over several days "visitors" means the sum of
 * each day's unique visitors, not unique people.
 */
export const RANGES = {
  "24h": { label: "24h", long: "24 hours", hours: 24, bucket: "hour" },
  "7d": { label: "7d", long: "7 days", hours: 24 * 7, bucket: "day" },
  "30d": { label: "30d", long: "30 days", hours: 24 * 30, bucket: "day" },
  "90d": { label: "90d", long: "90 days", hours: 24 * 90, bucket: "day" },
} as const;
export type RangeKey = keyof typeof RANGES;

const n = (value: unknown) => Number(value ?? 0);

export type Dashboard = NonNullable<Awaited<ReturnType<typeof loadDashboard>>>;
export type Ranked = { label: string; visitors: number };

type Totals = { visitors: bigint; pageviews: bigint; clickers: bigint; players: bigint; leads: bigint };

export async function loadDashboard(range: RangeKey) {
  const prisma = db();
  if (!prisma) return null;
  const { hours, bucket } = RANGES[range];
  const now = Date.now();
  const since = new Date(now - hours * 3600_000);
  const before = new Date(now - 2 * hours * 3600_000);
  const fiveMinutesAgo = new Date(now - 5 * 60_000);

  const totalsFor = (from: Date, to: Date) => prisma.$queryRaw<Totals[]>`
    SELECT
      count(DISTINCT visitor) FILTER (WHERE name = 'pageview') AS visitors,
      count(*) FILTER (WHERE name = 'pageview') AS pageviews,
      count(DISTINCT visitor) FILTER (WHERE name = 'cta') AS clickers,
      count(DISTINCT visitor) FILTER (WHERE name = 'hero_play') AS players,
      count(*) FILTER (WHERE name = 'lead') AS leads
    FROM "Event" WHERE "createdAt" >= ${from} AND "createdAt" < ${to}`;

  const ranked = (column: "path" | "source" | "country" | "device" | "browser" | "os", limit: number) => {
    // The column name is one of a fixed set above, never user input.
    const sql = `
      SELECT coalesce("${column}", '') AS label, count(DISTINCT visitor) AS visitors
      FROM "Event" WHERE name = 'pageview' AND "createdAt" >= $1
      GROUP BY 1 ORDER BY 2 DESC LIMIT ${limit}`;
    return prisma.$queryRawUnsafe<{ label: string; visitors: bigint }[]>(sql, since);
  };

  const [totals, previous, live, series, funnel, heroes, plays, pages, sources, countries, devices, browsers, systems, people, recent] =
    await Promise.all([
      totalsFor(since, new Date(now + 60_000)),
      totalsFor(before, since),
      prisma.$queryRaw<{ c: bigint }[]>`
        SELECT count(DISTINCT visitor) AS c FROM "Event" WHERE "createdAt" >= ${fiveMinutesAgo}`,
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
        GROUP BY hero`,
      prisma.$queryRaw<{ hero: string; kind: string; visitors: bigint }[]>`
        SELECT hero, props->>'kind' AS kind, count(DISTINCT visitor) AS visitors
        FROM "Event" WHERE name = 'hero_play' AND hero IS NOT NULL AND "createdAt" >= ${since}
        GROUP BY 1, 2 ORDER BY 3 DESC`,
      ranked("path", 7),
      ranked("source", 7),
      ranked("country", 8),
      ranked("device", 4),
      ranked("browser", 5),
      ranked("os", 5),
      prisma.$queryRaw<
        {
          visitor: string;
          first: Date;
          last: Date;
          country: string | null;
          city: string | null;
          device: string | null;
          browser: string | null;
          os: string | null;
          source: string | null;
          landing: string | null;
          views: bigint;
          heroes: string[] | null;
          played: boolean;
          clicked: boolean;
          sent: boolean;
        }[]
      >`
        SELECT visitor,
          min("createdAt") AS first, max("createdAt") AS last,
          max(country) AS country, max(city) AS city, max(device) AS device,
          max(browser) AS browser, max(os) AS os,
          (array_agg(source ORDER BY "createdAt") FILTER (WHERE source IS NOT NULL))[1] AS source,
          (array_agg(path ORDER BY "createdAt") FILTER (WHERE name = 'pageview'))[1] AS landing,
          count(*) FILTER (WHERE name = 'pageview') AS views,
          array_remove(array_agg(DISTINCT hero), NULL) AS heroes,
          bool_or(name = 'hero_play') AS played,
          bool_or(name = 'cta') AS clicked,
          bool_or(name = 'lead') AS sent
        FROM "Event" WHERE "createdAt" >= ${since}
        GROUP BY visitor ORDER BY max("createdAt") DESC LIMIT 14`,
      prisma.event.findMany({
        where: { createdAt: { gte: since }, name: { in: ["cta", "lead", "hero_next", "hero_play", "outbound"] } },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
    ]);

  // Fill the gaps so a quiet day shows as an empty slot, not a missing one.
  const step = bucket === "hour" ? 3600_000 : 86_400_000;
  const found = new Map(series.map((row) => [new Date(row.t).getTime(), row]));
  const start = Math.floor(since.getTime() / step) * step + step;
  const points: { t: number; visitors: number; pageviews: number }[] = [];
  for (let t = start; t <= now; t += step) {
    const row = found.get(t);
    points.push({ t, visitors: n(row?.visitors), pageviews: n(row?.pageviews) });
  }

  const rows = (list: { label: string; visitors: bigint }[]): Ranked[] =>
    list.map((r) => ({ label: r.label, visitors: n(r.visitors) }));
  const pack = (t: Totals | undefined) => ({
    visitors: n(t?.visitors),
    pageviews: n(t?.pageviews),
    clickers: n(t?.clickers),
    players: n(t?.players),
    leads: n(t?.leads),
  });
  const f = funnel[0] ?? {};

  return {
    bucket,
    live: n(live[0]?.c),
    totals: pack(totals[0]),
    previous: pack(previous[0]),
    points,
    funnel: [
      { step: "Opened the homepage", short: "Landed", count: n(f.landed) },
      { step: "Scrolled to the work", short: "Saw the work", count: n(f.work) },
      { step: "Reached the contact section", short: "Reached contact", count: n(f.contact) },
      { step: "Clicked a button", short: "Clicked", count: n(f.clicked) },
      { step: "Sent a message", short: "Wrote to me", count: n(f.sent) },
    ],
    heroes: heroes.map((h) => ({
      hero: h.hero,
      visitors: n(h.visitors),
      played: n(h.played),
      next: n(h.next),
      clicked: n(h.clicked),
      plays: plays.filter((p) => p.hero === h.hero).map((p) => ({ kind: p.kind, visitors: n(p.visitors) })),
    })),
    pages: rows(pages),
    sources: rows(sources),
    countries: rows(countries),
    devices: rows(devices),
    browsers: rows(browsers),
    systems: rows(systems),
    people: people.map((p) => ({
      id: p.visitor,
      first: new Date(p.first).getTime(),
      last: new Date(p.last).getTime(),
      country: p.country,
      city: p.city,
      device: p.device,
      browser: p.browser,
      os: p.os,
      source: p.source,
      landing: p.landing,
      views: n(p.views),
      heroes: p.heroes ?? [],
      played: p.played,
      clicked: p.clicked,
      sent: p.sent,
    })),
    recent: recent.map((e) => ({
      id: e.id,
      at: e.createdAt.getTime(),
      name: e.name,
      path: e.path,
      hero: e.hero,
      country: e.country,
      props: (e.props ?? {}) as Record<string, string | number | boolean>,
    })),
    now,
  };
}
