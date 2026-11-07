"use client"

import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { useRef, type ReactNode, type PointerEvent } from "react"

import { cn } from "@/lib/utils"

type TiltCardProps = {
  children: ReactNode
  className?: string
  /** Max tilt in degrees */
  max?: number
}

/**
 * 3D tilt on hover (pattern from Aceternity UI's "3D Card Effect", rebuilt on Motion springs).
 * Mouse only; touch and reduced-motion users get a static card.
 */
export function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 22, mass: 0.4 })
  const sy = useSpring(py, { stiffness: 180, damping: 22, mass: 0.4 })
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"])
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"])
  const glare = useTransform([glareX, glareY], ([x, y]) =>
    `radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 55%)`
  )

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  function onLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={cn("group/tilt relative will-change-transform [transform-style:preserve-3d]", className)}
    >
      {children}
      {!reduce && (
        <motion.span
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        />
      )}
    </motion.div>
  )
}
