import type { Metadata } from "next"
import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
import { CtaSection } from "@/components/sections/cta-section"
import { DestinationsExplorer } from "@/components/sections/destinations-explorer"
import { photos } from "@/lib/images"
import { pageMetadata } from "@/lib/seo"

const title = "Destinations"
const description =
  "Browse 150+ destinations: beaches in Bali and Goa, Himalayan peaks, city breaks in Paris and Tokyo. Filter by trip type and see best times and starting prices."

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/destinations",
  image: photos.destinationsHeader,
  imageAlt: "Green mountain valley at sunrise with mist in the distance",
})

export default function DestinationsPage() {
  return (
    <>
      <PageHeader
        title="Find the place you'll want to go back to"
        crumb="Destinations"
        text="Beaches, mountains, cities and a little adventure. Filter by the kind of trip you're after."
        image={photos.destinationsHeader}
        alt="Green mountain valley at sunrise with mist in the distance"
      />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24 text-muted-foreground">Loading destinations…</div>}>
        <DestinationsExplorer />
      </Suspense>
      <CtaSection
        title="Don't see your place?"
        text="We plan trips well beyond this list. Tell us where you're dreaming of and we'll build it."
        image={photos.roadTrip}
        alt="A winding road through mountains at golden hour"
      />
    </>
  )
}
