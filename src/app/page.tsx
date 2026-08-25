import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { AboutSection } from "@/components/sections/AboutSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { caseStudies, cards } from "@/content/projects";
import { site } from "@/content/site";
import { mediaOrUndefined, withExistingMedia } from "@/lib/media";
import { SITE_URL } from "@/lib/site-url";

/**
 * One connected graph instead of a lone Person node: Person ↔ WebSite ↔
 * ProfilePage, plus the featured case studies as an ItemList — so search
 * engines see the work, not just the name.
 */
const personId = `${SITE_URL}/#person`;
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      jobTitle: site.positioning,
      description: site.summary,
      email: `mailto:${site.email}`,
      url: SITE_URL,
      sameAs: [site.links.github, site.links.linkedin],
      address: { "@type": "PostalAddress", addressLocality: "Agadir", addressCountry: "MA" },
      alumniOf: site.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
      knowsLanguage: ["ar", "fr", "en"],
      knowsAbout: [
        "AI Engineering",
        "LLM agents",
        "Retrieval-Augmented Generation",
        "Next.js",
        "TypeScript",
        "PostgreSQL",
        "Multilingual RTL products",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: site.name,
      publisher: { "@id": personId },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": personId },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#work-list`,
      name: "Selected work",
      itemListElement: caseStudies.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/work/${p.slug}`,
        name: p.name,
      })),
    },
  ],
};

export default function Home() {
  const featured = caseStudies.map(withExistingMedia);
  const more = cards.map(withExistingMedia);
  // Laqta's generated ad videos, pulled from its pipeline (present after extraction)
  const laqtaVideos = [1, 2, 3]
    .map((n) => ({
      src: `/projects/laqta/ad-${n}.mp4`,
      poster: mediaOrUndefined(`/projects/laqta/ad-${n}-poster.avif`),
    }))
    .filter((v) => mediaOrUndefined(v.src));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Nav />
      <main className="flex-1">
        <HeroSection
          name={site.name}
          headline={site.headline}
          positioning={site.positioning}
          microline="Next.js · LLM Agents & RAG · Postgres · Remote-first"
          videoSrc={mediaOrUndefined("/media/hero-ambient.mp4")}
          posterSrc={mediaOrUndefined("/media/hero-poster.avif")}
        />
        <ProofStrip proof={site.proof} />
        <SelectedWork projects={featured} extras={{ laqtaVideos }} />
        <WorkGrid projects={more} />
        <AboutSection
          site={site}
          teacherSrc={mediaOrUndefined("/media/about-teacher.avif")}
          builderSrc={mediaOrUndefined("/media/about-builder.avif")}
        />
        <CapabilitiesSection />
        <ContactSection email={site.email} />
      </main>
      <Footer />
    </>
  );
}
