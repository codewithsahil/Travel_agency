/**
 * Single source of truth for brand + contact details. Change here, it updates everywhere.
 * Home market is assumed to be India (used for the Domestic / International filter and ₹ prices).
 * All phone numbers / addresses below are placeholders.
 */
export const siteConfig = {
  name: "Once Again",
  tagline: "Trips you'll want to take once again",
  description:
    "Once Again plans holiday packages for couples, families and friends — hand-picked stays, honest prices and a real person on call 24/7.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://onceagain.example",
  currency: "₹",
  locale: "en-IN",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsapp: "919876543210",
  email: "hello@onceagain.example",
  address: {
    line1: "14 Harbour Walk, Connaught Place",
    line2: "New Delhi 110001, India",
  },
  hours: [
    { days: "Monday – Friday", time: "9:30 am – 7:00 pm" },
    { days: "Saturday", time: "10:00 am – 5:00 pm" },
    { days: "Sunday", time: "Closed (WhatsApp replies in 2 hours)" },
  ],
  mapQuery: "Connaught Place, New Delhi",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "X (Twitter)", href: "https://x.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
} as const

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function formatPrice(value: number) {
  return `${siteConfig.currency}${new Intl.NumberFormat(siteConfig.locale).format(value)}`
}

/** Limited-time offer shown on the home page. Update the date + copy when you run a new campaign. */
export const offer = {
  title: "Year-end sale: 20% off Maldives & Bali",
  text: "Book any Maldives or Bali package for travel before 30 June and save up to ₹25,000 per couple.",
  code: "ONCE20",
  endsAt: "2026-12-31T23:59:59+05:30",
} as const
