# Security Audit: Once Again travel website

| | |
|---|---|
| **Date** | 2026-11-10 |
| **Scope** | Whole repository at commit `bd2ae89` (Next.js 16.4.5, React 19.3, Tailwind 4, TypeScript), tested locally only |
| **Method** | Read-only code review first, then scanning, black-box testing, fixes, re-testing |
| **Out of scope (by request)** | Login, sessions, JWT, passwords, RBAC, IDOR. **There is no login in this app**, so those items are *not applicable*, not "passed". |

## 1. Overall assessment

The site is a **static marketing site with one write endpoint** (`POST /api/enquiry`). It has no database, no
authentication, no file upload, no AI/LLM features, no cookies and no secrets. That removes most of the OWASP Top 10
attack surface by design. The real exposure was:

1. **No browser security headers** at all (no CSP, no clickjacking protection, no HSTS, framework version leaked).
2. **The enquiry API trusted its input**: any content type, any origin, any body size, unlimited requests, and weak field validation.
3. **A build-only CLI (`shadcn`) shipped as a runtime dependency**, dragging 6 advisories into the production tree.

All three were fixed and re-tested. **Verified result: 0 Critical, 0 High findings; 15 findings in total, 10 fixed, 5 remaining (2 Medium, 3 Low).**

> **This is not a statement that the site is "secure" or "production-ready".** The remaining items below (notably the
> forms that do not deliver anywhere yet, the `'unsafe-inline'` CSP and the in-memory rate limiter) must be handled
> before real customer data flows through the site. See `SECURITY_RECOMMENDATIONS.md`.

## 2. Findings

Severity is my judgement for *this* app, not a CVSS score.

| ID | Severity | Finding | Affected | Status |
|---|---|---|---|---|
| F-01 | Medium | No security headers: no CSP, X-Frame-Options (clickjacking), nosniff, Referrer-Policy, Permissions-Policy, HSTS | whole site (`next.config.ts`) | **Fixed** |
| F-02 | Low | `X-Powered-By: Next.js` disclosed in every response | whole site | **Fixed** |
| F-03 | Medium | `/api/enquiry` accepted `text/plain` posts from a foreign `Origin`: cross-site form spam / CSRF-style abuse; no Origin check | `src/app/api/enquiry/route.ts` | **Fixed** |
| F-04 | Medium | No request size limit: a 2 MB body was fully read and processed | same | **Fixed** |
| F-05 | Medium | No rate limiting on the enquiry endpoint (spam / resource abuse) | same | **Fixed** (in-memory; see F-12/R-3) |
| F-06 | Medium | Weak server-side validation: unbounded name/email/phone length; any string accepted as destination (`<script>`); dates not format-checked (`9999zzz` accepted); NUL/CR/LF accepted in fields (email-header injection once mail is wired); `0x5`/`1e1` accepted as traveler counts | `src/lib/enquiry.ts` | **Fixed** |
| F-07 | Low | Reference number derived from `Date.now()`: predictable, collision-prone | route.ts | **Fixed** |
| F-08 | Low | Map iframe used `no-referrer-when-downgrade`, sending the full contact-page URL (destination, dates, traveler count from the query string) to Google | `src/app/contact/page.tsx` | **Fixed** |
| F-09 | Low | `?package=&tier=&offer=` were copied into the message box with no length cap: a crafted link could pre-fill a huge or abusive message | `enquiry-form.tsx` | **Fixed** |
| F-10 | Low | `shadcn` (a CLI used only for `@import "shadcn/tailwind.css"` at build time) was in `dependencies`: 6 advisories (2 low, 4 moderate) in the production tree | `package.json` | **Fixed** (moved to `devDependencies`; `npm audit --omit=dev` = 0) |
| F-11 | Low | Dev-only tree still has 12 advisories (2 low, 10 moderate) via the `shadcn` CLI and `typescript-eslint`; Trivy: `minimatch` 10.2.6 CVE-2026-118764 (DoS on crafted globs, fixed in 11.0.1) | dev toolchain | **Unresolved**: needs major upgrades; build tools only, not shipped |
| F-12 | Medium | CSP has to allow `'unsafe-inline'` for scripts and styles (Next bootstrap scripts, theme script, Motion inline styles). This weakens XSS defence-in-depth. No XSS sink was found, so this is a hardening gap, not an exploitable bug. | `next.config.ts` | **Unresolved**: design trade-off (nonces would make every page dynamic) |
| F-13 | Medium | **Enquiry and newsletter forms deliver nowhere** (TODO stubs) but show "Your enquiry is in" / "You're on the list". Customers believe they have contacted the agency. Insecure design / integrity. | `route.ts`, `newsletter-form.tsx` | **Unresolved**: needs a product decision (email/CRM provider) |
| F-15 | Low | No CAPTCHA / bot challenge on the enquiry form | enquiry form | **Unresolved** (recommendation) |
| F-16 | Low | No CI pipeline, no automated dependency or secret scanning, no Dependabot/Renovate | repo | **Unresolved** (recommendation) |

