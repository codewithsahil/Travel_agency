import { NumberTicker } from "@/components/ui/number-ticker"
import { Reveal } from "@/components/reveal"

const stats = [
  { value: 10000, suffix: "+", label: "Happy travelers", decimals: 0 },
  { value: 150, suffix: "+", label: "Destinations", decimals: 0 },
  { value: 15, suffix: "", label: "Years of experience", decimals: 0 },
  { value: 4.9, suffix: "/5", label: "Average rating", decimals: 1 },
]

export function Stats() {
  return (
    <section aria-label="Once Again in numbers" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <Reveal>
          <dl className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-border">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse px-2 text-center md:px-8">
                <dt className="mt-3 text-base text-muted-foreground">{s.label}</dt>
                <dd className="font-display text-[2.6rem] leading-none font-medium whitespace-nowrap text-deep tabular-nums sm:text-5xl md:text-6xl">
                  <NumberTicker
                    value={s.value}
                    decimalPlaces={s.decimals}
                    className="font-display tracking-normal text-deep"
                  />
                  <span className="text-sunset">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
