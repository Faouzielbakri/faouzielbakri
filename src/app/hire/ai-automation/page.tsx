import type { Metadata } from "next";
import { Accent, AsideLink, HireLanding, type HireLandingContent } from "@/components/hire/HireLanding";

/**
 * The AI automation page.
 *
 * The biggest cluster the site was not answering (DataForSEO, US/en, Oct 2026):
 * "ai automation agency" 4,400/mo, "ai workflow automation" 1,000, "ai
 * automation services" 720 (difficulty 3), "ai integration services" 720
 * (difficulty 1), "ai automation consultant" 590 and "custom ai solutions" 590
 * (both difficulty 0). The searcher types "agency"; the pitch is that they get
 * the engineer instead.
 */

const TITLE = "AI Automation Services — The Engineer, Not the Agency";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "AI automation services from the engineer who builds them: workflow automation, AI integration into the tools you already use, and custom AI solutions. Fixed scope, fixed price, live systems as proof.",
  keywords: [
    "ai automation agency",
    "ai automation services",
    "ai integration services",
    "ai automation consultant",
    "custom ai solutions",
    "ai workflow automation",
    "n8n automation agency",
    "business process automation ai",
  ],
  alternates: { canonical: "/hire/ai-automation" },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Workflow automation, AI integration and custom AI solutions, built and shipped by one engineer. No account manager, no slide deck.",
    url: "/hire/ai-automation",
    images: [{ url: "/og/default.png" }],
  },
};

