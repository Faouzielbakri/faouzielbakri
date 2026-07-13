<div align="center">

<img src="docs/readme/hero.webp" alt="A warm-cream drafting table where terracotta ink wireframes assemble themselves into glowing product interfaces" width="100%" />

# Salam, I'm Faouzi 👋

**AI Engineer & Full-Stack Developer — I build LLM-powered products that ship.**

By day I teach Morocco's next engineers (2,000+ students so far, Ministry of National Education).
By night I build the products they'll study — 16 live in production, four of them my own.

[**faouzielbakri.com**](https://faouzielbakri.com) · [**Hire me**](https://faouzielbakri.com/hire) · [**Blog**](https://faouzielbakri.com/blog) · [**LinkedIn**](https://linkedin.com/in/faouzielbakri) · [**Email**](mailto:faouzielbakri@gmail.com)

<br />

![Next.js](https://img.shields.io/badge/Next.js_16-141210?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-141210?style=flat-square&logo=typescript&logoColor=e8590c)
![React](https://img.shields.io/badge/React_19-141210?style=flat-square&logo=react&logoColor=e8590c)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-141210?style=flat-square&logo=tailwindcss&logoColor=e8590c)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-141210?style=flat-square&logo=postgresql&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_API-141210?style=flat-square&logo=anthropic&logoColor=e8590c)
![Gemini](https://img.shields.io/badge/Gemini_API-141210?style=flat-square&logo=googlegemini&logoColor=white)

</div>

<br />

## 🚀 What I've shipped

| | | |
| :--: | :--: | :--: |
| <img src="docs/readme/fasl.webp" alt="FASL — Arabic-first legal AI drafting Moroccan appeal memos" /> | <img src="docs/readme/hekaya.webp" alt="Magical Hekaya — AI-personalized kids' storybooks" /> | <img src="docs/readme/belmo.webp" alt="Belmo — Arabic-first K-beauty e-commerce" /> |
| **[FASL](https://fasl.ma)** — multi-agent AI drafting legal appeal memos, RAG over Moroccan law, Arabic-first | **[Magical Hekaya](https://magicalhekaya.com)** — kids star in their own AI-illustrated printed storybooks | **[Belmo](https://belmo.ma)** — K-beauty e-commerce for Morocco: COD, 24–48h delivery, self-hosted |
| 📈 **58.4K** search impressions / 28 days, avg position 6.2 | 💳 **Paying customers** · 44K impressions / 3 months | 🛒 **818 clients & 629 orders** in the first two months |

| | | |
| :--: | :--: | :--: |
| <img src="docs/readme/world-lakta.webp" alt="Lakta — AI-generated Darija video ads" /> | <img src="docs/readme/world-reso.webp" alt="RESO Khdma — WhatsApp job-matching AI agent" /> | <img src="docs/readme/world-webtrade.webp" alt="WebTrade — real-time trading platform" /> |
| **Lakta** — feed it a brand kit, it renders finished Darija video ads end-to-end | **RESO Khdma** — WhatsApp AI agent matching Moroccan workers to jobs, in Darija | **WebTrade** — real-time trading UI, WebSockets, real money on the line |

…plus ten more client projects, own products, and concept rebuilds — all in [the index](https://faouzielbakri.com/#more-work).

## 🧠 What I actually do

- **AI agents & multi-agent pipelines** — tool-using agents, staged pipelines with structured-output contracts, human-in-the-loop review. The architecture is written up on [my blog](https://faouzielbakri.com/blog/llm-agent-architecture).
- **RAG over domain data** — legal codes, catalogs, knowledge bases; grounded citations, not hallucinations.
- **Full-stack, zero to launch** — Next.js · TypeScript · PostgreSQL, from empty repo to paying customers: payments, auth, admin, deployment.
- **Arabic-first & multilingual** — native Arabic/Darija, RTL-first interfaces, four languages. The markets most teams get wrong are the ones I grew up in.

✍️ Latest from the blog: [How to Build an AI Agent with Claude](https://faouzielbakri.com/blog/how-to-build-an-ai-agent-with-claude) · [LLM Agent Architecture: What Actually Ships](https://faouzielbakri.com/blog/llm-agent-architecture)

## 🎬 This repo

You're looking at the source of [faouzielbakri.com](https://faouzielbakri.com) — an editorial-cinematic portfolio built as one connected paper-cream world. A few things worth stealing:

- **The hero film generates itself** — Gemini Omni Flash renders it from reference images (including identity-locked portraits) via a reproducible pipeline: `pnpm assets:generate` + [`docs/gemini-visuals-playbook.md`](docs/gemini-visuals-playbook.md).
- **Scroll-linked worlds** — six case studies as full-viewport panels scrolling over each other with Motion 12, each with its own palette and story component.
- **A drag-and-scroll About seam** — two lives (teacher / builder) split by a seam you drag on desktop and scroll on mobile.
- **AI-search ready** — generated [`llms.txt`](https://faouzielbakri.com/llms.txt) / `llms-full.txt`, JSON-LD everywhere, AI crawlers explicitly welcomed in robots.txt.
- **A zero-dependency blog** — markdown files in, typed renderer out; frontmatter parsed with zod.

<details>
<summary><strong>Run it locally</strong></summary>

<br />

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Env var (`.env.local`) | Needed for |
| --- | --- |
| `RESEND_API_KEY` | Contact form delivery (falls back to mailto without it) |
| `GEMINI_API_KEY` | Regenerating AI media assets (optional) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL override (defaults to faouzielbakri.com) |

**Asset pipeline** — all AI-generated media (hero film, case-study art, portraits) is reproducible:

```bash
pnpm assets:screens    # capture real product screenshots (Playwright)
pnpm assets:generate   # generate media from assets/manifest.json via Gemini
```

**Deploy** — any Node host: `pnpm build` + `pnpm start`. Current target: Hetzner + Dokploy.

</details>

<br />

<div align="center">

<img src="docs/readme/workspace.webp" alt="The engineer at a drafting table, product interfaces floating around him as glowing blueprints" width="80%" />

**Building something with LLMs?** → [faouzielbakri.com/hire](https://faouzielbakri.com/hire)

*Shipped from Agadir.* 🇲🇦

</div>
