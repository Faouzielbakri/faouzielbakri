import { NextResponse, type NextRequest } from "next/server";
import { PRIMARY_HERO, resolveHero } from "@/components/hero/variants";

/**
 * Hero selection.
 *
 * The homepage has five heroes, each prerendered at `/h/<key>`. LOOK is the
 * primary: every visitor gets it at `/`. `?hero=scratch` (or `?hero=2`) serves
 * another one, which is what the on-page "next opening" control links to. The
 * rewrite happens here, before rendering, so the visitor always receives
 * finished HTML for their hero and never a flash of a different one.
 */
export function proxy(request: NextRequest) {
  const hero = resolveHero(request.nextUrl.searchParams.get("hero")) ?? PRIMARY_HERO;
  const url = request.nextUrl.clone();
  url.pathname = `/h/${hero}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: "/" };
