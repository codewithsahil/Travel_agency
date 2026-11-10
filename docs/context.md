# Once Again — Project Context (attach this to a new chat)

> Purpose: lets a fresh Claude session continue this project without re-discovering anything.
> Last updated: 2026-11-10 (after the security audit, brand-name change and `SECURITY_TODO.md`). Repo: https://github.com/codewithsahil/Travel_agency (branch `main`, in sync at last check).
> Project folder: `D:\O11\p3- project trv` (Windows 10, Git Bash + PowerShell). The folder name is not a valid npm name, which is why the app was scaffolded elsewhere and moved in.

---

## 1. What this is

A complete travel-agency website for **Once Again** (the user said "for now agency name will be Onceagain"; on 2026-11-10 they asked for a **space**, so the display name is now **"Once Again"** in `src/lib/site.ts` `siteConfig.name`, the About copy, `data.ts` bios and the stats `aria-label`. Email/domain placeholders stay lowercase, `hello@onceagain.example`. The name may still change; it lives in `src/lib/site.ts`).

- **Audience:** couples, families, young travelers booking holidays online.
- **Feel:** bright, clean, modern, large travel photos. Inspiring, trustworthy, easy to use.
- **Pages:** Home, Destinations, Packages/Pricing, About, Contact.
- **Status:** all 5 pages built, committed (16 commits) and pushed. `npm run build`, `tsc --noEmit` and `eslint .` were clean at the last check. A security audit was done and its fixes pushed (see §10). **There is no login, database, cookie, upload or AI feature**: the only write endpoint is `POST /api/enquiry`, and it does not deliver the enquiry anywhere yet (TODO).

The original brief had steps A (setup), B (design system), C (build pages), D (quality check). All four were executed.

## 2. Stack (exact versions matter: this is NOT the Next.js you know)

| Tech | Version / note |
|---|---|
| Next.js | **16.4.5**, App Router, Turbopack, `src/` dir. `AGENTS.md` in the repo root says to read `node_modules/next/dist/docs/` before writing Next code because APIs differ from older versions. |
| React | 19.3.0 (React Compiler lint rules are active: `react-hooks/set-state-in-effect`, `react-hooks/refs`) |
| Tailwind CSS | v4 (CSS-first: tokens live in `src/app/globals.css` under `@theme inline`; no tailwind.config) |
| shadcn/ui | style `base-nova`, built on **Base UI** (`@base-ui/react`), NOT Radix. Component APIs differ (e.g. `data-active`, `data-open`, `aria-expanded` selectors). |
| Motion | `motion` v14 → import from `"motion/react"` |
| Icons | `lucide-react` v1.x: **brand icons (Instagram, Facebook, Twitter, Youtube) were removed**. Social icons are hand-drawn SVGs in `src/components/icons/social.tsx`. |
| Fonts | `next/font/google`: **Fraunces** (display, variable axes SOFT + opsz) → `--font-fraunces`; **Figtree** (body) → `--font-figtree` |
| Images | `next/image` + Unsplash (`images.unsplash.com`, `plus.unsplash.com` allowed in `next.config.ts`) |

`next.config.ts`: images `remotePatterns`, AVIF/WebP, `experimental.optimizePackageImports: ["lucide-react","motion"]`, the `turbopack.rules` entry for `@tailwindcss/turbopack` (scaffold default), **`poweredByHeader: false` and a `headers()` block with the security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP, HSTS)**. `shadcn` is now in `devDependencies` (it is only a build-time CLI + `@import "shadcn/tailwind.css"`). The scaffold's `cacheComponents` / `partialPrefetching` were deliberately **removed** (not useful for a static marketing site; avoids `Date.now()` prerender restrictions).

## 3. Skills used (and what to do with them)

The user said three skills were "already installed": `frontend-design`, `animated-component-libraries`, `ui-ux-pro-max`. They also asked for "Vercel React best practices" and "web interface guidelines" skills.

