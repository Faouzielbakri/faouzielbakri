import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { LocalTime } from "./LocalTime";

/**
 * Per-world footer palette — on /work pages the footer stays inside the
 * project's world instead of snapping back to the paper-cream default.
 */
export type FooterTheme = {
  /** CSS background (color or gradient) */
  bg: string;
  fg: string;
  muted: string;
  border: string;
  accent: string;
};

const LINKS = [
  { label: "Hire me", href: "/hire" },
  { label: "Relocating to the EU", href: "/hire/europe" },
  { label: "Blog", href: "/blog" },
  { label: "AI Visibility Checker", href: "/tools/ai-visibility-checker" },
  { label: site.email, href: `mailto:${site.email}` },
  { label: "GitHub", href: site.links.github, external: true },
  { label: "LinkedIn", href: site.links.linkedin, external: true },
  { label: "Résumé", href: site.links.resume },
];

export function Footer({ theme }: { theme?: FooterTheme }) {
  const vars: CSSProperties & Record<string, string> = theme
    ? {
        "--f-fg": theme.fg,
        "--f-muted": theme.muted,
        "--f-accent": theme.accent,
        background: theme.bg,
        borderTop: `1px solid ${theme.border}`,
      }
    : {
        "--f-fg": "var(--color-ink)",
        "--f-muted": "var(--color-muted)",
        "--f-accent": "var(--color-accent)",
      };

  return (
    <footer className={theme ? undefined : "rule bg-bg"} style={vars}>
      <div className="rail flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold" style={{ color: "var(--f-fg)" }}>
            {site.name}
            <span style={{ color: "var(--f-accent)" }}>.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm" style={{ color: "var(--f-muted)" }}>
            {site.location}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--f-muted)" }}>
            Local time: <LocalTime />
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                className="transition-colors duration-200 hover:!text-[var(--f-accent)]"
                style={{ color: "var(--f-fg)", opacity: 0.82 }}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="rail pb-8">
        <p className="text-xs" style={{ color: "var(--f-muted)" }}>
          © {new Date().getFullYear()} {site.name}. Built with Next.js — designed to be
          scrolled.
        </p>
      </div>
    </footer>
  );
}
