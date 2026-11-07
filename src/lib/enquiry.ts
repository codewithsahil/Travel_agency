/** Shared enquiry validation: used by the form (instant feedback) and the API route (the real check). */

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${day}`
}

export function validateEnquiry(v: Enquiry): EnquiryErrors {
  const e: EnquiryErrors = {}

  if (v.name.trim().length < 2) e.name = "Enter your full name."
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email, like name@example.com."

  const digits = v.phone.replace(/\D/g, "")
  if (!/^[+\d][\d\s()+-]*$/.test(v.phone.trim()) || digits.length < 7 || digits.length > 15) {
    e.phone = "Enter a phone number with 7–15 digits."
  }

  if (!v.destination.trim()) e.destination = "Choose where you'd like to go."

  const today = todayISO()
  if (!v.depart) e.depart = "Pick a departure date."
  else if (v.depart < today) e.depart = "Departure can't be in the past."

  if (!v.return) e.return = "Pick a return date."
  else if (v.depart && v.return < v.depart) e.return = "Return must be on or after departure."

  const n = Number(v.travelers)
  if (!Number.isInteger(n) || n < 1 || n > 20) e.travelers = "Enter 1 to 20 travelers."

  if (v.message.length > 1500) e.message = "Please keep your message under 1,500 characters."

  return e
}
