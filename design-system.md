# Onceagain — Design System

> Travel agency · couples, families and young travelers · "Go somewhere you'll want to go again."
> Generated with the **ui-ux-pro-max** skill (`--design-system`, domains: color, typography, style, landing, nextjs stack) and shaped by the **frontend-design** skill.

## 1. Concept — "Postcard & Boarding Pass"

The name *Onceagain* is about the trip you want to take a second time. The visual language borrows from
things travelers keep: **postcards, passport stamps and boarding passes**.

- **One memorable thing:** the hero search is a *boarding pass* (perforated notches, dashed divider,
  Destination / Dates / Travelers as ticket fields). Package cards reuse the same ticket perforation.
- Everything else stays quiet: big photography, white space, one display serif, one calm sans.
- Motion is spent in three places only: hero headline + slideshow, number counters, marquee. Everything else is
  hover/scroll-reveal at low intensity.

## 2. Skill search results (what the database said, and what we did with it)

| Query | Top DB match | Decision |
|---|---|---|
| Product palette (`color`) | **Travel/Tourism Agency** — Sky `#0EA5E9` + adventure orange `#EA580C` | Adopted. Orange darkened to `#C2410C` for CTA fills (white text needs ≥4.5:1). |
| Style (`--design-system`) | **Aurora UI** (light + dark supported, low cost) | Adopted *tone down*: soft sky/teal light only in the hero and CTA photo overlays, no mesh gradients as decoration. Layout borrows from **Editorial Grid / Magazine** (asymmetric grids, large imagery). |
| Landing pattern | Closest match **Hero + Testimonials + CTA** (Hero → value → social proof → CTA) | Adopted and extended with destinations, packages, stats and an offer banner. |
| Typography | DB's top editorial pair was *Playfair Display + Inter* (Classic Elegant); its design-system run returned Noto Sans Thai, which is off-topic (Thai sites) and was rejected. | Chose a warmer serif + humanist sans in the same *Serif + Sans* category: **Fraunces + Figtree**. This is a deliberate deviation from the DB row, because Playfair/Inter is the common default. |
| Avoid list | "Generic photos + Complex booking" | Photos are chosen per destination and shown large; the booking flow is a 3-field search + a short enquiry form. |

## 3. Color

Light mode is the main look (white page, sky-tinted bands). Dark mode is available via the theme toggle.

| Token | Hex | Use |
|---|---|---|
| `--lagoon` | `#0EA5E9` | Brand sky. Fills, icons, focus ring, gradients. Use **navy text** on it, never white. |
| `--ocean` | `#0369A1` | Links, outline buttons, small text accents (5.9:1 on white). |
| `--deep` | `#0C4A6E` | Primary text / headings (9.6:1 on white). |
| `--ink` | `#082F49` | Footer, dark sections, photo overlays. |
| `--sunset` | `#C2410C` | Primary CTA fill, white text (5.2:1). Hover `#9A3412`. |
| `--sunset-soft` | `#FB923C` | Decorative only (stamps, underline strokes, offer glow). Never text on white. |
| `--palm` | `#0F766E` | "Included" checks, success states (5.5:1 on white). |
| `--sun` | `#F59E0B` | Star ratings (icon only). |
| `--mist` | `#F0F9FF` | Alternating section background. |
| `--sand` | `#FFF7ED` | Warm card/tint behind orange accents. |
| `--border` | `#D6EBF7` | Hairlines, input borders. |
| `--muted-foreground` | `#475569` | Secondary text (7.6:1 on white). |
| `--destructive` | `#DC2626` | Form errors. |

Dark mode: background `#06202F`, card `#0B2D42`, text `#E6F4FB`, primary `#38BDF8` (navy text), CTA `#F97316`
(navy text), border `rgba(186,230,253,.14)`.

Contrast rules: body text ≥ 4.5:1 everywhere; white text on photos only over the `ink` gradient overlay.

