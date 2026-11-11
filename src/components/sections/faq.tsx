import { Plus } from "lucide-react"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { WhatsAppIcon } from "@/components/icons/social"
import { faqs } from "@/lib/data"
import { siteConfig } from "@/lib/site"

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-8">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            id="faq-title"
            title="Questions before you book?"
            text="The short answers. For anything else, we're one message away."
          />
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-deep/30 px-6 font-semibold text-deep transition-colors hover:bg-deep hover:text-background"
          >
            Ask us anything
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={0.08}>
          <Accordion className="border-t border-border">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-b border-border">
                <AccordionPrimitive.Header className="m-0">
                  <AccordionPrimitive.Trigger className="group/trigger flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 rounded-lg py-5 text-left font-display text-xl text-deep transition-colors hover:text-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:text-2xl">
                    {f.q}
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-ocean transition-transform duration-300 group-aria-expanded/trigger:rotate-45">
                      <Plus className="size-5" aria-hidden />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="max-w-2xl pb-6 text-lg leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-secondary p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl text-deep">Still not sure about something?</p>
              <p className="mt-1 text-muted-foreground">A real person replies on WhatsApp, usually within minutes.</p>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Hi ${siteConfig.name}, I have a question before booking.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#128c4a] px-6 font-semibold text-white transition-colors hover:bg-[#0f7a40]"
            >
              <WhatsAppIcon width={20} height={20} />
              Ask on WhatsApp
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
