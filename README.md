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
