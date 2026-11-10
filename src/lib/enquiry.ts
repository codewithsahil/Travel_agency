/** Shared enquiry validation: used by the form (instant feedback) and the API route (the real check). */

import { destinations } from "@/lib/data"

export type EnquiryField =
  | "name"
  | "email"
  | "phone"
  | "destination"
  | "depart"
  | "return"
  | "travelers"
  | "message"

export type Enquiry = Record<EnquiryField, string>
export type EnquiryErrors = Partial<Record<EnquiryField, string>>

/** Hard upper bounds. They also protect whatever the API forwards to later (email, CRM, logs). */
export const LIMITS = { name: 100, email: 254, phone: 30, destination: 80, message: 1500 } as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const COUNT_RE = /^\d{1,2}$/
/** Control characters (incl. NUL, CR/LF, line/paragraph separators): never valid in single-line fields. */
const CONTROL_RE = /[\x00-\x1F\x7F\p{Zl}\p{Zp}]/u
/** Control characters except tab, LF and CR: allowed-set for the free-text message. */
const MESSAGE_BAD_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/

const ALLOWED_DESTINATIONS = new Set<string>([...destinations.map((d) => d.name), "Somewhere else"])
const MAX_YEARS_AHEAD = 3

function isoDate(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${day}`
}

function todayISO() {
  return isoDate(new Date())
}

function maxDateISO() {
  const d = new Date()
  d.setFullYear(d.getFullYear() + MAX_YEARS_AHEAD)
  return isoDate(d)
}

/** True only for a real calendar date written as YYYY-MM-DD (rejects "9999zzz", "2026-02-31", ...). */
function isRealDate(s: string) {
  if (!DATE_RE.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

export function validateEnquiry(v: Enquiry): EnquiryErrors {
  const e: EnquiryErrors = {}

  const name = v.name.trim()
  if (name.length < 2 || CONTROL_RE.test(v.name)) e.name = "Enter your full name."
  else if (name.length > LIMITS.name) e.name = `Please keep your name under ${LIMITS.name} characters.`

  const email = v.email.trim()
  if (!EMAIL_RE.test(email) || CONTROL_RE.test(v.email) || email.length > LIMITS.email) {
    e.email = "Enter a valid email, like name@example.com."
  }

  const digits = v.phone.replace(/\D/g, "")
  if (
    !/^[+\d][\d\s()+-]*$/.test(v.phone.trim()) ||
    digits.length < 7 ||
    digits.length > 15 ||
    v.phone.length > LIMITS.phone
  ) {
    e.phone = "Enter a phone number with 7–15 digits."
  }

  if (!v.destination.trim() || !ALLOWED_DESTINATIONS.has(v.destination)) e.destination = "Choose where you'd like to go."

  const today = todayISO()
  if (!v.depart) e.depart = "Pick a departure date."
  else if (!isRealDate(v.depart)) e.depart = "Enter a valid departure date."
  else if (v.depart < today) e.depart = "Departure can't be in the past."
  else if (v.depart > maxDateISO()) e.depart = `Pick a date within the next ${MAX_YEARS_AHEAD} years.`

  if (!v.return) e.return = "Pick a return date."
  else if (!isRealDate(v.return)) e.return = "Enter a valid return date."
  else if (v.depart && v.return < v.depart) e.return = "Return must be on or after departure."
  else if (v.return > maxDateISO()) e.return = `Pick a date within the next ${MAX_YEARS_AHEAD} years.`

  const n = Number(v.travelers)
  if (!COUNT_RE.test(v.travelers.trim()) || !Number.isInteger(n) || n < 1 || n > 20) {
    e.travelers = "Enter 1 to 20 travelers."
  }

  if (v.message.length > LIMITS.message) e.message = "Please keep your message under 1,500 characters."
  else if (MESSAGE_BAD_RE.test(v.message)) e.message = "Your message contains characters we can't accept."

  return e
}