| Skill | Found? | Location / how it was used |
|---|---|---|
| **frontend-design** | Yes | `C:\Users\sahil.sharma\.claude\plugins\marketplaces\claude-plugins-official\plugins\frontend-design\skills\frontend-design\SKILL.md` (also copied into the repo at `.agents/skills/frontend-design/` by create-next-app; `skills-lock.json` tracks it). Rules applied: avoid generic AI-template look, no tracked ALL-CAPS eyebrows above every heading, no `01/02/03` numbering unless the content is a real sequence (only the About timeline), no single-word accents in headlines, varied radii, one memorable element (the boarding-pass search), motion used sparingly. |
| **ui-ux-pro-max** | Yes | `C:\Users\sahil.sharma\.claude\plugins\marketplaces\ui-ux-pro-max-skill\.claude\skills\ui-ux-pro-max\` (also cached under `...\plugins\cache\ui-ux-pro-max-skill\ui-ux-pro-max\2.15.0\`). Search CLI (Python 3.12 present): `python "<that dir>/scripts/search.py" "<query>" --design-system -p "Onceagain" [--domain color\|typography\|style\|landing\|ux] [--stack nextjs\|shadcn\|react]`. Results used: product palette "Travel/Tourism Agency", style Aurora UI (toned down), landing pattern "Hero + Testimonials + CTA", nextjs image guidance. Its typography design-system result (Noto Sans Thai) was off-topic and rejected. Details in `design-system.md` §2. Newer plugin skills are also listed in-session as `ui-ux-pro-max:ui-ux-pro-max`, `:ui-styling`, `:design-system`, `:brand`, `:banner-design`, `:slides`, `:design`. |
| **animated-component-libraries** | **No** | Not found on disk. Animated components were installed through the shadcn CLI instead (below). |
| Vercel React best practices / web interface guidelines | **No** | Not found on disk. Applied from general knowledge: `next/image` with `sizes`, `optimizePackageImports`, no barrel imports, lazy iframe, semantic landmarks, labelled form fields, `aria-*`, focus-visible, reduced-motion, `color-scheme`, tabular numerals, `text-wrap: balance`. |

### Animated component libraries (installed via shadcn CLI)
- **Magic UI** (`@magicui/...`): `shimmer-button`, `number-ticker`, `marquee` → `src/components/ui/`. `shimmer-button.tsx` was **modified** to render a real `<Link>` when `href` is passed. `marquee.tsx` was modified so duplicate copies are `aria-hidden`.
- **React Bits** (`@react-bits/BlurText-TS-TW`): `src/components/ui/blur-text.tsx` (vendored; has an `eslint-disable` header for refs/set-state-in-effect rules). Used for the hero subtitle only.
- **Aceternity UI**: its registry returned **Unauthorized (needs an API token)**. The 3D tilt card was rebuilt by hand in `src/components/tilt-card.tsx` (Motion springs, mouse only, disabled for touch/reduced motion). `components.json` already registers `@aceternity` and `@react-bits` registries.

## 4. Design system (full spec: `/design-system.md`)

Concept **"Postcard & Boarding Pass"**. Light mode is main; dark mode via toggle (class `.dark`, persisted in `localStorage.theme`, applied pre-paint by an inline script in `layout.tsx`).

Key tokens (defined in `globals.css`, exposed as Tailwind colors):
`lagoon #0EA5E9` (brand sky; use navy text on it) · `ocean #0369A1` (links) · `deep #0C4A6E` (text/headings) · `ink #082F49` (footer/overlays) · `navy #0C4A6E` (**never flips in dark mode**; use for text on white chips over photos) · `sunset #C2410C` (CTA fill, white text) / hover `#9A3412` · `sunset-soft #FB923C` (decorative only) · `palm #0F766E` (checks) · `sun #F59E0B` (stars) · `mist #F0F9FF` (alt section bg) · `sand #FFF7ED`.
Custom utilities: `.text-hero`, `.text-display`, `.ticket-notch-x` (package ticket notches), `.ticket-cut-v` (boarding-pass notches, desktop only), `.scrollbar-none`, `.bg-grain`; shadows `shadow-soft` / `shadow-lift` (via `--sh-soft`/`--sh-lift`).

## 5. Repository map

