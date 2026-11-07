import { Tag } from "lucide-react"

import { Photo } from "@/components/photo"
import { Reveal } from "@/components/reveal"
import { Countdown } from "@/components/sections/countdown"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { photos } from "@/lib/images"
import { offer } from "@/lib/site"

export function OfferBanner() {
  return (
    <section aria-labelledby="offer-title" className="bg-background py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[36px] bg-ink px-6 py-12 text-white sm:px-12 md:py-16">
            <Photo
        quietFallback
              id={photos.offer}
              alt="Overwater villas above a turquoise lagoon"
              fill
              sizes="(min-width:1280px) 1216px, 100vw"
              className="-z-20 object-cover"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/20" />

            <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-sunset px-4 py-1.5 text-sm font-semibold">
                  <Tag className="size-4" aria-hidden />
                  Limited-time deal
                </p>
                <h2 id="offer-title" className="mt-5 text-display font-medium text-white">
                  {offer.title}
                </h2>
                <p className="mt-4 max-w-lg text-lg text-white/85">{offer.text}</p>
                <p className="mt-4 text-white/85">
                  Use code{" "}
                  <span className="rounded-md border border-dashed border-white/60 px-2 py-0.5 font-mono font-semibold tracking-wider text-white">
                    {offer.code}
                  </span>{" "}
                  when you enquire.
                </p>
              </div>
              <div className="flex flex-col gap-6 lg:items-end">
                <Countdown endsAt={offer.endsAt} />
                <ShimmerButton
                  href={`/contact?offer=${offer.code}`}
                  background="var(--sunset)"
                  shimmerColor="#fed7aa"
                  className="h-14 px-8 text-base font-semibold"
                >
                  Claim this deal
                </ShimmerButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
