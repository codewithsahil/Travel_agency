import Link from "next/link"
import { Plane } from "lucide-react"

import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={cn("group inline-flex min-h-11 items-center gap-2.5", className)}
    >
      <span className="relative grid size-9 place-items-center rounded-full bg-sunset text-white shadow-[0_6px_16px_-6px_rgba(194,65,12,.8)] transition-transform duration-500 group-hover:rotate-[360deg]">
        <Plane className="size-[18px] -rotate-45" aria-hidden />
      </span>
      <span
        className={cn(
          "font-display text-[1.45rem] leading-none font-semibold tracking-tight transition-colors",
          light ? "text-white" : "text-current"
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  )
}
