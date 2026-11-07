import type { Metadata } from "next"

import { CtaSection } from "@/components/sections/cta-section"
import { FeaturedPackages } from "@/components/sections/featured-packages"
import { Hero } from "@/components/sections/hero"
import { OfferBanner } from "@/components/sections/offer-banner"
import { PopularDestinations } from "@/components/sections/popular-destinations"
import { Stats } from "@/components/sections/stats"
import { Testimonials } from "@/components/sections/testimonials"
import { WhyChooseUs } from "@/components/sections/why-choose-us"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — Holiday packages for couples, families & friends` },
  description:
    "Book hand-picked holiday packages to Bali, the Maldives, Santorini, Kerala and 150+ destinations. Honest prices, flexible dates, 24/7 support.",
  alternates: { canonical: "/" },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <PopularDestinations />
      <FeaturedPackages />
      <WhyChooseUs />
      <Testimonials />
      <OfferBanner />
      <CtaSection />
    </>
  )
}
