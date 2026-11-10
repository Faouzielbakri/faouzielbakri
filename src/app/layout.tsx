import type { Metadata } from "next";
import { Attribution } from "@/components/layout/Attribution";
import { Tracker } from "@/components/analytics/Tracker";
import { SITE_URL } from "@/lib/site-url";
import { FONT_PRELOADS } from "./font-preloads";
// The fonts ship with the site (scripts/fetch-google-fonts.mjs): a build never waits on Google Fonts.
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Faouzi El Bakri — AI Engineer & Full-Stack Developer",
    template: "%s — Faouzi El Bakri",
  },
  description:
    "AI engineer building LLM-powered products end-to-end — multi-agent pipelines, RAG, Next.js, TypeScript, Postgres. Based in Agadir, Morocco, working worldwide.",
  keywords: [
    "AI engineer",
    "full-stack developer",
    "LLM agents",
    "multi-agent pipelines",
    "RAG",
    "Next.js developer",
    "TypeScript",
    "Morocco",
    "Arabic RTL products",
    "freelance AI engineer",
    "hire AI developer",
    "freelance AI developer",
    "AI consultant",
  ],
  authors: [{ name: "Faouzi El Bakri", url: SITE_URL }],
  creator: "Faouzi El Bakri",
  category: "technology",
  openGraph: {
    type: "website",
    siteName: "Faouzi El Bakri",
    title: "Faouzi El Bakri — AI Engineer & Full-Stack Developer",
    description:
      "I build AI products people actually use — multi-agent pipelines, RAG, Next.js. Shipped from Agadir, used worldwide.",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faouzi El Bakri — AI Engineer & Full-Stack Developer",
    images: ["/og/default.png"],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        {FONT_PRELOADS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="" />
        ))}
      </head>
      <body className="min-h-full flex flex-col">
        <Attribution />
        <Tracker />
        {children}
      </body>
    </html>
  );
}
