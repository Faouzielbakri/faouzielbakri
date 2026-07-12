"use client";

import { motion } from "motion/react";
import { reveal, revealGroup, viewportOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/hooks";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger direct children instead of revealing as one block */
  group?: boolean;
  as?: "div" | "section" | "ul";
};

/** whileInView entrance shared across sections; static under reduced motion. */
export function Reveal({ children, className, group, as = "div" }: RevealProps) {
  const reduced = useReducedMotionSafe();
  const Tag = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={group ? revealGroup : reveal}
    >
      {children}
    </Tag>
  );
}

/** Child item for a `group` Reveal. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={reveal}>
      {children}
    </motion.div>
  );
}
