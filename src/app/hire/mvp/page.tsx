import type { Metadata } from "next";
import { Accent, AsideLink, HireLanding, type HireLandingContent } from "@/components/hire/HireLanding";

/**
 * The MVP page.
 *
 * "mvp development services" 590/mo and "mvp development company" 480/mo both
 * sit at difficulty 0 with $40–50 clicks; "startup mvp development" 210, "mvp
 * development agency" 170, "mvp development cost" 140, "saas mvp development"
 * 70 at $152 a click (DataForSEO, US/en, Oct 2026). The blog post
 * /blog/how-to-build-an-mvp ranks for the informational side and funnels here.
 */

const TITLE = "MVP Development Services — From Empty Repo to First Users";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "MVP development services for founders: one engineer who scopes, builds and launches your first version, web app or SaaS, with AI where it helps. Fixed scope, fixed price, four of my own products live as proof.",
  keywords: [
    "mvp development services",
    "mvp development company",
    "startup mvp development",
    "mvp development agency",
    "saas mvp development",
    "mvp development cost",
    "mvp developer",
    "build an mvp",
  ],
  alternates: { canonical: "/hire/mvp" },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Your first version, scoped honestly and shipped by the engineer who has launched his own products the same way.",
    url: "/hire/mvp",
    images: [{ url: "/og/default.png" }],
  },
};

