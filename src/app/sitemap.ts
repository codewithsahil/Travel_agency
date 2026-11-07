import type { MetadataRoute } from "next"

import { navLinks, siteConfig } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((l) => ({
    url: `${siteConfig.url}${l.href === "/" ? "" : l.href}`,
    changeFrequency: "weekly",
    priority: l.href === "/" ? 1 : 0.8,
  }))
}
