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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.positioning,
  email: `mailto:${site.email}`,
  url: SITE_URL,
  sameAs: [site.links.github, site.links.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Agadir", addressCountry: "MA" },
  alumniOf: site.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  knowsLanguage: ["ar", "fr", "en"],
};

export default function Home() {
  const featured = caseStudies.map(withExistingMedia);
  const more = cards.map(withExistingMedia);
  // Lakta's generated ad videos, pulled from its pipeline (present after extraction)
  const laktaVideos = [1, 2, 3]
    .map((n) => ({
      src: `/projects/lakta/ad-${n}.mp4`,
      poster: mediaOrUndefined(`/projects/lakta/ad-${n}-poster.avif`),
    }))
    .filter((v) => mediaOrUndefined(v.src));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
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
        <SelectedWork projects={featured} extras={{ laktaVideos }} />
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
