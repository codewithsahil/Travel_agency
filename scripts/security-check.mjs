#!/usr/bin/env node
/**
 * Black-box security regression checks for the Once Again site. No dependencies; needs Node 18+.
 *
 *   npm run build && npx next start -p 3201
 *   ENQUIRY_RATE_LIMIT_MAX=1000 npx next start -p 3201   # functional run (keeps the limiter out of the way)
 *   node scripts/security-check.mjs http://localhost:3201
 *
 *   npx next start -p 3202                                 # default limiter (8 per 10 minutes)
 *   node scripts/security-check.mjs http://localhost:3202 --rate-limit
 *
 * Only run this against your own local or staging server. Exit code is 1 if any check fails.
 */

const args = process.argv.slice(2)
const base = (args.find((a) => a.startsWith("http")) ?? "http://localhost:3201").replace(/\/$/, "")
const rateLimitMode = args.includes("--rate-limit")
const rateMax = Number((args.find((a) => a.startsWith("--max=")) ?? "--max=8").split("=")[1])

const results = []
async function check(id, category, name, fn) {
  try {
    const detail = await fn()
    results.push({ id, category, name, pass: true, detail: detail ?? "" })
  } catch (err) {
    results.push({ id, category, name, pass: false, detail: err instanceof Error ? err.message : String(err) })
  }
}
function expect(cond, message) {
  if (!cond) throw new Error(message)
}

const day = 24 * 60 * 60 * 1000
const iso = (offsetDays) => new Date(Date.now() + offsetDays * day).toISOString().slice(0, 10)
const valid = () => ({
  name: "Asha Verma",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  destination: "Somewhere else",
  depart: iso(30),
  return: iso(37),
  travelers: "2",
  message: "Anniversary trip, vegetarian meals please.",
})

