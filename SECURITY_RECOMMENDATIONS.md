# Security Recommendations

Companion to `SECURITY_AUDIT.md`. Priorities: **P1** before real customer data flows, **P2** before launch, **P3** ongoing.

## 1. Remaining risks

| # | Risk | Severity | Why it is still open |
|---|---|---|---|
| R-1 (F-13) | **Enquiry and newsletter forms deliver nowhere** but tell the visitor it worked | Medium | Needs a decision on the email/CRM provider |
| R-2 (F-12) | CSP allows `'unsafe-inline'` scripts and styles | Medium | Strict CSP needs nonces (all pages become dynamic) or experimental SRI |
| R-3 (F-05) | Rate limiter is per-process, keyed on `X-Forwarded-For` | Low-Medium | Needs a shared store or edge/WAF rule; depends on hosting |
| R-4 (F-15) | No bot protection on the enquiry form | Low | Needs a provider account (Turnstile / reCAPTCHA / hCaptcha) |
| R-5 (F-11) | Dev-toolchain advisories (`minimatch` DoS and others via the `shadcn` CLI and `typescript-eslint`) | Low | Fix needs major upgrades; build tooling only, not shipped |
| R-6 (F-16) | No CI, no automated dependency/secret scanning | Low | Repo has no pipeline yet |
| R-7 | Untested: HTTPS/HSTS, proxy header handling, Google Maps rendering, non-Chrome browsers | n/a | Not possible locally |

## 2. Recommended improvements

### P1: when you wire up the enquiry form (R-1)

