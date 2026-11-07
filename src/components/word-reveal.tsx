"use client"

import { motion } from "motion/react"
import { Fragment } from "react"

import { cn } from "@/lib/utils"

type Props = {
  text: string
  as?: "h1" | "h2"
  id?: string
  className?: string
  delay?: number
  stagger?: number
}

/**
 * Headline that rises in word by word (the one orchestrated page-load moment).
 * Real text stays in the DOM, so screen readers read a normal heading.
 */
export function WordReveal({ text, as = "h1", id, className, delay = 0.15, stagger = 0.07 }: Props) {
  const Tag = as === "h1" ? motion.h1 : motion.h2
  const words = text.split(" ")
  return (
    <Tag id={id} className={className} initial="hidden" animate="show" transition={{ staggerChildren: stagger, delayChildren: delay }}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span
              className={cn("inline-block will-change-transform")}
              variants={{
                hidden: { y: "105%", opacity: 0, filter: "blur(6px)" },
                show: { y: "0%", opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  )
}
