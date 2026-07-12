import { z } from "zod";

/**
 * Every metric carries a `source` so nothing unverifiable ships.
 * If it can't name a source, it doesn't go on the site.
 */
export const MetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  source: z.string(),
});

export const ArchStepSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

export const CaseStudySchema = z.object({
  problem: z.string(),
  approach: z.array(z.string()).min(2),
  outcome: z.array(z.string()).min(1),
  /** Optional pipeline diagram steps (rendered by ArchDiagram) */
  architecture: z.array(ArchStepSchema).optional(),
});

export const ScreenshotsSchema = z.object({
  desktop: z.array(z.string()).default([]),
  mobile: z.array(z.string()).default([]),
});

export const ProjectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    tagline: z.string(),
    tier: z.enum(["case-study", "card"]),
    role: z.string(),
    url: z.url().optional(),
    /** Per-project accent used to tint work panels/cards */
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    stack: z.array(z.string()).min(1),
    metrics: z.array(MetricSchema).default([]),
    caseStudy: CaseStudySchema.optional(),
    screenshots: ScreenshotsSchema.default({ desktop: [], mobile: [] }),
    alt: z.string(),
  })
  .refine((p) => p.tier !== "case-study" || p.caseStudy, {
    message: "case-study tier projects must include caseStudy content",
  });

export type Project = z.infer<typeof ProjectSchema>;
export type Metric = z.infer<typeof MetricSchema>;

export const CapabilitySchema = z.object({
  id: z.string(),
  title: z.string(),
  /** Copy variants per audience intent; `base` is the fallback */
  copy: z.object({
    base: z.string(),
    hire: z.string(),
    project: z.string(),
  }),
  points: z.array(z.string()).min(2),
  /** Generated visual for the pillar (public path) */
  visual: z.string(),
});

export const SiteSchema = z.object({
  name: z.string(),
  headline: z.string(),
  positioning: z.string(),
  summary: z.string(),
  location: z.string(),
  email: z.email(),
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
    resume: z.string(),
  }),
  languages: z.array(z.string()),
  education: z.array(
    z.object({
      degree: z.string(),
      school: z.string(),
      years: z.string(),
      note: z.string().optional(),
    }),
  ),
  proof: z.array(MetricSchema),
  capabilities: z.array(CapabilitySchema).length(3),
});

export type Site = z.infer<typeof SiteSchema>;
export type Capability = z.infer<typeof CapabilitySchema>;

/** Shared with scripts/generate-assets.ts — validates assets/manifest.json */
export const AssetSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image"),
    id: z.string(),
    model: z.string(),
    prompt: z.string(),
    aspectRatio: z.string(),
    output: z.string(),
    /** Skip the shared styleGuide prefix (for assets with their own art direction) */
    standalone: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("video"),
    id: z.string(),
    model: z.string(),
    prompt: z.string(),
    aspectRatio: z.string(),
    durationSeconds: z.number().int().positive(),
    output: z.string(),
  }),
  z.object({
    type: z.literal("poster-from-video"),
    id: z.string(),
    /** id of the video asset to extract the poster frame from */
    source: z.string(),
    output: z.string(),
  }),
]);

export const AssetManifestSchema = z.object({
  styleGuide: z.string(),
  assets: z.array(AssetSchema),
});

export type Asset = z.infer<typeof AssetSchema>;
export type AssetManifest = z.infer<typeof AssetManifestSchema>;
