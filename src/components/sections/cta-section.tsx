import { MessageCircle, Phone } from "lucide-react"
import Link from "next/link"

import { Photo } from "@/components/photo"
import { Reveal } from "@/components/reveal"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { photos } from "@/lib/images"
import { siteConfig } from "@/lib/site"

export function CtaSection({
  title = "Plan your dream trip",
  image = photos.cta,
  alt = "Snow-capped mountains glowing at sunset",
  text = "Tell us where, when and who with. A trip planner will send a tailored itinerary and price within 2 hours. No obligation.",
}: {
  title?: string
  text?: string
  image?: string
  alt?: string
}) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-ink py-24 text-white md:py-36">
      <Photo
        quietFallback
        id={image}
        alt={alt}
        fill
        sizes="100vw"
        sourceWidth={1800}
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/60" />
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 id="cta-title" className="text-hero font-medium text-white [text-shadow:0_2px_24px_rgba(8,47,73,.5)]">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/90 md:text-xl">{text}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ShimmerButton
            href="/contact"
            background="var(--sunset)"
            shimmerColor="#fed7aa"
            className="h-14 px-9 text-lg font-semibold"
          >
            Plan my trip
          </ShimmerButton>
          <Link
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 rounded-full border border-white/60 px-7 text-base font-semibold text-white transition-colors hover:bg-white hover:text-navy"
          >
            <MessageCircle className="size-5" aria-hidden />
            Chat on WhatsApp
          </Link>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-white/85">
          <Phone className="size-4" aria-hidden />
          Or call{" "}
          <a href={siteConfig.phoneHref} className="font-semibold underline underline-offset-4">
            {siteConfig.phone}
          </a>
        </p>
      </Reveal>
    </section>
  )
}
