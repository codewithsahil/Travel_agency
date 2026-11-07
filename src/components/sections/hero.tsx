"use client"

import { motion } from "motion/react"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { Pause, Play } from "lucide-react"
import { useEffect, useState } from "react"

import { Photo } from "@/components/photo"
import { SearchPass } from "@/components/sections/search-pass"
import BlurText from "@/components/ui/blur-text"
import { WordReveal } from "@/components/word-reveal"
import { photos } from "@/lib/images"
import { cn } from "@/lib/utils"

const slides = [
  { id: photos.heroBali, place: "Bali, Indonesia", alt: "Stone temple gate framing a green volcano in Bali" },
  { id: photos.heroSantorini, place: "Santorini, Greece", alt: "White houses and blue domes above the sea in Santorini" },
  { id: photos.heroLake, place: "Swiss Alps, Switzerland", alt: "Alpine lake beneath jagged mountain peaks" },
  { id: photos.heroBeach, place: "Maldives", alt: "Palm tree leaning over a tropical beach and turquoise water" },
]

const SLIDE_MS = 6500

export function Hero() {
  const reduce = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const playing = !paused && !reduce

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [playing])

  return (
    <section aria-label="Welcome" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink text-white">
      {/* slideshow */}
      <div className="absolute inset-0 -z-20" aria-roledescription="carousel" aria-label="Featured destinations">
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.place}`}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-in-out",
              i === index ? "opacity-100" : "opacity-0"
            )}
          >
            <Photo
              quietFallback
              id={s.id}
              alt={i === index ? s.alt : ""}
              fill
              priority={i === 0}
              sizes="100vw"
              sourceWidth={2000}
              className={cn(
                "object-cover",
                !reduce && "transition-transform duration-[9000ms] ease-out",
                i === index && !reduce ? "scale-[1.08]" : "scale-100"
              )}
            />
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/55" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pt-36 pb-10 sm:px-6 lg:px-8 lg:pb-14">
        <div className="max-w-4xl">
          <WordReveal
            text="Go somewhere you'll want to go again."
            className="text-hero font-medium text-white"
            delay={0.25}
          />
          <BlurText
            text="Hand-picked stays, honest prices and a real person on call. Plan your next holiday in minutes."
            delay={45}
            trigger="load"
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 lg:mt-14"
        >
          <SearchPass />
        </motion.div>

        {/* postcard caption + slide controls */}
        <div className="mt-6 flex items-center justify-between gap-4 pr-16 text-sm sm:pr-20 lg:pr-0">
          <p className="text-white/85" aria-live={playing ? "off" : "polite"}>
            <span className="text-white/65">Pictured: </span>
            {slides[index].place}
          </p>
          <div className="flex items-center gap-1">
            <div className="mr-1 flex items-center">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.place}`}
                  aria-current={i === index}
                  className="grid size-8 cursor-pointer place-items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      i === index ? "w-7 bg-white" : "w-2.5 bg-white/50"
                    )}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused || reduce ? "Play slideshow" : "Pause slideshow"}
              className="grid size-11 cursor-pointer place-items-center rounded-full bg-white/15 backdrop-blur transition-colors hover:bg-white/30"
            >
              {paused || reduce ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* passport stamp */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-28 right-8 hidden size-36 text-white/90 xl:block"
      >
        <svg viewBox="0 0 200 200" className="size-full animate-spin-slow">
          <defs>
            <path id="stamp-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
          </defs>
          <text fontSize="15" fontWeight="600" letterSpacing="3.2" fill="currentColor">
            <textPath href="#stamp-circle">10,000+ TRAVELERS • SINCE 2011 • 4.9 RATED •</textPath>
          </text>
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-3xl">★</span>
      </div>
    </section>
  )
}
