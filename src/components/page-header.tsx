import { ChevronRight } from "lucide-react"
import Link from "next/link"

import { Photo } from "@/components/photo"
import { WordReveal } from "@/components/word-reveal"

type Props = {
  title: string
  /** Short label for the breadcrumb; defaults to the title. */
  crumb?: string
  text: string
  image: string
  alt: string
}

/** Photo banner used at the top of every inner page (keeps the transparent navbar legible). */
export function PageHeader({ title, crumb, text, image, alt }: Props) {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden bg-ink text-white">
      <Photo quietFallback id={image} alt={alt} fill priority sizes="100vw" sourceWidth={1800} className="-z-20 object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/55"
      />
      <div className="mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 pt-32 pb-14 sm:px-6 md:min-h-[480px] lg:px-8 lg:pb-20">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-sm text-white/80">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-white hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="font-medium text-white">
              {crumb ?? title}
            </li>
          </ol>
        </nav>
        <WordReveal
          text={title}
          id="page-title"
          className="max-w-4xl text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.04] font-medium text-white"
        />
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">{text}</p>
      </div>
    </section>
  )
}
