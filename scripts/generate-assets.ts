/**
 * Generates the portfolio's AI media assets from assets/manifest.json.
 *
 * Images  — Nano Banana 2 (gemini-3.1-flash-image) via generateContent
 * Video   — Gemini Omni Flash (gemini-omni-flash-preview) via the Interactions API
 * Posters — first frame extracted from a generated video (requires ffmpeg)
 *
 * Usage:
 *   pnpm assets:generate                    # everything missing
 *   pnpm assets:generate --item hero-ambient
 *   pnpm assets:generate --force            # regenerate even if output exists
 *   pnpm assets:generate --dry-run          # validate manifest + print plan
 *
 * Requires GEMINI_API_KEY in .env.local.
 */
import { config } from "dotenv";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { AssetManifestSchema, type Asset } from "../src/content/schema";

config({ path: ".env.local" });
config();

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const option = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const FORCE = flag("--force");
const DRY_RUN = flag("--dry-run");
const ITEM = option("--item");
const DELAY_MS = 3_000;

const manifestPath = path.join(process.cwd(), "assets", "manifest.json");
const manifest = AssetManifestSchema.parse(
  JSON.parse(fs.readFileSync(manifestPath, "utf-8")),
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function outputPath(asset: Asset) {
  return path.join(process.cwd(), asset.output);
}

async function saveImage(data: Buffer, dest: string) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const ext = path.extname(dest);
  let img = sharp(data);
  if (ext === ".avif") {
    img = img.avif({ quality: 70 });
  } else if (ext === ".png") {
    img = img.png();
  } else if (ext === ".jpg" || ext === ".jpeg") {
    img = img.jpeg({ quality: 85 });
  }
  await img.toFile(dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`  saved ${path.relative(process.cwd(), dest)} (${kb} KB)`);
}

async function generateImage(ai: GoogleGenAI, asset: Extract<Asset, { type: "image" }>) {
  const prompt = asset.standalone ? asset.prompt : `${manifest.styleGuide}\n\n${asset.prompt}`;
  const response = await ai.models.generateContent({
    model: asset.model,
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: asset.aspectRatio, imageSize: "2K" },
    },
  });
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const inline = parts.find((p) => p.inlineData?.data);
  if (!inline?.inlineData?.data) {
    throw new Error("no image data in response");
  }
  await saveImage(Buffer.from(inline.inlineData.data, "base64"), outputPath(asset));
}

async function generateVideo(ai: GoogleGenAI, asset: Extract<Asset, { type: "video" }>) {
  const dest = outputPath(asset);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  const interaction = await ai.interactions.create({
    model: asset.model,
    input: asset.prompt,
    response_format: {
      type: "video",
      aspect_ratio: asset.aspectRatio,
      duration: `${asset.durationSeconds}s`,
      delivery: "uri",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const video = (interaction as { output_video?: { data?: string; uri?: string } })
    .output_video;
  if (video?.data) {
    fs.writeFileSync(dest, Buffer.from(video.data, "base64"));
  } else if (video?.uri) {
    // File may still be processing server-side; retry the download briefly.
    let lastError: unknown;
    for (let attempt = 0; attempt < 12; attempt++) {
      try {
        await ai.files.download({ file: video as never, downloadPath: dest });
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        await sleep(5_000);
      }
    }
    if (lastError) throw lastError;
  } else {
    throw new Error("no video data or uri in interaction response");
  }
  const mb = (fs.statSync(dest).size / (1024 * 1024)).toFixed(2);
  console.log(`  saved ${path.relative(process.cwd(), dest)} (${mb} MB)`);
}

async function extractPoster(asset: Extract<Asset, { type: "poster-from-video" }>) {
  const source = manifest.assets.find((a) => a.id === asset.source);
  if (!source) throw new Error(`poster source "${asset.source}" not in manifest`);
  const videoPath = outputPath(source);
  if (!fs.existsSync(videoPath)) {
    throw new Error(`source video missing (${source.output}) — generate it first`);
  }
  const probe = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (probe.error || probe.status !== 0) {
    throw new Error("ffmpeg not found — install it to extract video posters");
  }
  const tmpPng = path.join(process.cwd(), "assets", `.${asset.id}.tmp.png`);
  const result = spawnSync(
    "ffmpeg",
    ["-y", "-i", videoPath, "-frames:v", "1", tmpPng],
    { stdio: "ignore" },
  );
  if (result.status !== 0) throw new Error("ffmpeg frame extraction failed");
  await saveImage(fs.readFileSync(tmpPng), outputPath(asset));
  fs.unlinkSync(tmpPng);
}

/** OG image gets the name/title composited on the generated background. */
async function compositeOgText(asset: Asset) {
  const dest = outputPath(asset);
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <text x="72" y="300" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="700" fill="#141210">Faouzi El Bakri</text>
    <text x="72" y="368" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#2b2823">AI Engineer &amp; Full-Stack Developer</text>
    <text x="72" y="420" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#6e6a63">Next.js · LLM Agents &amp; RAG · Postgres</text>
  </svg>`;
  const base = await sharp(dest).resize(1200, 630, { fit: "cover" }).toBuffer();
  await sharp(base)
    .composite([{ input: Buffer.from(svg) }])
    .png()
    .toFile(dest + ".tmp");
  fs.renameSync(dest + ".tmp", dest);
  console.log(`  composited OG text onto ${path.relative(process.cwd(), dest)}`);
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey && !DRY_RUN) {
    console.error("GEMINI_API_KEY missing — add it to .env.local");
    process.exit(1);
  }

  const queue = manifest.assets.filter((a) => !ITEM || a.id === ITEM);
  if (queue.length === 0) {
    console.error(`no manifest asset matches --item ${ITEM}`);
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log("Manifest valid. Plan:");
    for (const asset of queue) {
      const exists = fs.existsSync(outputPath(asset));
      console.log(
        `  [${asset.type}] ${asset.id} → ${asset.output}${exists ? " (exists, will skip)" : ""}`,
      );
    }
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  // Videos and images first; posters last so their sources exist.
  const ordered = [
    ...queue.filter((a) => a.type !== "poster-from-video"),
    ...queue.filter((a) => a.type === "poster-from-video"),
  ];

  for (const asset of ordered) {
    const dest = outputPath(asset);
    if (!FORCE && fs.existsSync(dest)) {
      console.log(`skip ${asset.id} (exists)`);
      continue;
    }
    console.log(`▸ ${asset.id} [${asset.type}]`);
    try {
      if (asset.type === "image") {
        await generateImage(ai, asset);
        if (asset.id === "og-default") await compositeOgText(asset);
      } else if (asset.type === "video") {
        await generateVideo(ai, asset);
      } else {
        await extractPoster(asset);
      }
    } catch (err) {
      console.warn(`  ✗ ${asset.id}: ${(err as Error).message}`);
    }
    await sleep(DELAY_MS);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
