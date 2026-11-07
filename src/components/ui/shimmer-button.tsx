import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

/**
 * Magic UI "Shimmer Button" (installed via the shadcn CLI), extended so it can
 * render a real <a> (Next <Link>) when `href` is passed — navigation should be
 * a link for semantics, middle-click and prefetching.
 */
type CommonProps = {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export type ShimmerButtonProps = CommonProps &
  (
    | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href">)
    | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
  )

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ShimmerButtonProps
>(function ShimmerButton(
  {
    shimmerColor = "#ffffff",
    shimmerSize = "0.05em",
    shimmerDuration = "3s",
    borderRadius = "100px",
    background = "rgba(0, 0, 0, 1)",
    className,
    children,
    ...props
  },
  ref
) {
  const style = {
    "--spread": "90deg",
    "--shimmer-color": shimmerColor,
    "--radius": borderRadius,
    "--speed": shimmerDuration,
    "--cut": shimmerSize,
    "--bg": background,
  } as CSSProperties

  const classes = cn(
    "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 whitespace-nowrap text-white [background:var(--bg)]",
    "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
    className
  )

  const inner = (
    <>
      {/* spark container */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 overflow-visible blur-[2px] @container-[size]"
      >
        {/* spark */}
        <span className="animate-shimmer-slide absolute inset-0 block aspect-[1] h-[100cqh] rounded-none [mask:none]">
          {/* spark before */}
          <span className="animate-spin-around absolute -inset-full block w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </span>
      </span>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>

      {/* Highlight */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 size-full",
          "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
          "transform-gpu transition-all duration-300 ease-in-out",
          "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
          "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
        )}
      />

      {/* backdrop */}
      <span
        aria-hidden
        className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
      />
    </>
  )

  if ("href" in props && props.href !== undefined) {
    return (
      <Link
        {...(props as ComponentPropsWithoutRef<typeof Link>)}
        ref={ref as React.Ref<HTMLAnchorElement>}
        style={style}
        className={classes}
      >
        {inner}
      </Link>
    )
  }

  return (
    <button
      {...(props as ComponentPropsWithoutRef<"button">)}
      ref={ref as React.Ref<HTMLButtonElement>}
      style={style}
      className={classes}
    >
      {inner}
    </button>
  )
})

ShimmerButton.displayName = "ShimmerButton"
