"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/store";

const links = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useUiStore((s) => s.activeSection);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="rail flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          FEB<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm transition-colors duration-200 sm:px-4 ${
                activeSection === link.id
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="ml-2 hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent sm:inline-flex"
          >
            Let&apos;s talk
          </Link>
        </div>
      </nav>
    </header>
  );
}
