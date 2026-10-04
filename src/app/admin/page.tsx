import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Activity, Eye, FileText, LayoutDashboard, LogOut, Mail, ShieldCheck, Users } from "lucide-react";
import { Eyebrow, HeroGlyph } from "@/components/admin/bits";
import { EmailsView, ProposalsView } from "@/components/admin/extra-views";
import { ActivityView, AudienceView, OpeningsView, OverviewView } from "@/components/admin/views";
import { OWNER_COOKIE, adminConfigured, isAdmin } from "@/lib/admin-auth";
import { loadDashboard, RANGES, type RangeKey } from "@/lib/analytics-queries";
import { loadEmails, loadProposals } from "@/lib/dashboard-extras";
import { signIn, signOut } from "./actions";

/**
 * The owner's dashboard: who came, from where and on what, which hero they
 * met, what they did, and where they left. Private (password, noindex) and
 * read straight from the site's own Event table. A sidebar switches between
 * views, each sized to one desktop screen: four about traffic, then who read
 * which proposal, and the mail sent from and received at the domain.
 */
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const VIEWS = {
  overview: { label: "Overview", blurb: "The numbers that matter, and where visitors leave.", Icon: LayoutDashboard, View: OverviewView },
  visitors: { label: "Visitors", blurb: "Where they are, what they use, how they found you.", Icon: Users, View: AudienceView },
  openings: { label: "Openings", blurb: "How each of the five heroes is doing.", Icon: Eye, View: OpeningsView },
  activity: { label: "Activity", blurb: "What gets read, and what people just did.", Icon: Activity, View: ActivityView },
  proposals: { label: "Proposals", blurb: "Did they open it, how long did they read, what did they press.", Icon: FileText, View: null },
  emails: { label: "Emails", blurb: "What left from your domain, and what arrived.", Icon: Mail, View: null },
} as const;
type ViewKey = keyof typeof VIEWS;

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;

  if (!adminConfigured()) {
    return (
      <main className="rail min-h-screen py-10">
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-4 max-w-md text-muted">
          Set <code className="font-mono text-ink">ADMIN_PASSWORD</code> in the environment to open the
          dashboard.
        </p>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main className="min-h-screen px-4 py-6">
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
      </main>
    );
  }

  const range = (typeof params.range === "string" && params.range in RANGES ? params.range : "7d") as RangeKey;
  const view = (typeof params.view === "string" && params.view in VIEWS ? params.view : "overview") as ViewKey;
  const data = await loadDashboard(range);
  const ownerMarked = (await cookies()).get(OWNER_COOKIE)?.value === "1";
  const href = (next: { view?: ViewKey; range?: RangeKey }) =>
    `/admin?view=${next.view ?? view}&range=${next.range ?? range}`;
  const { View, label, blurb } = VIEWS[view];
  // Period and live count only mean something on the traffic views.
  const traffic = View !== null;
  const proposals = view === "proposals" ? await loadProposals() : null;
  const emails = view === "emails" ? await loadEmails() : null;
  const now = data?.now ?? new Date().getTime();

  return (
    <div className="min-h-screen lg:pl-60">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="z-20 flex flex-col gap-1 border-b border-line bg-surface px-3 py-3 lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
        <Link href="/" className="flex items-center gap-3 px-2 lg:mb-6" title="Back to the site">
          <HeroGlyph hero="look" className="size-9" />
          <span>
            <span className="font-display block text-base font-bold leading-none">Dashboard</span>
            <span className="mt-1 block font-mono text-[10px] tracking-[0.12em] text-muted">faouzielbakri.com</span>
          </span>
        </Link>

        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {(Object.keys(VIEWS) as ViewKey[]).map((key) => {
            const { label: name, Icon } = VIEWS[key];
            const active = key === view;
            return (
              <Link
                key={key}
                href={href({ view: key })}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                  active ? "bg-ink text-bg" : "text-ink-soft hover:bg-bg hover:text-ink"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden space-y-3 lg:block">
          <div className="rounded-2xl bg-bg p-3 text-[12px] leading-snug">
            <p className="flex items-center gap-2 font-medium">
              <ShieldCheck className={`size-4 ${ownerMarked ? "text-[#0fa37a]" : "text-muted"}`} aria-hidden />
              {ownerMarked ? "This browser isn't counted" : "This browser is counted"}
            </p>
            <p className="mt-1 text-muted">
              {ownerMarked
                ? "Your own visits stay out of the numbers, even after you sign out."
                : "Sign out and in again to mark it as yours."}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-bg hover:text-ink"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Content ──────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-[1320px] px-4 py-5 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold leading-none">{label}</h1>
            <p className="mt-1.5 text-sm text-muted">{blurb}</p>
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
                <span className="font-medium tabular-nums">{data.live}</span>
                <span className="text-muted">on the site now</span>
              </span>
            ) : null}
            <nav
              className={`rounded-full border border-line bg-surface p-1 text-sm ${traffic ? "inline-flex" : "hidden"}`}
              aria-label="Period"
            >
              {(Object.keys(RANGES) as RangeKey[]).map((key) => (
                <Link
                  key={key}
                  href={href({ range: key })}
                  title={`Last ${RANGES[key].long}`}
                  className={`rounded-full px-3.5 py-1.5 tabular-nums transition-colors ${
                    key === range ? "bg-ink text-bg" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {RANGES[key].label}
                </Link>
              ))}
            </nav>
            <form action={signOut} className="lg:hidden">
              <button
                type="submit"
                title="Sign out"
                className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-surface text-muted"
              >
                <LogOut className="size-4" aria-hidden />
                <span className="sr-only">Sign out</span>
              </button>
            </form>
          </div>
        </header>

        <div className="mt-5">
          {proposals ? (
            <ProposalsView report={proposals} now={now} />
          ) : emails ? (
            <EmailsView report={emails} now={now} />
          ) : data && View ? (
            <View data={data} range={range} />
          ) : (
            <p className="max-w-md text-muted">
              No database connected. Set <code className="font-mono text-ink">DATABASE_URL</code> to start
              recording visits.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
