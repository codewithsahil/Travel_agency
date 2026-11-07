import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { StarRating } from "@/components/star-rating"
import { Marquee } from "@/components/ui/marquee"
import { Avatar } from "@/components/avatar"
import { testimonials, type Testimonial } from "@/lib/data"

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[320px] shrink-0 flex-col justify-between gap-5 rounded-[24px] border border-border bg-card p-6 shadow-soft sm:w-[380px]">
      <div>
        <StarRating value={t.rating} />
        <blockquote className="mt-4 text-[1.05rem] leading-relaxed text-deep">{t.quote}</blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        <Avatar id={t.avatar} name={t.name} size={48} />
        <div>
          <p className="font-semibold text-deep">{t.name}</p>
          <p className="text-sm text-muted-foreground">{t.trip}</p>
        </div>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const first = testimonials.slice(0, 4)
  const second = testimonials.slice(4)
  return (
    <section aria-labelledby="reviews-title" className="overflow-hidden bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="reviews-title"
            align="center"
            title="Kind words from people who've just got back"
            text="Real trips, real reviews. Hover to pause."
          />
        </Reveal>
      </div>

      <div className="relative mt-12 space-y-5 [--gap:1.25rem]" role="region" aria-label="Traveler reviews">
        <Marquee pauseOnHover className="[--duration:55s]">
          {first.map((t) => (
            <ReviewCard key={t.name} t={t} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:60s]">
          {second.map((t) => (
            <ReviewCard key={t.name} t={t} />
          ))}
        </Marquee>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-mist to-transparent sm:w-32" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-mist to-transparent sm:w-32" />
      </div>
    </section>
  )
}
