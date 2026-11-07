import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export function StarRating({
  value,
  className,
  size = "size-4",
}: {
  value: number
  className?: string
  size?: string
}) {
  const full = Math.round(value)
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(size, i < full ? "fill-sun text-sun" : "fill-transparent text-muted-foreground/40")}
        />
      ))}
    </span>
  )
}
