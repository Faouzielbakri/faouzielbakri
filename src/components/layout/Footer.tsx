import { site } from "@/content/site";
import { LocalTime } from "./LocalTime";

export function Footer() {
  return (
    <footer className="rule bg-bg">
      <div className="rail flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold">
            {site.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted">{site.location}</p>
          <p className="mt-1 text-sm text-muted">
            Local time: <LocalTime />
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <a className="text-ink-soft hover:text-accent" href="/hire">
              Hire me
            </a>
          </li>
          <li>
            <a className="text-ink-soft hover:text-accent" href="/blog">
              Blog
            </a>
          </li>
          <li>
            <a className="text-ink-soft hover:text-accent" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </li>
          <li>
            <a
              className="text-ink-soft hover:text-accent"
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              className="text-ink-soft hover:text-accent"
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a className="text-ink-soft hover:text-accent" href={site.links.resume}>
              Résumé
            </a>
          </li>
        </ul>
      </div>
      <div className="rail pb-8">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {site.name}. Built with Next.js — designed to be
          scrolled.
        </p>
      </div>
    </footer>
  );
}