## 4. Typography

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Fraunces** (variable, soft optical axes) | Weight 500–600, tight tracking `-0.02em`, line-height 1.05–1.15. Big, confident, the headline *is* the design. |
| Body / UI | **Figtree** | 400/500/600. Humanist, friendly, very legible at 16px+. |

Loaded with `next/font/google` (self-hosted, `display: swap`, subset `latin`, exposed as `--font-display` and `--font-sans`).

Scale (fluid, `clamp`): Hero `clamp(2.75rem, 7vw, 6rem)` · H2 `clamp(2rem, 4.2vw, 3.5rem)` · H3 `1.5rem` · Body `1rem/1.65` ·
Small `0.875rem`. Max line length ~65ch. No all-caps tracked eyebrows; labels are sentence case.

## 5. Layout, shape and spacing

- Container `max-w-7xl`, gutters 16px (mobile) → 32px (desktop). Section padding `py-20 md:py-28`.
- Asymmetric grids for destinations and the packages bento; photos are the layout.
- Radii are intentionally varied: pill buttons (`9999px`), photo cards `28px`, inputs `12px`, ticket cards `24px` with
  circular perforation notches. Not one radius on everything.
- Shadows are soft and blue-tinted (`rgba(8,47,73,.12)`) — never neutral grey.
- Mobile-first breakpoints: 375 / 768 / 1024 / 1440. No horizontal scroll at any width.

## 6. Components & patterns

- **Navbar** — transparent over hero, becomes `bg-white/80 backdrop-blur-xl` + hairline on scroll. Shimmer "Book Now".
- **Boarding-pass search** — three ticket fields + dashed tear line + Search button.
- **Destination card** — photo, hover zoom + 3D tilt (pointer only, disabled on touch & reduced motion), "from" price.
- **Ticket card (package)** — photo top, perforated divider, included icons (hotel, flights, meals, sightseeing), price stub.
- **Marquee** — testimonials and partner logos, pause on hover, static under reduced motion.
- **Stamp** — circular rotating-text badge used once in the hero and once on About.
- **FAQ** — accessible accordion with animated height.

Animated component sources (installed as local source, shadcn-style): Magic UI (shimmer button, number ticker,
marquee), Aceternity UI (3D card effect, text reveal), React Bits (blur/split text) — adapted to Motion + Tailwind.

## 7. Motion

| Where | What | Duration / easing |
|---|---|---|
| Hero headline | Word-by-word rise + blur-in, once on load | 700 ms, `cubic-bezier(.22,1,.36,1)`, 60 ms stagger |
| Hero background | Crossfade slideshow with slow scale | 1200 ms fade, 6 s hold |
| Sections | Fade + 16 px rise on enter viewport (once) | 500 ms |
| Cards | Image zoom 1.06 / tilt ≤ 6° | 300–400 ms |
| Buttons | Shimmer sweep, press scale .98 | 2.4 s loop (nav CTA only), 150 ms |
| Counters | Count up when visible | 1.8 s |
| Filters | Layout animation with `AnimatePresence` | 350 ms |

Rules: only `transform` and `opacity` are animated; `prefers-reduced-motion` disables parallax, tilt, marquee scrolling,
shimmer and count-up (final state renders immediately); nothing auto-plays longer than 5 s without a pause control
(slideshow has pause + dots).

## 8. Accessibility checklist

- Visible `:focus-visible` ring (2 px lagoon + 2 px offset) on every interactive element; skip-to-content link.
- Real `<nav>`, `<main>`, `<section aria-labelledby>`, one `<h1>` per page; decorative icons `aria-hidden`.
- Alt text on every image (descriptive; decorative overlays use `alt=""`).
- Touch targets ≥ 44 × 44 px; form fields have visible labels and inline errors (`aria-describedby`, `aria-invalid`).
- Never color alone for state (icons + text).

## 9. Don'ts (anti-template list)

- No cream + terracotta editorial look, no near-black + acid accent, no identical rounded-card kits.
- No tracked all-caps eyebrow above every heading, no `01 / 02 / 03` numbering except the real timeline.
- No single-word accent in headlines, no emoji as icons, no gradient washes as decoration.
