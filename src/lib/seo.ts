import type { Metadata } from "next"

import { unsplash } from "@/lib/images"
import { siteConfig } from "@/lib/site"

/** Builds consistent title / description / canonical / Open Graph / Twitter metadata for a page. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
}: {
  title: string
  description: string
  path: string
  image: string
  imageAlt: string
}): Metadata {
  const ogImage = { url: `${unsplash(image, 1200)}&h=630`, width: 1200, height: 630, alt: imageAlt }
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_IN",
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage.url],
    },
  }
}
