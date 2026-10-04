import { HomePage } from "@/components/home/HomePage";
import { PRIMARY_HERO } from "@/components/hero/variants";

/**
 * `src/proxy.ts` rewrites every request for `/` to `/h/<hero>`, so this page is
 * only the fallback if the proxy is ever bypassed.
 */
export default function Home() {
  return <HomePage hero={PRIMARY_HERO} />;
}
