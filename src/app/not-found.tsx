import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="rail flex flex-1 flex-col items-start justify-center py-40">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">404</p>
        <h1
          className="font-display mt-4 font-bold leading-none"
          style={{ fontSize: "var(--text-display)" }}
        >
          This page shipped somewhere else.
        </h1>
        <p className="mt-4 max-w-md text-lg text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist — but the work does.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors duration-200 hover:bg-accent"
        >
          ← Back home
        </Link>
      </main>
      <Footer />
    </>
  );
}
