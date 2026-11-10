import { NextResponse } from "next/server"

import { validateEnquiry, type Enquiry } from "@/lib/enquiry"
import { rateLimit } from "@/lib/rate-limit"
import { siteConfig } from "@/lib/site"

const FIELDS = ["name", "email", "phone", "destination", "depart", "return", "travelers", "message"] as const

/** A real enquiry is well under 3 KB; anything bigger is junk or an attack. */
const MAX_BODY_BYTES = 8 * 1024

function positiveInt(raw: string | undefined, fallback: number) {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : fallback
}

// Per-IP budget. Tunable per environment without code changes.
const RATE_MAX = positiveInt(process.env.ENQUIRY_RATE_LIMIT_MAX, 8)
const RATE_WINDOW_MS = positiveInt(process.env.ENQUIRY_RATE_LIMIT_WINDOW_SEC, 600) * 1000

function reply(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  // Never cache API responses; they can contain a per-request reference number.
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } })
}

/**
 * Client address used for rate limiting. We take the LAST x-forwarded-for entry: that is the one appended by
 * the closest trusted proxy, whereas the first entries can be forged by the client.
 */
function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  const last = forwarded?.split(",").pop()?.trim()
  return (last || request.headers.get("x-real-ip") || "unknown").slice(0, 64)
}

/** Defence in depth against cross-site form posts: a browser-sent Origin must be one of our own hosts. */
function isSameSite(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false
  const origin = request.headers.get("origin")
  if (!origin) return true // non-browser clients (curl, server-to-server) do not send Origin
  try {
    const allowed = new Set<string>([new URL(siteConfig.url).host])
    for (const h of ["host", "x-forwarded-host"]) {
      const v = request.headers.get(h)
      if (v) allowed.add(v)
    }
    return allowed.has(new URL(origin).host)
  } catch {
    return false
  }
}

/** Reads the body but stops as soon as it exceeds the cap, so a huge upload is never buffered. Null = too large. */
async function readLimitedText(request: Request): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"))
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null

  const reader = request.body?.getReader()
  if (!reader) return ""
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > MAX_BODY_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString("utf8")
}

export async function POST(request: Request) {
  if (!isSameSite(request)) return reply({ ok: false, error: "Forbidden." }, 403)

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return reply({ ok: false, error: "Unsupported content type." }, 415)
  }

  const limit = rateLimit(`enquiry:${clientKey(request)}`, RATE_MAX, RATE_WINDOW_MS)
  if (!limit.ok) {
    return reply({ ok: false, error: "Too many requests. Please try again later." }, 429, {
      "Retry-After": String(limit.retryAfterSec),
    })
  }

  const text = await readLimitedText(request)
  if (text === null) return reply({ ok: false, error: "Request too large." }, 413)

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return reply({ ok: false, error: "Invalid request." }, 400)
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return reply({ ok: false, error: "Invalid request." }, 400)
  }

  // Allow-list the fields we know (blocks mass assignment) and coerce everything else to "".
  const input = body as Record<string, unknown>
  const enquiry = Object.fromEntries(
    FIELDS.map((k) => [k, typeof input[k] === "string" ? (input[k] as string) : ""])
  ) as Enquiry

  const errors = validateEnquiry(enquiry)
  if (Object.keys(errors).length > 0) {
    return reply({ ok: false, errors }, 422)
  }

  // TODO: forward to your CRM / email provider here (Resend, SendGrid, HubSpot...).
  // When you do: HTML-escape every field before putting it in an email body, never put user input in
  // email headers (subject/to/reply-to) without stripping CR/LF, and do not log the enquiry (it is personal data).
  const ref = `ONC-${crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`
  return reply({ ok: true, ref })
}
