"use client"

import { useSyncExternalStore } from "react"

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 1000)
  return () => window.clearInterval(id)
}
// Whole seconds so the snapshot is stable between reads inside one tick.
const getNow = () => Math.floor(Date.now() / 1000)
const getServerNow = () => 0

const pad = (n: number) => String(n).padStart(2, "0")

export function Countdown({ endsAt }: { endsAt: string }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow)
  const end = Math.floor(new Date(endsAt).getTime() / 1000)
  const ready = now > 0
  const left = Math.max(0, end - now)
  const expired = ready && left === 0

  const units = [
    { label: "Days", value: Math.floor(left / 86400) },
    { label: "Hours", value: Math.floor((left % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((left % 3600) / 60) },
    { label: "Seconds", value: left % 60 },
  ]

  if (expired) {
    return <p className="font-display text-2xl text-white">This offer has ended. New deals are coming soon.</p>
  }

  return (
    <div role="timer" aria-label="Time left on this offer" className="flex gap-2 sm:gap-3">
      {units.map((u) => (
        <div
          key={u.label}
          className="grid min-w-[4.25rem] flex-1 place-items-center rounded-2xl bg-white/15 px-2 py-3 text-white ring-1 ring-white/25 backdrop-blur sm:min-w-[5.5rem] sm:flex-none sm:py-4"
        >
          <span className="font-display text-3xl leading-none tabular-nums sm:text-5xl" aria-hidden={!ready}>
            {ready ? pad(u.value) : "––"}
          </span>
          <span className="mt-1.5 text-xs text-white/85 sm:text-sm">{u.label}</span>
        </div>
      ))}
    </div>
  )
}
