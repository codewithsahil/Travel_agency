import Link from "next/link"
import { ArrowUpRight, Camera, Hotel, MapPin, Moon, Plane, UtensilsCrossed } from "lucide-react"

import { Photo } from "@/components/photo"
import { StarRating } from "@/components/star-rating"
import type { TravelPackage } from "@/lib/data"
import { formatPrice } from "@/lib/site"
import { cn } from "@/lib/utils"

const detailsHref = (p: TravelPackage) => `/packages?for=${p.audience}#${p.slug}`
const bookHref = (p: TravelPackage) =>
  `/contact?package=${encodeURIComponent(p.title)}&destination=${encodeURIComponent(p.destination)}`

function Price({ p, light }: { p: TravelPackage; light?: boolean }) {
  return (
    <p className="leading-tight">
      <span className={cn("text-xs", light ? "text-white/80" : "text-muted-foreground")}>from</span>{" "}
      {p.oldPrice && (
        <s className={cn("text-sm", light ? "text-white/70" : "text-muted-foreground")}>
          <span className="sr-only">was </span>
          {formatPrice(p.oldPrice)}
        </s>
      )}
      <span className={cn("block font-display text-2xl font-semibold", light ? "text-white" : "text-deep")}>
        {formatPrice(p.price)}
        <span className={cn("font-sans text-sm font-normal", light ? "text-white/80" : "text-muted-foreground")}>
          {" "}
          / person
        </span>
      </span>
    </p>
  )
}

function Nights({ n, className }: { n: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-navy backdrop-blur",
        className
      )}
    >
      <Moon className="size-3.5 text-[#0369a1]" aria-hidden />
      {n} nights / {n + 1} days
    </span>
  )
}

const includeIcons = [
  { key: "hotel", label: "Stay", Icon: Hotel },
  { key: "flights", label: "Travel", Icon: Plane },
  { key: "meals", label: "Meals", Icon: UtensilsCrossed },
  { key: "sightseeing", label: "Sightseeing", Icon: Camera },
] as const

/** Full ticket-style package card used on the Packages page. */
export function PackageCard({ pkg: p, sizes }: { pkg: TravelPackage; sizes: string }) {
  return (
    <div className="h-full [filter:drop-shadow(0_18px_28px_rgba(8,47,73,.14))]">
      <article
        id={p.slug}
        className="ticket-notch-x flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[24px] bg-card [--notch-y:calc(100%_-_92px)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Photo
            id={p.image}
            alt={p.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.05]"
          />
          <Nights n={p.nights} className="absolute bottom-3 left-3" />
          {p.tag && (
            <span className="absolute top-3 left-3 rounded-full bg-sunset px-3 py-1 text-xs font-semibold text-white">
              {p.tag}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 text-ocean" aria-hidden />
            {p.destination}
          </p>
          <h3 className="mt-1 text-2xl font-medium text-deep">{p.title}</h3>
          <p className="mt-2 text-muted-foreground">{p.summary}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {includeIcons.map(({ key, label, Icon }) => (
              <div key={key} className="flex gap-2.5">
                <Icon className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold text-deep">{label}</dt>
                  <dd className="text-[0.8rem] leading-snug text-muted-foreground">{p.includes[key]}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <StarRating value={p.rating} />
            <span className="font-medium text-deep">{p.rating}</span>
            <span className="text-muted-foreground">({p.reviews} reviews)</span>
          </div>
        </div>

        {/* stub */}
        <div className="flex h-[92px] items-center justify-between gap-3 border-t-2 border-dashed border-border px-5 sm:px-6">
          <Price p={p} />
          <Link
            href={bookHref(p)}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-sunset px-5 text-sm font-semibold text-white transition-colors hover:bg-sunset-hover"
            aria-label={`Book ${p.title}`}
          >
            Book now
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </article>
    </div>
  )
}

/** Big photo-led bento tile (home page). */
export function PackageFeature({ pkg: p, sizes }: { pkg: TravelPackage; sizes: string }) {
  return (
    <article className="group relative isolate flex h-full min-h-[460px] flex-col justify-end overflow-hidden rounded-[32px] bg-ink text-white shadow-soft">
      <Photo
        id={p.image}
        alt={p.alt}
        fill
        sizes={sizes}
        quietFallback
        className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5" />
      <div className="absolute top-5 left-5 flex gap-2">
        <Nights n={p.nights} />
        {p.tag && <span className="rounded-full bg-sunset px-3 py-1 text-xs font-semibold">{p.tag}</span>}
      </div>
      <div className="p-6 sm:p-8">
        <p className="flex items-center gap-1.5 text-sm text-white/85">
          <MapPin className="size-4" aria-hidden />
          {p.destination}
        </p>
        <h3 className="mt-1 text-3xl font-medium sm:text-4xl">{p.title}</h3>
        <p className="mt-2 max-w-md text-white/85">{p.summary}</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <StarRating value={p.rating} />
          <span className="font-medium">{p.rating}</span>
          <span className="text-white/75">({p.reviews} reviews)</span>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <Price p={p} light />
          <Link
            href={detailsHref(p)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-navy transition-colors hover:bg-sky-100"
          >
            View Details
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}

/** Compact horizontal card for the home bento. */
export function PackageCompact({ pkg: p, sizes }: { pkg: TravelPackage; sizes: string }) {
  return (
    <article className="group grid h-full overflow-hidden rounded-[28px] border border-border bg-card shadow-soft transition-shadow duration-300 hover:shadow-lift sm:grid-cols-[2fr_3fr]">
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[210px]">
        <Photo
          id={p.image}
          alt={p.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="flex flex-col p-5">
        <p className="text-xs font-semibold text-ocean">
          {p.nights} nights · {p.destination}
        </p>
        <h3 className="mt-1 text-xl font-medium text-deep">{p.title}</h3>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <StarRating value={p.rating} size="size-3.5" />
          <span className="font-medium text-deep">{p.rating}</span>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <Price p={p} />
          <Link
            href={detailsHref(p)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-deep/25 px-4 text-sm font-semibold text-deep transition-colors hover:border-deep hover:bg-deep hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
