"use client"

import { motion, useScroll, useSpring } from "motion/react"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { useRef } from "react"

import { timeline } from "@/lib/data"
import { cn } from "@/lib/utils"

/** Vertical timeline whose spine draws itself as you scroll; each milestone eases in. */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      {/* spine */}
      <span aria-hidden className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
      <motion.span
        aria-hidden
        style={{ scaleY: reduce ? 1 : draw, transformOrigin: "top" }}
        className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-sunset md:left-1/2 md:-translate-x-1/2"
      />

      {timeline.map((m, i) => {
        const left = i % 2 === 0
        return (
          <motion.li
            key={m.year}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative pb-12 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0",
              left ? "" : "md:[&>div]:col-start-2"
            )}
          >
            <span
              aria-hidden
              className="absolute top-1.5 left-3 grid size-4 place-items-center rounded-full bg-background ring-2 ring-sunset md:left-1/2 md:-translate-x-1/2"
            >
              <span className="size-1.5 rounded-full bg-sunset" />
            </span>
            <div className={cn(left ? "md:text-right" : "md:text-left")}>
              <p className="font-display text-4xl font-medium text-sunset md:text-5xl">{m.year}</p>
              <h3 className="mt-2 text-xl font-medium text-deep md:text-2xl">{m.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{m.text}</p>
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
