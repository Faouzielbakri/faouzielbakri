import type { Metadata } from "next";

/** Mock pages exist only as capture targets for project screenshots. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
