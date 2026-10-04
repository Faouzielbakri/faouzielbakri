"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/lib/store";
import { resetOncePerPage, track, trackOnce } from "@/lib/track";

/**
 * Sends the events nobody has to remember to send: a page view on every
 * navigation, how far down the page was scrolled, which homepage sections came
 * into view, and clicks on email and outside links.
 */
export function Tracker() {
  const pathname = usePathname();
  const section = useUiStore((s) => s.activeSection);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    resetOncePerPage();
    // Wait a tick so the hero has mounted and can be named in the event.
    const t = window.setTimeout(() => track("pageview"), 50);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const depth = (window.scrollY / max) * 100;
      for (const mark of [25, 50, 75, 100]) {
        if (depth >= mark - 1) trackOnce(`scroll:${mark}`, "scroll", { depth: mark });
      }
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href) return;
      if (href.startsWith("mailto:")) track("cta", { kind: "email" });
      else if (/^https?:\/\//.test(href) && !href.includes(window.location.hostname)) {
        try {
          track("outbound", { host: new URL(href).hostname.replace(/^www\./, "") });
        } catch {}
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/" && section) trackOnce(`section:${section}`, "section", { id: section });
  }, [pathname, section]);

  return null;
}
