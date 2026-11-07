import { BadgeCheck, CalendarClock, Compass, Headset, ShieldCheck, Wallet } from "lucide-react"

import { Photo } from "@/components/photo"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { StarRating } from "@/components/star-rating"
import { photos } from "@/lib/images"

const features = [
  {
    icon: BadgeCheck,
    title: "Stays we've slept in",
    text: "Every hotel is visited by our team before it's listed. If we wouldn't book it for family, it's not on the site.",
  },
  {
    icon: Wallet,
    title: "One honest price",
    text: "Flights, stays, transfers and meals are itemised. No resort fees or add-ons appear after you pay.",
  },
  {
    icon: Headset,
    title: "A human on call, 24/7",
    text: "Missed connection at 2 am? Call or WhatsApp us. A trip manager picks up and sorts it out.",
  },
  {
    icon: CalendarClock,
    title: "Plans that can change",
    text: "Free date changes on Standard and Signature trips, because life doesn't always follow the itinerary.",
  },
  {
    icon: Compass,
    title: "Local guides, not scripts",
    text: "Small groups led by people who live there, so you eat where they eat and see what tourists skip.",
  },
  {
    icon: ShieldCheck,
    title: "Safe, encrypted payments",
    text: "Pay a 20% deposit to confirm and the rest later. We never store your card details.",
  },
]

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-title" className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionHeading
            id="why-title"
            title="Why people book with us twice"
            text="Most of our travelers come back. Here's what we think brings them back."
          />
          <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[32px] bg-mist shadow-soft">
            <Photo
              id={photos.roadTrip}
              alt="A road winding through mountains toward a golden sunset"
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/95 p-4 text-navy shadow-lift backdrop-blur sm:right-auto sm:max-w-[270px]">
              <StarRating value={5} />
              <p className="mt-2 font-display text-xl leading-snug">&ldquo;The most relaxed trip we have taken.&rdquo;</p>
              <p className="mt-1 text-sm text-slate-600">4.9 average from 3,200+ reviews</p>
            </div>
          </div>
        </Reveal>

        <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:col-span-7 lg:content-start">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 2) * 0.08} className="border-t border-border py-7">
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-ocean">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-medium text-deep">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
