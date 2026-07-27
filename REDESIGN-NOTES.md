# REDESIGN-NOTES — 305 Web Service (v2: productized services + NFC)

## 1. Strategy implemented

Turned the site from a broad list of technical capabilities into a **conversion-focused sales site for seven productized services**, on the approved **Monumento 305** corporate identity (navy `#071426`, electric blue `#146CFF`, turquoise `#20D7C5`, warm white `#F7F9FC`, Inter) — but rebalanced to a **warmer, paper-dominant commercial system** (light backgrounds, navy/blue accent bands, subtle cards and shadows) as the brief required, instead of the earlier navy-heavy editorial look.

- **$499 is back and above the fold** (hero badge + Website Starter featured card). Verified visible in the mobile first viewport alongside the H1 and the single primary CTA "Request a Quote".
- **7 productized offers**, each with problem / ideal customer / outcome / deliverables / price state / one specific CTA: Website Starter ($499), Business Website, Online Store, Custom Business Software, Automation & Integrations, IT Infrastructure & Support, and **NFC Business Solutions** (new).
- **NFC is presented as an integrated business solution**, not a gadget: use cases, QR fallback everywhere, and an explicit "Honest by design" compliance block (compatibility honesty, consent, no review gating/incentives, no promised ratings).
- **One primary CTA colour** site-wide; package cards and service heroes carry the selected service into the quote form (`/contact?service=<id>` preselects the dropdown — verified).
- **English is the complete default**; full Spanish under `/es/*` with hreflang and an EN/ES switch. No partial translation.

## 2. Routes & files changed

**New content model**
- `src/data/offers.ts` — the 7 offers (EN+ES) with full detail (problems, whoFor, deliverables, useCases, pricingMethod, per-offer FAQ).
- `src/data/content.ts` — rewritten: nav, hero, problems, selector, whyCustom, industries, process, proof-fallback, engagement, FAQ, finalCta, footer, about, contact, privacy, NFC compliance, form services/budgets — EN+ES.

**Libraries**
- `src/lib/i18n.ts` — 12 page keys × EN/ES route map + `OFFER_PAGE`.
- `src/lib/links.ts` — `quoteLink(locale, service)` and `waQuote(locale, label)` (carry selection).
- `src/lib/analytics.ts` — platform-agnostic `trackEvent` (gtag/plausible/dataLayer, no-op if absent) + `captureAttribution` (UTM/referrer).
- `src/lib/schema.ts` — LocalBusiness/ProfessionalService, Service, BreadcrumbList, FAQPage (verified data only).

**Components**
- `components/AnalyticsListener.tsx` (delegated `[data-track]` + wa/tel/mailto events).
- `layout/Header.tsx` (services dropdown + WhatsApp icon + Request-a-Quote; mobile full-screen menu with focus trap/Escape/scroll-lock), `layout/Footer.tsx` (Services/Company/Contact columns), `layout/Layout.tsx` (+AnalyticsListener).
- `sections/PackageSelector.tsx` (7 offers, Website Starter featured), `sections/HomeSections.tsx` (ProblemGrid, WhyCustom before/after, Industries, ProcessSteps, ProofExpect, Engagement, Faq accordion, FinalCta, TrustStrip).
- `pages/HomePage.tsx` (11-section home), `pages/ServicePage.tsx` (generic detail renderer + NFC compliance), `pages/ServicesPage.tsx`, `pages/IndustriesPage.tsx`, `pages/AboutPage.tsx`, `pages/ProcessPage.tsx`, `pages/PrivacyPage.tsx`, `pages/ContactPage.tsx` (7 services + carry + UTM + honest states), `pages/PageHero.tsx`.
- `ui/Button.tsx` (adds `track`/`trackData`, ghost variant), `ui/SectionHeading.tsx`, `app.css` (cards, badges, AA blue tokens), `tailwind.config.js` (identity tokens).
- Removed orphans: `sections/WhatWeBuild.tsx`, `sections/ServiceAccordion.tsx`.

**Routes** — EN: `/`, `/services`, `/website-packages`, `/custom-software`, `/automation-integrations`, `/it-infrastructure`, `/nfc-business-solutions`, `/industries`, `/process`, `/about`, `/contact`, `/privacy`, 404. ES equivalents under `/es/*`. Legacy 301s updated (`/web-design`→`/website-packages`, `/precios`→`/es/paquetes-web`, `/projects`→`/services`, etc.).