```
design-system.md              full design spec
docs/context.md               this file          docs/run-project.md   how to start/verify the app
SECURITY_AUDIT.md             findings, fixes, tools run, verified vs unverified
SECURITY_TEST_CASES.md        every test with steps, before/after results
SECURITY_RECOMMENDATIONS.md   remaining risks + production deployment checklist
SECURITY_TODO.md              working list: open items, login/auth checklist + AUTH-01..24 tests, toolbox commands
scripts/security-check.mjs    dependency-free black-box security tests (`npm run test:security -- <baseUrl>`)
src/app/
  layout.tsx                  fonts, theme script, metadata base, JSON-LD (TravelAgency), skip link, Providers, Navbar, Footer, WhatsApp button
  page.tsx                    Home
  destinations|packages|about|contact/page.tsx
  api/enquiry/route.ts        POST: same-site/Origin check, JSON-only (415), 8 KB body cap (413), per-IP rate limit (429), field allow-list, validation (422), no-store, random ref `ONC-XXXXXX`; TODO: send email/CRM
  not-found.tsx  sitemap.ts  robots.ts  globals.css  favicon.ico
src/components/
  layout/   navbar (scroll-solid + mobile menu), footer, logo, theme-toggle, newsletter-form, whatsapp-button
  sections/ hero, search-pass (boarding-pass search), stats, popular-destinations, featured-packages, why-choose-us,
            testimonials (2 marquees), countdown, offer-banner, cta-section, destinations-explorer (filters),
            packages-explorer (tabs), pricing-tiers, faq (accordion), timeline, enquiry-form
  ui/       shadcn base + Magic UI + React Bits components
  photo.tsx (next/image + fallback)  avatar.tsx  reveal.tsx  word-reveal.tsx  tilt-card.tsx  star-rating.tsx
  section-heading.tsx  page-header.tsx  destination-cards.tsx  package-cards.tsx  providers.tsx  icons/social.tsx
src/hooks/use-prefers-reduced-motion.ts   hydration-safe (useSyncExternalStore)
src/lib/
  site.ts     brand, contact, hours, nav links, formatPrice, `offer` (countdown end date)
  data.ts     destinations (12), packages (9 = 3 per audience), tiers, faqs, testimonials, team, timeline, partners, values
  images.ts   `unsplash(id,width)` + `photos` map (hero/headers/CTA ids)
  seo.ts      pageMetadata() helper     utils.ts   cn()
  enquiry.ts  shared validation (client + API): length caps, destination allow-list built from `data.ts` + "Somewhere else", real YYYY-MM-DD dates (max 3 years ahead), control-char rejection, travelers 1-20
  rate-limit.ts  in-memory fixed-window limiter (per process; see SECURITY_TODO A2)
```

**Where to edit what:** brand/contact/offer → `site.ts` · content → `data.ts` · photo IDs → `data.ts` + `images.ts` · colors → `globals.css` · page copy → the page / section files.

## 6. Behavior notes

- **Hero:** crossfading 4-slide slideshow (6.5 s, pause button, dots, paused under reduced motion), word-by-word h1 reveal, boarding-pass search → `/destinations?q=&depart=&return=&travelers=`.
- **Destinations:** filter pills with animated active pill (`layoutId`), `AnimatePresence popLayout` grid, reads `q`/`travelers`/`depart` from URL and carries them into "Enquire" links.
- **Packages:** Couples / Family / Solo & Friends tabs (`?for=family#slug` deep link selects the tab and scrolls), 3 tiers (middle = "Most booked"), FAQ accordion.
- **Contact:** prefill from `?destination=&package=&tier=&offer=&travelers=&depart=&return=` (package/tier/offer text is capped at 80 chars); blur + submit validation, focus first error, success checkmark animation, reference number `ONC-xxxxxx` (6 random hex chars). The API re-validates everything server-side with the same `validateEnquiry`. The map iframe uses `referrerPolicy="strict-origin-when-cross-origin"`.
- **Countdown:** `useSyncExternalStore` ticking each second; ends `2026-12-31T23:59:59+05:30` (`offer.endsAt`).
- **Home search currency/market assumption:** India (₹, "Domestic" = Indian destinations). Not confirmed by the user.
- Navbar is transparent over the photo hero on every page (all pages start with a photo banner), solid + blur after 24 px scroll, or always solid on unknown routes (404).

