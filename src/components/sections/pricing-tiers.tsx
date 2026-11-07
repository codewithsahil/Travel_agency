import { Check, Minus } from "lucide-react"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { tiers } from "@/lib/data"
import { formatPrice } from "@/lib/site"
import { cn } from "@/lib/utils"

export function PricingTiers() {
  return (
    <section aria-labelledby="tiers-title" className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="tiers-title"
            align="center"
            title="Three ways to travel, one honest price"
            text="Same expert planning at every level. Choose how much comfort and flexibility you want. Prices are per person, based on a 5-night trip."
          />
        </Reveal>

        <ul className="mt-14 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-0">
          {tiers.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 0.08} className={cn(t.highlight && "relative z-10 lg:-my-6")}>
              <div
                className={cn(
                  "flex h-full flex-col p-7 sm:p-9",
                  t.highlight
                    ? "rounded-[32px] bg-ink text-white shadow-lift ring-2 ring-sunset-soft/70"
                    : "rounded-[28px] border border-border bg-card text-deep shadow-soft lg:rounded-none lg:shadow-none",
                  !t.highlight && i === 0 && "lg:rounded-l-[28px]",
                  !t.highlight && i === 2 && "lg:rounded-r-[28px]"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className={cn("text-2xl font-medium", t.highlight ? "text-white" : "text-deep")}>
                    {t.name}
                    <span className={cn("ml-2 font-sans text-sm font-normal", t.highlight ? "text-white/75" : "text-muted-foreground")}>
                      {t.label}
                    </span>
                  </h3>
                  {t.highlight && (
                    <span className="rounded-full bg-sunset px-3 py-1 text-xs font-semibold text-white">Most booked</span>
                  )}
                </div>
                <p className={cn("mt-3", t.highlight ? "text-white/80" : "text-muted-foreground")}>{t.blurb}</p>

                <p className="mt-6">
                  <span className={cn("text-sm", t.highlight ? "text-white/75" : "text-muted-foreground")}>from</span>
                  <span className="block font-display text-5xl leading-tight font-medium">
                    {formatPrice(t.price)}
                  </span>
                  <span className={cn("text-sm", t.highlight ? "text-white/75" : "text-muted-foreground")}>per person</span>
                </p>

                <ul className="mt-7 flex-1 space-y-3.5">
                  {t.features.map((f) => (
                    <li key={f.text} className="flex gap-3 text-[0.97rem]">
                      {f.included ? (
                        <Check
                          className={cn("mt-0.5 size-5 shrink-0", t.highlight ? "text-sunset-soft" : "text-palm")}
                          aria-label="Included:"
                        />
                      ) : (
                        <Minus className="mt-0.5 size-5 shrink-0 text-muted-foreground/60" aria-label="Not included:" />
                      )}
                      <span className={cn(!f.included && "text-muted-foreground line-through decoration-1")}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/contact?tier=${t.label}`}
                  className={cn(
                    "mt-8 inline-flex h-13 items-center justify-center rounded-full px-6 text-base font-semibold transition-colors",
                    t.highlight
                      ? "bg-sunset text-white hover:bg-sunset-hover"
                      : "border border-deep/30 text-deep hover:bg-deep hover:text-background"
                  )}
                >
                  Book {t.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
