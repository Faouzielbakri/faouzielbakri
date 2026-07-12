"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/hooks";

type AmbientVideoProps = {
  /** Public path to the mp4 — omit while assets aren't generated yet */
  src?: string;
  /** Poster image path; the LCP element when present */
  poster?: string;
  alt: string;
  className?: string;
};

/**
 * Poster-first ambient video. The <video> element is only attached after
 * hydration + idle, plays muted/looped while in view, and pauses off-screen.
 * With no src (assets not generated yet) or reduced motion, it renders the
 * poster — or a slow warm gradient as the final fallback.
 */
export function AmbientVideo({ src, poster, alt, className = "" }: AmbientVideoProps) {
  const reduced = useReducedMotionSafe();
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!src || reduced) return;
    if (typeof window.requestIdleCallback === "function") {
      const idle = window.requestIdleCallback(() => setReady(true));
      return () => window.cancelIdleCallback(idle);
    }
    const timer = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(timer);
  }, [src, reduced]);

  useEffect(() => {
    const container = containerRef.current;
    if (!ready || !container) return;
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current;
      if (!video) return;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      aria-label={alt}
      role="img"
    >
      {/* Gradient fallback — always underneath */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(140deg, #f3e8d8 0%, #e8a30c22 35%, #e8590c2e 70%, #f7ede0 100%)",
        }}
      />
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="object-cover"
        />
      )}
      {ready && src && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
