# 305 Digital Card — implementation notes (brief: claude-premium-digital-card)

Status: **implemented locally, verified, NOT deployed.** No physical NFC tag is locked
(`nfc.status: "draft"` until the destination is approved and tested live).

---

## V2 — «digital business concierge» redesign (order: claude-super-premium-redesign, 2026-07-28)

Full visual + architecture redesign per the super-premium order. Same URLs, same
functionality preserved; the experience now sells instead of informing.

**Architecture (as ordered):** single-screen hero (≤820px @390: circular 305 mark,
availability pill, editorial serif headline "Technology built to move your business
forward.", **real-project reel** crossfading Aguiar/LSF/Polkanea/Cosme — paused under
reduced-motion, progressive image mounting, Start a Project dominant + Save Contact +
quick WhatsApp/Call/Share) → trust ribbon → **project concierge** ("What are you ready
to improve?": 6 needs → recommendation + outcome + related real project + price only
where approved [$499 website only] + contextual CTA; NFC need's proof = this card
itself) → **Built for real businesses** 4:3 carousel (visible controls, snap, lazy,
focus states) → compact conversion card → premium Share-Your-Contact → collapsible
Share-this-card (profile QR + **offline vCard QR** + copy/native share + secondary
links) → sticky mobile action bar (safe-area, hides with sheet open) → desktop:
centered 620px card + sticky featured sidebar.

**Two-step LeadSheet** (bottom sheet mobile / centered dialog desktop): step 1 name +
preferred contact method (WhatsApp/call/email) + need; step 2 contact-by-method +
optional company/message + consent. Focus trap, Escape, aria-modal, scroll lock, focus
restore. Programmatic `useAction` submission (inline errors, fields preserved); no-JS
degrades to native POST (success redirect still works).

**Bugs found & fixed during QA:**
- Save Contact link was intercepted by the SPA router → vCard never downloaded. Fixed
  with `rel="external" download` on both vCard links. (This was the "falta la vcard".)
- Form submits fell into native POST (automatic action interception not firing for the
  dynamically-mounted sheet) → page reloaded and the server error was lost. Fixed with
  programmatic `useAction` + preventDefault; error-restore fallback also added.
- Hero was 862px and 12px horizontal overflow (unclipped "305" signature) → fixed.

