import { SiteSchema, type Site } from "./schema";

export const site: Site = SiteSchema.parse({
  name: "Faouzi El Bakri",
  headline: "I build AI products people actually use.",
  positioning: "AI Engineer & Full-Stack Developer",
  summary:
    "AI-focused full-stack engineer with 5+ years building and shipping production web products end-to-end. I specialize in LLM-powered applications — multi-agent pipelines, RAG, and tool-calling agents — on a modern Next.js / TypeScript stack. I work the whole lifecycle: architecture → build → deploy → iterate.",
  location: "Agadir, Morocco — working worldwide",
  email: "faouzielbakri@gmail.com",
  links: {
    github: "https://github.com/faouzielbakri",
    linkedin: "https://linkedin.com/in/faouzielbakri",
    resume: "/resume.pdf",
  },
  languages: ["Arabic & Darija — native", "French — fluent", "English — fluent"],
  education: [
    {
      degree: "M.Sc. Big Data & Artificial Intelligence",
      school: "Ibn Zohr University",
      years: "2023 – 2025",
      note: "Thesis: solar panel defect detection with YOLO + PSO — 96.96% mAP50, submitted to AISDS'2025.",
    },
    {
      degree: "B.Sc. Computer Science",
      school: "Ibn Zohr University",
      years: "2018 – 2021",
    },
  ],
  proof: [
    {
      label: "Years shipping production software",
      value: "5+",
      source: "Career",
    },
    {
      label: "Search impressions / 28 days — FASL",
      value: "~37K",
      source: "Google Search Console",
    },
    {
      label: "Magical Hekaya",
      value: "Paying customers",
      source: "Live product sales",
    },
    {
      label: "Students on Magic Hands LMS",
      value: "~500",
      source: "Platform enrollment",
    },
    {
      label: "Providers on Maroc Fournisseurs",
      value: "~500",
      source: "Platform data",
    },
    {
      label: "Languages built for",
      value: "AR · FR · EN — RTL-first",
      source: "FASL, RESO Khdma, Annid Law",
    },
  ],
  capabilities: [
    {
      id: "ai",
      title: "AI Engineering",
      copy: {
        base: "LLM systems that survive contact with production.",
        hire: "I bring hands-on experience shipping agentic systems — not notebooks, products.",
        project: "I can take your product from 'we should add AI' to a working agentic feature.",
      },
      points: [
        "Multi-agent pipelines with structured output contracts",
        "RAG that grounds answers in your data — built for domains where hallucination is expensive",
        "Tool / function calling via JSON-schema contracts",
        "Claude & Gemini APIs, prompt & context engineering, output evaluation",
      ],
      visual: "/media/pillar-ai.avif",
    },
    {
      id: "fullstack",
      title: "Full-Stack Product",
      copy: {
        base: "The whole lifecycle: architecture → build → deploy → iterate.",
        hire: "Comfortable owning features end-to-end across frontend, backend, and infra.",
        project: "One person who can take your idea to a deployed, maintained product.",
      },
      points: [
        "Next.js App Router, React, TypeScript — daily drivers",
        "PostgreSQL, Prisma, Supabase data layers",
        "Real-time systems: WebSockets, streaming UIs, race-condition-safe transactions",
        "Deployment on Vercel or self-hosted — Docker, Hetzner, Dokploy, n8n",
      ],
      visual: "/media/pillar-fullstack.avif",
    },
    {
      id: "multilingual",
      title: "Multilingual & Launch",
      copy: {
        base: "Products that speak Arabic, Darija, French, and English — and actually get found.",
        hire: "Rare combination: strong engineering plus native fluency in RTL and MENA-market products.",
        project: "If your market speaks Arabic or French, I build for it natively — not as an afterthought.",
      },
      points: [
        "RTL-first interfaces — FASL, RESO Khdma, and Annid Law all run in Arabic",
        "i18n architecture with next-intl across four languages",
        "SEO that performs: ~37K impressions/28 days on FASL with zero ad spend",
        "Zero-to-launch experience: payments, fulfilment, analytics, real customers",
      ],
      visual: "/media/pillar-multilingual.avif",
    },
  ],
});
