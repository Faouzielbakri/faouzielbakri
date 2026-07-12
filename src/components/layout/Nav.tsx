"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/store";

const links = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export function Nav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useUiStore((s) => s.activeSection);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over a dark world page the un-scrolled nav sits on dark artwork; once
  // scrolled the light backdrop returns and the default ink palette applies.
  const dark = tone === "dark" && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="rail flex h-16 items-center justify-between" aria-label="Main">
        <Link
          href="/"
          className={`font-display text-lg font-bold tracking-tight ${dark ? "text-white" : ""}`}
        >
          FEB<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm transition-colors duration-200 sm:px-4 ${
                activeSection === link.id
                  ? dark
                    ? "text-white"
                    : "text-ink"
                  : dark
                    ? "text-white/60 hover:text-white"
                    : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className={`ml-2 hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 sm:inline-flex ${
              dark
                ? "bg-white text-ink hover:bg-accent hover:text-white"
                : "bg-ink text-bg hover:bg-accent"
            }`}
          >
            Let&apos;s talk
          </Link>
        </div>
      </nav>
    </header>
  );
}
