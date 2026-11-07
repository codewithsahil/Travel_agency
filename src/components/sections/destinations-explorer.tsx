"use client"

import { AnimatePresence, motion } from "motion/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Compass, X } from "lucide-react"

import { DestinationCard } from "@/components/destination-cards"
import { destinations, destinationTypes, type DestinationType } from "@/lib/data"
import { cn } from "@/lib/utils"

type Filter = "All" | DestinationType

export function DestinationsExplorer() {
  const router = useRouter()
  const params = useSearchParams()
  const q = (params.get("q") ?? "").trim()
  const [filter, setFilter] = useState<Filter>("All")

  // Carry the trip details from the home search into each "Enquire" link.
  const carried = new URLSearchParams()
  for (const key of ["travelers", "depart", "return"]) {
    const v = params.get(key)
    if (v) carried.set(key, v)
  }
  const extraQuery = carried.toString()

  const counts = useMemo(() => {
    const base = destinations.filter((d) => matches(d.name + " " + d.country, q))
    const map = new Map<Filter, number>([["All", base.length]])
    for (const t of destinationTypes) map.set(t, base.filter((d) => d.types.includes(t)).length)
    return map
  }, [q])

  const list = useMemo(
    () =>
      destinations.filter(
        (d) => (filter === "All" || d.types.includes(filter)) && matches(d.name + " " + d.country, q)
      ),
    [filter, q]
  )

  const filters: Filter[] = ["All", ...destinationTypes]

  return (
    <>
      <div className="sticky top-[72px] z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            role="group"
            aria-label="Filter destinations by type"
            className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {filters.map((f) => {
              const active = filter === f
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "relative inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-5 text-[0.95rem] font-medium transition-colors",
                    active ? "border-transparent text-white" : "border-border bg-card text-deep hover:border-ocean/50 hover:bg-mist"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-deep dark:bg-primary"
                      transition={{ type: "spring", stiffness: 450, damping: 36 }}
                    />
                  )}
                  <span className={cn("relative", active && "dark:text-primary-foreground")}>{f}</span>
                  <span
                    className={cn(
                      "relative rounded-full px-1.5 text-xs tabular-nums",
                      active ? "bg-white/20 dark:bg-black/15 dark:text-primary-foreground" : "bg-secondary text-ocean"
                    )}
                  >
                    {counts.get(f)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <section aria-labelledby="results-title" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2 id="results-title" className="sr-only">
          Destination results
        </h2>
        <div className="mb-8 flex flex-wrap items-center gap-3" aria-live="polite">
          <p className="text-muted-foreground">
            Showing <strong className="font-semibold text-deep">{list.length}</strong>{" "}
            {list.length === 1 ? "destination" : "destinations"}
            {filter !== "All" && (
              <>
                {" "}
                in <strong className="font-semibold text-deep">{filter}</strong>
              </>
            )}
          </p>
          {q && (
            <button
              type="button"
              onClick={() => router.replace("/destinations", { scroll: false })}
              className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-ocean hover:bg-secondary/70"
            >
              Search: &ldquo;{q}&rdquo;
              <X className="size-4" aria-label="Clear search" />
            </button>
          )}
          {params.get("travelers") && (
            <span className="text-sm text-muted-foreground">
              · {params.get("travelers")} traveler{params.get("travelers") === "1" ? "" : "s"}
              {params.get("depart") ? ` · from ${params.get("depart")}` : ""}
            </span>
          )}
        </div>

        {list.length > 0 ? (
          <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((d) => (
                <motion.li
                  key={d.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DestinationCard
                    destination={d}
                    extraQuery={extraQuery}
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="mx-auto max-w-md rounded-[28px] border border-dashed border-border bg-mist px-6 py-14 text-center">
            <Compass className="mx-auto size-10 text-ocean" aria-hidden />
            <h2 className="mt-4 text-2xl text-deep">Nothing matches yet</h2>
            <p className="mt-2 text-muted-foreground">
              We plan trips beyond this list too. Clear the filters or tell us where you want to go.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilter("All")
                  if (q) router.replace("/destinations", { scroll: false })
                }}
                className="min-h-11 cursor-pointer rounded-full border border-deep/30 px-5 text-sm font-semibold text-deep hover:bg-deep hover:text-background"
              >
                Clear filters
              </button>
              <a
                href={`/contact${q ? `?destination=${encodeURIComponent(q)}` : ""}`}
                className="inline-flex min-h-11 items-center rounded-full bg-sunset px-5 text-sm font-semibold text-white hover:bg-sunset-hover"
              >
                Ask for {q ? `"${q}"` : "a custom trip"}
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

function matches(text: string, q: string) {
  return !q || text.toLowerCase().includes(q.toLowerCase())
}
