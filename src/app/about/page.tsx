import type { Metadata } from "next"
import { Award, BadgeCheck, Compass, Headset, Leaf, LifeBuoy, ShieldCheck, Wallet } from "lucide-react"

import { Photo } from "@/components/photo"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { CtaSection } from "@/components/sections/cta-section"
import { Timeline } from "@/components/sections/timeline"
import { Marquee } from "@/components/ui/marquee"
import { partners, team, values } from "@/lib/data"
import { photos } from "@/lib/images"
import { pageMetadata } from "@/lib/seo"

const title = "About us"
const description =
  "Once Again is a team of travelers who plan trips we'd take ourselves. Meet the people, the story since 2011 and the values behind every itinerary."

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/about",
  image: photos.aboutHeader,
  imageAlt: "Travel flat lay with a map, camera and passport",
})

const badges = [
  { icon: ShieldCheck, title: "Secure payments", text: "Encrypted checkout, 20% deposit" },
  { icon: BadgeCheck, title: "Verified reviews", text: "Only from people who travelled" },
  { icon: Award, title: "Best-price promise", text: "Find it cheaper, we match it" },
  { icon: Headset, title: "24/7 trip support", text: "A real person, any hour" },
]

const valueIcons = { wallet: Wallet, compass: Compass, "life-buoy": LifeBuoy, leaf: Leaf } as const

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="We plan the trips we'd take ourselves"
        text="Fifteen years, 10,000 travelers and one rule: if we wouldn't book it for our own family, it isn't on the site."
        image={photos.aboutHeader}
        alt="Travel flat lay with a map, camera and passport"
      />

      {/* story */}
      <section aria-labelledby="story-title" className="bg-background py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal>
            <h2 id="story-title" className="text-display font-medium text-deep">
              It started with a missed ferry
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                In 2011 our founder, Rohan, missed the last ferry to a Greek island with a booking he&rsquo;d made
                through a big website. Nobody picked up the phone. He slept on a bench and promised that
                if he ever ran a travel company, someone would always pick up.
              </p>
              <p>
                Once Again is that promise, grown into a team of planners who&rsquo;ve walked the trails, slept in the
                hotels and know which table has the view. We keep our name for the best reason there is:
                most of our travelers come back.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[32px] shadow-lift">
              <Photo
                id={photos.story}
                alt="Small boat moored on a calm mountain lake"
                fill
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* timeline */}
      <section aria-labelledby="timeline-title" className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading id="timeline-title" align="center" title="Fifteen years, five turning points" />
          </Reveal>
          <div className="mt-14">
            <Timeline />
          </div>
        </div>
      </section>

      {/* team */}
      <section aria-labelledby="team-title" className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              id="team-title"
              title="The people who answer the phone"
              text="A small team that has collectively visited more than 90 countries and still argues about where to go next."
            />
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={i * 0.07}>
                <article className="group h-full overflow-hidden rounded-[28px] border border-border bg-card shadow-soft">
                  <div className="relative aspect-[4/5] overflow-hidden bg-mist">
                    <Photo
                      id={m.image}
                      alt={`Portrait of ${m.name}, ${m.role}`}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      sourceWidth={800}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-medium text-deep">{m.name}</h3>
                    <p className="text-sm font-medium text-ocean">{m.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* values */}
      <section aria-labelledby="values-title" className="bg-mist py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              id="values-title"
              title="What we stand for"
              text="Four promises we hold ourselves to on every trip."
            />
          </Reveal>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {values.map((v, i) => {
              const Icon = valueIcons[v.icon]
              return (
                <Reveal as="li" key={v.title} delay={(i % 2) * 0.08} className="border-t border-border py-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-card text-ocean shadow-soft">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-medium text-deep">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{v.text}</p>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* trust + partners */}
      <section aria-labelledby="trust-title" className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              id="trust-title"
              align="center"
              title="Why you can book with confidence"
            />
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map(({ icon: Icon, title: t, text }, i) => (
              <Reveal as="li" key={t} delay={i * 0.06}>
                <div className="flex h-full items-start gap-4 rounded-[24px] border border-border bg-card p-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-palm">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-deep">{t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-20">
            <p className="text-center text-muted-foreground">Trusted partners behind your trip</p>
            <div className="relative mt-6 [--gap:3rem]">
              <Marquee pauseOnHover className="[--duration:45s]">
                {partners.map((p) => (
                  <span
                    key={p}
                    className="flex h-14 shrink-0 items-center gap-3 font-display text-2xl font-medium whitespace-nowrap text-deep/55"
                  >
                    <span aria-hidden className="size-2 rounded-full bg-sunset-soft" />
                    {p}
                  </span>
                ))}
              </Marquee>
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
              <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title="Let's plan your next one"
        text="Tell us what a perfect trip looks like. We'll handle everything else."
        image={photos.heroLake}
        alt="Alpine lake beneath jagged mountain peaks"
      />
    </>
  )
}
