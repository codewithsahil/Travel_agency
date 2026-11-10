# Onceagain — Project Context (attach this to a new chat)

> Purpose: lets a fresh Claude session continue this project without re-discovering anything.
> Last updated: 2026-11-10. Repo: https://github.com/codewithsahil/Travel_agency (branch `main`, in sync at last check).
> Project folder: `D:\O11\p3- project trv` (Windows 10, Git Bash + PowerShell). The folder name is not a valid npm name, which is why the app was scaffolded elsewhere and moved in.

---

## 1. What this is

A complete travel-agency website for **Onceagain** (the user said "for now agency name will be Onceagain", so the name may change, and it lives in `src/lib/site.ts`).

- **Audience:** couples, families, young travelers booking holidays online.
- **Feel:** bright, clean, modern, large travel photos. Inspiring, trustworthy, easy to use.
- **Pages:** Home, Destinations, Packages/Pricing, About, Contact.
- **Status:** all 5 pages built, committed (11 commits) and pushed. `npm run build`, `tsc --noEmit` and `eslint .` were clean at the last check.

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

`next.config.ts`: images `remotePatterns`, AVIF/WebP, `experimental.optimizePackageImports: ["lucide-react","motion"]`, and the `turbopack.rules` entry for `@tailwindcss/turbopack` (scaffold default). The scaffold's `cacheComponents` / `partialPrefetching` were deliberately **removed** (not useful for a static marketing site; avoids `Date.now()` prerender restrictions).

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
docs/context.md               this file
src/app/
  layout.tsx                  fonts, theme script, metadata base, JSON-LD (TravelAgency), skip link, Providers, Navbar, Footer, WhatsApp button
  page.tsx                    Home
  destinations|packages|about|contact/page.tsx
  api/enquiry/route.ts        POST, server-side validation, returns {ok, ref}; TODO: send email/CRM
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
  seo.ts      pageMetadata() helper     enquiry.ts   shared validation (client + API)     utils.ts   cn()
```

**Where to edit what:** brand/contact/offer → `site.ts` · content → `data.ts` · photo IDs → `data.ts` + `images.ts` · colors → `globals.css` · page copy → the page / section files.

## 6. Behavior notes

- **Hero:** crossfading 4-slide slideshow (6.5 s, pause button, dots, paused under reduced motion), word-by-word h1 reveal, boarding-pass search → `/destinations?q=&depart=&return=&travelers=`.
- **Destinations:** filter pills with animated active pill (`layoutId`), `AnimatePresence popLayout` grid, reads `q`/`travelers`/`depart` from URL and carries them into "Enquire" links.
- **Packages:** Couples / Family / Solo & Friends tabs (`?for=family#slug` deep link selects the tab and scrolls), 3 tiers (middle = "Most booked"), FAQ accordion.
- **Contact:** prefill from `?destination=&package=&tier=&offer=&travelers=&depart=&return=`; blur + submit validation, focus first error, success checkmark animation, reference number `ONC-xxxxxx`.
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

## 8. Environment problems (important)

- **Unsplash is blocked on this network.** A Sophos TLS-inspection appliance presents a CA that Node/curl/Chrome don't trust (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`, `SEC_E_UNTRUSTED_ROOT`). Consequences: no real photo has ever been seen by Claude; the **Unsplash photo IDs were written from memory and are UNVERIFIED** (some may be wrong/mislabeled); all layouts were tested with the built-in fallbacks (`Photo` → ocean-gradient placeholder; `Avatar` → initials). **Do not disable TLS verification.** Fix on the user's side: `set NODE_EXTRA_CA_CERTS=<path to Sophos root CA .pem>` before `npm run dev`, or use an unfiltered network, then verify every image.
- **Port 3000 on `localhost` is taken** by another project (`D:\O11\p2 - reserch`, node via tsx, bound to 127.0.0.1/::1). Use another port, e.g. `npx next start -p 3200` (after `npm run build`) or `npm run dev -- -p 3200`. Leftover Next processes from earlier sessions may still be on ports 3000 (0.0.0.0) and 3100 and 3200; Claude's attempt to `taskkill` one was denied by the permission classifier, so ask the user to close them.
- A sandbox classifier may deny process-killing commands.

## 9. How it was tested (scripts were temporary, in the session scratchpad, not in the repo)

- Playwright-core + system Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`), headless: full-page screenshots at 1440/768/390 (scroll through the page first to trigger scroll-reveal), overflow-X check (0 everywhere), console error capture.
- Interaction suite (all passed): home search → destinations, filters (All 12 / Mountains 2 / Domestic 4), tabs, FAQ open/close, deep link, contact prefill, empty-submit errors + focus, invalid email/date errors, success state + reference, navbar solid-on-scroll, skip link first tab stop, dark-mode toggle + persistence, mobile menu open/close, reduced-motion slideshow paused.
- Production build must be used for visual testing (or dev with `allowedDevOrigins`).
- To recreate these tests, `npm i playwright-core` in a temp folder outside the repo.

## 10. Git state

11 commits on `main` pushed to origin (`f66a2c2..f321495`):
scaffold → design system → content layer → animated primitives → layout shell → home → destinations → packages → about → contact → favicon.
The user asked for commits to be **backdated** to "increase commits"; Claude **declined** (it would misreport when work happened). Real timestamps only. Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Git user: `codewithsahil`. Pushing was explicitly authorized for that batch only; ask before pushing again.

## 11. What's left (TODO, in priority order)

1. **Verify real photos** (see §8), fix wrong Unsplash IDs, check crops and text legibility over overlays, view hero slideshow and hover effects with real images, and re-do the visual design review.
2. **Replace placeholder content** in `site.ts` / `data.ts`: phone, WhatsApp, email, address, hours, social URLs, team, testimonials, partners, "3,200+ reviews", "4.9", "10,000+ travelers", year-end offer copy/date. Confirm India/₹ assumption and the agency name.
3. **Wire the enquiry form** (`src/app/api/enquiry/route.ts` TODO: Resend/SendGrid/CRM) and the **newsletter form** (`newsletter-form.tsx`, no backend).
4. Set `NEXT_PUBLIC_SITE_URL` (sitemap/canonical/OG currently use `https://onceagain.example`); deploy (Vercel).
5. Run Lighthouse and an automated a11y audit (axe); view tablet (768 px) screenshots closely; test the Google Map iframe (may be blocked on this network).
6. Optional: `.gitattributes` (`* text=auto`), lazy-load `BlurText`, add package/destination detail pages (currently "View Details" deep-links to `/packages?for=…#slug`), real OG images, CI.
7. Individual intermediate commits were not build-tested (only the final tree).

## 12. Instructions for the next Claude session

- Read `AGENTS.md` and relevant `node_modules/next/dist/docs/` pages before Next-specific code.
- Read `design-system.md` and follow it; use `ui-ux-pro-max` search CLI for design decisions and `frontend-design` rules to stay non-generic.
- After editing: `npx tsc --noEmit && npx eslint .`, then `npm run build`. Test visually from a production build.
- Keep the user informed in short step updates; the user likes brief "what I did, then continue" status messages.
- Do not fabricate: no fake dates in git history, no disabling TLS checks, mark placeholder data as placeholder.
- Pronouns: the user's pronouns are unknown. Use they/them.
