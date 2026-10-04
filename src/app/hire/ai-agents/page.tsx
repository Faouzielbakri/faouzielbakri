import type { Metadata } from "next";
import { Accent, AsideLink, HireLanding, type HireLandingContent } from "@/components/hire/HireLanding";

/**
 * The AI agents page.
 *
 * Found in the October 2026 DataForSEO pass (US/en), not in the earlier ones:
 * "ai agent for business" 3,600/mo at difficulty 14 and $87 a click, "ai
 * chatbot for business" 2,900, "ai agent development company" 720, "ai agent
 * development services" 480 (difficulty 0), "custom ai agents" 390, "chatbot
 * development services" 320 (difficulty 0, $86). "ai agent developer" is also
 * the most-asked phrase of the set inside AI assistants. /hire speaks to people
 * hiring a developer; this page speaks to the owner who wants the agent.
 */

const TITLE = "AI Agents for Business — Custom AI Agent Development";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Custom AI agents for business, built by an AI agent developer with agents live in production: customer-facing agents on WhatsApp and web, internal agents over your data, multi-agent pipelines. Fixed scope, fixed price.",
  keywords: [
    "ai agent for business",
    "ai agents for small business",
    "ai agent development services",
    "ai agent development company",
    "custom ai agents",
    "custom ai agent development",
    "ai agent developer",
    "ai chatbot for business",
    "chatbot development services",
    "whatsapp ai agent",
  ],
  alternates: { canonical: "/hire/ai-agents" },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Customer-facing agents, internal agents over your data, and multi-agent pipelines, from a developer whose agents already run in production.",
    url: "/hire/ai-agents",
    images: [{ url: "/og/default.png" }],
  },
};

