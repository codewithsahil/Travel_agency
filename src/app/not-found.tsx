import { Compass } from "lucide-react"
import Link from "next/link"

import { destinations } from "@/lib/data"

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
      <Compass className="size-14 text-ocean" aria-hidden />
      <h1 className="mt-6 text-5xl font-medium text-deep">This page took a wrong turn</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        We couldn&rsquo;t find what you were looking for. Let&rsquo;s get you back on the route.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex h-12 items-center rounded-full bg-sunset px-7 font-semibold text-white hover:bg-sunset-hover">
          Back to home
        </Link>
        <Link href="/destinations" className="inline-flex h-12 items-center rounded-full border border-deep/30 px-7 font-semibold text-deep hover:bg-deep hover:text-background">
          Browse destinations
        </Link>
      </div>

      <div className="mt-12 w-full border-t border-border pt-8">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Or start from a favourite
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {destinations.slice(0, 6).map((d) => (
            <li key={d.slug}>
              <Link
                href={`/destinations?q=${encodeURIComponent(d.name)}`}
                className="inline-flex min-h-11 items-center rounded-full bg-secondary px-5 font-medium text-deep transition-colors hover:bg-deep hover:text-background"
              >
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
