import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Project } from "@/content/schema";

/** True if a public-relative path (e.g. "/projects/fasl/home-desktop.avif") exists on disk. */
export function mediaExists(publicPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}

/** Returns the path if the file exists, otherwise undefined. */
export function mediaOrUndefined(publicPath: string): string | undefined {
  return mediaExists(publicPath) ? publicPath : undefined;
}

/**
 * Drops screenshot paths whose files haven't been captured yet, so client
 * components can render placeholders instead of broken images.
 */
export function withExistingMedia(project: Project): Project {
  return {
    ...project,
    screenshots: {
      desktop: project.screenshots.desktop.filter(mediaExists),
      mobile: project.screenshots.mobile.filter(mediaExists),
    },
  };
}