const content: HireLandingContent = {
  path: "/hire/ai-agents",
  breadcrumb: "AI agents",
  service: {
    name: "Custom AI Agent Development",
    description:
      "AI agent development services for businesses: customer-facing agents on WhatsApp and web, internal agents over company data, and multi-agent pipelines, built and deployed by one AI agent developer.",
    serviceType: "AI agent development",
    audience: "Businesses that want an AI agent built around their own process",
    catalogName: "AI agent engagements",
  },
  hero: {
    eyebrow: "AI agents for business · custom AI agent development",
    title: (
      <>
        An AI agent for your business
        <br />
        that does the <Accent>actual job</Accent>
      </>
    ),
    lede: "A chatbot answers. An agent acts: it reads your data, uses your tools, follows your rules and hands over to a person when it should. I build custom AI agents around how your business really runs, and I have several of them working in production today, not in a demo.",
    cta: "Book a free 30-minute call →",
    mailSubject: "AI agent for my business — first call",
    secondary: { label: "Automating a workflow instead? AI automation", href: "/hire/ai-automation" },
  },
  offers: {
    title: "Four agents businesses actually put to work",
    intro:
      "An agent is worth building when it owns one job completely. These are the four shapes that keep proving themselves.",
    items: [
      {
        kicker: "01",
        title: "The customer-facing agent",
        body: "On WhatsApp, your website, or both. It knows your catalogue, prices and policies, asks the follow-up questions a good employee would, takes the booking or the order details, and passes the conversation to a human with the full context when it reaches its limit.",
        fit: "Best if customers wait for answers your team retypes daily.",
      },
      {
        kicker: "02",
        title: "The internal agent over your data",
        body: "Staff ask in plain language; the agent searches your documents, database or archive by meaning, answers with the source attached, and can take the next step: fill the form, draft the reply, open the ticket.",
        fit: "Best if the answer exists but nobody can find it.",
      },
      {
        kicker: "03",
        title: "The multi-agent pipeline",
        body: "For work too large for one prompt: one agent plans, another drafts, another reviews, another checks the facts. Each has a narrow role and a structured contract with the next, which is what makes long, high-stakes output reliable.",
        fit: "Best if the output is long, expert and must be right.",
      },
      {
        kicker: "04",
        title: "The agent inside your product",
        body: "If you are building software, the agent is a feature: tool calling, memory, streaming, cost controls, evaluation, and the product around it. I build the whole thing in Next.js and TypeScript, not only the model calls.",
        fit: "Best if AI is the product, not an add-on.",
      },
    ],
  },
  receipts: {
    title: "Agents with real users, not demo videos",
    items: [
      {
        value: "Darija",
        label: "A WhatsApp agent that interviews and matches",
        detail:
          "RESO Khdma: an agent talks to workers inside WhatsApp in the dialect they type, builds their profile from the conversation and matches them to jobs with semantic search.",
        slug: "reso-khdma",
      },
      {
        value: "4 agents",
        label: "A legal team in a pipeline",
        detail:
          "FASL: strategist, drafter, senior partner and auditor agents draft Moroccan legal appeals, grounded in the law and able to stop and ask the lawyer for a document.",
        slug: "fasl",
      },
      {
        value: "7 agents",
        label: "From product photo to finished video ad",
        detail:
          "Laqta: seven agents write, voice and render a Darija video ad from a single product upload.",
        slug: "laqta",
      },
      {
        value: "Paid",
        label: "A consumer product run by a model pipeline",
        detail:
          "Magical Hekaya: a multi-model pipeline writes, illustrates and narrates a personalised children's book, with paying customers.",
        slug: "magical-hekaya",
      },
    ],
  },
  process: {
    title: "From a job description to an agent on duty",
    items: [
      {
        step: "A call, free",
        body: "Thirty minutes on the one job you want the agent to own. I tell you whether an agent is the right tool, or whether a simpler automation would do.",
      },
      {
        step: "A fixed scope",
        body: "One page: what the agent does, what it must never do, which tools and data it touches, when it lands and what it costs. Agreed before any code is written.",
      },
      {
        step: "Build and test on real cases",
        body: "The agent is tested against your real conversations and documents, including the awkward ones, and you watch it work before it meets a customer.",
      },
      {
        step: "Launch with a human in reach",
        body: "It goes live with handover to a person, logs of every conversation and a clear cost per use. You own the code, the prompts and the accounts.",
      },
    ],
  },
  caseStudies: {
    title: "Three agent systems, written up in full",
    slugs: ["reso-khdma", "fasl", "laqta"],
  },
  faq: {
    title: "Asked by every owner",
    aside: (
      <>
        Want to know how these are built?{" "}
        <AsideLink href="/blog/llm-agent-architecture">LLM agent architecture</AsideLink> explains the
        structure behind the agents on this page.
      </>
    ),
    items: [
      {
        q: "What is an AI agent for business, in plain words?",
        a: "Software that is given a goal, your data and a set of tools, and works through the steps itself: it reads, decides, acts and reports. A chatbot only answers questions. An agent can also look up the order, book the slot, draft the document or update the record, inside limits you set.",
      },
      {
        q: "Is an AI agent different from a chatbot?",
        a: "Yes. A chatbot replies from a script or a knowledge base. An agent uses tools: your database, your calendar, your WhatsApp number, your CRM. If you only need answers to common questions, a well-built chatbot is cheaper and I will say so.",
      },
      {
        q: "Can the agent work on WhatsApp?",
        a: "Yes, through the official WhatsApp Business API. RESO Khdma runs entirely inside WhatsApp. The same agent can also sit on your website, so customers use whichever they prefer.",
      },
      {
        q: "Should I buy an off-the-shelf agent tool instead?",
        a: "Often, yes. If a ready-made product does your job well, buy it. A custom agent makes sense when your process, your language or your data is the part the generic tools get wrong, or when the agent is part of what you sell.",
      },
      {
        q: "How do you keep an agent from making mistakes with customers?",
        a: "It answers only from your own information and shows where the answer came from, it is given a short list of allowed actions, anything risky needs a human to approve, and it is built to say “let me get a person” when it is unsure. Every conversation is logged so you can review it.",
      },
      {
        q: "What does a custom AI agent cost?",
        a: "It depends on how many tools it uses and how much is at stake when it is wrong, so I quote after a free call: one fixed price in writing, plus an estimate of the monthly running cost (model usage and hosting).",
      },
      {
        q: "Which languages can it speak?",
        a: "English, French, Arabic and Moroccan Darija are the ones I have shipped and can test properly as a speaker. Other languages are possible; I will be clear about what I can verify myself.",
      },
      {
        q: "Who builds it and who owns it?",
        a: "I build it myself; there is no team the work is passed to. You own the code, the prompts and the accounts, and it runs on infrastructure you control.",
      },
    ],
  },
  closing: {
    eyebrow: "Free call · no deck, no pitch",
    title: (
      <>
        Describe the job.
        <br />
        I will tell you if an agent can <Accent>hold it</Accent>.
      </>
    ),
    body: "Thirty minutes, no charge, and an honest answer, including “a simpler tool will do.” I read and answer every email myself, within 24 hours.",
  },
};

export default function HireAiAgentsPage() {
  return <HireLanding content={content} />;
}
