"use client";

import type { Project } from "@/content/schema";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export function ScreenshotGallery({ project }: { project: Project }) {
  const { desktop, mobile } = project.screenshots;
  if (desktop.length === 0 && mobile.length === 0) return null;

  return (
    <Reveal group className="grid items-start gap-6 lg:grid-cols-[3fr_1fr]">
      <div className="space-y-6">
        {desktop.map((src, i) => (
          <RevealItem key={src}>
            <DeviceFrame
              src={src}
              alt={`${project.alt} — screen ${i + 1}`}
              accent={project.accent}
              kind="desktop"
              sizes="(min-width: 1024px) 70vw, 90vw"
            />
          </RevealItem>
        ))}
      </div>
      <div className="space-y-6">
        {mobile.map((src, i) => (
          <RevealItem key={src}>
            <DeviceFrame
              src={src}
              alt={`${project.name} on mobile — screen ${i + 1}`}
              accent={project.accent}
              kind="mobile"
              sizes="(min-width: 1024px) 18vw, 40vw"
            />
          </RevealItem>
        ))}
      </div>
    </Reveal>
  );
}
