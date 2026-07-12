"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Site } from "@/content/schema";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotionSafe, useSectionSpy } from "@/lib/hooks";

type AboutSectionProps = {
  site: Site;
  textureSrc?: string;
  thesisSrc?: string;
};

export function AboutSection({ site, textureSrc, thesisSrc }: AboutSectionProps) {
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement | null>(null);
  const spyRef = useSectionSpy<HTMLElement>("about");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const textureY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="about"
      ref={(el) => {
        sectionRef.current = el;
        spyRef.current = el;
      }}
      className="rule relative overflow-hidden bg-surface py-28"
    >
      {textureSrc && (
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-[0.16]"
          style={reduced ? undefined : { y: textureY }}
        >
          <Image src={textureSrc} alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
      )}

      <div className="rail relative grid gap-16 lg:grid-cols-2">
        {/* Beat 1 — the story */}
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">About</p>
          <h2
            className="font-display mt-3 font-bold leading-tight"
            style={{ fontSize: "var(--text-title)" }}
          >
            From Agadir to production — {`I've`} spent 5+ years turning ideas into
            products people pay for.
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">{site.summary}</p>
          <p className="mt-4 max-w-lg leading-relaxed text-ink-soft">
            Co-founder of FASL, founder of Magical Hekaya, and freelance engineer behind
            trading platforms, marketplaces, and learning systems. If it&apos;s on this
            page, it shipped.
          </p>
        </Reveal>

        {/* Beat 2 — credentials */}
        <Reveal className="lg:pt-24">
          <div className="rounded-2xl border border-line bg-bg/80 p-8 backdrop-blur">
            <h3 className="font-display text-lg font-bold">Credentials</h3>
            <ul className="mt-5 space-y-5">
              {site.education.map((edu) => (
                <li key={edu.degree}>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-muted">
                    {edu.school} · {edu.years}
                  </p>
                  {edu.note && (
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{edu.note}</p>
                  )}
                </li>
              ))}
              <li>
                <p className="font-medium">Languages</p>
                <p className="text-sm text-muted">{site.languages.join(" · ")}</p>
              </li>
            </ul>
            {thesisSrc && (
              <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-xl border border-line">
                <Image
                  src={thesisSrc}
                  alt="Stylized visualization inspired by the thesis — solar panel defect detection"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