const post = (body, headers = {}, raw) =>
  fetch(`${base}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: raw ?? JSON.stringify(body),
  })

const NUL = String.fromCharCode(0)
const CR = String.fromCharCode(13)
const LF = String.fromCharCode(10)

if (!rateLimitMode) {
  // ---------- Security headers ----------
  const home = await fetch(`${base}/`)
  const h = home.headers
  await check("HDR-01", "Security headers", "Content-Security-Policy blocks framing, plugins and foreign bases", () => {
    const csp = h.get("content-security-policy") ?? ""
    for (const d of ["default-src 'self'", "frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"]) {
      expect(csp.includes(d), `CSP missing "${d}"`)
    }
    expect(!/script-src[^;]*\*/.test(csp), "script-src must not contain a wildcard")
  })
  await check("HDR-02", "Security headers", "X-Content-Type-Options: nosniff", () => expect(h.get("x-content-type-options") === "nosniff", "missing"))
  await check("HDR-03", "Security headers", "Clickjacking: X-Frame-Options DENY", () => expect(h.get("x-frame-options") === "DENY", "missing"))
  await check("HDR-04", "Security headers", "Referrer-Policy set", () => expect(/strict-origin/.test(h.get("referrer-policy") ?? ""), "missing"))
  await check("HDR-05", "Security headers", "Permissions-Policy disables camera/mic/geolocation", () => {
    const p = h.get("permissions-policy") ?? ""
    expect(p.includes("camera=()") && p.includes("microphone=()") && p.includes("geolocation=()"), "missing")
  })
  await check("HDR-06", "Security headers", "Strict-Transport-Security set", () => expect(/max-age=\d+/.test(h.get("strict-transport-security") ?? ""), "missing"))
  await check("HDR-07", "Information disclosure", "X-Powered-By not sent", () => expect(!h.get("x-powered-by"), `sent: ${h.get("x-powered-by")}`))
  await check("HDR-08", "Security headers", "Headers also present on 404 pages", async () => {
    const r = await fetch(`${base}/definitely-not-here`)
    expect(r.status === 404, `status ${r.status}`)
    expect(r.headers.get("content-security-policy") && r.headers.get("x-frame-options"), "missing on 404")
  })

  // ---------- API: transport / method / CSRF / CORS ----------
  await check("API-01", "API security", "GET /api/enquiry is rejected (405)", async () => {
    const r = await fetch(`${base}/api/enquiry`)
    expect(r.status === 405, `status ${r.status}`)
  })
  await check("API-02", "API security", "Non-JSON content type rejected (415): blocks cross-site simple-form posts", async () => {
    const r = await post(null, { "Content-Type": "text/plain" }, JSON.stringify(valid()))
    expect(r.status === 415, `status ${r.status}`)
    const r2 = await post(null, { "Content-Type": "application/x-www-form-urlencoded" }, "name=x")
    expect(r2.status === 415, `form-encoded status ${r2.status}`)
  })
  await check("API-03", "CSRF / CORS", "Foreign Origin rejected (403) and no CORS allow header", async () => {
    const r = await post(valid(), { Origin: "https://evil.example" })
    expect(r.status === 403, `status ${r.status}`)
    expect(!r.headers.get("access-control-allow-origin"), "ACAO header present")
  })
  await check("API-04", "CSRF / CORS", "Sec-Fetch-Site: cross-site rejected (403)", async () => {
    const r = await post(valid(), { "Sec-Fetch-Site": "cross-site" })
    expect(r.status === 403, `status ${r.status}`)
  })
  await check("API-05", "CSRF / CORS", "Preflight from a foreign origin gets no CORS allowance", async () => {
    const r = await fetch(`${base}/api/enquiry`, {
      method: "OPTIONS",
      headers: { Origin: "https://evil.example", "Access-Control-Request-Method": "POST" },
    })
    expect(!r.headers.get("access-control-allow-origin"), `ACAO=${r.headers.get("access-control-allow-origin")}`)
  })
  await check("API-06", "CSRF / CORS", "Same-origin request with matching Origin is accepted", async () => {
    const r = await post(valid(), { Origin: base })
    expect(r.status === 200, `status ${r.status}`)
  })

  // ---------- API: size, JSON shape ----------
  await check("API-07", "API security", "Oversized body rejected (413) without being processed", async () => {
    const big = JSON.stringify({ ...valid(), message: "A".repeat(2_000_000) })
    const r = await post(null, {}, big)
    expect(r.status === 413, `status ${r.status}`)
  })
  await check("API-08", "API security", "Malformed JSON, null, array and scalar bodies -> 400", async () => {
    for (const raw of ["{not json", "null", "[]", "123", '"str"', ""]) {
      const r = await post(null, {}, raw)
      expect(r.status === 400, `body ${JSON.stringify(raw)} -> ${r.status}`)
    }
  })
  await check("API-09", "API security", "Valid enquiry accepted, reference is random-looking and response not cacheable", async () => {
    const r = await post(valid())
    const j = await r.json()
    expect(r.status === 200 && j.ok === true, `status ${r.status}`)
    expect(/^ONC-[0-9A-F]{6}$/.test(j.ref), `ref ${j.ref}`)
    expect(/no-store/.test(r.headers.get("cache-control") ?? ""), "Cache-Control not no-store")
    const j2 = await (await post(valid())).json()
    expect(j.ref !== j2.ref, "two submissions returned the same reference")
  })
  await check("API-10", "Mass assignment", "Unknown fields (role, isAdmin, __proto__) are ignored and never echoed", async () => {
    const raw = JSON.stringify({ ...valid(), role: "admin", isAdmin: true }).replace(/}$/, ',"__proto__":{"polluted":true}}')
    const r = await post(null, {}, raw)
    const j = await r.json()
    expect(r.status === 200, `status ${r.status}`)
    expect(Object.keys(j).sort().join() === "ok,ref", `response keys: ${Object.keys(j)}`)
    expect(({}).polluted === undefined, "prototype polluted in test process")
  })

  // ---------- API: input validation / injection ----------
  const reject = (id, name, patch, field) =>
    check(id, "Input validation", name, async () => {
      const r = await post({ ...valid(), ...patch })
      const j = await r.json()
      expect(r.status === 422, `status ${r.status}`)
      expect(j.errors && j.errors[field], `no error reported for "${field}": ${JSON.stringify(j)}`)
    })
  await reject("VAL-01", "Destination outside the allow-list (script tag) rejected", { destination: "<script>alert(1)</script>" }, "destination")
  await reject("VAL-02", "Non-date departure string rejected", { depart: "9999zzz", return: "zzzz" }, "depart")
  await reject("VAL-03", "Impossible calendar date rejected", { depart: "2030-02-31" }, "depart")
  await reject("VAL-04", "Departure more than 3 years ahead rejected", { depart: "2099-01-01", return: "2099-01-02" }, "depart")
  await reject("VAL-05", "Control characters / CRLF header-injection in name rejected", { name: `Asha${CR}${LF}Bcc: victim@example.com` }, "name")
  await reject("VAL-06", "NUL byte in email rejected", { email: `a${NUL}@example.com` }, "email")
  await reject("VAL-07", "Name over 100 characters rejected", { name: "A".repeat(101) }, "name")
  await reject("VAL-08", "Email over 254 characters rejected", { email: `${"a".repeat(250)}@example.com` }, "email")
  await reject("VAL-09", "Phone over 30 characters rejected", { phone: `+91${" 9".repeat(20)}` }, "phone")
  await reject("VAL-10", "Message over 1500 characters rejected", { message: "A".repeat(1501) }, "message")
  await reject("VAL-11", "Control characters in message rejected", { message: `hi${NUL}there` }, "message")
  for (const [i, t] of ["0x5", "1e1", "5.5", "-1", "21", "0", " ", "999"].entries()) {
    await reject(`VAL-${12 + i}`, `travelers "${t}" rejected`, { travelers: t }, "travelers")
  }
  await check("VAL-20", "Injection", "Object/array/NoSQL-style operator values are coerced and rejected, not interpreted", async () => {
    const r = await post({ ...valid(), name: { $ne: null }, email: ["a@b.co"], phone: { $gt: "" } })
    const j = await r.json()
    expect(r.status === 422, `status ${r.status}`)
    expect(j.errors.name && j.errors.email && j.errors.phone, "expected errors for all three")
  })
  await check("VAL-21", "Injection", "SQL-injection style strings are treated as plain data (no server error)", async () => {
    const r = await post({ ...valid(), name: "Robert'); DROP TABLE enquiries;--", message: "' OR '1'='1" })
    expect(r.status === 200, `status ${r.status}`)
  })
  await check("ERR-01", "Error handling", "Error responses leak no stack traces, paths or framework internals", async () => {
    const samples = [
      await post(null, {}, "{bad"),
      await post({ ...valid(), depart: "x" }),
      await post(valid(), { Origin: "https://evil.example" }),
      await fetch(`${base}/api/enquiry`),
    ]
    for (const r of samples) {
      const text = await r.text()
      expect(!/node_modules|\.tsx?:\d+|[A-Za-z]:\\|\/src\/|at \w+ \(|SyntaxError|Unexpected token/.test(text), `leak in ${r.status}: ${text.slice(0, 120)}`)
    }
  })

  // ---------- Reflected XSS / open redirect / SSRF / traversal / exposure ----------
  await check("XSS-01", "XSS", "Query-string payloads are not reflected unescaped in server HTML", async () => {
    const payload = '<script>alert(1)</script>"><img src=x onerror=alert(1)>'
    const urls = [
      `/destinations?q=${encodeURIComponent(payload)}`,
      `/contact?package=${encodeURIComponent(payload)}&tier=${encodeURIComponent(payload)}&destination=${encodeURIComponent(payload)}`,
      `/packages?for=${encodeURIComponent(payload)}`,
    ]
    for (const u of urls) {
      const html = await (await fetch(base + u)).text()
      expect(!html.includes("<script>alert(1)</script>"), `raw <script> reflected for ${u}`)
      expect(!html.includes("<img src=x onerror=alert(1)>"), `raw <img onerror> reflected for ${u}`)
    }
  })
  await check("RED-01", "Open redirect", "Protocol-relative and encoded external paths never redirect off-site", async () => {
    for (const p of ["//evil.example", "/%2F%2Fevil.example", "/\\evil.example", "/%5Cevil.example", "/https://evil.example"]) {
      const r = await fetch(base + p, { redirect: "manual" })
      const loc = r.headers.get("location")
      // A redirect is fine as long as it stays on our own origin (e.g. "//x" normalised to "/x").
      expect(!loc || new URL(loc, base).origin === new URL(base).origin, `${p} -> ${r.status} Location: ${loc}`)
    }
  })
  await check("SSRF-01", "SSRF", "Image optimizer refuses non-allow-listed hosts (evil host, metadata IP, localhost)", async () => {
    for (const target of ["https://evil.example/x.png", "http://169.254.169.254/latest/meta-data/", "http://localhost:3200/", "https://images.unsplash.com.evil.example/x.png"]) {
      const r = await fetch(`${base}/_next/image?url=${encodeURIComponent(target)}&w=64&q=75`)
      expect(r.status === 400 || r.status === 404, `${target} -> ${r.status}`)
    }
  })
  await check("PATH-01", "Path traversal", "Traversal sequences never return files outside /public", async () => {
    for (const p of ["/..%2f..%2fpackage.json", "/%2e%2e/%2e%2e/package.json", "/_next/static/..%2f..%2f..%2fpackage.json", "/..%5c..%5cpackage.json", "/%252e%252e/%252e%252e/package.json"]) {
      const r = await fetch(base + p, { redirect: "manual" })
      const text = await r.text()
      expect(!text.includes('"onceagain"') && !text.includes('"dependencies"'), `${p} returned package.json (${r.status})`)
    }
  })
  await check("EXP-01", "Information disclosure", "Source, config, VCS and env files are not served", async () => {
    for (const p of ["/.env", "/.env.local", "/.git/config", "/.git/HEAD", "/package.json", "/package-lock.json", "/next.config.ts", "/src/lib/site.ts", "/src/app/api/enquiry/route.ts", "/docs/context.md", "/tsconfig.json"]) {
      const r = await fetch(base + p)
      const text = await r.text()
      expect(r.status === 404, `${p} -> ${r.status}`)
      expect(!text.includes("[core]") && !text.includes("siteConfig"), `${p} leaked content`)
    }
  })
  await check("EXP-02", "Information disclosure", "robots.txt hides /api/, sitemap is served", async () => {
    const robots = await (await fetch(`${base}/robots.txt`)).text()
    expect(/Disallow:\s*\/api\//.test(robots), "robots missing Disallow: /api/")
    expect((await fetch(`${base}/sitemap.xml`)).status === 200, "sitemap not 200")
  })
} else {
  // ---------- Rate limiting (needs a fresh server with the default limiter) ----------
  await check("RATE-01", "Rate limiting", `Request ${rateMax + 1} within the window gets 429 + Retry-After; earlier ones succeed`, async () => {
    const statuses = []
    let last
    for (let i = 0; i < rateMax + 3; i++) {
      last = await post(valid())
      statuses.push(last.status)
    }
    expect(statuses.slice(0, rateMax).every((s) => s === 200), `first ${rateMax}: ${statuses.slice(0, rateMax)}`)
    expect(statuses.slice(rateMax).every((s) => s === 429), `after limit: ${statuses.slice(rateMax)}`)
    expect(Number(last.headers.get("retry-after")) > 0, "Retry-After header missing")
    const j = await last.json()
    expect(j.ok === false, "429 body should be ok:false")
    return `statuses: ${statuses.join(",")}`
  })
}

// ---------- Report ----------
const pad = (s, n) => String(s).padEnd(n)
console.log(`\nSecurity checks against ${base}${rateLimitMode ? " (rate-limit mode)" : ""}\n`)
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${pad(r.id, 8)} ${pad(r.category, 24)} ${r.name}${r.pass ? "" : `\n      -> ${r.detail}`}${r.pass && r.detail ? `\n      (${r.detail})` : ""}`)
}
const failed = results.filter((r) => !r.pass).length
console.log(`\n${results.length - failed}/${results.length} passed, ${failed} failed\n`)
process.exit(failed ? 1 : 0)
