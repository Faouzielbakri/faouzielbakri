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
};

const LIVE_TARGETS: LiveTarget[] = [
  { slug: "fasl", url: "https://fasl.ma", pages: [{ name: "home", path: "/" }] },
  {
    slug: "magical-hekaya",
    url: "https://magicalhekaya.com",
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
  // must be running on :4400.
  {
    slug: "reso-khdma",
    url: "http://localhost:4400/mock/reso-khdma",
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "maroc-fournisseurs",
    url: "http://localhost:4400/mock/maroc-fournisseurs",
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "universeo",
    url: "http://localhost:4400/mock/universeo",
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "tagi",
    url: "http://localhost:4400/mock/tagi",
    pages: [{ name: "home", path: "/" }],
  },
];

const WORK_DIR = path.resolve(process.cwd(), "..");

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
  },
  {
    slug: "magic-hands-lms",
    dir: path.join(WORK_DIR, "Magic-Hands-Formation-feminine-"),
    cmd: ["node", "server/server.js"],
    port: 3000,
    pages: [{ name: "home", path: "/" }],
  },
  {
    slug: "afaizcar",
    dir: path.join(WORK_DIR, "afaizcar"),
    cmd: ["pnpm", "dev", "--port", "4319"],
    port: 4319,
    // Locale-prefixed app — root is a 404
    pages: [{ name: "home", path: "/en" }],
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

async function captureLocal(browser: Browser, target: LocalTarget) {
  if (!fs.existsSync(target.dir)) {
    console.warn(`  ✗ ${target.slug}: directory not found (${target.dir})`);
    return;
  }
  console.log(`\n▸ ${target.slug} (local — ${target.dir})`);
  let child: ChildProcess | null = null;
  try {
    child = spawn(target.cmd[0], target.cmd.slice(1), {
      cwd: target.dir,
      stdio: "ignore",
      detached: true,
    });
    await waitForPort(target.port, 90_000);
    await capturePages(browser, target.slug, `http://localhost:${target.port}`, target.pages);
  } catch (err) {
    console.warn(`  ✗ ${target.slug}: ${(err as Error).message}`);
  } finally {
    if (child?.pid) {
      try {
        process.kill(-child.pid, "SIGTERM");
      } catch {
        child.kill("SIGTERM");
      }
    }
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
      for (const target of local) {
        await captureLocal(browser, target);
      }
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
