"use client"

import { Check, Send } from "lucide-react"
import { useId, useState, type FormEvent } from "react"

import { cn } from "@/lib/utils"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function NewsletterForm({ className }: { className?: string }) {
  const id = useId()
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle")

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim()
    if (!EMAIL_RE.test(email)) {
      setStatus("error")
      return
    }
    // Hook up your email provider here (Mailchimp, Resend, etc.).
    setStatus("done")
    e.currentTarget.reset()
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("w-full", className)}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white/90">
        Get one great trip idea a month
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          placeholder="you@example.com"
          aria-invalid={status === "error"}
          aria-describedby={`${id}-msg`}
          onChange={() => status !== "idle" && setStatus("idle")}
          className="h-12 min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-base text-white placeholder:text-white/55 focus-visible:border-lagoon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lagoon aria-[invalid=true]:border-red-300"
        />
        <button
          type="submit"
          className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-sunset px-5 text-sm font-semibold text-white transition-colors hover:bg-sunset-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="hidden sm:inline">Subscribe</span>
          <Send className="size-4" aria-hidden />
          <span className="sr-only sm:hidden">Subscribe</span>
        </button>
      </div>
      <p
        id={`${id}-msg`}
        role="status"
        aria-live="polite"
        className={cn(
          "mt-2 min-h-5 text-sm",
          status === "error" ? "text-red-300" : "text-emerald-300"
        )}
      >
        {status === "error" && "Enter a valid email address, like name@example.com."}
        {status === "done" && (
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4" aria-hidden /> You&rsquo;re on the list. Check your inbox for a welcome note.
          </span>
        )}
      </p>
    </form>
  )
}
