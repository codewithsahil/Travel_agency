"use client"

import { MotionConfig } from "motion/react"

/** Respect prefers-reduced-motion everywhere: transforms/layout animations are skipped for those users. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