**Benchmark elevations beyond the order** (vs Popl/Blinq/HiHello/Wave/V1CE): circular
brand identity mark (real logo asset); **offline vCard QR** ("Save contact — works
offline") — scanning adds the contact with no internet, which generic platforms don't
offer; live in-context proof ("You're using one right now" on the NFC need).

**V2 analytics names** (order §Instrumentación): `card_view` (src), `save_contact`,
`whatsapp_click`, `call_click`, `email_click`, `share_click`, `project_view` (IO 60%),
`project_visit`, `concierge_select`, `start_project`, `lead_form_start`,
`lead_form_submit`, `language_change`. UTM preserved via session first-touch.

### V3 correction — premium contact panel (order: no-website-sidebar, 2026-07-28)

Desktop right column is no longer a portfolio duplicate; it is now the utilitarian side
of a premium physical card: monogram `305` (Fraunces, ring) → name → `Websites · Custom
Software · NFC · IT Solutions` → `Miami, Florida` → aqua dot + Available for projects →
big START A PROJECT → SAVE CONTACT → WhatsApp/Call/Share small actions → discreet QR →
"Tap the NFC card or scan to connect." Panel: 390px wide, 26px radius, `#0a1728` (navy
slightly lighter), 1px low-opacity border, wide subtle shadow, no screenshots, no $499,
no long URL, no email/phone as decorative text. Grid now `[580px_390px]`.

Hero featured project refined per order: 16:9 (270px high @1440 ≤360 max), dark
gradient overlay with project name + one solution line + View Project link, discreet
prev/next + dots. Supporting copy shortened ("…—built around your business."). Mobile:
no sidebar, bar labels Start/WhatsApp/Save, hero 815px.

Validated (headless CDP, 2026-07-28): right column contains ZERO /work/ screenshots
(only the QR); no project visibly duplicated in the same viewport (reel preloads next
image at opacity 0 — not visible); desktop first viewport shows identity, headline,
copy, one controlled proof, both CTAs, quick actions and the panel QR without scroll;
overflow 0 @1440 and @390; typecheck + build clean (no lint script exists). Screenshots:
`card-v3-1440-en.png`, `card-v3-390-en.png`. Structure: **Identity → Contact → Proof →
Conversion.**

### V4 correction — minimalist reduction (order: minimalist-reduction, 2026-07-28)

Rule enforced: **one identity + one promise + one proof + one action group per viewport.**
Removed repetition without changing colors, typography, headline or brand essence.

Removed: the `305` circle monogram next to the wordmark; the giant `305` background
numeral (replaced by a page-level radial glow with no recognizable shape — the previous
hero `ambient` block also drew a visible rectangle, now gone); the entire duplicate
identity/CTA stack in the right column; the second information ribbon
(`Websites from $499 · …`) from the first viewport — price and scope now live in the
concierge section below. Copy: dropped "Premium" from the supporting line.

Right column is now a **Share Panel only** (320px): `SHARE THIS CARD` label · 158px QR ·
`Scan to connect` · `Copy link` · `NFC · QR · Direct link`. Nothing else.

Mobile order per brief (flex `order`, DOM unchanged): identity+EN/ES → availability →
headline → supporting copy → Start a Project → Save Contact → WhatsApp·Call·Share →
featured project → rest. Desktop keeps project before the action group. Share Panel is
hidden on mobile; the QR lives at the end inside the collapsible "Share this card".

Verified (headless CDP, first viewport, both 1440×900 and 390×844) — occurrences:
wordmark `305` **1** · `Web Service` **1** · `Available for projects` **1** ·
`Start a Project` **1** · `Save Contact` **1** · WhatsApp/Call/Share **1 each** ·
`$499` **0**. Giant background element: **absent**. Right panel: no `/work/` image, no
identity, no CTA, no availability; width 320px. Featured project 303px (spec 280–330).
Horizontal overflow 0. EN/ES verified. typecheck + build clean (no lint script in repo).
Screenshots: `card-v4-1440-en.png`, `card-v4-390-en.png`, `card-v4-390-es.png`.

### V5 correction — single QR + selling panel (order: final-conversion-panel-and-single-qr)

Principle: **the right panel sells; the final QR shares. Never mix the two.**

- **One QR on the entire page.** Removed the panel QR and the separate offline-vCard QR
  (asset `public/card/qr-vcard-305.svg` deleted). The single canonical QR lives in the
  final `Share this card` section: 184px module + quiet zone, black on white, decodes to
  `https://305webservice.com/nfc/305?src=qr` (production URL with campaign tracking —
  never localhost, never the `.vcf`). Share section is now always-visible (not a
  collapsible) and contains: heading · QR · "Scan to open this card" · Copy link · Share ·
  discreet "Save contact" link · secondary links.
- **Right column = Conversion Panel** (360px): `YOUR NEXT MOVE` → "Let's build what your
  business needs next." → explanation → 3 outcomes (Look more professional / Turn more
  visitors into customers / Operate with less manual work) → START A PROJECT →
  CHAT ON WHATSAPP → trust line → discreet price. No QR, no logo, no screenshot, no
  service list, no duplicated Save Contact.
- **Left column CTAs removed on desktop** (identity, promise, one real project, proof
  line only). The mid-page "compact conversion" section was deleted — the panel replaces it.
- **Mobile**: no sidebar; hero keeps Save Contact + WhatsApp + `More` (Call/Share);
  the Conversion Panel is injected after the featured project, before the needs selector;
  the QR only appears at the very end.
- **WhatsApp** now opens with the exact localized message ordered
  (`Hi 305 Web Service, I'd like to discuss a project for my business.` /
  `Hola 305 Web Service, quisiera conversar sobre un proyecto para mi negocio.`).
- **Analytics**: added `copy_link` and `qr_view` (IntersectionObserver, fires once).

