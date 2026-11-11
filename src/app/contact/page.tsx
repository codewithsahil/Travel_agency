import type { Metadata } from "next"
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { EnquiryForm } from "@/components/sections/enquiry-form"
import { photos } from "@/lib/images"
import { pageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

const title = "Contact & booking enquiry"
const description =
  "Tell us where you want to go. Send a booking enquiry, call, WhatsApp or visit our Delhi office. A trip planner replies within 2 hours."

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/contact",
  image: photos.contactHeader,
  imageAlt: "Aeroplane wing above the clouds at sunrise",
})

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapQuery)}&z=15&output=embed`
  const waHref = `https://wa.me/${siteConfig.whatsapp}`

  return (
    <>
      <PageHeader
        title="Tell us where you want to go"
        crumb="Contact"
        text="Send an enquiry and a trip planner will reply within 2 hours with ideas and a price. No pressure, no obligation."
        image={photos.contactHeader}
        alt="Aeroplane wing above the clouds at sunrise"
      />

      <section aria-label="Enquiry form and contact details" className="bg-mist py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-7">
            <Suspense fallback={<div className="min-h-[600px] rounded-[32px] bg-card" />}>
              <EnquiryForm />
            </Suspense>
          </Reveal>

          <Reveal className="space-y-6 lg:col-span-5" delay={0.1}>
            <div className="rounded-[28px] border border-border bg-card p-6 shadow-soft sm:p-8">
              <h2 className="text-2xl font-medium text-deep">Reach us directly</h2>
              <ul className="mt-5 space-y-1">
                <li>
                  <a href={siteConfig.phoneHref} className="flex min-h-14 items-center gap-4 rounded-xl p-2 hover:bg-mist">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-ocean">
                      <Phone className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm text-muted-foreground">Call us</span>
                      <span className="font-semibold text-deep">{siteConfig.phone}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center gap-4 rounded-xl p-2 hover:bg-mist">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-palm">
                      <MessageCircle className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm text-muted-foreground">WhatsApp (opens in a new tab)</span>
                      <span className="font-semibold text-deep">Chat with a planner</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="flex min-h-14 items-center gap-4 rounded-xl p-2 hover:bg-mist">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-ocean">
                      <Mail className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-muted-foreground">Email</span>
                      <span className="font-semibold break-all text-deep">{siteConfig.email}</span>
                    </span>
                  </a>
                </li>
                <li className="flex min-h-14 items-start gap-4 p-2">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-ocean">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <address className="not-italic">
                    <span className="block text-sm text-muted-foreground">Visit our office</span>
                    <span className="font-semibold text-deep">
                      {siteConfig.address.line1}
                      <br />
                      {siteConfig.address.line2}
                    </span>
                  </address>
                </li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 shadow-soft sm:p-8">
              <h2 className="flex items-center gap-2 text-2xl font-medium text-deep">
                <Clock className="size-6 text-ocean" aria-hidden />
                Office hours
              </h2>
              <dl className="mt-4 divide-y divide-border">
                {siteConfig.hours.map((h) => (
                  <div key={h.days} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3">
                    <dt className="font-medium text-deep">{h.days}</dt>
                    <dd className="text-muted-foreground">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-xl bg-sand px-4 py-3 text-sm text-deep">
                Travelling right now? The 24/7 helpline number is on your itinerary.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="map-title" className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="map-title" className="text-display font-medium text-deep">
            Find us
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            {siteConfig.address.line1}, {siteConfig.address.line2}.
          </p>
          <div className="mt-8 overflow-hidden rounded-[32px] border border-border shadow-soft">
            <iframe
              title={`Map showing the ${siteConfig.name} office`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-[380px] w-full border-0 md:h-[480px]"
            />
          </div>
        </div>
      </section>
    </>
  )
}
