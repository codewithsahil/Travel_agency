# Onceagain — travel agency website

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Motion · lucide-react.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

- Design system: [design-system.md](design-system.md)
- Brand, contact details, offer banner: `src/lib/site.ts`
- Destinations, packages, tiers, FAQs, reviews, team: `src/lib/data.ts`
- Photos (Unsplash ids): `src/lib/images.ts` and `src/lib/data.ts`
- Enquiry form posts to `src/app/api/enquiry/route.ts` (add your email/CRM call where marked TODO)
- Security: audit in [SECURITY_AUDIT.md](SECURITY_AUDIT.md), tests in [SECURITY_TEST_CASES.md](SECURITY_TEST_CASES.md), open risks and launch checklist in [SECURITY_RECOMMENDATIONS.md](SECURITY_RECOMMENDATIONS.md). Re-run the checks with `npm run test:security -- http://localhost:3201` against a `next start` server.
- Optional env vars: `NEXT_PUBLIC_SITE_URL`, `ENQUIRY_RATE_LIMIT_MAX` (default 8), `ENQUIRY_RATE_LIMIT_WINDOW_SEC` (default 600)