Verified (headless CDP): QR elements rendered in the whole DOM = **1** (both 1440×900 and
390×844), module 184px, decoded from the final screenshot → card URL, not the vCard;
right panel has no `<img>`; panel contains eyebrow + CTA + WhatsApp + 3 outcomes + trust +
price, width 360px; desktop first viewport `Start a Project` ×1, WhatsApp ×1, QR ×0;
mobile first viewport Save Contact ×1, WhatsApp ×1, Start a Project ×0 (it lives in the
panel below the project, as ordered); overflow 0; EN/ES verified including the localized
WhatsApp href; typecheck + build clean. Screenshots: `card-v5-1440-en.png`,
`card-v5-390-en.png`, `card-v5-390-es.png`, `card-v5-390-full.png`.

Final structure: **Brand promise → Real proof → Conversion → Services → Contact exchange → Share.**

**QA results (2026-07-28, local node-server build):**
- typecheck clean; production build OK (no lint script exists in this repo — none run).
- Overflow 0px at 320/375/390/430/768/1024/1280/1440.
- Hero fits first viewport @390×844 (807px) with identity + reel + both CTAs + quick actions.
- EN/ES complete (toggle persists, `<html lang>` updates); ES written to sell.
- vCard endpoint + link verified (`text/vcard`, attachment, RFC escaping); offline
  vCard QR decodes to valid BEGIN:VCARD with correct phone.
- Sheet: step validation, method-conditional fields, honest server error inline with
  fields preserved, no fake success; scroll lock + focus trap + Escape verified.
