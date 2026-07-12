/**
 * Captures project screenshots for the portfolio.
 *
 * Usage:
 *   pnpm assets:screens                 # everything (live sites, then local dev servers)
 *   pnpm assets:screens --live-only     # only deployed sites (no env/db needed)
 *   pnpm assets:screens --local-only    # only local projects (needs their .env/db)
 *   pnpm assets:screens --target fasl   # a single project
 *   pnpm assets:screens --force         # overwrite existing captures
 *
 * Output: public/projects/<slug>/<page>-<viewport>.avif (above the fold)
 *         public/projects/<slug>/<page>-<viewport>-full.avif (full page)
 *
 * Local targets boot their dev server sequentially and are captured on
 * http://localhost:<port>. Failures are logged and skipped, never fatal —
 * most local projects need their own .env / database to render.
 */
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium, type Browser, type BrowserContext } from "playwright";
import sharp from "sharp";

type PageTarget = { name: string; path: string };
type LiveTarget = { slug: string; url: string; pages: PageTarget[] };
type LocalTarget = {
  slug: string;
  dir: string;
  cmd: string[];
  port: number;
  pages: PageTarget[];
  /** Extra env for the dev server (overrides the project's .env). */
  env?: Record<string, string>;
  /** Runs in the browser before any page script (playwright addInitScript). */
  initScript?: string;
};

const LIVE_TARGETS: LiveTarget[] = [
  { slug: "fasl", url: "https://fasl.ma", pages: [{ name: "home", path: "/" }] },
  {
    slug: "magical-hekaya",
    url: "https://magicalhekaya.com",
    // ?variant=control forces the original ("best") landing past the A/B
    // middleware and its sticky lp_ab cookie.
    pages: [{ name: "home", path: "/?variant=control" }],
  },
  {
    slug: "magic-hands-lms",
    // Real LMS (Laravel 12 API + Next.js web). Prod URL is only up on
    // demand — expect this target to fail when the client VPS is off.
    url: "https://mh.unikvps.space",
    pages: [{ name: "home", path: "/" }],
  },
  // annid-law and magic-hands are captured from LOCAL dev servers (the live
  // deployments aren't ours to represent) — see LOCAL_TARGETS.
  { slug: "belmo", url: "https://belmo.ma", pages: [{ name: "home", path: "/" }] },
  // Live but unlinked on the portfolio — URL stays out of site data on purpose.
  {
    slug: "webtrade",
    url: "https://probasemarket.live",
    pages: [{ name: "home", path: "/" }],
  },
  // Our own redesigned mock heroes (src/app/mock/*) — portfolio dev server
  // must be running on :4400. The mock path MUST live in pages[].path, not
  // the base url: new URL("/", base) drops the base's path entirely (this
  // silently captured the portfolio homepage for every mock).
  {
    slug: "reso-khdma",
    url: "http://localhost:4400",
    pages: [{ name: "home", path: "/mock/reso-khdma" }],
  },
  {
    slug: "maroc-fournisseurs",
    url: "http://localhost:4400",
    pages: [{ name: "home", path: "/mock/maroc-fournisseurs" }],
  },
  {
    slug: "universeo",
    url: "http://localhost:4400",
    pages: [{ name: "home", path: "/mock/universeo" }],
  },
  {
    slug: "tagi",
    url: "http://localhost:4400",
    pages: [{ name: "home", path: "/mock/tagi" }],
  },
];

const WORK_DIR = path.resolve(process.cwd(), "..");

/**
 * Promote Clerk's keyless temp keys (.clerk/.tmp/keyless.json) to real env
 * keys. In keyless mode Clerk's client JS bounces the page through
 * /clerk-sync-keyless, which locale middleware turns into a 404 — with the
 * keys set explicitly, no bounce happens and the page captures cleanly.
 */
function clerkKeylessEnv(dir: string): Record<string, string> {
  try {
    const raw = JSON.parse(
      fs.readFileSync(path.join(dir, ".clerk", ".tmp", "keyless.json"), "utf8"),
    );
    return {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: raw.publishableKey,
      CLERK_SECRET_KEY: raw.secretKey,
    };
  } catch {
    return {};
  }
}

