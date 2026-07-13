/**
 * Prints scripts/resume.html to public/resume.pdf (A4).
 * Usage: pnpm resume:pdf
 */
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.join(root, "scripts", "resume.html"), {
    waitUntil: "networkidle",
  });
  await page.pdf({
    path: path.join(root, "public", "resume.pdf"),
    format: "A4",
    printBackground: true,
    // margins come from @page in the HTML
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log("public/resume.pdf written");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
