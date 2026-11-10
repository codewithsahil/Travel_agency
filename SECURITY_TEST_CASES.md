# Security Test Cases

Companion to `SECURITY_AUDIT.md`. Date: 2026-11-10. All tests ran against **local** servers only.

- **Before** = original code (commit `bd2ae89`, served by `next dev`).
- **After** = fixed code, `next build` + `next start` (production build).
- Authentication / authorization tests are **not included: the app has no login** (skipped as instructed).

## How to re-run

```bash
npm run build

# functional checks (46). The limiter is raised so it does not interfere with the test traffic.
ENQUIRY_RATE_LIMIT_MAX=1000 npx next start -p 3201        # PowerShell: $env:ENQUIRY_RATE_LIMIT_MAX=1000; npx next start -p 3201
npm run test:security -- http://localhost:3201

# rate limiter check (1), against a server with the default limiter (8 per 10 min)
npx next start -p 3202
npm run test:security -- http://localhost:3202 --rate-limit
```

Exit code is 1 if any check fails. Only point it at your own local/staging server. The script is dependency-free (Node 18+).

## Result summary

| Run | Passed | Failed |
|---|---|---|
| Before (original code), functional | 21 / 46 | 25 |
| Before, rate-limit | 0 / 1 | 1 |
| **After (fixed code), functional** | **46 / 46** | 0 |
| **After, rate-limit** | **1 / 1** | 0 |
| After, real-browser checks BRW-01 to BRW-06 (Chrome, section C) | 6 / 6 | 0 |

## A. Automated HTTP tests (`scripts/security-check.mjs`)

Steps column uses `H=http://localhost:3201` and `curl`. Every ID below is also the ID printed by the script.

### Security headers and information disclosure

| ID | Category | Scenario | Steps | Expected | Before | After |
|---|---|---|---|---|---|---|
| HDR-01 | Security headers | CSP blocks framing, plugins, foreign base/form targets | `curl -sI $H/` and read `Content-Security-Policy` | Has `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`; no wildcard in `script-src` | FAIL (header absent) | PASS |
| HDR-02 | Security headers | MIME sniffing disabled | same | `X-Content-Type-Options: nosniff` | FAIL | PASS |
| HDR-03 | Clickjacking | Page cannot be framed | same | `X-Frame-Options: DENY` | FAIL | PASS |
| HDR-04 | Security headers | Referrer limited | same | `Referrer-Policy: strict-origin-when-cross-origin` | FAIL | PASS |
| HDR-05 | Security headers | Powerful features off | same | `Permissions-Policy` has `camera=()`, `microphone=()`, `geolocation=()` | FAIL | PASS |
| HDR-06 | Transport | HSTS present (effective over HTTPS only) | same | `Strict-Transport-Security: max-age=...` | FAIL | PASS |
| HDR-07 | Info disclosure | Framework not advertised | same | No `X-Powered-By` | FAIL (`Next.js`) | PASS |
| HDR-08 | Security headers | Headers also on 404 | `curl -sI $H/definitely-not-here` | 404 with CSP and X-Frame-Options | FAIL | PASS |

### API: transport, CSRF, CORS, size, shape

| ID | Category | Scenario | Steps | Expected | Before | After |
|---|---|---|---|---|---|---|
| API-01 | API | Wrong method | `curl -si $H/api/enquiry` | 405 | PASS | PASS |
| API-02 | CSRF | Simple cross-site form post (non-JSON) | `curl -X POST -H "Content-Type: text/plain" --data '{...valid...}' $H/api/enquiry`; repeat with `application/x-www-form-urlencoded` | 415 | FAIL (200) | PASS |
| API-03 | CSRF/CORS | Foreign Origin | POST valid JSON with header `Origin: https://evil.example` | 403, no `Access-Control-Allow-Origin` | FAIL (200) | PASS |
| API-04 | CSRF | Browser says cross-site | POST valid JSON with `Sec-Fetch-Site: cross-site` | 403 | FAIL (200) | PASS |
| API-05 | CORS | Preflight from foreign origin | `curl -X OPTIONS -H "Origin: https://evil.example" -H "Access-Control-Request-Method: POST" $H/api/enquiry` | No `Access-Control-Allow-Origin` | PASS | PASS |
| API-06 | Regression | Same-origin request still works | POST valid JSON with `Origin: $H` | 200 | PASS | PASS |
| API-07 | DoS | 2 MB body | POST JSON with a 2,000,000-char `message` | 413, not processed | FAIL (422, fully read) | PASS |
| API-08 | API | Malformed / non-object JSON | POST `{not json`, `null`, `[]`, `123`, `"str"`, empty body | 400 each | FAIL (`null` -> 422) | PASS |
| API-09 | API | Valid enquiry; reference is random and not cacheable | POST valid JSON twice | 200, `ref` matches `ONC-XXXXXX`, differs per request, `Cache-Control: no-store` | FAIL (no `no-store`; time-based ref) | PASS |
| API-10 | Mass assignment | Extra fields (`role`, `isAdmin`, `__proto__`) | POST valid JSON plus those keys | 200; response only `{ok, ref}`; no prototype pollution | PASS | PASS |
| RATE-01 | Rate limiting | Flood from one client | 11 valid POSTs in a row against default limiter (limit 8) | First 8 = 200, then 429 with `Retry-After` | FAIL (all 200) | PASS (`200x8, 429x3`) |

