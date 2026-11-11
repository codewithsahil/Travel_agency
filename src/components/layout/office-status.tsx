"use client"

import { useEffect, useState } from "react"

import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Opening windows in India Standard Time, in minutes after midnight. Keep in step with `siteConfig.hours`. */
const WINDOWS: Record<string, [number, number] | null> = {
  Mon: [9 * 60 + 30, 19 * 60],
  Tue: [9 * 60 + 30, 19 * 60],
  Wed: [9 * 60 + 30, 19 * 60],
  Thu: [9 * 60 + 30, 19 * 60],
  Fri: [9 * 60 + 30, 19 * 60],
  Sat: [10 * 60, 17 * 60],
  Sun: null,
}

function isOpenNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  const window = WINDOWS[get("weekday")]
  if (!window) return false
  const minutes = Number(get("hour")) * 60 + Number(get("minute"))
  return minutes >= window[0] && minutes < window[1]
}

/** Office hours list with a live "Open now / Closed" pill (checked in the browser, so it never goes stale in the cache). */
export function OfficeStatus() {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setOpen(isOpenNow(new Date()))
    check()
    const id = window.setInterval(check, 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div>
      {open !== null && (
        <p
          className={cn(
            "mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
            open ? "bg-palm/20 text-white" : "bg-white/10 text-white/80"
          )}
        >
          <span aria-hidden className={cn("size-2 rounded-full", open ? "bg-palm" : "bg-white/50")} />
          {open ? "We're open now" : "Closed right now"}
        </p>
      )}
      <ul className="space-y-0.5">
        {siteConfig.hours.map((h) => (
          <li key={h.days}>
            <span className="text-white/90">{h.days}:</span> {h.time}
          </li>
        ))}
      </ul>
    </div>
  )
}
