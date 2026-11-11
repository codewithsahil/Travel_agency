"use client"

import { useEffect, useRef } from "react"

/** Thin reading-progress bar pinned to the top of the viewport. Decorative, so hidden from assistive tech. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const el = bar.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      el.style.transform = `scaleX(${ratio})`
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed print:hidden inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-sunset will-change-transform" />
    </div>
  )
}
