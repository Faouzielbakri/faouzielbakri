/**
 * The five homepage heroes, in the order the "next opening" control steps
 * through them. The first is the primary, served at `/`; `src/proxy.ts`
 * rewrites `/?hero=<key>` (or 1–5) to the others.
 * This file is imported by the proxy, so it must stay free of React and of
 * anything that touches the DOM.
 */
export const HERO_KEYS = ["look", "scratch", "watcher", "break", "brief"] as const;
export type HeroKey = (typeof HERO_KEYS)[number];
export const PRIMARY_HERO: HeroKey = HERO_KEYS[0];

/** The pre-rotation hero, kept reachable at `?hero=current` for comparison. */
export const LEGACY_HERO = "current";
export type HeroRoute = HeroKey | typeof LEGACY_HERO;

export function resolveHero(param: string | null): HeroRoute | null {
  if (!param) return null;
  if (param === LEGACY_HERO) return LEGACY_HERO;
  const byNumber = HERO_KEYS[Number(param) - 1];
  if (byNumber) return byNumber;
  return (HERO_KEYS as readonly string[]).includes(param) ? (param as HeroKey) : null;
}
