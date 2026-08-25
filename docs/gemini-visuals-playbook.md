# Gemini Visuals Playbook — manual generation in Google AI Studio

Copy-paste prompts + exactly which reference files to attach. Everything here is
designed so the code picks the output up automatically: drop the file at the
listed path, rebuild, done. No code changes needed.

**Models (in the AI Studio UI):**
- **Images** → the Gemini flash image model (Nano Banana). Attach reference images before pasting the prompt.
- **Video** → the Gemini omni flash / Veo video model. It also accepts reference images.

**Converting to the right format** (sharp is already in the repo):

```bash
# PNG/JPG/WebP → AVIF at the pipeline's quality
node -e "require('sharp')('INPUT.png').avif({quality:70}).toFile('OUTPUT.avif')"

# Grab a poster frame from a generated video
ffmpeg -i public/media/hero-ambient.mp4 -frames:v 1 poster.png
```

---

## 1 · Case-study hero art — the screenshot pops off the paper

Each featured project's `/work` page has a wired slot: save the render as
`public/media/case-<slug>.avif` and the page swaps its framed screenshot for
the art automatically (falls back to the plain screenshot until then).

**Recipe (same for all six):**
1. Attach the real captures: `public/projects/<slug>/home-desktop-full.avif` and `home-mobile-full.avif`.
2. Attach the world image for palette: `public/media/world-<slug>.avif`.
3. Paste the project prompt below. Aspect ratio **4:3**.
4. Convert to AVIF → `public/media/case-<slug>.avif`.

**Golden rules to include if the model drifts:** the UI in the render must be
*exactly* the attached screenshot — same layout, same colors, no invented
text; the screenshot is the hero, the scenery is supporting cast.

