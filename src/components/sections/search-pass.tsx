"use client"

import { CalendarDays, MapPin, Minus, Plus, Search, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId, useState, type FormEvent } from "react"

import { destinations } from "@/lib/data"

/**
 * Boarding-pass style search. The dashed tear line + notches echo the package tickets.
 * Submits to /destinations with the search in the URL.
 */
export function SearchPass() {
  const router = useRouter()
  const uid = useId()
  const [travelers, setTravelers] = useState(2)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const q = String(f.get("destination") ?? "").trim()
    const depart = String(f.get("depart") ?? "")
    const ret = String(f.get("return") ?? "")
    if (q) params.set("q", q)
    if (depart) params.set("depart", depart)
    if (ret) params.set("return", ret)
    params.set("travelers", String(travelers))
    router.push(`/destinations?${params.toString()}`)
  }

  const label = "mb-1 flex items-center gap-1.5 text-xs font-semibold text-ocean"
  const field =
    "h-9 w-full min-w-0 bg-transparent text-base font-medium text-deep placeholder:text-muted-foreground/80 focus:outline-none"

  return (
    <div className="[filter:drop-shadow(0_24px_40px_rgba(8,47,73,.35))]">
      <form
        onSubmit={onSubmit}
        role="search"
        aria-label="Search trips"
        className="ticket-cut-v grid gap-0 rounded-[28px] bg-card text-deep lg:grid-cols-[1.25fr_1.6fr_1fr_auto]"
      >
        <div className="group relative border-b border-border px-5 py-4 transition-colors focus-within:bg-mist lg:border-r lg:border-b-0 lg:px-6">
          <label htmlFor={`${uid}-dest`} className={label}>
            <MapPin className="size-3.5" aria-hidden /> Where to?
          </label>
          <input
            id={`${uid}-dest`}
            name="destination"
            list={`${uid}-list`}
            autoComplete="off"
            placeholder="Bali, Paris, Ladakh…"
            className={field}
          />
          <datalist id={`${uid}-list`}>
            {destinations.map((d) => (
              <option key={d.slug} value={d.name} />
            ))}
          </datalist>
        </div>

        <div role="group" aria-labelledby={`${uid}-dates`} className="group border-b border-border px-5 py-4 transition-colors focus-within:bg-mist lg:border-r lg:border-b-0 lg:px-6">
          <p id={`${uid}-dates`} className={label}>
            <CalendarDays className="size-3.5" aria-hidden /> Dates
          </p>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`${uid}-depart`}>
              Departure date
            </label>
            <input id={`${uid}-depart`} name="depart" type="date" className={`${field} dark:[color-scheme:dark]`} />
            <span aria-hidden className="text-muted-foreground">
              →
            </span>
            <label className="sr-only" htmlFor={`${uid}-return`}>
              Return date
            </label>
            <input id={`${uid}-return`} name="return" type="date" className={`${field} dark:[color-scheme:dark]`} />
          </div>
        </div>

        <div className="border-b border-border px-5 py-4 transition-colors focus-within:bg-mist lg:border-b-0 lg:px-6">
          <p id={`${uid}-trav`} className={label}>
            <Users className="size-3.5" aria-hidden /> Travelers
          </p>
          <div className="flex h-9 items-center gap-3" role="group" aria-labelledby={`${uid}-trav`}>
            <button
              type="button"
              onClick={() => setTravelers((t) => Math.max(1, t - 1))}
              disabled={travelers <= 1}
              aria-label="Fewer travelers"
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-deep transition-colors hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <output aria-live="polite" className="min-w-[4.5rem] text-center font-medium">
              {travelers} {travelers === 1 ? "person" : "people"}
            </output>
            <button
              type="button"
              onClick={() => setTravelers((t) => Math.min(12, t + 1))}
              disabled={travelers >= 12}
              aria-label="More travelers"
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-deep transition-colors hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* stub */}
        <div className="flex items-center justify-center border-t-2 border-dashed border-border p-4 lg:w-[176px] lg:border-t-0 lg:border-l-2">
          <button
            type="submit"
            className="inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-sunset px-6 text-base font-semibold text-white transition-colors hover:bg-sunset-hover active:translate-y-px"
          >
            <Search className="size-5" aria-hidden />
            Search
          </button>
        </div>
      </form>
    </div>
  )
}
