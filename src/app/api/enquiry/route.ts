import { NextResponse } from "next/server"

import { validateEnquiry, type Enquiry } from "@/lib/enquiry"

const FIELDS = ["name", "email", "phone", "destination", "depart", "return", "travelers", "message"] as const

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  const input = (body ?? {}) as Record<string, unknown>
  const enquiry = Object.fromEntries(FIELDS.map((k) => [k, typeof input[k] === "string" ? (input[k] as string) : ""])) as Enquiry

  const errors = validateEnquiry(enquiry)
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 })
  }

  // TODO: forward to your CRM / email provider here (Resend, SendGrid, HubSpot...).
  const ref = `ONC-${Date.now().toString(36).toUpperCase().slice(-6)}`
  return NextResponse.json({ ok: true, ref })
}
