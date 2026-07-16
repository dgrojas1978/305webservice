# 305 Web Service — Website

Marketing site for **305 Web Service**: web design, custom software and IT
solutions for small and medium-sized businesses in Miami and across the US.

- **Stack:** SolidStart 1.x (SSR) · Tailwind CSS 3 · MongoDB (quote-form leads) · Vercel
- **Language:** US English (`lang="en-US"`). Architecture is ready for a future
  Spanish version (all copy lives in `src/data/content.ts`), but no partial
  translation or language selector ships until it's complete.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # production build (Vercel preset)
```

## Environment variables

See `.env.example`. In production set:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | **Required.** Quote-form leads are stored in the `leads` collection of the `305-web-service` DB. If missing, the form shows an error state (it never fakes success). |
| `VITE_WHATSAPP_NUMBER` | Number behind every "Chat on WhatsApp" CTA (defaults to 13058332984). |
| `VITE_CONTACT_EMAIL` | Public contact email (footer, contact page). |

## Structure

```
src/
├── routes/            # Pages: index, services, web-design, custom-software,
│                      # it-infrastructure, about, contact, privacy, [...404]
│                      # + .ts API routes that 301-redirect legacy Spanish URLs
├── components/
│   ├── layout/        # Header, Footer, Layout (skip link + landmarks)
│   ├── sections/      # HeroVisual, ServicesGrid, PlansSection, InfraDiagram,
│   │                  # ProcessSection, FinalCTA
│   ├── ui/            # Container, Button, SectionHeading
│   ├── Seo.tsx        # Title/description/canonical/OG per page
│   └── JsonLd.tsx     # Structured-data script tag
├── data/content.ts    # ALL site copy (services, plans, FAQ, form options)
├── lib/site.ts        # Site constants, env-driven WhatsApp/email, nav
└── lib/db.ts          # MongoDB lead storage
```

## Content rules

- Services only — no proprietary products or internal platforms anywhere.
- No invented metrics, testimonials, clients or certifications.
- Pricing claims limited to "Professional Websites Starting at $499";
  everything else is "custom quote".

## Assets

- `scripts/generate-og.mjs` regenerates `public/og-image.png`.
- `scripts/generate-icons.mjs` regenerates favicons from `public/icon.svg`.
- `public/sitemap.xml` is static — update `lastmod`/URLs when pages change.