## 7. Gotchas learned (read before changing things)

1. **`cn()` / tailwind-merge:** custom font sizes `text-hero`/`text-display` are registered in `src/lib/utils.ts` via `extendTailwindMerge`; otherwise `cn("text-display text-deep")` drops the size. Add new custom text-size utilities there too.
2. **shadcn CLI re-adds a bogus `cn` npm package** and imports `from "cn"`. After any `shadcn add`, run: `grep -rl 'from "cn"' src | xargs sed -i 's#from "cn"#from "@/lib/utils"#'` and `npm rm cn`. Magic UI CLI also appends to `globals.css` (check for duplicate `@keyframes marquee`/`--animate-marquee`).
3. **Reduced motion & hydration:** never branch rendered output on motion's `useReducedMotion()` (server/client mismatch). Use `usePrefersReducedMotion` from `src/hooks`.
4. **Dark mode chips over photos:** use `text-navy`/`text-slate-600`, not `text-deep`/`text-muted-foreground` on `bg-white` chips.
5. **lucide v1** has no brand icons.
6. **Base UI components:** Tabs trigger active state is `data-active`; accordion panels use `--accordion-panel-height`.
7. **Next 16 dev server blocks `/_next` JS from non-localhost origins** unless `allowedDevOrigins` is set (this caused blank screenshots when testing via LAN IP). A temporary entry was added and then removed.
8. **Git Bash on Windows:** MSYS rewrites args starting with `/` (e.g. `PAGES=/`); long multi-heredoc commands sometimes break, so prefer the Write/Edit tools for files. Playwright scripts used `PAGES=home,about,...` for this reason.
9. Git prints LF→CRLF warnings (harmless; `.gitattributes` with `* text=auto` would silence).
10. **Editing tool quirk (cost real time):** in this Claude environment the Write tool turns a typed U+2028/U+2029 escape into a raw line-separator character (which ends a regex literal: "Unterminated regular expression"), and Bash commands lose one level of backslashes (`\\u0000` became raw NUL bytes in a file). Use Unicode property classes (`\p{Zl}\p{Zp}`) in source files and, when a shell command must write backslashes, build them with `String.fromCharCode(92)`. After such edits check the file for NUL bytes.
11. **CSP lives in `next.config.ts`.** Any new third-party origin (analytics, fonts CDN, new iframe, API host) must be added there deliberately, otherwise the browser blocks it. Dev mode adds `'unsafe-eval'` and `ws:` automatically; production does not. `script-src`/`style-src` still allow `'unsafe-inline'` (SECURITY_TODO A5).
12. **API CSRF/Origin check** allows the Origin host from `siteConfig.url` (`NEXT_PUBLIC_SITE_URL`) or the request's `Host`/`X-Forwarded-Host`. A wrong site URL behind a proxy that rewrites Host would make the form return 403.
13. **Destinations allow-list:** adding or renaming a destination in `data.ts` automatically changes what the API accepts (`enquiry.ts` builds the allow-list from it).

## 8. Environment problems (important)