### FASL → `public/media/case-fasl.avif`
> A cinematic 3D paper-craft scene: the attached website screenshot rises out of an open cream legal dossier lying on a dark carved-wood desk, as if the interface is lifting off the paper page into the air. The screenshot stays perfectly flat, sharp and unmodified — same layout, same colors, no invented text — floating at a slight angle with soft realistic shadows beneath it. Around it: deep emerald green ambiance, a faint brass balance scale silhouette in the background bokeh, warm golden volumetric light from the upper right, tiny drifting dust particles. The attached phone screenshot floats smaller beside it like a second exhibit. Background in deep emerald (#0b3b2e) tones matching the attached palette reference. Photoreal render, high detail. 4:3 aspect ratio. Light, mostly-cream background behind the papers so the composition sits well on a warm paper page.

### Magical Hekaya → `public/media/case-magical-hekaya.avif`
> A dreamlike 3D storybook scene: a giant open children's book at night, and the attached website screenshot rises from its pages like a pop-up illustration coming to life. The screenshot stays perfectly flat, sharp and unmodified — same layout, same colors, no invented text — tilted gently like a page mid-turn, glowing softly at the edges. Golden sparks and tiny illustrated stars spill from behind it; deep violet-indigo night sky with a warm crescent moon, painterly-photoreal blend, tender and magical. The attached phone screenshot floats smaller nearby like a bookmark. Palette matched to the attached night-sky reference. 4:3 aspect ratio.

### RESO Khdma → `public/media/case-reso-khdma.avif`
> A warm 3D scene inside a Moroccan artisan workshop at golden hour: the attached dashboard screenshot lifts off a paper job-notice pinned above a wooden workbench, floating flat and sharp and unmodified — same layout, same colors, no invented text — with soft shadows. Around it, green WhatsApp-style chat bubbles (blank, no readable text) drift upward like paper cutouts connecting a phone on the bench to the floating dashboard. Sawdust particles in warm sunbeams, subtle green color grade matching the attached workshop reference. Photoreal with paper-craft accents. 4:3 aspect ratio.

### WebTrade → `public/media/case-webtrade.avif`
> A dark cinematic fintech scene: the attached trading platform screenshot tears out of a sheet of graph paper and hovers above a black glass desk, perfectly flat, sharp and unmodified — same layout, same colors, no invented text. From behind it, luminous emerald-green and coral-red candlestick bars rise like a skyline, out of focus. Cool night-blue bokeh, volumetric glow, high contrast, sleek and precise, palette matched to the attached dark reference. Dark background (#080b0f) so it sits on a dark page. 4:3 aspect ratio.

### Belmo → `public/media/case-belmo.avif`
> A soft K-beauty editorial 3D scene: the attached storefront screenshot rises from a sheet of blush-pink silk-textured paper like a product reveal, perfectly flat, sharp and unmodified — same layout, same colors, no invented text — with gentle studio lighting and a soft shadow. Around it: floating rose petals, one or two elegant unlabeled skincare bottles in soft focus, pearl and blush tones matching the attached silk reference. The attached phone screenshot leans beside it like a gift card. Bright, airy, luxurious. Light blush background (#fdf1f4) so it sits on a pink page. 4:3 aspect ratio.

### Laqta → `public/media/case-laqta.avif`
> A dark creative-studio 3D scene: the attached app screenshot bursts upward off a director's clapperboard-styled paper storyboard, perfectly flat, sharp and unmodified — same layout, same colors, no invented text. Behind it, a glowing editing-timeline hologram with colorful blank clip thumbnails arcs through the air; warm orange and magenta neon accents, soft studio bokeh, palette matched to the attached studio reference. Dark background (#140c10) so it sits on a dark page. 4:3 aspect ratio.

---

## 2 · New hero film — the full-bleed workspace canvas

The hero is now a full-viewport canvas: the film covers the whole screen and
your name is printed on top of it in ink (multiply blend). That means the film
**must stay light/warm-cream overall** or the name disappears.

**Output:** `public/media/hero-ambient.mp4` (16:9, 8s, seamless loop), then a
poster frame → `public/media/hero-poster.avif`.

**References to attach:** 2–3 real product screenshots so the interfaces being
drawn are *your* products, e.g. `public/projects/fasl/home-desktop.avif`,
`public/projects/magical-hekaya/home-desktop.avif`,
`public/projects/webtrade/home-desktop.avif`.

> A single continuous cinematic shot across a vast warm-cream drafting table seen from above at a shallow angle, camera gliding slowly and steadily to the right, seamless loop. Thin terracotta ink lines draw themselves into wireframe interface blueprints on the paper — the wireframes gradually lift off the page and resolve into softly glowing finished product interfaces inspired by the attached screenshots (suggested, slightly out of focus — no readable text). Several interfaces at different stages of assembly are scattered across the table: raw ink sketch on the left, half-built glowing panels center, finished floating product right. Tiny saffron light particles drift through warm volumetric daylight. Overall exposure stays bright and paper-cream across the entire frame — no dark areas — with the center-left of frame kept calm and empty. Subtle film grain, high-end minimalist editorial aesthetic, slow constant motion. No readable text, no words, no letters, no people, no hands, no logos, no dialogue, no music. 16:9.

Why these constraints: center-left is where the name lands; “no dark areas”
keeps the multiply-blend ink legible; “no readable text” avoids fake UI copy.

---

## 2b · Hero film v3 — you + the fleet (identity-locked)

The upgrade over §2: you are *in* the film, and your face is locked to the two
beach photos. Same output paths and same canvas constraints as §2 (bright
warm-cream, center-left calm for the name, seamless loop, 16:9 · 8s).

**References — attach in this exact order** (Veo's ingredients-to-video takes
**max 3 images**, and the first one carries the most identity weight, so the
identity photo goes first and the three featured screenshots are pre-composited
into one sheet):

1. `docs/hero-refs/face-primary.png` — head-and-shoulders crop of IMG_0076 (eyes most visible, straight-on → the identity anchor)
2. `docs/hero-refs/face-angle2.png` — crop of IMG_0081 (second angle; 2 identity refs beat 1)
3. `docs/hero-refs/projects-top3.png` — FASL + Magical Hekaya + Belmo desktop screenshots on one sheet (homepage featured top 3)

> Take the man from the first two attached reference photos and place him, photographically identical, into the scene below: identical round full face shape, full cheeks, eye shape, nose, warm wide smile showing his upper teeth exactly as in the references, short black curly hair with a tight fade, neat short black beard, clear-acetate aviator glasses with the double bridge. He wears a plain warm-neutral shirt (not the beach t-shirt).
>
> A single continuous cinematic shot, seamless loop: he stands at the right side of a vast warm-cream drafting table seen at a shallow angle, calmly studying his work. Across the table, thin terracotta ink lines draw themselves into wireframe blueprints that lift off the paper and resolve into three softly glowing floating product interfaces inspired by the three screenshots on the attached sheet (suggested, slightly out of focus, no readable text) — a small fleet coming online around him. Warm light from the panels plays across his face; a faint proud smile, the same smile as the references. Camera glides slowly and steadily to the right. Tiny saffron light particles in warm volumetric daylight. Overall exposure stays bright and paper-cream across the entire frame — no dark areas — and the center-left of frame stays calm and empty (the name is printed there). Subtle film grain, high-end minimalist editorial aesthetic, slow constant motion. No readable text, no words, no logos, no other people, no dialogue, no music. 16:9.

If the face drifts: regenerate rather than iterate; and repeat the identity
sentence at the very start of the prompt. If the film goes dark or busy on the
left: append *“keep the left half of the frame empty warm-cream paper.”*

**API route (no AI Studio needed):** `ai.interactions.create` on
`gemini-omni-flash-preview` accepts the refs inline — `input` is an array of
`{type:'image', data:<base64 jpeg>, mime_type}` parts (identity photo first)
followed by `{type:'text', text: prompt}`, with `response_format:
{type:'video', aspect_ratio:'16:9', duration:'8s', delivery:'uri'}`. Resize
refs to ~1024px JPEG before encoding. **Log `interaction.id` and the video
`uri` before downloading** — downloads can fail (import `@google/genai/node`,
not the root package) and the render is unrecoverable without the id.

---

## 3 · You, in the system — portrait image + video (attach your photo)

**Identity technique that actually works** (learned the hard way — full-body
photos with a small face produce someone else):

1. **References:** attach tight head-and-shoulders crops, face filling 30–50%
   of the frame, sharp and evenly lit — not full-body shots. Two angles beat one.
2. **Prompt order:** identity first, scene second. Start with an edit-style
   instruction: *“Take the man from the attached reference photos and place
   him, photographically identical, into the scene below.”*
3. **Enumerate the features** instead of saying “same person”: *“identical
   round full face shape, full cheeks, eye shape, nose, warm wide smile showing
   his upper teeth exactly as in the references, short black curly hair with a
   tight fade, neat short black beard, clear-acetate aviator glasses with the
   double bridge.”*
4. **Match the expression to the references** (smiling refs → ask for the same
   smile); asking for a different expression invites drift.
5. Generate 3 candidates and pick — don't iterate a bad seed.

### 3a · Editorial portrait (image) → `public/media/portrait-editorial.avif`
Drop-in replacement candidate for the About section's builder panel (3:4).

> An editorial portrait of the man in the attached photo — exact same face and features — seated at a warm night-time builder's desk in Agadir, lit by a warm desk lamp and the glow of a laptop showing soft unreadable interface panels. Behind him a window with a deep-blue Atlantic dusk and faint city lights. He looks toward the screen, calm and focused, sleeves rolled. Terracotta and amber accents, gentle film grain, high-end editorial photography, shallow depth of field. No readable text anywhere. 3:4 aspect ratio.

### 3b · "The agent and its author" (image) → `public/media/portrait-workspace.avif`
A hero-adjacent wide shot (16:9) — you inside the same world the hero film lives in.

> A cinematic wide shot of the man in the attached photo — exact same face and features — standing at a vast warm-cream drafting table covered in terracotta ink wireframe blueprints. Some wireframes have lifted off the paper and hover around him as softly glowing translucent interface panels (blank, no readable text), which he studies like an architect reviewing floating drawings. Bright airy warm-cream palette, saffron light particles, soft volumetric daylight, subtle Moroccan geometric undertones in the paper texture, high-end editorial tech aesthetic, film grain. 16:9 aspect ratio.

### 3c · Portrait come-to-life (video, 8s) → for LinkedIn / socials or a future About loop
Attach your photo **and** (optionally) `public/media/hero-poster.avif` for palette.

> Cinematic 8-second shot: the man in the attached photo — exact same face and features — sits at a warm drafting table at night, sketching. As his pen moves, thin terracotta ink lines rise off the paper and assemble in the air into a softly glowing product interface (blank panels, no readable text). He looks up at it; warm light from the panels plays across his face; a faint smile. Slow push-in camera, warm cream and amber palette, film grain, editorial and quietly heroic. No dialogue, no music, no readable text. 16:9.

### 3d · "Shipped from Agadir" (video, 8s) — hero-film variant with you in it
> A single continuous cinematic shot: starts on the hands of the man in the attached photo typing at a laptop on a warm-cream desk; the camera pulls back and rises, and above the laptop his products assemble themselves from terracotta ink wireframes into glowing floating interfaces inspired by the attached screenshots (suggested, no readable text) — three of them, like a small fleet coming online. He leans back and watches them hover, exact same face as the attached photo. Bright warm-cream palette, saffron particles, volumetric daylight, film grain, seamless loop potential. No dialogue, no music, no readable text. 16:9.

---

## 4 · Checklist

| Asset | Output path | Ratio | Auto-wired? |
|---|---|---|---|
| FASL case art | `public/media/case-fasl.avif` | 4:3 | ✅ /work/fasl |
| Hekaya case art | `public/media/case-magical-hekaya.avif` | 4:3 | ✅ /work/magical-hekaya |
| RESO case art | `public/media/case-reso-khdma.avif` | 4:3 | ✅ /work/reso-khdma |
| WebTrade case art | `public/media/case-webtrade.avif` | 4:3 | ✅ /work/webtrade |
| Belmo case art | `public/media/case-belmo.avif` | 4:3 | ✅ /work/belmo |
| Laqta case art | `public/media/case-laqta.avif` | 4:3 | ✅ /work/laqta |
| Hero film v2 | `public/media/hero-ambient.mp4` | 16:9 · 8s | ✅ hero (replaces current) |
| Hero film v3 (§2b, with you) | `public/media/hero-ambient.mp4` | 16:9 · 8s | ✅ hero — refs in `docs/hero-refs/` |
| Hero poster v2 | `public/media/hero-poster.avif` | 16:9 | ✅ hero LCP |
| Portrait — editorial | `public/media/portrait-editorial.avif` | 3:4 | ✅ generated via API · wired as the About "builder" panel |
| Portrait — workspace | `public/media/portrait-workspace.avif` | 16:9 | ✅ generated via API · free for socials / LinkedIn banner / future OG |
| Videos 3c / 3d | keep wherever you like | 16:9 | socials / future use |

Tips that consistently help in AI Studio:
- Generate 3–4 candidates per prompt and pick; don't iterate a bad seed.
- If the screenshot gets redrawn/mangled, append: *“Do not repaint or restyle the attached screenshot — composite it as-is, pixel-faithful, only perspective and lighting may change.”*
- For the film, ask for “seamless loop” and check the first/last frames; if they jump, generate again rather than trimming.