const LOCAL_TARGETS: LocalTarget[] = [
  {
    slug: "annid-law",
    dir: path.join(WORK_DIR, "annid-law"),
    cmd: ["pnpm", "dev", "--port", "4317"],
    port: 4317,
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "magic-hands",
    dir: path.join(WORK_DIR, "magic-hands-landing"),
    cmd: ["pnpm", "dev", "--port", "4318"],
    port: 4318,
    pages: [{ name: "home", path: "/" }],
    // Two payment gates guard this site (unpaid client). SITE_ACTIVE=false
    // in its .env triggers a server-side suspension page, and a client-side
    // PaymentGate fetches suspension flags from the live DB after hydration.
    // Force the server gate open via env and satisfy the client gate by
    // pre-seeding its sessionStorage cache — never touch the live DB.
    env: { SITE_ACTIVE: "true" },
    initScript: `sessionStorage.setItem("payment_gate_settings", JSON.stringify({
      data: { paid: true, suspended: false, deadline: null }, cachedAt: Date.now() }))`,
  },
  {
    // Landing page for the "féminin sacré" in-person formation (the real
    // LMS is the magic-hands-lms LIVE target above).
    slug: "magic-hands-feminin",
    dir: path.join(WORK_DIR, "Magic-Hands-Formation-feminine-"),
    cmd: ["node", "server/server.js"],
    // Off port 3000 — anything already squatting there (a stale next dev)
    // would get captured instead of the LMS. SITE_ACTIVE flags override the
    // unpaid-client suspension gates (server + Vite client) in its .env.
    // Dummy Stripe key: with SITE_ACTIVE=true the server refuses to boot
    // without one, and the homepage never actually calls Stripe.
    port: 4321,
    env: {
      PORT: "4321",
      SITE_ACTIVE: "true",
      VITE_SITE_ACTIVE: "true",
      STRIPE_SECRET_KEY: "sk_test_capture_dummy",
    },
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "afaizcar",
    dir: path.join(WORK_DIR, "afaizcar"),
    cmd: ["pnpm", "dev", "--port", "4319"],
    port: 4319,
    // Locale-prefixed app — root is a 404
    pages: [{ name: "home", path: "/en" }],
    env: clerkKeylessEnv(path.join(WORK_DIR, "afaizcar")),
    // Hide Clerk's dev-mode "Configure your application" toast (#clerk-components).
    initScript: `document.addEventListener("DOMContentLoaded", () => {
      const s = document.createElement("style");
      s.textContent = "#clerk-components{display:none!important}";
      document.head.appendChild(s);
    });`,
  },
  {
    slug: "bluenote",
    dir: path.join(WORK_DIR, "bluenote"),
    cmd: ["pnpm", "dev", "--port", "4320"],
    port: 4320,
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "lakta",
    dir: path.join(WORK_DIR, "lakta"),
    cmd: ["pnpm", "dev", "--port", "4312"],
    port: 4312,
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "universeo",
    dir: path.join(WORK_DIR, "universeo"),
    cmd: ["pnpm", "dev", "--port", "4313"],
    port: 4313,
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "maroc-fournisseurs",
    dir: path.join(WORK_DIR, "marocforuni1", "marocforuni"),
    cmd: ["pnpm", "dev", "--port", "4314"],
    port: 4314,
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "cvshifter",
    dir: path.join(WORK_DIR, "saas", "cvshifter"),
    cmd: ["pnpm", "dev", "--port", "4315"],
    port: 4315,
    pages: [{ name: "home", path: "/" }],
  },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true },
} as const;

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const option = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const FORCE = flag("--force");
const TARGET = option("--target");

function outPath(slug: string, page: string, viewport: string, full: boolean) {
  return path.join(
    process.cwd(),
    "public",
    "projects",
    slug,
    `${page}-${viewport}${full ? "-full" : ""}.avif`,
  );
}

/** AVIF/HEIF rejects very tall images — scale full-page captures down to fit. */
const MAX_AVIF_DIMENSION = 8192;

async function savePng(png: Buffer, dest: string) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let img = sharp(png);
  const meta = await img.metadata();
  if ((meta.height ?? 0) > MAX_AVIF_DIMENSION) {
    img = img.resize({ height: MAX_AVIF_DIMENSION });
  }
  await img.avif({ quality: 60 }).toFile(dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`  saved ${path.relative(process.cwd(), dest)} (${kb} KB)`);
}

