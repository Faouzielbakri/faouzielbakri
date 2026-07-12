import { z } from "zod";
import { ProjectSchema, type Project } from "./schema";

/**
 * All portfolio projects. Parsed at module load — invalid content fails the
 * build. Metrics policy: only claims with a named source ship.
 */
export const projects: Project[] = z.array(ProjectSchema).parse([
  // ── Tier 1: case studies ────────────────────────────────────────────────
  {
    slug: "fasl",
    name: "FASL",
    tagline: "Multi-agent AI that drafts Moroccan legal appeals end-to-end.",
    tier: "case-study",
    role: "Co-founder & Lead Engineer",
    url: "https://fasl.ma",
    accent: "#0e7a5f",
    stack: [
      "Next.js",
      "TypeScript",
      "Claude & Gemini",
      "RAG",
      "PostgreSQL",
      "Prisma",
      "n8n",
      "TipTap",
    ],
    metrics: [
      {
        label: "Search impressions in 28 days",
        value: "~37K",
        source: "Google Search Console",
      },
    ],
    caseStudy: {
      problem:
        "Drafting an appeal memo in Morocco means hours of case analysis, digging through legal codes, and careful Arabic legal writing — with no tooling built for how Moroccan lawyers actually work.",
      approach: [
        "Built a multi-agent pipeline that carries a case from analysis to a polished legal memo: case analysis → document retrieval → draft generation → final review.",
        "Engineered a RAG pipeline over Moroccan legal codes so every citation is grounded in real law, minimizing hallucination in a domain where mistakes are expensive.",
        "Kept lawyers in control with a human-in-the-loop rich-text editor for reviewing and refining every draft before it leaves the building.",
        "Designed the product Arabic-first with full RTL support, because the legal system runs in Arabic — not in translation.",
      ],
      outcome: [
        "Live in production at fasl.ma with lawyers reaching out inbound.",
        "~37K organic search impressions in 28 days (Google Search Console) with zero ad spend.",
      ],
      architecture: [
        {
          title: "Case analysis",
          detail: "An agent reads the case file and extracts the legal issues at stake.",
        },
        {
          title: "Retrieval",
          detail: "RAG over Moroccan legal codes surfaces the articles and precedents that apply.",
        },
        {
          title: "Drafting",
          detail: "A drafting agent composes the appeal memo, grounded in the retrieved law.",
        },
        {
          title: "Human review",
          detail: "The lawyer refines the draft in a purpose-built Arabic legal editor.",
        },
      ],
    },
    screenshots: {
      desktop: ["/projects/fasl/home-desktop.avif"],
      mobile: ["/projects/fasl/home-mobile.avif"],
    },
    alt: "FASL landing page — Arabic legal AI platform for drafting appeal memos",
  },
  {
    slug: "magical-hekaya",
    name: "Magical Hekaya",
    tagline: "Personalized AI storybooks kids star in — live, with paying customers.",
    tier: "case-study",
    role: "Founder",
    url: "https://magicalhekaya.com",
    accent: "#d6336c",
    stack: [
      "Next.js 16",
      "Gemini",
      "ElevenLabs",
      "Remotion",
      "AWS S3",
      "PostgreSQL",
      "Prisma",
      "Print-on-demand",
    ],
    metrics: [
      {
        label: "Paying customers",
        value: "Real revenue",
        source: "Live product sales",
      },
    ],
    caseStudy: {
      problem:
        "Personalized kids' books usually mean swapping a name into a template. Making a child the actual hero — consistent face, consistent story, printed and delivered — is a much harder generation problem.",
      approach: [
        "Photo-based character generation keeps the child recognizable across every illustrated page.",
        "Structured output contracts between agents solve long-horizon narrative consistency — each agent hands the next a validated, typed story state instead of free text.",
        "AI narration and rendered story videos turn each book into something kids can watch and listen to, not just read.",
        "Print-on-demand fulfilment closes the loop from a photo upload to a physical book at the door.",
      ],
      outcome: [
        "Live consumer product at magicalhekaya.com with real paying customers.",
        "Full pipeline owned end-to-end: generation, payments, rendering, fulfilment.",
      ],
    },
    screenshots: {
      desktop: ["/projects/magical-hekaya/home-desktop.avif"],
      mobile: ["/projects/magical-hekaya/home-mobile.avif"],
    },
    alt: "Magical Hekaya landing page — AI-generated personalized children's storybooks",
  },
  {
    slug: "reso-khdma",
    name: "RESO Khdma",
    tagline: "A WhatsApp AI agent matching Moroccan workers to jobs — in Darija.",
    tier: "case-study",
    role: "Freelance Engineer",
    accent: "#1fa855",
    stack: [
      "Next.js",
      "Gemini embeddings",
      "Semantic search",
      "WhatsApp Business API",
      "PostgreSQL",
      "Prisma",
      "TanStack",
    ],
    metrics: [
      {
        label: "Languages understood",
        value: "Arabic · Darija · French",
        source: "Multilingual NLP pipeline",
      },
    ],
    caseStudy: {
      problem:
        "Morocco's craft and service workers aren't on job boards — they're on WhatsApp. Recruiters had no way to search them, and workers had no way to be found.",
      approach: [
        "Built a conversational AI agent living entirely inside WhatsApp, where the workers already are — no app install, no sign-up form.",
        "Gemini embeddings power semantic matching between what a worker says they do and what a recruiter is looking for — across Arabic, Darija, and French.",
        "Tool calling via JSON-schema contracts keeps the agent's actions (registering, searching, matching) structured and reliable.",
        "A recruiter dashboard turns matches into a searchable, paid product.",
      ],
      outcome: [
        "Delivered a working platform: WhatsApp agent, matching engine, and recruiter dashboard.",
        "Handles the messy reality of Darija — the dialect real workers actually type in.",
      ],
      architecture: [
        {
          title: "WhatsApp intake",
          detail: "Workers register by chatting — the agent extracts skills, city, and availability.",
        },
        {
          title: "Embedding & indexing",
          detail: "Profiles are embedded with Gemini and indexed for semantic search.",
        },
        {
          title: "Matching",
          detail: "Recruiter queries are matched semantically, not by keyword.",
        },
        {
          title: "Dashboard",
          detail: "Recruiters browse, search, and contact candidates from a web dashboard.",
        },
      ],
    },
    screenshots: {
      desktop: ["/projects/reso-khdma/home-desktop.avif"],
      mobile: ["/projects/reso-khdma/home-mobile.avif"],
    },
    alt: "RESO Khdma — WhatsApp AI job-matching platform for Moroccan workers",
  },
  {
    slug: "webtrade",
    name: "WebTrade",
    tagline: "Real-time trading UI with real money on the line.",
    tier: "case-study",
    role: "Freelance Engineer",
    accent: "#1971c2",
    stack: [
      "Next.js",
      "WebSockets",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "GSAP",
    ],
    metrics: [
      {
        label: "Chart render latency",
        value: "Sub-100ms",
        source: "WebSocket streaming pipeline",
      },
    ],
    caseStudy: {
      problem:
        "A trading platform can't fake it: prices must stream live, charts must not stutter, and every transaction touches real user money — so race conditions aren't bugs, they're theft.",
      approach: [
        "WebSocket-driven price streaming feeds candlestick charts at sub-100ms render latency.",
        "Transaction logic built around funds locking and race-condition prevention, because concurrent orders against one wallet must never double-spend.",
        "Admin tooling for operating the platform day-to-day.",
      ],
      outcome: [
        "Real users trading with real money, still running and maintained today.",
        "The project that taught me to treat concurrency as a product feature, not an implementation detail.",
      ],
    },
    screenshots: {
      desktop: ["/projects/webtrade/home-desktop.avif"],
      mobile: ["/projects/webtrade/home-mobile.avif"],
    },
    alt: "WebTrade — real-time trading platform with live candlestick charts",
  },

  {
    slug: "belmo",
    name: "Belmo",
    tagline: "Arabic-first K-beauty e-commerce for Morocco — COD, 24–48h delivery, self-hosted.",
    tier: "case-study",
    role: "Founder & Engineer",
    url: "https://belmo.ma",
    accent: "#d6748f",
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Clerk",
      "AWS S3",
      "Hetzner + Dokploy",
    ],
    metrics: [
      {
        label: "Live store, orders fulfilled in Morocco",
        value: "belmo.ma",
        source: "Production",
      },
    ],
    caseStudy: {
      problem:
        "Korean skincare is booming in Morocco, but buying it means sketchy resellers, no Arabic experience, and no cash-on-delivery — the payment method most Moroccan shoppers actually trust.",
      approach: [
        "Built a full Arabic-first RTL storefront with catalog, cart, and checkout tuned for how Moroccans buy: cash on delivery, 24–48h delivery, 7-day returns.",
        "Admin dashboard with drag-and-drop merchandising, inventory, and order management.",
        "Self-hosted the whole stack on a Hetzner server with Dokploy — owning infra costs instead of renting them.",
      ],
      outcome: [
        "Live store at belmo.ma taking real orders.",
        "One engineer owns everything: product, storefront, ops tooling, and the server it runs on.",
      ],
    },
    screenshots: {
      desktop: ["/projects/belmo/home-desktop.avif"],
      mobile: ["/projects/belmo/home-mobile.avif"],
    },
    alt: "Belmo — Arabic K-beauty e-commerce storefront",
  },

  // ── Tier 2: cards ───────────────────────────────────────────────────────
  {
    slug: "annid-law",
    name: "Annid Law Office",
    tagline:
      "Multilingual, RTL-first site for a Casablanca law office — Arabic, French, English, Spanish.",
    tier: "card",
    role: "Freelance Engineer",
    url: "https://annidlawoffice.com",
    accent: "#8a6d3b",
    stack: ["Next.js 16", "next-intl", "Tailwind", "Prisma", "MDX"],
    screenshots: {
      desktop: ["/projects/annid-law/home-desktop.avif"],
      mobile: ["/projects/annid-law/home-mobile.avif"],
    },
    alt: "Annid Law Office — multilingual landing site for a Casablanca lawyer",
  },
  {
    slug: "magic-hands",
    name: "Magic Hands",
    tagline:
      "A complete LMS for a French massage academy — courses, payments, anti-cheat — serving ~500 students.",
    tier: "card",
    role: "Freelance Engineer",
    url: "https://magichands.fr",
    accent: "#9c36b5",
    stack: ["Next.js", "React", "Stripe", "PostgreSQL", "Framer Motion"],
    metrics: [
      {
        label: "Students",
        value: "~500",
        source: "Platform enrollment",
      },
    ],
    screenshots: {
      desktop: ["/projects/magic-hands/home-desktop.avif"],
      mobile: ["/projects/magic-hands/home-mobile.avif"],
    },
    alt: "Magic Hands — learning platform for a French massage training academy",
  },
  {
    slug: "magic-hands-lms",
    name: "Magic Hands Academy",
    tagline:
      "The school behind the landing page — course platform with payments and anti-cheat for the massage academy's online cohorts.",
    tier: "card",
    role: "Freelance Engineer",
    accent: "#7048e8",
    stack: ["React", "Vite", "Express", "Stripe + Klarna", "Meta CAPI"],
    screenshots: {
      desktop: ["/projects/magic-hands-lms/home-desktop.avif"],
      mobile: ["/projects/magic-hands-lms/home-mobile.avif"],
    },
    alt: "Magic Hands Academy — online course platform for massage training",
  },
  {
    slug: "maroc-fournisseurs",
    name: "Maroc Fournisseurs",
    tagline:
      "B2B marketplace connecting ~500 Moroccan providers with buyers — sub-second Algolia search, real-time negotiation chat.",
    tier: "card",
    role: "Freelance Engineer",
    accent: "#c2255c",
    stack: ["Next.js", "TypeScript", "Algolia", "Prisma", "WebSockets"],
    metrics: [
      {
        label: "Providers onboarded",
        value: "~500",
        source: "Platform data",
      },
    ],
    screenshots: {
      desktop: ["/projects/maroc-fournisseurs/home-desktop.avif"],
      mobile: ["/projects/maroc-fournisseurs/home-mobile.avif"],
    },
    alt: "Maroc Fournisseurs — B2B marketplace for Moroccan suppliers",
  },
  {
    slug: "lakta",
    name: "Lakta",
    tagline:
      "Feed it a brand kit — it produces finished Darija video ads and Instagram carousels.",
    tier: "case-study",
    role: "Founder / Builder",
    accent: "#e8590c",
    stack: ["Next.js 16", "Gemini", "FFmpeg (wasm)", "Inngest", "AWS S3", "PostgreSQL"],
    metrics: [
      {
        label: "From brand kit to rendered video ad",
        value: "One pipeline",
        source: "Gemini scripts → FFmpeg render",
      },
    ],
    caseStudy: {
      problem:
        "Moroccan SMEs advertise where their customers are — Instagram and TikTok, in Darija — but producing a single decent video ad means agencies, studios, and budgets they don't have.",
      approach: [
        "A brand kit (logo, colors, product shots) is all the input: Gemini writes the Darija script and scene plan.",
        "FFmpeg running in WebAssembly renders the final video ad right in the pipeline — text overlays, cuts, and music timed to the script.",
        "Inngest job pipelines keep long renders reliable, resumable, and observable.",
        "Same pipeline emits Instagram carousels for the posts between video campaigns.",
      ],
      outcome: [
        "Finished, publishable Darija video ads generated end-to-end — the videos on this page came out of the pipeline itself.",
      ],
    },
    screenshots: {
      desktop: ["/projects/lakta/home-desktop.avif"],
      mobile: ["/projects/lakta/home-mobile.avif"],
    },
    alt: "Lakta — AI generator for Darija video ads and social carousels",
  },
  {
    slug: "universeo",
    name: "Universeo",
    tagline:
      "SEO content briefs grounded in the live SERP — scraping pipelines and concurrent background workers.",
    tier: "card",
    role: "Founder / Builder",
    accent: "#5f3dc4",
    stack: ["Next.js 16", "Gemini", "Scraping pipeline", "Prisma", "Background workers"],
    screenshots: {
      desktop: ["/projects/universeo/home-desktop.avif"],
      mobile: ["/projects/universeo/home-mobile.avif"],
    },
    alt: "Universeo — SERP-grounded SEO content brief generator",
  },
  {
    slug: "cvshifter",
    name: "CvShifter",
    tagline:
      "Reads a job description and reshapes a generic CV into a tailored, ATS-optimized, visually themed resume.",
    tier: "card",
    role: "Founder / Builder",
    accent: "#0c8599",
    stack: ["Next.js", "LLM pipeline", "Text extraction", "Template rendering", "Prisma"],
    screenshots: {
      desktop: ["/projects/cvshifter/home-desktop.avif"],
      mobile: ["/projects/cvshifter/home-mobile.avif"],
    },
    alt: "CvShifter — AI-powered CV tailoring for specific job descriptions",
  },
  {
    slug: "afaizcar",
    name: "Afaiz Car",
    tagline:
      "Bilingual car-rental platform for a Moroccan agency — fleet, locations, bookings, and an admin back office.",
    tier: "card",
    role: "Freelance Engineer",
    accent: "#e8590c",
    stack: ["Next.js", "TypeScript", "Prisma", "Clerk", "i18n (EN/FR)", "ISR"],
    screenshots: {
      desktop: ["/projects/afaizcar/home-desktop.avif"],
      mobile: ["/projects/afaizcar/home-mobile.avif"],
    },
    alt: "Afaiz Car — car rental platform with fleet and booking management",
  },
  {
    slug: "bluenote",
    name: "Blue Note",
    tagline:
      "Marketing site for a bar & restaurant — menus, ambiance, and reservations with an editorial feel.",
    tier: "card",
    role: "Freelance Engineer",
    accent: "#1864ab",
    stack: ["Next.js", "React", "Framer Motion", "Embla carousel"],
    screenshots: {
      desktop: ["/projects/bluenote/home-desktop.avif"],
      // The client site has no mobile breakpoints — the phone capture shows
      // a broken layout, so we only ever present desktop.
      mobile: [],
    },
    alt: "Blue Note — bar and restaurant marketing site",
  },
  {
    slug: "tagi",
    name: "TAGi",
    tagline:
      "NFC networking — tap a card, share your contact. React Native app plus a web dashboard with role-based access.",
    tier: "card",
    role: "Lead Developer",
    accent: "#3b5bdb",
    stack: ["React Native", "NFC", "Next.js", "Dashboard", "RBAC"],
    screenshots: {
      desktop: ["/projects/tagi/home-desktop.avif"],
      mobile: ["/projects/tagi/home-mobile.avif"],
    },
    alt: "TAGi — NFC contact-sharing app with admin dashboard",
  },
]);

export const caseStudies = projects.filter((p) => p.tier === "case-study");
export const cards = projects.filter((p) => p.tier === "card");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
