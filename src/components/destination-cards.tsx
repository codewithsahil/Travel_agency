import Link from "next/link"
import { ArrowUpRight, CalendarDays } from "lucide-react"

import { Photo } from "@/components/photo"
import { TiltCard } from "@/components/tilt-card"
import type { Destination } from "@/lib/data"
import { formatPrice } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Home page tile: photo-first with the info overlaid, 3D tilt + hover zoom. */
export function DestinationTile({
  destination: d,
  className,
  sizes,
  priority,
}: {
  destination: Destination
  className?: string
  sizes: string
  priority?: boolean
}) {
  return (
    <TiltCard className={cn("h-full", className)}>
      <Link
        href={`/destinations?q=${encodeURIComponent(d.name)}`}
        className="group relative block h-full min-h-[300px] overflow-hidden rounded-[28px] bg-ink shadow-soft"
      >
        <Photo
          id={d.image}
          alt={d.alt}
          fill
          sizes={sizes}
          priority={priority}
          quietFallback
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent transition-opacity"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white sm:p-6">
          <div>
            <h3 className="text-2xl font-medium sm:text-3xl">{d.name}</h3>
            <p className="mt-0.5 text-sm text-white/85">{d.country}</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/95 px-3.5 py-2 text-right text-navy backdrop-blur">
            <span className="block text-xs text-slate-600">from</span>
            <span className="font-display text-lg leading-none font-semibold">{formatPrice(d.from)}</span>
          </div>
        </div>
        <span
          aria-hidden
          className="absolute top-4 right-4 grid size-10 translate-y-1 place-items-center rounded-full bg-white/90 text-navy opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </Link>
    </TiltCard>
  )
}

/** Destinations page card: photo on top, details below (blurb, best time, starting price). */
export function DestinationCard({
  destination: d,
  sizes,
  extraQuery = "",
}: {
  destination: Destination
  sizes: string
  extraQuery?: string
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Photo
          id={d.image}
          alt={d.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <ul className="absolute top-3 left-3 flex max-w-[85%] flex-wrap gap-1.5" aria-label="Trip types">
          {d.types.map((t) => (
            <li key={t} className="rounded-full bg-white/92 px-2.5 py-1 text-xs font-semibold text-navy backdrop-blur">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-2xl font-medium text-deep">{d.name}</h3>
          <span className="text-sm text-muted-foreground">{d.country}</span>
        </div>
        <p className="mt-2 leading-relaxed text-muted-foreground">{d.blurb}</p>
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-deep">
          <CalendarDays className="size-4 text-ocean" aria-hidden />
          Best time: {d.bestTime}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
          <p>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <span className="block font-display text-2xl leading-tight font-semibold text-deep">
              {formatPrice(d.from)}
              <span className="font-sans text-sm font-normal text-muted-foreground"> / person</span>
            </span>
          </p>
          <Link
            href={`/contact?destination=${encodeURIComponent(d.name)}${extraQuery ? `&${extraQuery}` : ""}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-sunset px-5 text-sm font-semibold text-white transition-colors hover:bg-sunset-hover"
          >
            Enquire
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