(F-14 was merged into F-05: the rate limiter is per-process and trusts the last `X-Forwarded-For` entry.)

**Totals: 15 findings. Critical 0, High 0, Medium 7, Low 8. Fixed 10 (Medium 5, Low 5). Remaining 5 (Medium 2, Low 3).**

## 3. What was changed

| File | Change |
|---|---|
| `next.config.ts` | `poweredByHeader: false`; security headers on every route (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP, HSTS). Dev-only `'unsafe-eval'`/`ws:` are added only when `NODE_ENV=development`. |
| `src/app/api/enquiry/route.ts` | Same-site check (Origin + `Sec-Fetch-Site`), JSON-only (415), 8 KB streaming body cap (413), per-IP rate limit (429 + `Retry-After`), body must be a JSON object, field allow-list (mass-assignment safe), `Cache-Control: no-store`, random reference, guidance for the future email step. |
| `src/lib/enquiry.ts` | Length caps, destination allow-list, real-date check (max 3 years ahead), control-character rejection, strict traveler count. Shared with the form, so the UI shows the same messages. |
| `src/lib/rate-limit.ts` (new) | Small fixed-window limiter, bounded memory. |
| `src/app/contact/page.tsx` | Map iframe `referrerPolicy="strict-origin-when-cross-origin"`. |
| `src/components/sections/enquiry-form.tsx` | URL-prefilled text capped at 80 characters per field. |
| `package.json`, `package-lock.json` | `shadcn` moved to `devDependencies`. Lockfile diff verified: 0 packages added/removed, 228 `dev` flags flipped. |
| `scripts/security-check.mjs` (new), `package.json` | `npm run test:security`: 47 black-box regression checks. |

Nothing in the UI, pages, data, or styling was changed. Configuration knobs (optional):
`ENQUIRY_RATE_LIMIT_MAX` (default 8) and `ENQUIRY_RATE_LIMIT_WINDOW_SEC` (default 600).

## 4. Coverage by category

