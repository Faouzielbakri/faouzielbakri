import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, CloudUpload } from "lucide-react";
import { FormFiller } from "@/components/forms/FormFiller";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { FORMS, findForm } from "@/content/forms";

/**
 * A client form (brief, questionnaire) in the site's own style. The questions
 * come from src/content/forms; answering and saving live in FormFiller.
 * Private by link: not indexed, not in the sitemap.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return FORMS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/forms/[slug]">): Promise<Metadata> {
  const form = findForm((await params).slug);
  return {
    title: form?.title ?? "Form",
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function FormPage({ params }: PageProps<"/forms/[slug]">) {
  const form = findForm((await params).slug);
  if (!form) notFound();
  const [lead, accent] = form.heading;

  return (
    <>
      <Nav />
      <main className="min-h-screen pb-28 pt-28 sm:pt-32">
        <header className="rail">
          <div className="mx-auto max-w-3xl">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted sm:tracking-[0.25em]">
              <span aria-hidden className="h-px w-10 shrink-0 bg-accent" />
              {form.eyebrow}
            </p>
            <h1
              className="font-display mt-5 font-bold leading-[1.04] text-balance"
              style={{ fontSize: "var(--text-display)" }}
            >
              {lead}{" "}
              <em
                className="not-italic"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                }}
              >
                {accent}
              </em>
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{form.lead}</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-[13px] text-ink-soft">
              <li className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5">
                <Clock className="size-3.5 text-muted" aria-hidden />
                About {form.minutes} minutes
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5">
                <CloudUpload className="size-3.5 text-muted" aria-hidden />
                Saves as you type, finish any time
              </li>
            </ul>
          </div>
        </header>

        <div className="rail mt-10 sm:mt-14">
          <div className="mx-auto max-w-3xl">
            <FormFiller form={form} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
