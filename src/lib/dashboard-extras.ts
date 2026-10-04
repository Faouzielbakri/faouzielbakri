import { PROPOSALS } from "@/content/proposals";
import { db } from "@/lib/db";

/**
 * The two dashboard views that are not about site traffic: who read a
 * proposal, and the mail that left from and arrived at the domain.
 */

const n = (value: unknown) => Number(value ?? 0);
const DOMAIN = "faouzielbakri.com";

/* ── Proposals ──────────────────────────────────────────────────────────── */

export type ProposalReport = Awaited<ReturnType<typeof loadProposals>>;

/** All time, not the selected period: a proposal is read days after it is sent. */
export async function loadProposals() {
  const prisma = db();
  const rows = prisma
    ? await prisma.$queryRaw<
        {
          path: string;
          visitor: string;
          first: Date;
          last: Date;
          country: string | null;
          city: string | null;
          device: string | null;
          browser: string | null;
          os: string | null;
          seconds: number | null;
          depth: number | null;
          sections: bigint;
          actions: string[] | null;
        }[]
      >`
        SELECT path, visitor,
          min("createdAt") AS first, max("createdAt") AS last,
          max(country) AS country, max(city) AS city, max(device) AS device,
          max(browser) AS browser, max(os) AS os,
          max((props->>'seconds')::int) FILTER (WHERE name = 'proposal_time') AS seconds,
          max((props->>'depth')::int) FILTER (WHERE name = 'proposal_time') AS depth,
          count(DISTINCT props->>'id') FILTER (WHERE name = 'proposal_action' AND props->>'kind' = 'section') AS sections,
          array_agg(DISTINCT props->>'kind') FILTER (WHERE name = 'proposal_action' AND props->>'kind' <> 'section') AS actions
        FROM "Event" WHERE name LIKE 'proposal\\_%'
        GROUP BY path, visitor ORDER BY max("createdAt") DESC`
    : [];

  return PROPOSALS.map((proposal) => {
    const reads = rows
      .filter((r) => r.path === `/proposals/${proposal.slug}`)
      .map((r) => ({
        id: r.visitor + r.first.toISOString(),
        first: new Date(r.first).getTime(),
        last: new Date(r.last).getTime(),
        country: r.country,
        city: r.city,
        device: r.device,
        browser: r.browser,
        os: r.os,
        seconds: n(r.seconds),
        depth: n(r.depth),
        sections: n(r.sections),
        actions: r.actions ?? [],
      }));
    return {
      ...proposal,
      reads,
      opens: reads.length,
      lastOpened: reads[0]?.last ?? null,
      totalSeconds: reads.reduce((sum, r) => sum + r.seconds, 0),
      longest: Math.max(0, ...reads.map((r) => r.seconds)),
      deepest: Math.max(0, ...reads.map((r) => r.depth)),
      actions: [...new Set(reads.flatMap((r) => r.actions))],
    };
  });
}

/* ── Emails ─────────────────────────────────────────────────────────────── */

export type SentEmail = { id: string; at: number; to: string[]; subject: string; status: string };
export type ReceivedEmail = { at: number; from: string; to: string; subject: string; status: string };
export type EmailReport = Awaited<ReturnType<typeof loadEmails>>;

/**
 * Sent mail comes from Resend, which every product on the account shares, so
 * the list is filtered down to this domain. Resend allows two requests a
 * second; pages are fetched one at a time and the result is cached.
 */
async function loadSent(): Promise<{ emails: SentEmail[]; error: string | null }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { emails: [], error: "RESEND_API_KEY is not set." };
  const emails: SentEmail[] = [];
  let after: string | null = null;
  try {
    for (let page = 0; page < 5; page++) {
      const url: string = `https://api.resend.com/emails?limit=100${after ? `&after=${after}` : ""}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` }, next: { revalidate: 300 } });
      if (res.status === 401 || res.status === 403) {
        return { emails, error: "This Resend key can only send. Listing sent mail needs a full-access key." };
      }
      if (!res.ok) return { emails, error: `Resend answered ${res.status}.` };
      const body = (await res.json()) as {
        has_more?: boolean;
        data?: { id: string; from: string; to: string[]; subject: string; created_at: string; last_event: string }[];
      };
      const data = body.data ?? [];
      for (const e of data) {
        if (!e.from?.includes(`@${DOMAIN}`)) continue;
        emails.push({
          id: e.id,
          at: new Date(e.created_at.replace(" ", "T").replace(/\+00$/, "Z")).getTime(),
          to: e.to ?? [],
          subject: e.subject ?? "",
          status: e.last_event ?? "sent",
        });
      }
      if (!body.has_more || !data.length) break;
      after = data[data.length - 1].id;
    }
    return { emails, error: null };
  } catch {
    return { emails, error: "Could not reach Resend." };
  }
}

/** Received mail is Cloudflare Email Routing's activity log, when a token is configured. */
async function loadReceived(): Promise<{ emails: ReceivedEmail[]; error: string | null; configured: boolean }> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;
  if (!token || !zone) return { emails: [], error: null, configured: false };
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const query = `query ($zone: String!, $since: Time!) {
    viewer { zones(filter: { zoneTag: $zone }) {
      emailRoutingAdaptive(limit: 40, filter: { datetime_geq: $since }, orderBy: [datetime_DESC]) {
        datetime from to subject status
      }
    } }
  }`;
  try {
    const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { zone, since } }),
      next: { revalidate: 300 },
    });
    const body = (await res.json()) as {
      errors?: { message: string }[];
      data?: { viewer?: { zones?: { emailRoutingAdaptive?: { datetime: string; from: string; to: string; subject: string; status: string }[] }[] } };
    };
    if (body.errors?.length) return { emails: [], error: body.errors[0].message, configured: true };
    const rows = body.data?.viewer?.zones?.[0]?.emailRoutingAdaptive ?? [];
    return {
      emails: rows.map((r) => ({ at: new Date(r.datetime).getTime(), from: r.from, to: r.to, subject: r.subject, status: r.status })),
      error: null,
      configured: true,
    };
  } catch {
    return { emails: [], error: "Could not reach Cloudflare.", configured: true };
  }
}

export async function loadEmails() {
  const [sent, received] = await Promise.all([loadSent(), loadReceived()]);
  return { sent, received, domain: DOMAIN };
}