## 3. Final package & CTA structure

| Offer | Price state | Primary CTA | Detail page |
|---|---|---|---|
| Website Starter | Starting at $499 | Start My Website | /website-packages |
| Business Website | Custom Quote | Request a Website Quote | /website-packages |
| Online Store | Custom Quote | Plan My Online Store | /website-packages |
| Custom Business Software | Scoped Proposal | Discuss My Software Idea | /custom-software |
| Automation & Integrations | Scoped Proposal | Find What We Can Automate | /automation-integrations |
| IT Infrastructure & Support | Assessment Required | Request an IT Assessment | /it-infrastructure |
| NFC Business Solutions | Custom Quote | Explore NFC Solutions | /nfc-business-solutions |

Site-wide primary CTA: **Request a Quote**. Secondary: **Chat on WhatsApp**. Every package/hero CTA passes `?service=<id>` into the form.

## 4. Business facts still requiring confirmation

- **NFC pricing** — kept as **Custom Quote** everywhere; no material/printing/shipping/subscription fees invented. Add real packages/prices once production costs are confirmed.
- **Verified proof** — no real testimonials, logos, metrics or awards available, so the "What you can expect" fallback is used (per brief). Swap in real proof (with permission) when available.
- **Public email** — using `305webservice@gmail.com`. If you prefer `info@305webservice.com`, set `VITE_CONTACT_EMAIL` in Vercel.
- **Postal address** — not published, so omitted from schema (LocalBusiness uses locality Miami, FL only).
- **"$499"** — provided and displayed per brief; hosting/domain/maintenance explicitly excluded and quoted separately (stated in FAQ and Website Starter copy).

## 5. Integrations connected / pending

- **Quote form → MongoDB** (`saveLead`, collection `305-web-service.leads`), conserved. Honeypot + native/server validation + honest error (never simulates success; verified without `MONGODB_URI`). Carries service + budget + UTM/referrer.
- **Analytics — pending platform.** Events are wired via `src/lib/analytics.ts` + `AnalyticsListener` and no-op until GA4/Plausible/GTM is added. Documented in `.env.example`. No personal data sent to analytics.
- **WhatsApp / phone / email** — live links with prefilled, locale-aware messages.

## 6. Tests & build results

- `npm run typecheck` — clean.
- `NITRO_PRESET=node-server npm run build` — OK (Vercel preset intact for deploy).
- No unit test suite exists (never did) — verification = CDP browser QA.
- Routes: all 12 EN + 12 ES return 200; 404 returns 404; legacy 301s verified.
- Package carry, empty-submit block (6 invalid fields), honest server error — verified.

## 7. Accessibility & performance

- **Lighthouse (mobile, home, production build): Performance 96, Accessibility 96, Best Practices 100, SEO 100.** LCP 2.27 s · CLS 0.016 — all brief targets met (Perf ≥90, A11y ≥95, BP ≥95, SEO ≥95, LCP <2.5s, CLS <0.1).
- **0 px horizontal overflow** at 320 / 375 / 768 / 1024 / 1440 on home, website-packages, NFC, services, contact and `/es`.
- Mobile menu: opens, locks scroll, Escape closes, focus trapped — verified.
- Contrast: introduced AA blue tokens (`--blue-ink` for small blue text on light, `--blue-on-navy` for the "305" wordmark on navy) and fixed badges. **One remaining Lighthouse contrast flag** is the giant decorative "305" background numeral (`aria-hidden`, invisible to assistive tech). Raising its contrast would destroy the intended subtle texture and helps no AT user, so it's left as-is; Accessibility is 96 (≥95 target).

## 8. Recommended next experiment after launch

Connect GA4 (or Plausible) and run a **hero A/B test**: current outcome headline + "$499 badge" vs a variant that leads the H1 with the price ("Professional websites from $499 — plus custom software, automation & NFC"). Measure `hero_cta_primary` → `form_submit_success` conversion and `package_cta_click` distribution to see whether leading with price or leading with breadth converts the target small-business visitor better.

## Run

```bash
npm run dev            # dev (we used --port 3007)
npm run typecheck
npm run build          # Vercel preset (deploy)
NITRO_PRESET=node-server npm run build && node .output/server/index.mjs   # prod local
```

## Screenshots

`qa-screenshots/redesign-*.png` — home (desktop + mobile fold), website-packages, NFC, contact, `/es` home; `lighthouse-redesign.json`.

*(No commit or push yet — pending authorization.)*
