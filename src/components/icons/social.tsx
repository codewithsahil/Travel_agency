import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  "aria-hidden": true,
  focusable: false,
} as const

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M13.5 21v-7.6h2.6l.5-3h-3.1V8.5c0-.9.4-1.5 1.6-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.4 0-4 1.4-4 4.1v2.1H7.4v3h2.4V21z" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor" />
    </svg>
  )
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M12.04 2A9.9 9.9 0 0 0 3.6 17.1L2 22l5-1.6A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.3 14.96l-.3-.2-2.96.95.97-2.87-.2-.31A8.1 8.1 0 0 1 12.04 3.8Zm-3.2 3.7c-.2 0-.5.07-.75.35-.25.27-.97.95-.97 2.3 0 1.36 1 2.67 1.13 2.85.14.18 1.93 3.05 4.76 4.15 2.35.92 2.83.74 3.34.7.5-.05 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.52-.32-.27-.13-1.64-.8-1.9-.9-.25-.09-.43-.13-.6.14-.19.27-.72.9-.88 1.08-.16.18-.32.2-.6.07-.27-.14-1.15-.42-2.2-1.35-.8-.72-1.35-1.6-1.5-1.87-.17-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.6-1.5-.84-2.05-.2-.48-.43-.5-.6-.5Z" />
    </svg>
  )
}
