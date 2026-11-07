import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { PackageCompact, PackageFeature } from "@/components/package-cards"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { packages } from "@/lib/data"

const bySlug = (s: string) => packages.find((p) => p.slug === s)!

export function FeaturedPackages() {
  const hero = bySlug("bali-honeymoon")
  const side = [bySlug("ladakh-road-trip"), bySlug("kerala-backwaters")]
  const bottom = [bySlug("dubai-family"), bySlug("phuket-island-hopper")]

  return (
    <section aria-labelledby="featured-title" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="featured-title"
            title="Packages travelers book again and again"
            text="Flights, stays, meals and sightseeing are all in the price. Swap anything you like."
            action={
              <Link href="/packages" className="group inline-flex min-h-11 items-center gap-2 font-semibold text-ocean">
                Browse all packages
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <PackageFeature pkg={hero} sizes="(min-width:1024px) 58vw, 100vw" />
          </Reveal>
          {side.map((p, i) => (
            <Reveal key={p.slug} delay={0.08 * (i + 1)} className="lg:col-span-5">
              <PackageCompact pkg={p} sizes="(min-width:1024px) 20vw, (min-width:640px) 35vw, 100vw" />
            </Reveal>
          ))}
          {bottom.map((p, i) => (
            <Reveal key={p.slug} delay={0.08 * i} className="lg:col-span-6">
              <PackageCompact pkg={p} sizes="(min-width:1024px) 20vw, (min-width:640px) 35vw, 100vw" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
