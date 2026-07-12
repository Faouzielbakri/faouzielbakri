import type { Metadata } from "next";
import {
  Amiri,
  Fraunces,
  Geist,
  Geist_Mono,
  Playfair_Display,
  Space_Grotesk,
  Tajawal,
} from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* World fonts — each featured project speaks its own typography */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  style: ["normal", "italic"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Faouzi El Bakri — AI Engineer & Full-Stack Developer",
    template: "%s — Faouzi El Bakri",
  },
  description:
    "AI-focused full-stack engineer building LLM-powered products end-to-end — multi-agent pipelines, RAG, Next.js, TypeScript, Postgres. Based in Agadir, Morocco, working worldwide.",
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
      className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${fraunces.variable} ${playfair.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
