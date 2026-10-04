import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/HomePage";
import { HERO_KEYS, LEGACY_HERO, resolveHero } from "@/components/hero/variants";

/**
 * The homepage, once per hero. Visitors never see these URLs: the proxy
 * rewrites `/` here. Reached directly, they declare `/` as the canonical page.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...HERO_KEYS, LEGACY_HERO].map((hero) => ({ hero }));
}

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HeroHomePage({ params }: PageProps<"/h/[hero]">) {
  const { hero } = await params;
  const key = resolveHero(hero);
  if (!key) notFound();
  return <HomePage hero={key} />;
}