async function capturePages(
  browser: Browser,
  slug: string,
  baseUrl: string,
  pages: PageTarget[],
  initScript?: string,
) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    let context: BrowserContext | null = null;
    try {
      context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.deviceScaleFactor,
        isMobile: viewport.isMobile,
        userAgent: viewport.isMobile
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          : undefined,
      });
      // Next.js dev-tools overlay (<nextjs-portal>) must never end up in a capture.
      await context.addInitScript(`document.addEventListener("DOMContentLoaded", () => {
        const s = document.createElement("style");
        s.textContent = "nextjs-portal{display:none!important}";
        document.head.appendChild(s);
      });`);
      if (initScript) await context.addInitScript(initScript);
      const page = await context.newPage();
      for (const target of pages) {
        const fold = outPath(slug, target.name, viewportName, false);
        const full = outPath(slug, target.name, viewportName, true);
        if (!FORCE && fs.existsSync(fold) && fs.existsSync(full)) {
          console.log(`  skip ${slug}/${target.name}-${viewportName} (exists)`);
          continue;
        }
        const url = new URL(target.path, baseUrl).toString();
        console.log(`  ${url} @ ${viewportName}`);
        try {
          await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
        } catch {
          // Sites with long-lived connections never go network-idle.
          await page.goto(url, { waitUntil: "load", timeout: 45_000 });
        }
        // Let fonts, lazy images, and entrance animations settle.
        await page.waitForTimeout(2_500);
        // Some landings auto-scroll on load (e.g. Hekaya's control variant
        // lands on its second section) — the fold shot is always the hero.
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(800);
        await savePng(await page.screenshot({ type: "png" }), fold);
        await savePng(await page.screenshot({ type: "png", fullPage: true }), full);
      }
    } catch (err) {
      console.warn(`  ✗ ${slug} @ ${viewportName}: ${(err as Error).message}`);
    } finally {
      await context?.close();
    }
  }
}

function waitForPort(port: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const probe = async () => {
      try {
        const res = await fetch(`http://localhost:${port}`, {
          signal: AbortSignal.timeout(2_000),
        });
        if (res.status < 500) return resolve();
      } catch {
        /* not up yet */
      }
      if (Date.now() > deadline) return reject(new Error(`port ${port} never came up`));
      setTimeout(probe, 1_500);
    };
    probe();
  });
}

type RunningTarget = { target: LocalTarget; child: ChildProcess };

function bootLocal(target: LocalTarget): RunningTarget | null {
  if (!fs.existsSync(target.dir)) {
    console.warn(`  ✗ ${target.slug}: directory not found (${target.dir})`);
    return null;
  }
  const child = spawn(target.cmd[0], target.cmd.slice(1), {
    cwd: target.dir,
    stdio: "ignore",
    detached: true,
    env: { ...process.env, ...target.env },
  });
  return { target, child };
}

function killLocal({ child }: RunningTarget) {
  if (!child.pid) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }
}

/**
 * Boot every local dev server at once (each has its own port — boot time
 * dominates the run), wait for all ports in parallel, capture each, then
 * tear everything down.
 */
async function captureLocalAll(browser: Browser, targets: LocalTarget[]) {
  const running = targets.map(bootLocal).filter((r): r is RunningTarget => r !== null);
  try {
    const ready = await Promise.allSettled(
      running.map((r) => waitForPort(r.target.port, 180_000)),
    );
    for (const [i, { target }] of running.entries()) {
      console.log(`\n▸ ${target.slug} (local — ${target.dir})`);
      const state = ready[i];
      if (state.status === "rejected") {
        console.warn(`  ✗ ${target.slug}: ${(state.reason as Error).message ?? state.reason}`);
        continue;
      }
      try {
        await capturePages(
          browser,
          target.slug,
          `http://localhost:${target.port}`,
          target.pages,
          target.initScript,
        );
      } catch (err) {
        console.warn(`  ✗ ${target.slug}: ${(err as Error).message}`);
      }
    }
  } finally {
    running.forEach(killLocal);
  }
}

async function main() {
  const liveOnly = flag("--live-only");
  const localOnly = flag("--local-only");

  const live = LIVE_TARGETS.filter((t) => !TARGET || t.slug === TARGET);
  const local = LOCAL_TARGETS.filter((t) => !TARGET || t.slug === TARGET);

  const browser = await chromium.launch();
  try {
    if (!localOnly) {
      for (const target of live) {
        console.log(`\n▸ ${target.slug} (${target.url})`);
        await capturePages(browser, target.slug, target.url, target.pages);
      }
    }
    if (!liveOnly) {
      await captureLocalAll(browser, local);
    }
  } finally {
    await browser.close();
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