### Input validation and injection

| ID | Category | Scenario | Payload (changed field) | Expected | Before | After |
|---|---|---|---|---|---|---|
| VAL-01 | Validation | Destination outside allow-list | `destination: "<script>alert(1)</script>"` | 422 + field error | FAIL (200) | PASS |
| VAL-02 | Validation | Non-date string | `depart: "9999zzz", return: "zzzz"` | 422 on `depart` | FAIL (200) | PASS |
| VAL-03 | Validation | Impossible date | `depart: "2030-02-31"` | 422 on `depart` | FAIL | PASS |
| VAL-04 | Validation | Date > 3 years ahead | `depart: "2099-01-01"` | 422 on `depart` | FAIL (200) | PASS |
| VAL-05 | Header injection | CR/LF in name | `name: "Asha\r\nBcc: victim@example.com"` | 422 on `name` | FAIL (200) | PASS |
| VAL-06 | Validation | NUL byte in email | `email: "a\0@example.com"` | 422 on `email` | FAIL (200) | PASS |
| VAL-07 | Validation | Name > 100 chars | 101 x `A` | 422 | FAIL (200) | PASS |
| VAL-08 | Validation | Email > 254 chars | 250 x `a` + `@example.com` | 422 | FAIL (200) | PASS |
| VAL-09 | Validation | Phone > 30 chars | `+91` + 20 x ` 9` | 422 | PASS | PASS |
| VAL-10 | Validation | Message > 1500 chars | 1501 x `A` | 422 | PASS | PASS |
| VAL-11 | Validation | Control chars in message | `"hi\0there"` | 422 | FAIL (200) | PASS |
| VAL-12 to VAL-19 | Validation | Traveler count | `"0x5"`, `"1e1"`, `"5.5"`, `"-1"`, `"21"`, `"0"`, `" "`, `"999"` | 422 each | `0x5`, `1e1` FAIL; others PASS | PASS (all 8) |
| VAL-20 | Injection | NoSQL-style operators | `name: {"$ne":null}`, `email: ["a@b.co"]`, `phone: {"$gt":""}` | 422 (coerced to empty), never interpreted | PASS | PASS |
| VAL-21 | Injection | SQL-injection strings in text | `name: "Robert'); DROP TABLE enquiries;--"`, `message: "' OR '1'='1"` | 200, treated as text, no server error (there is no database) | PASS | PASS |
| ERR-01 | Error handling | No stack/path/framework leakage | Trigger 400, 422, 403 and 405 responses and scan bodies for `node_modules`, `.ts:123`, `C:\`, `SyntaxError` | No matches | PASS | PASS |

### Web-attack probes

| ID | Category | Scenario | Steps | Expected | Before | After |
|---|---|---|---|---|---|---|
| XSS-01 | XSS (reflected) | Script/img payloads in `q`, `package`, `tier`, `destination`, `for` | `curl "$H/destinations?q=%3Cscript%3Ealert(1)%3C/script%3E"` etc.; search HTML for the raw payload | Raw `<script>alert(1)</script>` / `<img onerror>` never present | PASS | PASS |
| RED-01 | Open redirect | `//evil.example`, `/%2F%2Fevil.example`, `/\evil.example`, `/%5Cevil.example`, `/https://evil.example` | `curl -si $H/<path>` | No redirect to another origin (`//x` normalising to `/x` is fine) | PASS (after fixing a false positive in my test: it flagged a same-origin `/evil.example`) | PASS |
| SSRF-01 | SSRF | Image optimizer asked to fetch non-allow-listed targets | `curl "$H/_next/image?url=<target>&w=64&q=75"` for `https://evil.example/x.png`, `http://169.254.169.254/latest/meta-data/`, `http://localhost:3200/`, `https://images.unsplash.com.evil.example/x.png` | 400 or 404 | PASS | PASS |
| PATH-01 | Path traversal | `..%2f`, `%2e%2e/`, `..%5c`, double-encoded | `curl "$H/..%2f..%2fpackage.json"` and variants | `package.json` content never returned | PASS | PASS |
| EXP-01 | Info disclosure | Source/config/VCS/env files | `curl $H/.env /.git/config /package.json /next.config.ts /src/lib/site.ts /docs/context.md ...` (11 paths) | 404, no content | PASS | PASS |
| EXP-02 | Info disclosure | robots/sitemap | `curl $H/robots.txt` | `Disallow: /api/`; sitemap 200 | PASS | PASS |

