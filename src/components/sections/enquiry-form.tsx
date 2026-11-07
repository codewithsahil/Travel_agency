"use client"

import { AnimatePresence, motion } from "motion/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { Loader2, Send } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { destinations } from "@/lib/data"
import { validateEnquiry, type Enquiry, type EnquiryErrors, type EnquiryField } from "@/lib/enquiry"
import { cn } from "@/lib/utils"

const control =
  "h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-deep placeholder:text-muted-foreground/70 transition-colors focus-visible:border-ocean focus-visible:ring-3 focus-visible:ring-ring/30 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20"

export function EnquiryForm() {
  const params = useSearchParams()
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)

  const prefillDestination = params.get("destination") ?? ""
  const known = destinations.some((d) => d.name === prefillDestination)
  const context = [params.get("package"), params.get("tier") && `${params.get("tier")} tier`, params.get("offer") && `Offer ${params.get("offer")}`]
    .filter(Boolean)
    .join(" · ")

  const [values, setValues] = useState<Enquiry>({
    name: "",
    email: "",
    phone: "",
    destination: known ? prefillDestination : prefillDestination ? "Somewhere else" : "",
    depart: params.get("depart") ?? "",
    return: params.get("return") ?? "",
    travelers: params.get("travelers") ?? "2",
    message: context ? `I'm interested in: ${context}.\n` : "",
  })
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle")
  const [ref, setRef] = useState("")

  useEffect(() => {
    if (status === "done") successRef.current?.focus()
  }, [status])

  const id = (f: EnquiryField) => `${uid}-${f}`
  const err = (f: EnquiryField) => (touched[f] ? errors[f] : undefined)

  function set(field: EnquiryField, value: string) {
    const next = { ...values, [field]: value }
    setValues(next)
    if (touched[field] || Object.keys(errors).length) setErrors(validateEnquiry(next))
  }

  function blur(field: EnquiryField) {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validateEnquiry(values))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validateEnquiry(values)
    setErrors(found)
    const keys = Object.keys(found) as EnquiryField[]
    setTouched(Object.fromEntries((Object.keys(values) as EnquiryField[]).map((k) => [k, true])))
    if (keys.length) {
      const first = keys[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus("sending")
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error("rejected")
      setRef(data.ref)
      setStatus("done")
    } catch {
      setStatus("failed")
    }
  }

  const fieldError = (f: EnquiryField) =>
    err(f) && (
      <p id={`${id(f)}-err`} className="mt-1.5 flex items-start gap-1.5 text-sm text-destructive">
        <span aria-hidden>⚠</span>
        <span>{err(f)}</span>
      </p>
    )
  const a11y = (f: EnquiryField) => ({
    "aria-invalid": err(f) ? true : undefined,
    "aria-describedby": err(f) ? `${id(f)}-err` : undefined,
  })

  return (
    <div className="relative rounded-[32px] border border-border bg-card p-6 shadow-soft sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[460px] flex-col items-center justify-center text-center"
            role="status"
          >
            <svg viewBox="0 0 96 96" className="size-28" aria-hidden>
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="var(--palm)"
                strokeWidth="5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              <motion.path
                d="M30 50 l13 13 l25 -28"
                fill="none"
                stroke="var(--palm)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
              />
            </svg>
            <h2 ref={successRef} tabIndex={-1} className="mt-6 text-3xl font-medium text-deep outline-none">
              Thank you, {values.name.split(" ")[0]}!
            </h2>
            <p className="mt-3 max-w-md text-lg text-muted-foreground">
              Your enquiry is in. A trip planner will email {values.email} within 2 hours with ideas and a price.
            </p>
            <p className="mt-5 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-ocean">
              Your reference: {ref}
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle")
                setTouched({})
                setErrors({})
                setValues((v) => ({ ...v, message: "" }))
              }}
              className="mt-8 min-h-11 cursor-pointer rounded-full border border-deep/30 px-6 text-sm font-semibold text-deep hover:bg-deep hover:text-background"
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-labelledby={`${uid}-title`}
          >
            <h2 id={`${uid}-title`} className="text-3xl font-medium text-deep">
              Tell us about your trip
            </h2>
            <p className="mt-2 text-muted-foreground">
              Takes about two minutes. Fields marked <span aria-hidden>*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </p>

            <div className="mt-8 grid gap-x-5 gap-y-6 sm:grid-cols-2">
              <div>
                <Label htmlFor={id("name")} className="mb-2 text-sm font-semibold text-deep">
                  Full name <span aria-hidden>*</span>
                </Label>
                <Input
                  id={id("name")}
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => blur("name")}
                  required
                  className={control}
                  {...a11y("name")}
                />
                {fieldError("name")}
              </div>

              <div>
                <Label htmlFor={id("email")} className="mb-2 text-sm font-semibold text-deep">
                  Email <span aria-hidden>*</span>
                </Label>
                <Input
                  id={id("email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => blur("email")}
                  required
                  className={control}
                  {...a11y("email")}
                />
                {fieldError("email")}
              </div>

              <div>
                <Label htmlFor={id("phone")} className="mb-2 text-sm font-semibold text-deep">
                  Phone / WhatsApp <span aria-hidden>*</span>
                </Label>
                <Input
                  id={id("phone")}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+91 98765 43210"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onBlur={() => blur("phone")}
                  required
                  className={control}
                  {...a11y("phone")}
                />
                {fieldError("phone")}
              </div>

              <div>
                <Label htmlFor={id("destination")} className="mb-2 text-sm font-semibold text-deep">
                  Destination <span aria-hidden>*</span>
                </Label>
                <select
                  id={id("destination")}
                  name="destination"
                  value={values.destination}
                  onChange={(e) => set("destination", e.target.value)}
                  onBlur={() => blur("destination")}
                  required
                  className={cn(control, "cursor-pointer appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10")}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>\")",
                  }}
                  {...a11y("destination")}
                >
                  <option value="">Choose a destination</option>
                  {destinations.map((d) => (
                    <option key={d.slug} value={d.name}>
                      {d.name}, {d.country}
                    </option>
                  ))}
                  <option value="Somewhere else">Somewhere else</option>
                </select>
                {fieldError("destination")}
              </div>

              <div>
                <Label htmlFor={id("depart")} className="mb-2 text-sm font-semibold text-deep">
                  Travel from <span aria-hidden>*</span>
                </Label>
                <Input
                  id={id("depart")}
                  name="depart"
                  type="date"
                  value={values.depart}
                  onChange={(e) => set("depart", e.target.value)}
                  onBlur={() => blur("depart")}
                  required
                  className={cn(control, "dark:[color-scheme:dark]")}
                  {...a11y("depart")}
                />
                {fieldError("depart")}
              </div>

              <div>
                <Label htmlFor={id("return")} className="mb-2 text-sm font-semibold text-deep">
                  Travel until <span aria-hidden>*</span>
                </Label>
                <Input
                  id={id("return")}
                  name="return"
                  type="date"
                  value={values.return}
                  min={values.depart || undefined}
                  onChange={(e) => set("return", e.target.value)}
                  onBlur={() => blur("return")}
                  required
                  className={cn(control, "dark:[color-scheme:dark]")}
                  {...a11y("return")}
                />
                {fieldError("return")}
              </div>

              <div>
                <Label htmlFor={id("travelers")} className="mb-2 text-sm font-semibold text-deep">
                  Number of travelers <span aria-hidden>*</span>
                </Label>
                <Input
                  id={id("travelers")}
                  name="travelers"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={20}
                  value={values.travelers}
                  onChange={(e) => set("travelers", e.target.value)}
                  onBlur={() => blur("travelers")}
                  required
                  className={control}
                  {...a11y("travelers")}
                />
                {fieldError("travelers")}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor={id("message")} className="mb-2 text-sm font-semibold text-deep">
                  Anything we should know?
                </Label>
                <Textarea
                  id={id("message")}
                  name="message"
                  rows={5}
                  placeholder="Budget, special occasions, dietary needs, hotels you love…"
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                  onBlur={() => blur("message")}
                  className={cn(control, "h-auto min-h-32 py-3")}
                  {...a11y("message")}
                />
                {fieldError("message")}
              </div>
            </div>

            {status === "failed" && (
              <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                We couldn&rsquo;t send that just now. Please try again, or message us on WhatsApp.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-8 inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-sunset px-8 text-base font-semibold text-white transition-colors hover:bg-sunset-hover disabled:cursor-wait disabled:opacity-80 sm:w-auto"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden /> Sending…
                </>
              ) : (
                <>
                  <Send className="size-5" aria-hidden /> Send my enquiry
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
