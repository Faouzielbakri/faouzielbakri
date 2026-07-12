import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Faouzi El Bakri — AI Engineer & Full-Stack Developer",
    template: "%s — Faouzi El Bakri",
  },
  description:
    "AI-focused full-stack engineer building LLM-powered products end-to-end — multi-agent pipelines, RAG, Next.js, TypeScript, Postgres. Based in Agadir, Morocco, working worldwide.",
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
      className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
