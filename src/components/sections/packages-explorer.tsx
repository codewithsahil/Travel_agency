"use client"

import { motion } from "motion/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Heart, Users, Backpack } from "lucide-react"

import { PackageCard } from "@/components/package-cards"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { audiences, packages, type Audience } from "@/lib/data"

const icons = { couples: Heart, family: Users, friends: Backpack } as const
const blurbs: Record<Audience, string> = {
  couples: "Slower mornings, better views and dinners for two.",
  family: "Easy pacing, kid-friendly stops and rooms that actually fit everyone.",
  friends: "Shared adventures, flexible plans and the best group rates.",
}

const isAudience = (v: string | null): v is Audience => audiences.some((a) => a.value === v)

export function PackagesExplorer() {
  const params = useSearchParams()
  const initial = params.get("for")
  const [tab, setTab] = useState<Audience>(isAudience(initial) ? initial : "couples")

  // Deep link from the home page: /packages?for=family#kerala-backwaters
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 350)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <section aria-labelledby="packages-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="packages-title" className="text-display font-medium text-deep">
          Pick the kind of trip you&rsquo;re taking
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Every package is a starting point. Swap hotels, add days or drop anything you don&rsquo;t want.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Audience)} className="mt-10 items-stretch gap-10">
        <TabsList
          aria-label="Package type"
          className="mx-auto h-auto w-full max-w-xl gap-1 rounded-full bg-secondary p-1.5 group-data-horizontal/tabs:h-auto"
        >
          {audiences.map((a) => {
            const Icon = icons[a.value]
            return (
              <TabsTrigger
                key={a.value}
                value={a.value}
                className="h-12 min-w-0 flex-1 cursor-pointer gap-2 rounded-full px-3 text-[0.95rem] font-semibold text-deep/80 hover:text-deep data-active:bg-deep data-active:text-white data-active:shadow-soft sm:px-6 sm:text-base dark:data-active:border-transparent dark:data-active:bg-primary dark:data-active:text-primary-foreground"
              >
                <Icon aria-hidden />
                {a.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {audiences.map((a) => (
          <TabsContent key={a.value} value={a.value} className="text-base">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-8 text-center text-muted-foreground">{blurbs[a.value]}</p>
              <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {packages
                  .filter((p) => p.audience === a.value)
                  .map((p) => (
                    <li key={p.slug}>
                      <PackageCard pkg={p} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" />
                    </li>
                  ))}
              </ul>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
