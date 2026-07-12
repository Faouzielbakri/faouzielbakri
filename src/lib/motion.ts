/**
 * Shared motion tokens. Every animated component pulls from here so the
 * whole site moves with one voice.
 */

export const duration = {
  micro: 0.2,
  standard: 0.5,
  cinematic: 0.9,
} as const;

/** easeOutExpo-flavoured entrance curve */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const spring = {
  type: "spring",
  stiffness: 260,
  damping: 30,
} as const;

export const stagger = {
  tight: 0.05,
  standard: 0.08,
} as const;

/** Standard reveal used by whileInView entrances */
export const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.standard, ease: easeOut },
  },
} as const;

/** Parent variant that staggers `reveal` children */
export const revealGroup = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger.standard } },
} as const;

/**
 * `amount` stays low so tall containers (grids, galleries) reveal as soon as
 * they enter rather than waiting for 30% visibility and leaving blank space.
 */
export const viewportOnce = { once: true, amount: 0.12, margin: "0px 0px -8% 0px" } as const;
