import Link from "next/link"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "@/components/icons/social"
import { Logo } from "@/components/layout/logo"
import { NewsletterForm } from "@/components/layout/newsletter-form"
import { destinations } from "@/lib/data"
import { navLinks, siteConfig } from "@/lib/site"

const socialIcons = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  "X (Twitter)": XIcon,
  YouTube: YoutubeIcon,
} as const

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo light />
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/75">
              {siteConfig.description}
            </p>
            <NewsletterForm className="mt-8 max-w-md" />
          </div>

          <nav aria-label="Quick links" className="lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-white">Quick links</h2>
            <ul className="mt-4 space-y-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-9 items-center text-white/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Popular destinations" className="lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-white">Popular trips</h2>
            <ul className="mt-4 space-y-1">
              {destinations.slice(0, 6).map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/destinations?q=${encodeURIComponent(d.name)}`}
                    className="inline-flex min-h-9 items-center text-white/75 transition-colors hover:text-white"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-display text-lg font-semibold text-white">Talk to us</h2>
            <ul className="mt-4 space-y-3 text-white/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-lagoon" aria-hidden />
                <address className="not-italic">
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                </address>
              </li>
              <li>
                <a href={siteConfig.phoneHref} className="flex min-h-9 items-center gap-3 hover:text-white">
                  <Phone className="size-5 shrink-0 text-lagoon" aria-hidden />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex min-h-9 items-center gap-3 break-all hover:text-white">
                  <Mail className="size-5 shrink-0 text-lagoon" aria-hidden />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-lagoon" aria-hidden />
                <span>Mon – Sat, 9:30 am – 7 pm</span>
              </li>
            </ul>
            <ul className="mt-6 flex gap-2">
              {siteConfig.social.map((s) => {
                const Icon = socialIcons[s.label as keyof typeof socialIcons]
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in a new tab)`}
                      className="grid size-11 place-items-center rounded-full border border-white/20 text-white/85 transition-colors hover:border-white hover:bg-white hover:text-ink"
                    >
                      <Icon />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Made for people who like their holidays to feel like holidays.</p>
        </div>
      </div>
    </footer>
  )
}
