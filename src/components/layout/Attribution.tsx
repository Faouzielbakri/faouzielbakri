"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Records the visit's channel on whichever page the visitor lands on. Renders
 * nothing; it exists so the capture happens even when the first page is a case
 * study or a blog post rather than the homepage.
 */
export function Attribution() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