- **Unsplash is blocked on this network.** A Sophos TLS-inspection appliance presents a CA that Node/curl/Chrome don't trust (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`, `SEC_E_UNTRUSTED_ROOT`). Consequences: no real photo has ever been seen by Claude; the **Unsplash photo IDs were written from memory and are UNVERIFIED** (some may be wrong/mislabeled); all layouts were tested with the built-in fallbacks (`Photo` → ocean-gradient placeholder; `Avatar` → initials). **Do not disable TLS verification.** Fix on the user's side: `set NODE_EXTRA_CA_CERTS=<path to Sophos root CA .pem>` before `npm run dev`, or use an unfiltered network, then verify every image.
- **Port 3000 on `localhost` is taken** by another project (`D:\O11\p2 - reserch`, node via tsx, bound to 127.0.0.1/::1). Use another port, e.g. `npx next start -p 3200` (after `npm run build`) or `npm run dev -- -p 3200`. Leftover Next processes from earlier sessions may still be on ports 3000 (0.0.0.0) and 3100 and 3200; Claude's attempt to `taskkill` one was denied by the permission classifier, so ask the user to close them.
- A sandbox classifier may deny process-killing commands. Stopping a Claude *background task* kills only the wrapper shell, not the Node child: find the PID with `Get-NetTCPConnection -LocalPort <p> -State Listen`, check its command line belongs to this project (`Get-CimInstance Win32_Process`), then `Stop-Process`. Only stop processes you started.
- **Docker Desktop is available.** Scanner images already pulled: `zricethezav/gitleaks`, `aquasec/trivy`, `semgrep/semgrep`, `ghcr.io/zaproxy/zaproxy:stable`. Semgrep has no native Windows build, so run it through Docker. In Git Bash use `MSYS_NO_PATHCONV=1` and a Windows-style path for `-v`.
- Port 3200 is the usual dev port; ports 3201/3202 were used (and freed) for production-build security tests.

## 9. How it was tested (scripts were temporary, in the session scratchpad, not in the repo)

- Playwright-core + system Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`), headless: full-page screenshots at 1440/768/390 (scroll through the page first to trigger scroll-reveal), overflow-X check (0 everywhere), console error capture.
- Interaction suite (all passed): home search → destinations, filters (All 12 / Mountains 2 / Domestic 4), tabs, FAQ open/close, deep link, contact prefill, empty-submit errors + focus, invalid email/date errors, success state + reference, navbar solid-on-scroll, skip link first tab stop, dark-mode toggle + persistence, mobile menu open/close, reduced-motion slideshow paused.
- Production build must be used for visual testing (or dev with `allowedDevOrigins`).
- To recreate these tests, `npm i playwright-core` in a temp folder outside the repo.
- **Security tests (2026-11-10):** `scripts/security-check.mjs` is in the repo (46 functional checks + 1 rate-limit check). Results: original code 21/47, fixed code 47/47. A temporary Playwright script (not in the repo) confirmed 0 CSP violations on all pages, a working real form submission and a non-executing XSS probe. Scanner results are in `SECURITY_AUDIT.md` §5 and `SECURITY_TEST_CASES.md` §B.

## 10. Security (audit done 2026-11-10)

Scope: whole repo, local testing only. **Login/auth/RBAC/IDOR were skipped at the user's request because there is no login**; they are marked N/A, not "passed". Full detail: `SECURITY_AUDIT.md`.

- **Result:** 15 findings (0 Critical, 0 High, 7 Medium, 8 Low); **10 fixed, 5 open**. Prod `npm audit --omit=dev` = 0. Semgrep (95 rules) 0 findings; Gitleaks history clean (its 12 working-tree hits are generated keys inside gitignored `.next/`); ZAP baseline 61 pass / 0 fail / 7 triaged warnings.
- **What was fixed:** security headers + CSP + no `X-Powered-By`; enquiry API hardening (see repo map); stricter shared validation; random reference; map referrer policy; URL-prefill cap; `shadcn` moved to devDependencies.
- **Still open (details and how-to in `SECURITY_TODO.md`):** (1) forms do not deliver anywhere yet but show success (Medium, P1); (2) CSP keeps `'unsafe-inline'` (Medium); (3) no CAPTCHA (Low); (4) dev-only advisories (`minimatch` etc. via `shadcn` CLI / `typescript-eslint`; **never run `npm audit fix --force`**, it suggests downgrading `shadcn`); (5) no CI/Dependabot (Low). The in-memory rate limiter is per process (needs a shared store or WAF rule on real hosting).
- **Not verified:** HTTPS/HSTS, behaviour behind a proxy (`X-Forwarded-For`: the limiter uses the LAST entry), Google Map content, non-Chrome browsers, ZAP active scan, anything on a deployed server.
- **Optional env vars:** `NEXT_PUBLIC_SITE_URL`, `ENQUIRY_RATE_LIMIT_MAX` (default 8), `ENQUIRY_RATE_LIMIT_WINDOW_SEC` (default 600).
- **Re-run the tests after any change to `next.config.ts`, the API route or validation:** `npm run build`, then `ENQUIRY_RATE_LIMIT_MAX=1000 npx next start -p 3201` and `npm run test:security -- http://localhost:3201`; for the limiter use a second server on 3202 without the env var and `--rate-limit`. Exit code 1 = failure.
- **When login is added:** follow `SECURITY_TODO.md` Part B (requirements checklist + AUTH-01..24 tests) and re-do the audit. Authorization must be enforced where data is read/changed, not only in `proxy.ts` (Next docs: `node_modules/next/dist/docs/01-app/02-guides/authentication.md`).