## B. Scanner runs

| ID | Tool | Scenario | Expected | Actual | Status |
|---|---|---|---|---|---|
| SCN-01 | `npm audit --omit=dev` | Production dependency advisories | 0 | before 6 (2 low, 4 moderate) / after **0** | PASS (after) |
| SCN-02 | `npm audit` (all) | All advisories | 0 | 12 (2 low, 10 moderate), dev tooling only (F-11) | **FAIL, accepted** |
| SCN-03 | Semgrep, 95 rules (OWASP Top 10, JS, TS, React, Next.js, security-audit) | Static analysis of `src/`, `scripts/`, `next.config.ts` | 0 findings | 0 findings, 67 files | PASS |
| SCN-04 | Gitleaks `git` | Secrets in git history | none | 12 commits scanned, none found | PASS |
| SCN-05 | Gitleaks `dir` | Secrets in working tree | none | 12 hits, all in gitignored `.next/` build output (generated keys): false positives | PASS (documented) |
| SCN-06 | Trivy `fs` (vuln, secret, misconfig) | Deps, secrets, config | none | prod: 0. With dev deps: 1 MEDIUM, `minimatch` 10.2.6 CVE-2026-118764 | **FAIL, accepted** (dev only, F-11) |
| SCN-07 | OWASP ZAP baseline (passive + spider) vs fixed production build | Passive web checks | no FAIL | 61 pass, 0 fail, 7 warn, all triaged in `SECURITY_AUDIT.md` section 5 | PASS |
| SCN-08 | `tsc --noEmit`, `eslint .`, `next build` | Quality gate | clean | clean; 11 static pages generated | PASS |

## C. Real-browser checks (headless Chrome, fixed production build)

| ID | Category | Scenario | Steps | Expected | Actual | Status |
|---|---|---|---|---|---|---|
| BRW-01 | CSP regression | No page is broken by the new CSP | Load `/`, `/destinations`, `/packages`, `/about`, `/contact`, `/nope`, scroll to the bottom, listen for `securitypolicyviolation` and console CSP errors | 0 violations; pages hydrate | 0 violations on all 6; all hydrated | PASS |
| BRW-02 | CSP regression | Inline theme script still runs | Set `localStorage.theme="dark"`, reload `/` | `<html>` has class `dark` | yes | PASS |
| BRW-03 | CSP regression | Map iframe allowed by `frame-src` | Open `/contact`, scroll to map | iframe `src` is the Google embed URL, no `frame-src` violation | no violation (map *content* not verified: network may block Google) | PASS (partial) |
| BRW-04 | XSS (DOM) | Payload in URL does not execute | Open `/contact?package=<img src=x onerror=window.__pwned=1>&destination=<svg onload=window.__pwned=1>` | `window.__pwned` stays undefined | undefined | PASS |
| BRW-05 | Functional regression | Real form submission through the UI | Fill all fields, choose "Somewhere else", submit | POST `/api/enquiry` returns 200; success screen with reference | 200; success screen shown | PASS |
| BRW-06 | Functional regression | Empty submit is blocked client-side | Click submit on empty form | Error text shown, no API request | error shown, no request | PASS |
| BRW-07 | Environment | Photos | Check `/_next/image` | Known issue: 500 with `UNABLE_TO_VERIFY_LEAF_SIGNATURE` because this network's TLS inspection blocks Unsplash. Unrelated to the CSP (photos go through the same-origin optimizer). | 73 such errors in the server log, same cause as documented in `docs/context.md` | **Environment, not fixed** |

## D. Tests that could not be performed

| Area | Why |
|---|---|
| Login, session, JWT, password, RBAC, IDOR | No login exists; skipped as instructed |
| SQL/NoSQL injection against a database, file upload, LLM/prompt-injection | No database, upload or AI feature exists |
| TLS / HTTPS / HSTS behaviour | Only local HTTP available |
| Behaviour behind a CDN/reverse proxy (`X-Forwarded-For` handling) | No proxy available; reasoned about, not tested |
| ZAP active scan / fuzzing | Not run (baseline only) |
| Multi-instance / serverless rate limiting | Not testable locally |
| Other browsers (Firefox, Safari) for CSP | Only Chrome available |
| Docker, CI/CD, IaC review | None exist in the repository |
