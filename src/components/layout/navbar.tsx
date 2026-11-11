"use client"

import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, useSyncExternalStore } from "react"
import { Phone } from "lucide-react"

import { WhatsAppIcon } from "@/components/icons/social"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { navLinks, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true })
  return () => window.removeEventListener("scroll", cb)
}
const getScrolled = () => window.scrollY > 24
const getScrolledServer = () => false

export function Navbar() {
  const pathname = usePathname()
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getScrolledServer)
  const [openFor, setOpenFor] = useState<string | null>(null)
  // The menu is "open" only for the route it was opened on, so navigating closes it.
  const open = openFor === pathname
  const knownRoute = navLinks.some((l) => l.href === pathname)
  const solid = scrolled || open || !knownRoute

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        solid
          ? "border-b border-border/70 bg-background/80 text-deep shadow-[0_8px_30px_-18px_rgba(8,47,73,.35)] backdrop-blur-xl"
          : "bg-transparent text-white"
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Logo light={!solid} />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors",
                    solid ? "hover:text-ocean" : "hover:text-white",
                    active ? "" : solid ? "text-deep/80" : "text-white/85"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className={cn(
                        "absolute inset-x-4 bottom-1.5 h-0.5 rounded-full",
                        solid ? "bg-sunset" : "bg-sunset-soft"
                      )}
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={siteConfig.phoneHref}
            className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium xl:inline-flex"
          >
            <Phone className="size-4" aria-hidden />
            {siteConfig.phone}
          </a>
          <ThemeToggle />
          <ShimmerButton
            href="/contact"
            background="var(--sunset)"
            shimmerColor="#fed7aa"
            className="ml-1 hidden h-11 px-6 text-[0.95rem] font-semibold shadow-[0_10px_24px_-10px_rgba(194,65,12,.9)] sm:flex"
          >
            Book Now
          </ShimmerButton>

          <button
            type="button"
            onClick={() => setOpenFor(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-current/10 lg:hidden"
          >
            <span className="relative block h-3.5 w-6" aria-hidden>
              <motion.span
                className="absolute inset-x-0 top-0 block h-0.5 rounded-full bg-current"
                animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="absolute inset-x-0 top-[6px] block h-0.5 rounded-full bg-current"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="absolute inset-x-0 bottom-0 block h-0.5 rounded-full bg-current"
                animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.25 }}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-b border-border bg-background px-4 pt-4 pb-8 text-deep shadow-lift lg:hidden"
          >
            <ul className="mx-auto flex max-w-xl flex-col">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setOpenFor(null)}
                    className={cn(
                      "flex min-h-14 items-center justify-between border-b border-border/70 font-display text-2xl",
                      pathname === link.href && "text-sunset"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3">
              <ShimmerButton
                href="/contact"
                background="var(--sunset)"
                shimmerColor="#fed7aa"
                className="h-12 w-full text-base font-semibold"
              >
                Book Now
              </ShimmerButton>
              <a
                href={siteConfig.phoneHref}
                className="flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-ocean"
              >
                <Phone className="size-4" aria-hidden />
                Call {siteConfig.phone}
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Hi ${siteConfig.name}, I would like help planning a trip.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-[#0f7a40]"
              >
                <WhatsAppIcon width={16} height={16} />
                Chat on WhatsApp
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