- Sticky bar: appears when hero leaves viewport, 3 actions, flush to bottom, hides at top
  (verified in headless Edge; the in-app Browser pane can't script-scroll — env artifact).
- fullPage screenshot under `prefers-reduced-motion`: no compressed/transformed content.
- Lighthouse mobile (local): **Perf 87 · A11y 100 · BP 100 · SEO 100**, LCP 3.5s, CLS 0.037.
  The two dominant penalties are local-server artifacts (no text compression; Vercel
  serves brotli+CDN in production) plus render-blocking global CSS. Perf ≥90 is expected
  but NOT yet verified in production — measure after deploy before calling the target met.
- Screenshots: `qa-screenshots/card-v2-*.png` (390 hero EN/ES, mid, sheet, 1440, fullpage).

## 1. Competitive rationale (why this beats a Popl/Blinq-style profile)

Platform cards share a contact; this card **sells**: it proves capability (4 real live
projects), identifies the visitor's need (service selector), and starts the sale
(quote CTA + $499 hook + optional contact exchange) — all in one no-app, no-signup,
no-popup page on 305's own domain with 305's own identity (no platform branding, no
per-seat SaaS fee, no lock-in). Weaknesses deliberately avoided: no icon walls, no
equal-weight button lists (5-action dock max, Save Contact visually primary), no
forced exchange, no fake Wallet buttons, no invented people.

## 2. What was built

| Piece | File |
|---|---|
| Profile system (brand/person/company/conversion/nfc separated) | `src/data/card.ts` |
| Card experience (9 sections per brief §15) | `src/components/card/DigitalCard.tsx` |
| Canonical route | `src/routes/card/[slug].tsx` → `/card/305` |
| vCard 3.0 endpoint | `src/routes/card/[slug]/vcard.ts` → `/card/305/vcard` |
| NFC short-URL redirect | `src/routes/nfc/[slug].ts` → `/nfc/305` |
| QR asset (navy, ECC-H) | `public/card/qr-305.svg` → `/nfc/305?src=qr` |
| Lead backend | reuses `saveLead` (Mongo `leads`), `source: "digital-card-305"` |

Only the **company card "305"** is instantiated. Personal cards are supported by the
data model (`kind: "person"` + `CardPerson`) but none is created — no verified person,
portrait or role exists yet (do-not-invent rule).

## 3. NFC / URL architecture (spec)

- NFC chip stores ONLY: `https://305webservice.com/nfc/305`
- Printed QR encodes: `https://305webservice.com/nfc/305?src=qr`
- Shared links may use: `https://305webservice.com/nfc/305?src=share`
- `/nfc/[slug]` issues a **302** to the canonical profile with attribution:
  `/card/305?utm_source=<nfc|qr|share>&utm_medium=digital-card&utm_campaign=card-305`
- Unknown slug → 302 to `/` (never a broken destination).
- Destination is centrally editable (`nfc.canonicalPath`) without reprogramming tags.
- No personal data or internal IDs on the chip. Do **not** lock tags until the live
  destination passes testing (status field tracks draft → testing → live).

## 4. Analytics events (privacy-safe; via existing `trackEvent`, no-op until GA4/Plausible connected)

| Event | Props |
|---|---|
| `card_open` | `card`, `src` (nfc/qr/share/direct) |
| `card_save_contact` / `card_whatsapp` / `card_call` / `card_email` / `card_share` | `card` |
| `card_request_quote` / `card_view_package` | `card` |
| `card_service_selected` / `card_service_cta` | `service` |
| `card_project_opened` | `project` |
| `card_exchange_start` | `card` (submit success = existing `form_submit_success` flow) |
| `card_lang_change` | `lang` |

No personal form data is ever sent to analytics. UTM survives internal navigation via
the existing first-touch `persistAttribution()` (sessionStorage `305_attr`).

## 5. Admin baseline (documented, NOT built — no fake dashboard)

Data model already supports it: `CARD_PROFILES` registry keyed by slug. Future endpoints:
`POST /api/cards` (create), `PATCH /api/cards/:id` (update contact/actions), `POST
/api/cards/:id/slug` (safe slug change + old-slug redirect), `GET /api/cards/:id/stats`
(privacy-safe counts), `GET /api/leads?source=digital-card-*` (authorized export),
`DELETE` → archive. Requires auth layer (none exists in this site today).

## 6. Verified test results (local, node-server build, 2026-07-27)

- `tsc --noEmit` clean; production build OK.
- `/nfc/305` → 302 `…utm_source=nfc…`; `?src=qr` → `utm_source=qr`; unknown slug → `/`.
- vCard: 200, `text/vcard; charset=utf-8`, attachment `305-web-service.vcf`, correct
  RFC escaping (`Websites\, Custom…`), CRLF, no internal fields.
- First viewport @360×780: wordmark, positioning, full 5-action dock, quote CTA and
  $499 all visible. Dock touch targets 83px.
- Horizontal overflow 0px @320/360/430/1280; column centered on desktop.
- EN→ES toggle: full translation, `<html lang="es-US">`, persisted (`305_card_lang`).
- Service selector: aria-expanded reveal with outcome + price + CTA (ES verified).
- Exchange form: server validation, consent required, honeypot, duplicate-protection
  (pending-disable); without `MONGODB_URI` shows the honest error — **no fake success**.
- Gallery: 4 approved projects (Aguiar, LSF, Polkanea, Cosme — permission recorded in
  `brand/out/flyers/WEBSITE-FLYER-ASSETS-AND-PERMISSIONS.md`), swipe with snap, no autoplay.
- Console: no errors.

## 7. Missing information / pending owner decisions

1. **Deploy approval** — everything is local; the NFC/QR destinations resolve only after deploy.
2. **Physical NFC hardware** — chip type/vendor not chosen; write `https://305webservice.com/nfc/305`, test on iPhone+Android against the LIVE site, then lock.
3. **Real-device vCard test** — verified by protocol/format locally; brief §13 asks for an iPhone/Android save test on the live URL.
4. **Personal cards** — need verified name, role, portrait, and per-person phone/email before creating any person profile.
5. **Analytics platform** — events are wired but dormant until GA4/Plausible is added.
6. **Wallet passes** — intentionally absent (brief: never show nonfunctional Wallet buttons). Requires Apple/Google developer setup if wanted later.
7. **QR print piece** — `public/card/qr-305.svg` is the digital asset; if a printed card/sticker is wanted, that's a brand/system render job (like the flyers).
