import type { Metadata } from "next"
import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
import { CtaSection } from "@/components/sections/cta-section"
import { Faq } from "@/components/sections/faq"
import { PackagesExplorer } from "@/components/sections/packages-explorer"
import { PricingTiers } from "@/components/sections/pricing-tiers"
import { photos } from "@/lib/images"
import { pageMetadata } from "@/lib/seo"

const title = "Holiday packages & pricing"
const description =
  "Honeymoon, family and friends holiday packages with flights, hotels, meals and sightseeing included. Compare Budget, Standard and Luxury tiers and read the FAQ."

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/packages",
  image: photos.packagesHeader,
  imageAlt: "Resort pool with palm trees and loungers at golden hour",
})

export default function PackagesPage() {
  return (
    <>
      <PageHeader
        title="Holiday packages, priced honestly"
        crumb="Packages"
        text="Flights, stays, meals and sightseeing are all in the price. See exactly what you get before you book."
        image={photos.packagesHeader}
        alt="Resort pool with palm trees and loungers at golden hour"
      />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24 text-muted-foreground">Loading packages…</div>}>
        <PackagesExplorer />
      </Suspense>
      <PricingTiers />
      <Faq />
      <CtaSection
        title="Not sure which one fits?"
        text="Tell us who's travelling and what you like. We'll recommend a package and price it the same day."
        image={photos.heroBeach}
        alt="Palm tree over a tropical beach and clear water"
      />
    </>
  )
}