const content: HireLandingContent = {
  path: "/hire/mvp",
  breadcrumb: "MVP development",
  service: {
    name: "MVP Development Services",
    description:
      "MVP development for founders and businesses: scoping, design, full-stack build, payments, deployment and launch of a first version, by one engineer on a fixed scope.",
    serviceType: "MVP development",
    audience: "Founders and businesses launching a first version of a product",
    catalogName: "MVP engagements",
  },
  hero: {
    eyebrow: "MVP development services · for founders",
    title: (
      <>
        Your MVP, built by someone
        <br />
        who has <Accent>launched</Accent> his own
      </>
    ),
    lede: "Most MVPs die of scope, not of code. I have taken my own products from an empty repository to real users and real payments, so I know which features a first version needs and which ones only feel necessary. You get one engineer for the whole thing: scope, build, payments, deployment, launch.",
    cta: "Book a free 30-minute call →",
    mailSubject: "MVP — first call",
    secondary: { label: "Read first: how to build an MVP", href: "/blog/how-to-build-an-mvp" },
  },
  offers: {
    title: "What an MVP engagement covers",
    intro:
      "One person owns every layer, so nothing falls between a designer, a front-end developer and a back-end developer.",
    items: [
      {
        kicker: "01",
        title: "Scope that fits a first version",
        body: "We cut the idea down to the one flow a user must complete for the product to prove itself. Everything else goes on a list for later. This is the step that decides whether you launch.",
        fit: "Best done before a single line of code.",
      },
      {
        kicker: "02",
        title: "The full product build",
        body: "Web app or SaaS in Next.js, TypeScript and PostgreSQL: accounts, the core flow, an admin area, emails, and a design that looks finished. Mobile-first, and in more than one language if your market needs it.",
        fit: "Best if you need it to look real on day one.",
      },
      {
        kicker: "03",
        title: "Payments and the parts that make money",
        body: "Checkout, subscriptions or one-off purchases, webhooks that are verified, invoices and the first analytics, so the MVP can answer the only question that matters: will someone pay.",
        fit: "Best if the test is revenue, not sign-ups.",
      },
      {
        kicker: "04",
        title: "AI where it earns its place",
        body: "If the product needs it: generation, retrieval over your data, an agent. Built with cost limits and checks from the start, so a model bill or a wrong answer does not sink the launch.",
        fit: "Best if AI is the reason the product exists.",
      },
    ],
  },
  receipts: {
    title: "First versions that reached real users",
    items: [
      {
        value: "818 / 629",
        label: "Registered clients and orders in the first two months",
        detail:
          "Belmo: a K-beauty store built from an empty repo, with storefront, cash on delivery, shipping integration and a full back office.",
        slug: "belmo",
      },
      {
        value: "$300",
        label: "Revenue in the first two months",
        detail:
          "Magical Hekaya: a consumer AI product I founded and launched myself. Small number, real customers, which is exactly what an MVP is for.",
        slug: "magical-hekaya",
      },
      {
        value: "217K",
        label: "Search impressions in 28 days",
        detail:
          "FASL: a legal AI platform I co-founded, built from the first commit and grown through its own SEO.",
        slug: "fasl",
      },
      {
        value: "~500",
        label: "Students on a platform that replaced spreadsheets",
        detail:
          "Magic Hands LMS: courses, video lessons, quizzes and online enrolment for a training academy.",
        slug: "magic-hands-lms",
      },
    ],
  },
  process: {
    title: "Four steps, one price",
    items: [
      {
        step: "A call, free",
        body: "Thirty minutes on the idea and who it is for. I will tell you what I would cut, and whether it needs building at all yet.",
      },
      {
        step: "A fixed scope",
        body: "One page: the flows in the first version, what is left out on purpose, the delivery date and one price. Agreed before any code is written.",
      },
      {
        step: "Build in the open",
        body: "You get a live link early and watch the product grow on it. Feedback goes in while it is cheap to act on.",
      },
      {
        step: "Launch and hand over",
        body: "Deployed on your domain, with payments live and documentation to run it. You own the code and the accounts. I can stay on for the next version if you want.",
      },
    ],
  },
  caseStudies: {
    title: "Three launches, from first commit to customers",
    slugs: ["belmo", "magical-hekaya", "fasl"],
  },
  faq: {
    title: "Asked by every founder",
    aside: (
      <>
        Still shaping the idea?{" "}
        <AsideLink href="/blog/how-to-build-an-mvp">How to build an MVP that ships</AsideLink> walks
        through scoping a first version honestly, including what it costs.
      </>
    ),
    items: [
      {
        q: "What does MVP development cost?",
        a: "It depends on the scope, and scope is the thing we fix first. After a free call you get one price in writing for a defined first version. If the honest answer is that your budget fits a smaller version, I will show you what that version is.",
      },
      {
        q: "How long does an MVP take?",
        a: "It depends on how hard we cut. A first version built around one core flow is a matter of weeks; the delivery date is written into the scope before work starts, and you see progress on a live link throughout.",
      },
      {
        q: "Are you an MVP development company?",
        a: "No. I am one engineer who does the whole build. For an MVP that is an advantage: no hand-offs, no meetings between teams, and the person who promised the scope is the person who has to deliver it.",
      },
      {
        q: "I am not technical. Can I still work with you?",
        a: "Yes. Most founders I work with are not. You bring the knowledge of the customer and the problem; I translate it into a product and explain the trade-offs in plain language.",
      },
      {
        q: "Which stack do you build with?",
        a: "Next.js, React, TypeScript and PostgreSQL, deployed with Docker on infrastructure you control or on Vercel. It is a mainstream stack, so any competent developer can take the product over later.",
      },
      {
        q: "Can you add AI features to the MVP?",
        a: "Yes, it is my specialty: agents, retrieval over your own data, generation pipelines. I will also tell you when AI adds cost and risk without making the first version better.",
      },
      {
        q: "Who owns the code?",
        a: "You do, from the first commit: the repository, the domain, the hosting and the payment accounts are in your name.",
      },
      {
        q: "What happens after launch?",
        a: "You will learn things from real users within days. I can stay on, month by month, to build the next version from what they tell you, or hand over cleanly to your own team.",
      },
    ],
  },
  closing: {
    eyebrow: "Free call · no deck, no pitch",
    title: (
      <>
        Tell me the idea.
        <br />
        I will tell you what to <Accent>cut</Accent>.
      </>
    ),
    body: "Thirty minutes, no charge, and an honest answer, including “do not build this yet.” I read and answer every email myself, within 24 hours.",
  },
};

export default function HireMvpPage() {
  return <HireLanding content={content} />;
}
