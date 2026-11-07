"use client"

import Image from "next/image"
import { useState } from "react"

import { unsplash } from "@/lib/images"

/** Round portrait that falls back to initials if the photo can't load. */
export function Avatar({ id, name, size = 48 }: { id: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

  if (failed) {
    return (
      <span
        role="img"
        aria-label={name}
        style={{ width: size, height: size }}
        className="grid shrink-0 place-items-center rounded-full bg-secondary font-semibold text-ocean"
      >
        {initials}
      </span>
    )
  }
  return (
    <Image
      src={`${unsplash(id, size * 3)}&crop=faces&facepad=2`}
      alt={`Photo of ${name}`}
      width={size}
      height={size}
      sizes={`${size}px`}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  )
}
