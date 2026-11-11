import { WhatsAppIcon } from "@/components/icons/social"
import { siteConfig } from "@/lib/site"

export function WhatsAppButton() {
  const message = `Hi ${siteConfig.name}, I would like help planning a trip.`
  const href = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="group fixed print:hidden right-4 bottom-4 z-40 flex h-14 items-center rounded-full bg-[#128c4a] text-white shadow-[0_14px_30px_-10px_rgba(18,140,74,.8)] transition-all duration-300 hover:pr-5 focus-visible:pr-5 sm:right-6 sm:bottom-6"
    >
      <span className="relative grid size-14 place-items-center">
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[#128c4a]/40 [animation-duration:2.6s] motion-reduce:hidden"
          aria-hidden
        />
        <WhatsAppIcon width={28} height={28} className="relative" />
      </span>
      <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:max-w-40 group-focus-visible:max-w-40">
        Chat with us
      </span>
    </a>
  )
}
