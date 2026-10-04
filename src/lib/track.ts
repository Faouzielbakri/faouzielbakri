/**
 * Client side of the site's own analytics: one function, `track`, that posts a
 * small event to /api/e. No cookie, no local storage; see the route for what
 * is kept. Failures are swallowed, because analytics must never break a page.
 */
export type TrackName =
  | "pageview"
  | "section"
  | "scroll"
  | "cta"
  | "lead"
  | "hero_next"
  | "hero_play"
  | "outbound";

type Props = Record<string, string | number | boolean>;

/** Where the visit came from: a campaign tag if present, else the referring site. */
function sourceOf() {
  const params = new URLSearchParams(window.location.search);
  const tagged = params.get("utm_source") ?? params.get("ref");
  if (tagged) return tagged.slice(0, 120);
  if (!document.referrer) return undefined;
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    return host === window.location.hostname.replace(/^www\./, "") ? undefined : host;
  } catch {
    return undefined;
  }
}

export function track(name: TrackName, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    const hero = document.querySelector<HTMLElement>("[data-hero]")?.dataset.hero;
    const body = JSON.stringify({
      name,
      path: window.location.pathname,
      hero: window.location.pathname === "/" ? hero : undefined,
      source: sourceOf(),
      props,
    });
    if (!navigator.sendBeacon?.("/api/e", body)) {
      void fetch("/api/e", { method: "POST", body, keepalive: true });
    }
  } catch {}
}

const fired = new Set<string>();

/** Like `track`, but at most once per page load for a given key. */
export function trackOnce(key: string, name: TrackName, props?: Props) {
  if (fired.has(key)) return;
  fired.add(key);
  track(name, props);
}

/** A visitor played with a hero: poked it, scratched it, broke it… */
export function played(kind: string) {
  trackOnce(`play:${kind}`, "hero_play", { kind });
}

export function resetOncePerPage() {
  fired.clear();
}