| Area | Result |
|---|---|
| Authentication, sessions, JWT, passwords, RBAC, IDOR, password reset | **N/A: no login exists** (skipped as instructed) |
| Injection (SQL/NoSQL/command) | No database, no shell calls, no `eval`. Injection-shaped input is rejected or treated as plain text (tests VAL-20/21). Verified. |
| XSS | No `innerHTML`; the only `dangerouslySetInnerHTML` are the static theme script and static JSON-LD. URL parameters are rendered through React (escaped). Verified in server HTML and in a real browser (payload did not execute). |
| CSRF / CORS | No cookies or sessions. No CORS headers are sent. Cross-site posts are now rejected. Verified. |
| Open redirect | No redirect code uses user input; `//evil.example` style paths stay on-origin. Verified. |
| SSRF | No server-side fetch of user URLs. The image optimizer only allows two Unsplash hosts; evil hosts, `169.254.169.254` and localhost were refused. Verified. |
| Path traversal / file exposure | 11 sensitive paths and 5 traversal variants all 404. Verified. |
| File upload | None exists. N/A |
| Database | None exists. N/A |
| AI / LLM / agents / RAG | None in the app (no AI SDK in dependencies). N/A |
| Secrets | Gitleaks: 12 commits clean. Trivy secret scan clean. No `.env` files; `.env*` and `*.pem` are gitignored. 12 Gitleaks hits in the working tree are all in the gitignored `.next/` build folder (Next's auto-generated preview/server-action keys): false positives. |
| Supply chain | Lockfile: all 613 packages from `registry.npmjs.org` with integrity hashes (6 bundled WASM sub-packages have no hash; present before this audit). `npm audit --omit=dev` = 0. See F-11. |
| Logging & monitoring | The app logs nothing (good for privacy, but there is no alerting either). See recommendations. |
| Docker, CI/CD, IaC | None in the repo, nothing to review (F-16). |
| TLS / HTTPS | **Could not be tested**: only local HTTP was available. HSTS is configured and only takes effect over HTTPS. |
| OWASP Top 10 (2025 categories) | Broken Access Control: N/A (no protected resources). Misconfiguration: F-01/F-02 fixed. Supply chain: F-10 fixed, F-11/F-16 open. Cryptographic failures: no crypto used; no data stored. Injection: verified. Insecure design: F-13 open. Authentication failures: N/A. Integrity: lockfile + integrity hashes OK. Logging: recommendation. Exceptional conditions: error responses verified to leak nothing (ERR-01). |

## 5. Tools executed

| Tool | Scope | Result |
|---|---|---|
| `npm audit` | all deps / prod only | before: 12 (prod 6); after: prod **0**, dev 12 (accepted, F-11) |
| Semgrep (Docker image `semgrep/semgrep:latest`, 95 community rules: OWASP Top 10, JS, TS, React, Next.js, security-audit) | `src/`, `scripts/`, `next.config.ts` incl. new files | **0 findings** |
| Gitleaks | full git history (12 commits) + working tree | history **clean**; tree: 12 false positives in `.next/` |
| Trivy (vuln, secret, misconfig) | repo filesystem, with and without dev deps | prod 0; dev: 1 MEDIUM (`minimatch`, F-11) |
| OWASP ZAP baseline (passive + spider) | fixed production build on localhost | **61 pass, 0 fail, 7 warnings** (triaged below) |
| `scripts/security-check.mjs` (custom) | original vs fixed code | before **21/47**, after **47/47** |
| Headless Chrome (Playwright) | all pages, CSP violations, real form submit, XSS probe | 0 CSP violations, form works |
| `tsc --noEmit`, `eslint .`, `next build` | whole project | all clean |

**Not performed:** ZAP *active* scan or fuzzing (baseline only), TLS/HTTPS scan, any test against a deployed or staging environment,
load/DoS testing of the rate limiter beyond the functional test, penetration testing of third-party services (Google Maps, Unsplash, WhatsApp).

### ZAP baseline warnings, triaged

| ZAP warning | Verdict |
|---|---|
| CSP: script-src unsafe-inline | Real, accepted: F-12 |
| Cross-Origin-Embedder-Policy missing | Not applicable: COEP `require-corp` would break the Google map embed and brings no benefit for a site that does not need cross-origin isolation |
| Sensitive information in URL | False positive: ZAP's own spider injected `email=zaproxy@example.com`; the app never puts email in URLs. (Trip destination/dates/traveler count do appear in the search URL; low sensitivity.) |
| Non-storable content | Informational: pages are `s-maxage=31536000`, static chunks are `immutable`; no regression |
| Content-Type missing / Application error disclosure | Caused by `/_next/image` returning a bare `500 Internal Server Error` because this machine's network blocks Unsplash (TLS inspection). The body is only the generic text; nothing is disclosed |
| Timestamp disclosure (Unix) | False positive: numeric values in static HTML (e.g. the offer end date) |

## 6. Verified vs. unverified

**Verified by a test I ran:** every "Fixed" item above (see `SECURITY_TEST_CASES.md`), headers on all routes, no CSP violations on the 5 pages + 404 in Chrome, successful real form submission after the changes, production build.

**Not verified:** behaviour behind a real proxy/CDN (the `X-Forwarded-For` assumption), HTTPS/HSTS, the Google map actually rendering (this network may block it; only the absence of CSP violations was confirmed), real Unsplash photos (blocked here), other browsers than Chrome, multi-instance rate limiting.

## 7. Known limitations of the fixes

- **Rate limiter** is per-process and keyed by the last `X-Forwarded-For` entry (the one a trusted proxy appends). Without a proxy all clients share one bucket; with a multi-proxy chain it may over-limit. On serverless or several instances each instance counts separately.
- **CSP** keeps `'unsafe-inline'` (F-12).
- **Origin check** is defence in depth; the main CSRF protection is requiring `application/json`, which browsers cannot send cross-site without a CORS preflight that the server never approves.
- **`npm audit fix --force` was deliberately not run**: it proposes a *downgrade* of `shadcn` to 1.0.0 and would break the build.