1. Send the enquiry to a real destination (Resend, SendGrid, HubSpot...) **from `src/app/api/enquiry/route.ts`** and return success only if that call succeeded; otherwise return an error so the form shows "We couldn't send that".
2. **HTML-escape every field** before placing it in an HTML email. Never put user input into email headers (subject, to, reply-to) without stripping CR/LF (the validator already rejects control characters, keep that).
3. Keep provider API keys in **server-only environment variables** (no `NEXT_PUBLIC_` prefix) and never log request bodies: they are personal data (name, email, phone, dates).
4. Send the visitor an acknowledgement only to the address they typed, and rate-limit that path (it can be abused to send mail to third parties).
5. Wire the newsletter form the same way: **server-side** validation (it currently validates only in the browser, with no length cap), double opt-in, unsubscribe link.
6. Decide how long enquiries are kept and mention it in a privacy policy (India's DPDP Act applies to collecting personal data of Indian residents; take legal advice).
7. The reference number (`ONC-XXXXXX`) is random but only 6 hex characters and is **not a secret**: never use it alone to look up someone's data.

### P2: before launch

- **Add a shared rate limiter** (R-3): your host's WAF rule, or Upstash/Redis. Keep the in-memory one as a fallback.
- **Add bot protection** (R-4): Cloudflare Turnstile is free and privacy-friendly. Verify the token server-side in the route.
- **Confirm `X-Forwarded-For` behaviour** on your host (Vercel overwrites it; nginx appends; multi-proxy chains differ). Adjust `clientKey()` in `route.ts` if needed.
- **Set `NEXT_PUBLIC_SITE_URL`** to the real https URL (it feeds canonical links, sitemap, Open Graph, and the CSRF Origin allow-list).
- Replace placeholder contact data in `src/lib/site.ts` and decide whether `hello@onceagain.example` is final.
- Test the **map iframe** and the **real photos** on an unfiltered network (this machine's network blocks both).
- Add `sandbox="allow-scripts allow-same-origin allow-popups"` to the map iframe *after* confirming the map still renders (not done here because it could not be tested).

### P3: ongoing

- Enable **Dependabot or Renovate** and a weekly `npm audit --omit=dev`.
- Add a CI workflow that runs: `npx tsc --noEmit`, `npx eslint .`, `npm run build`, `npm audit --omit=dev --audit-level=high`, Gitleaks and `npm run test:security` against a `next start` instance. Pin GitHub Actions to commit SHAs and give the workflow token `contents: read` only.
- Tighten the CSP (R-2): move to nonces via `proxy.ts` (see `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`) **or** enable `experimental.sri`. Trade-off: nonces make every page render per request and disable CDN caching of pages.
- Add a CSP `report-to`/`report-uri` endpoint (or a service) so violations are visible.
- Re-run Semgrep and an **active** ZAP scan against a staging deployment (this audit ran the passive baseline only).
- When the dev-toolchain advisories (R-5) get a non-breaking fix, update; otherwise revisit at each Next/shadcn major upgrade. Do **not** run `npm audit fix --force`: it currently suggests downgrading `shadcn`.
- Treat the files in `.agents/skills/` (and `skills-lock.json`) as part of your supply chain: they are instructions that AI coding agents follow. Review them like code and only update them from sources you trust.

## 3. Production deployment checklist

Tick every box on the **deployed** site, not on localhost.

**Transport**
- [ ] Site served only over HTTPS; HTTP redirects to HTTPS.
- [ ] TLS 1.2+ only; certificate auto-renews. Check at ssllabs.com/ssltest (target A or better).
- [ ] `Strict-Transport-Security` visible in the response (`curl -sI https://yourdomain/`). Add `includeSubDomains`/`preload` only when every subdomain is HTTPS.

**Headers and browser protections**
- [ ] `curl -sI https://yourdomain/` shows CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and **no** `X-Powered-By`.
- [ ] Browser console on all five pages shows no CSP violations.
- [ ] `npm run test:security -- https://yourdomain` passes (use a staging domain; run the `--rate-limit` mode only on staging).

**Secrets and configuration**
- [ ] No secrets in the repo; `.env*` stays gitignored; real values live in the host's secret store.
- [ ] Only the public site URL uses `NEXT_PUBLIC_`; every provider key is server-only.
- [ ] `NODE_ENV=production`; the dev server is never exposed publicly (`next dev` opens extra endpoints and relaxes the CSP).
- [ ] Source maps are not published (Next's default; do not enable `productionBrowserSourceMaps`).
- [ ] `.next/` build output is not committed (it contains generated keys; Gitleaks flags them).

**API and abuse protection**
- [ ] Enquiry endpoint actually delivers (P1 list above) and fails loudly when delivery fails.
- [ ] Shared rate limit or WAF rule in front of `/api/enquiry`; bot challenge enabled.
- [ ] Request logs do not contain form contents; log retention is defined.
- [ ] Alerting on a spike of 4xx/5xx or 429 responses on `/api/enquiry`.

**Dependencies and process**
- [ ] `npm audit --omit=dev` shows 0 vulnerabilities; lockfile committed; `npm ci` used in CI/deploy.
- [ ] Dependabot/Renovate on; CI pipeline from P3 is green.
- [ ] Branch protection on `main`; 2FA on the GitHub and hosting accounts; deploy tokens scoped and rotated.

**Third parties**
- [ ] Google Maps embed, Unsplash images and WhatsApp links verified on the live site.
- [ ] Privacy policy and cookie/consent notice added if you add analytics or marketing scripts. Any new third-party script must be added to the CSP deliberately.

## 4. Long-term recommendations

1. **Keep the attack surface small.** The best property of this site is that it stores nothing. If you add accounts, payments, or a database later, repeat this audit: authentication, authorization (including per-user ownership checks), session cookies (`HttpOnly`, `Secure`, `SameSite`), password hashing (Argon2id), parameterized queries, and audit logging all become in scope.
2. **Never store card data yourself**; use a hosted payment page (Razorpay, Stripe Checkout) so card numbers never touch your server.
3. **Self-host or pin** any third-party script/font you add, and use Subresource Integrity for anything loaded from a CDN.
4. **Add an incident contact**: a `/.well-known/security.txt` and an email address people can report issues to.
5. **Repeat the audit** after each major feature, each Next.js major upgrade, and at least once a year. Re-run `npm run test:security` after every change to `next.config.ts` or the API route.
6. Keep the **tests as the source of truth**: when you fix a bug or add an endpoint, add a check to `scripts/security-check.mjs` first.
