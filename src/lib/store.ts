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
};

export const useUiStore = create<UiState>()((set) => ({
  audienceIntent: null,
  setAudienceIntent: (audienceIntent) => set({ audienceIntent }),
  activeSection: "hero",
  setActiveSection: (activeSection) => set({ activeSection }),
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
