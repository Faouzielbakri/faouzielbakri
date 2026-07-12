import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ArchDiagram } from "@/components/case-study/ArchDiagram";
import { ScreenshotGallery } from "@/components/case-study/ScreenshotGallery";
import { Chip } from "@/components/ui/Chip";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { caseStudies, getProject } from "@/content/projects";
import { withExistingMedia } from "@/lib/media";

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const ogImage = project.screenshots.desktop[0] ?? "/og/default.png";
  return {
    title: `${project.name} — Case Study`,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.name} — Case Study by Faouzi El Bakri`,
      description: project.tagline,
      images: [{ url: ogImage }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const raw = getProject(slug);
  if (!raw || raw.tier !== "case-study" || !raw.caseStudy) notFound();
  const project = withExistingMedia(raw);
  const study = project.caseStudy!;

  const siblings = caseStudies;
  const index = siblings.findIndex((p) => p.slug === project.slug);
  const prev = siblings[(index - 1 + siblings.length) % siblings.length];
  const next = siblings[(index + 1) % siblings.length];
  const metric = project.metrics[0];

  return (
    <>
      <Nav />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <header
          className="pb-16 pt-12"
          style={{
            background: `linear-gradient(160deg, var(--color-bg) 40%, ${project.accent}14 100%)`,
          }}
        >
          <div className="rail">
            <Link
              href="/#work"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              ← All work
            </Link>
            <h1
              className="font-display mt-6 font-bold leading-none"
              style={{ fontSize: "var(--text-display)" }}
            >
              {project.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
              {project.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {project.role}
              </p>
              {metric && (
                <p className="flex items-baseline gap-2">
                  <span
                    className="font-display text-2xl font-bold"
                    style={{ color: project.accent }}
                  >
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted">
                    {metric.label} · {metric.source}
                  </span>
                </p>
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline decoration-line underline-offset-4 hover:text-accent"
                >
                  Visit live ↗
                </a>
              )}
            </div>
            <div className="mt-10">
              <DeviceFrame
                src={project.screenshots.desktop[0]}
                alt={project.alt}
                accent={project.accent}
                kind="desktop"
                monogram={project.name.charAt(0)}
                priority
                sizes="(min-width: 1280px) 1184px, 92vw"
              />
            </div>
          </div>
        </header>

        {/* Problem */}
        <section className="rail grid gap-8 py-16 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-xl font-bold">The problem</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">{study.problem}</p>
        </section>

        {/* Approach */}
        <section className="rule bg-surface py-16">
          <div className="rail grid gap-8 lg:grid-cols-[1fr_2fr]">
            <h2 className="font-display text-xl font-bold">The approach</h2>
            <ul className="max-w-2xl space-y-5">
              {study.approach.map((item) => (
                <li key={item} className="flex gap-4 leading-relaxed text-ink-soft">
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full"
                    style={{ background: project.accent }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {study.architecture && (
            <div className="rail mt-14">
              <h3 className="font-mono mb-6 text-xs uppercase tracking-[0.2em] text-muted">
                How it flows
              </h3>
              <ArchDiagram steps={study.architecture} accent={project.accent} />
            </div>
          )}
        </section>

        {/* Screenshots */}
        {(project.screenshots.desktop.length > 0 ||
          project.screenshots.mobile.length > 0) && (
          <section className="rail py-16">
            <h2 className="font-mono mb-8 text-xs uppercase tracking-[0.2em] text-muted">
              In the wild
            </h2>
            <ScreenshotGallery project={project} />
          </section>
        )}

        {/* Stack + outcome */}
        <section className="rule bg-surface py-16">
          <div className="rail grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-xl font-bold">Stack</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Chip>{tech}</Chip>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Outcome</h2>
              <ul className="mt-5 space-y-4">
                {study.outcome.map((item) => (
                  <li key={item} className="flex gap-4 leading-relaxed text-ink-soft">
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 rounded-full"
                      style={{ background: project.accent }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Prev / next */}
        <nav aria-label="More case studies" className="rule">
          <div className="rail flex items-center justify-between py-10">
            <Link
              href={`/work/${prev.slug}`}
              className="group text-sm text-muted hover:text-ink"
            >
              ← <span className="underline-offset-4 group-hover:underline">{prev.name}</span>
            </Link>
            <Link
              href={`/work/${next.slug}`}
              className="group text-sm text-muted hover:text-ink"
            >
              <span className="underline-offset-4 group-hover:underline">{next.name}</span> →
            </Link>
          </div>
        </nav>
      </main>
      <Footer />
    </>
  );
}
