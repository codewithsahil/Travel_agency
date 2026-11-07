"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import { ImageOff } from "lucide-react"

import { unsplash } from "@/lib/images"
import { cn } from "@/lib/utils"

type PhotoProps = Omit<ImageProps, "src"> & {
  /** Unsplash photo id, e.g. "1537996194471-e657df975ab4" */
  id: string
  /** Source width requested from Unsplash before Next resizes it. */
  sourceWidth?: number
  /** Hide the placeholder icon (for full-bleed backgrounds with text on top). */
  quietFallback?: boolean
}

/**
 * next/image wrapper for Unsplash photos with a graceful fallback, so a blocked or
 * missing image never leaves a hole in the layout.
 */
export function Photo({ id, alt, sourceWidth = 1400, quietFallback, className, ...rest }: PhotoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_85%_10%,rgba(251,146,60,.35),transparent_55%),linear-gradient(160deg,#0369a1,#0c4a6e_60%,#082f49)] text-white/55",
          className
        )}
      >
        {!quietFallback && <ImageOff className="size-8" aria-hidden />}
      </div>
    )
  }

  return (
    <Image
      src={unsplash(id, sourceWidth)}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