## 11. Git state

16 commits on `main`, all pushed to origin (latest `e619602`). History: scaffold → design system → content layer → animated primitives → layout shell → home → destinations → packages → about → contact → favicon → `docs: add project context and run guide` → `fix(brand): show brand name as "Once Again"` → `fix(security): harden enquiry API, add security headers and audit docs` → `docs(security): add SECURITY_TODO ...`.
The user asked for commits to be **backdated** to "increase commits"; Claude **declined** (it would misreport when work happened). Real timestamps only. Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Git user: `codewithsahil`. Do not commit or push unless the user asks; so far they have said "commit and push" explicitly for each batch.

## 12. What's left (TODO, in priority order)

Security items have their own detailed list in **`SECURITY_TODO.md`** (Part A open items, Part B login). General product items:

1. **Verify real photos** (see §8), fix wrong Unsplash IDs, check crops and text legibility over overlays, view hero slideshow and hover effects with real images, and re-do the visual design review.
2. **Replace placeholder content** in `site.ts` / `data.ts`: phone, WhatsApp, email, address, hours, social URLs, team, testimonials, partners, "3,200+ reviews", "4.9", "10,000+ travelers", year-end offer copy/date. Confirm India/₹ assumption and the agency name ("Once Again").
3. **Wire the enquiry form** (`src/app/api/enquiry/route.ts` TODO: Resend/SendGrid/CRM) and the **newsletter form** (`newsletter-form.tsx`, no backend, client-only validation). Until then the UI claims success without sending anything (SECURITY_TODO A1, P1). Escape fields in emails, never put user input in email headers, keep keys server-only.
4. Set `NEXT_PUBLIC_SITE_URL` (sitemap/canonical/OG/Origin allow-list currently use `https://onceagain.example`); deploy (Vercel) and run the live-site checks in SECURITY_TODO A4.
5. Run Lighthouse and an automated a11y audit (axe); view tablet (768 px) screenshots closely; test the Google Map iframe (may be blocked on this network).
6. Optional: `.gitattributes` (`* text=auto`), lazy-load `BlurText`, add package/destination detail pages (currently "View Details" deep-links to `/packages?for=…#slug`), real OG images, CI (also SECURITY_TODO A6).
7. Individual intermediate commits were not build-tested (only the final tree).

## 13. Instructions for the next Claude session

- Read `AGENTS.md` and relevant `node_modules/next/dist/docs/` pages before Next-specific code (headers/CSP docs: `01-app/02-guides/content-security-policy.md`, `01-app/03-api-reference/05-config/01-next-config-js/headers.md`).
- Read `design-system.md` and follow it; use `ui-ux-pro-max` search CLI for design decisions and `frontend-design` rules to stay non-generic.
- After editing: `npx tsc --noEmit && npx eslint .`, then `npm run build`. Test visually from a production build. If you touched `next.config.ts`, the API route or validation, also run `npm run test:security` (see §10).
- Do not weaken a security mechanism to make something work (for example widening the CSP to `*`, dropping the Origin/Content-Type checks, or removing the rate limit): fix the cause, or add one exact origin.
- Keep the user informed in short step updates; the user likes brief "what I did, then continue" status messages.
- Do not fabricate: no fake dates in git history, no disabling TLS checks, mark placeholder data as placeholder. Report verified vs. unverified honestly (the security docs follow this rule).
- Login is not implemented. If asked to audit, skip auth parts unless login has been added since.
- Pronouns: the user's pronouns are unknown. Use they/them.