const content: HireLandingContent = {
  path: "/hire/ai-automation",
  breadcrumb: "AI automation",
  service: {
    name: "AI Automation & Integration Services",
    description:
      "AI automation services: workflow automation, AI integration into existing tools, and custom AI solutions, designed, built and deployed by one engineer on a fixed scope.",
    serviceType: "AI automation",
    audience: "Businesses automating repetitive work",
    catalogName: "AI automation engagements",
  },
  hero: {
    eyebrow: "AI automation services · integration · custom AI solutions",
    title: (
      <>
        AI automation,
        <br />
        without the <Accent>agency</Accent>
      </>
    ),
    lede: "You searched for an AI automation agency. What you actually need is the work an agency would hand to its one good engineer: find the task your team repeats every day, wire a model into the tools you already use, and ship it so it runs without anyone babysitting it. I am that engineer, and you talk to me directly.",
    cta: "Book a free 30-minute call →",
    mailSubject: "AI automation — first call",
    secondary: { label: "Need a custom agent? The AI agents page", href: "/hire/ai-agents" },
  },
  offers: {
    title: "Four kinds of automation that earn their keep",
    intro:
      "Each is scoped to ship on its own. Start with the one that removes the most hours from the week; the others can wait until the first has paid for itself.",
    items: [
      {
        kicker: "01",
        title: "Workflow automation",
        body: "The chain of steps someone performs by hand: a lead arrives, gets qualified, lands in the CRM, triggers a reply, creates a task. I build it as code, or in n8n when a visual workflow your team can edit is the better tool, with a model making the judgement calls a rule cannot.",
        fit: "Best if a person is the glue between your tools.",
      },
      {
        kicker: "02",
        title: "AI integration into what you already use",
        body: "Claude or Gemini connected to your site, your WhatsApp number, your database, your inbox or your back office through their real APIs. No new platform to log into: the AI shows up inside the tools your team already opens every morning.",
        fit: "Best if you have the systems and want them smarter.",
      },
      {
        kicker: "03",
        title: "Document and content pipelines",
        body: "Quotes, reports, contracts, product descriptions, ad creatives: generated from your templates and your data, checked by a second pass, approved by a human before anything goes out. The model drafts; you stay the one who signs.",
        fit: "Best if someone bills hours for copy-paste.",
      },
      {
        kicker: "04",
        title: "Custom AI solutions",
        body: "When nothing off the shelf fits: retrieval over your own documents, a multi-step pipeline with its own logic, a product with AI at its centre. Designed around your process, deployed on infrastructure you control, and yours to keep.",
        fit: "Best if the tool you need does not exist yet.",
      },
    ],
  },
  receipts: {
    title: "Automations already running in production",
    items: [
      {
        value: "7 agents",
        label: "One upload in, a finished video ad out",
        detail:
          "Laqta: a seller uploads a product and picks an avatar; a seven-agent pipeline writes the script, voices it in Darija and renders the ad. No editor, no studio.",
        slug: "laqta",
      },
      {
        value: "4 stages",
        label: "A legal appeal drafted end to end",
        detail:
          "FASL: strategist, drafter, senior partner and auditor agents turn an uploaded judgment into a grounded appeal memo, pausing to ask the lawyer for a missing document when it would change the outcome.",
        slug: "fasl",
      },
      {
        value: "WhatsApp",
        label: "Job matching with nobody at the keyboard",
        detail:
          "RESO Khdma: an agent interviews workers inside WhatsApp in Darija, then matches them to jobs by meaning with semantic search, on the channel the users already had.",
        slug: "reso-khdma",
      },
      {
        value: "Paid",
        label: "A storybook generated per customer",
        detail:
          "Magical Hekaya: a parent uploads a photo and a multi-model pipeline writes, illustrates and narrates a personalised book. Live, with paying customers.",
        slug: "magical-hekaya",
      },
    ],
  },
  process: {
    title: "No retainer, no discovery phase, no surprise invoice",
    items: [
      {
        step: "A call, free",
        body: "Thirty minutes. You describe where the hours go; I tell you which part is worth automating and which part is not. If nothing fits, I say so.",
      },
      {
        step: "A fixed scope",
        body: "One page: what gets built, what it will and will not do, what I need from you, when it lands and what it costs. One number, agreed before any code is written.",
      },
      {
        step: "The build",
        body: "You see it working while it is being built, on your real data, so a wrong direction shows up in the first week and not at delivery.",
      },
      {
        step: "Handover that holds",
        body: "It ships to your hosting or mine, with the documentation to run it. You own the code and the workflows. I can stay on for maintenance, month by month, if you want it.",
      },
    ],
  },
  caseStudies: {
    title: "Three automations, written up in full",
    slugs: ["laqta", "fasl", "reso-khdma"],
  },
  faq: {
    title: "Asked before every first call",
    aside: (
      <>
        Not sure the idea deserves a build at all?{" "}
        <AsideLink href="/hire/small-business">The small-business page</AsideLink> is about picking
        the one automation worth starting with.
      </>
    ),
    items: [
      {
        q: "Are you an AI automation agency?",
        a: "No, and that is the point. An agency sells you an account manager and passes the work to whoever is free. I am one engineer: I scope it, build it, deploy it and answer your messages. You get agency-grade output without paying for the layers in between.",
      },
      {
        q: "What can actually be automated with AI?",
        a: "Work that is repeated often and tolerates review: answering recurring questions, qualifying and routing leads, drafting documents from templates, extracting data from files, searching your own knowledge, producing content variations. Work that is rare, or where one wrong answer is expensive and nobody checks it, is a bad candidate, and I will tell you so.",
      },
      {
        q: "Do you use n8n, Make or Zapier, or do you write code?",
        a: "Whichever fits. n8n is a good choice when your team wants to see and edit the workflow themselves. Code is the right choice when the logic is complex, the volume is high, or the automation is part of a product. Many builds are both: a coded core with a visual layer on top.",
      },
      {
        q: "Which AI models do you work with?",
        a: "Mostly Claude and Gemini, chosen per task: a strong model where reasoning matters, a small fast one for the high-volume steps. The system is built so the model can be swapped without a rewrite, because prices and quality change every few months.",
      },
      {
        q: "How do you stop it from inventing things?",
        a: "By engineering, not by prompt wording. Answers are grounded in your documents with the source shown, a second step checks the first, and a human approves anything that leaves under your name. On FASL, legal drafting where a wrong answer is costly, that structure is the whole product.",
      },
      {
        q: "What does AI automation cost?",
        a: "It depends on scope, so a number on a web page would be a guess. The shape is fixed: a free call, then one price agreed in writing before the build starts. Running costs (model usage, hosting) are estimated in the same document so there is no surprise later.",
      },
      {
        q: "Will it work in French or Arabic?",
        a: "Yes. I work in English, French, Arabic and Darija, and I have shipped systems in all four: FASL runs Arabic-first, RESO Khdma talks to users in Darija, Belmo sells in French and Arabic.",
      },
      {
        q: "Who owns the automation when it is done?",
        a: "You do: the code, the workflows, the prompts and the accounts. It runs on infrastructure you control. Nothing is locked to a platform you have to keep renting from me.",
      },
    ],
  },
  closing: {
    eyebrow: "Free call · no deck, no pitch",
    title: (
      <>
        Tell me which task
        <br />
        you would <Accent>delete</Accent>.
      </>
    ),
    body: "Thirty minutes, no charge, and an honest answer at the end, including “do not automate this.” I read and answer every email myself, within 24 hours.",
  },
};

export default function HireAiAutomationPage() {
  return <HireLanding content={content} />;
}
