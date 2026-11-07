import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { DestinationTile } from "@/components/destination-cards"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { destinations } from "@/lib/data"

const pick = ["bali", "santorini", "maldives", "kerala", "switzerland"]
const featured = pick.map((slug) => destinations.find((d) => d.slug === slug)!)

// Asymmetric grid: one tall tile + four smaller ones (12-column on desktop).
const layout = [
  "sm:col-span-2 lg:col-span-5 lg:row-span-2",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-4",
]
const sizes = [
  "(min-width:1024px) 40vw, 100vw",
  "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  "(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw",
  "(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw",
  "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
]

export function PopularDestinations() {
  return (
    <section aria-labelledby="popular-title" className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="popular-title"
            title="Where our travelers keep going back"
            text="Five places with the highest repeat-booking rate. Prices are per person, flights included."
            action={
              <Link
                href="/destinations"
                className="group inline-flex min-h-11 items-center gap-2 font-semibold text-ocean"
              >
                See all destinations
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-12 grid auto-rows-[320px] gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[300px]">
          {featured.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 0.08} className={`h-full ${layout[i]}`}>
              <DestinationTile destination={d} sizes={sizes[i]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
