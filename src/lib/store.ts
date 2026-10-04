import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AudienceIntent = "hire" | "project" | null;

type UiState = {
  /** Which audience the visitor identified as via the hero toggle */
  audienceIntent: AudienceIntent;
  setAudienceIntent: (intent: AudienceIntent) => void;

  /** Section currently in view, drives nav scroll-spy */
  activeSection: string;
  setActiveSection: (id: string) => void;

  /** Set by a hero that paints a dark ground, so the nav can switch palette */
  heroTone: "light" | "dark";
  setHeroTone: (tone: "light" | "dark") => void;
};

export const useUiStore = create<UiState>()((set) => ({
  audienceIntent: null,
  setAudienceIntent: (audienceIntent) => set({ audienceIntent }),
  activeSection: "hero",
  setActiveSection: (activeSection) => set({ activeSection }),
  heroTone: "light",
  setHeroTone: (heroTone) => set({ heroTone }),
}));

type MotionPrefs = {
  /** User override on top of prefers-reduced-motion */
  motionOverride: boolean;
  setMotionOverride: (off: boolean) => void;
};

export const useMotionPrefs = create<MotionPrefs>()(
  persist(
    (set) => ({
      motionOverride: false,
      setMotionOverride: (motionOverride) => set({ motionOverride }),
    }),
    { name: "feb-motion-prefs" },
  ),
);
