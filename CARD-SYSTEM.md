# 305 Digital Card System — platform spec

> ## 🔒 FROZEN — MASTER SPECIFICATION · v1.0 · 2026-07-28
>
> Owner-approved as the master spec for every 305 digital card. The three
> per-business modules (Google Reviews · Location/service areas · vCard media)
> are **built and signed off — do not rebuild or redesign them**.
>
> **Change control:** this document only changes when the owner approves a new
> written order. Bug fixes and new *business profiles* do not require a spec
> change; structural changes (layers, modes, panel rules, QR rule) do.
>
> **Invariants that must survive every future card:**
> 1. One identity + one promise + one proof + one action group per viewport.
> 2. The right panel sells; the final QR shares — never mixed.
> 3. Exactly ONE QR per page, at the end, pointing at the card (never the .vcf).
> 4. A module without valid real data does not render. Nothing is invented.
> 5. Google reviews are published only through Google. No review gating, ever.
>
> **Verified at freeze time (local production build):** typecheck ✅ · build ✅ ·
> single QR ✅ · EN/ES ✅ · 0 horizontal overflow at 320→1440 ✅ · 4 location modes ✅ ·
> vCard structure/folding/PHOTO+LOGO ✅.
> **Not yet verifiable without deploy:** real-device vCard, NFC tag flow,
> production Lighthouse/LCP.

Source of truth: `benchmark-y-estructura-tarjetas-digitales-305.md` (Codex, 2026-07-28).
The product is NOT an NFC card — it is **a digital experience built around each
business's commercial goal**, competing with Popl/Blinq/HiHello/Wave/V1CE on quality
while differentiating on custom design, bilingual UX, per-business flows and real proof.

## Universal structure (implemented for 305)

| Layer | Spec | Implemented component |
|---|---|---|
| 1 First Contact | identity + status + 1-line value + primary CTA + Save Contact + ≤3 quick actions, first viewport | Hero in `DigitalCard.tsx` (815px @390) |
| 2 Primary Intent | ONE dominant commercial action | `Start a Project` → LeadSheet |
| 3 Proof | 1 featured + up to 3 secondary, never a full website | Hero featured reel (1 visible) + `Built for real businesses` carousel |
| 4 Actions/Links | grouped by intent, only active channels | Quick actions + collapsible Share links (no social — none verified active) |
| 5 Exchange | Share Your Contact, bottom sheet, consent, no "lead capture" wording | `LeadSheet` exchange mode |
| 6 Share | ONE canonical QR + copy + native share + discreet Save contact; Wallet only when real | Final `Share this card` section (single 184px QR); no Wallet buttons |
| 7 Footer | privacy, "Digital card by 305 Web Service", card id | Footer |

Desktop: sober canvas, main column ≤640px + **right column 360px that never shows a
website and never repeats identity or CTAs** — it is the **Conversion Panel**
(`YOUR NEXT MOVE` → headline → 3 outcomes → START A PROJECT → CHAT ON WHATSAPP → trust →
discreet price). The single QR lives only in the final Share section.
Rule enforced page-wide: **the right panel sells, the final QR shares — never mixed**,
and **one identity + one promise + one proof + one action group per viewport**.

## Card modes (structural templates)

`CardMode` in `src/data/card.ts`: professional · business · review · commerce ·
creator · nonprofit. Each mode keeps architecture/quality/contact/analytics and swaps
CTA, proof, flow, modules, branding, captured data.

- **business** (LIVE — 305): Brand → Start a Project → Save Contact → Proof → Services → Exchange
- **creator** (next candidate — Light Specter Film): Identity → Watch Work → Featured Films → Discovery Call → Social. Needs: approved reel/film assets, booking destination, verified socials.
- professional / review / commerce / nonprofit: templates defined, **no invented content** — built when a real business with approved data arrives (e.g. restaurant review-mode needs a real Google review URL; nonprofit needs a real donation destination).

## Acceptance criteria status (305 card, local 2026-07-28)

✅ No app required · Save Contact without scroll · one dominant action · 3 quick
actions · no website in desktop sidebar · no duplicated content in viewport · QR
functional · NFC and QR open same canonical URL · EN/ES complete · touch targets ≥44px ·
0 overflow at 320/375/390/430/768/1024/1280/1440 · analytics events (view, save, call,
whatsapp, share, CTA, exchange, submit + concierge/project) · UTM preserved ·
reduced-motion content intact.
⏳ Pending production measurement: mobile LCP < 2.5s (local Lighthouse 87 with
local-server compression penalty; measure after deploy). WCAG 2.2 AA: Lighthouse a11y
100 + manual focus/keyboard/trap checks done; full AA audit = deploy-time task.

---

# Per-business modules (reviews · location · vCard media)

Configured per profile in `src/data/card.ts`; types + validation in
`src/lib/cardModules.ts`. **A module with incomplete/invalid data never renders** —
there is no placeholder, no sample rating, no invented address.

## 1. Google Reviews — what is and isn't possible

**Possible (implemented):** show the real rating + review count, show up to 3 reviews
fetched from Google Places API (New), link each review to its source on Google Maps,
and open the official "write a review" URL.

**Not possible (and deliberately not faked):** publishing a Google review from our own
form. Google owns authentication and submission. There is no star-rating form that
claims to "post to Google", no private feedback presented as a Google review, and no
manually pasted reviews labelled as synced.

**No review gating.** Every visitor sees the same `Leave a Google Review` CTA. We never
ask "how was your experience?" first to route only happy customers to Google.

**Attribution:** the module always renders a "Reviews from Google" link to the place on
Google Maps, keeps each review's author name/photo/link, and shows the ordering
disclosure (relevance or newest). Review text is never edited; if Google returns a
translation (`text.languageCode` ≠ `originalText.languageCode`) the card labels it
"Translated by Google".

### Integration
- Route: `src/routes/api/card-reviews/[placeId].ts` — **server-side only**.
- Key: `GOOGLE_PLACES_API_KEY` (never shipped to the client). Restrict it to Places API (New).
- FieldMask (only what is used): `id, displayName, rating, userRatingCount, reviews,
  googleMapsUri, reviewsUri, formattedAddress, shortFormattedAddress, location,
  regularOpeningHours, businessStatus, pureServiceAreaBusiness`.
- **Cache TTL: 6 h, in-memory only** (dies with the process). The **Place ID is the only
  value persisted** (in the profile config); Google content is treated as ephemeral.
  Refresh strategy = natural TTL expiry; re-verify Place IDs when a business moves.
- Rate limit 30 req/min per IP · 5 s timeout · failures degrade to a hidden module and
  never block the rest of the card.
- States handled: `ok`, `no-reviews`, `not-configured`, `unavailable`, `quota`
  (+ compact loading skeleton).

### How to enable for a business
1. Get the **Place ID** → https://developers.google.com/maps/documentation/places/web-service/place-id
2. Get the official **write-a-review URL** from the Google Business Profile dashboard.
3. Set `reviews: { enabled: true, placeId, requestReviewUrl, ... }`. Both values are
   required — with only one, the module refuses to render.

> **Compliance note:** Google's Places/Maps terms (attribution, caching, display rules)
> change over time. Re-read the current Places API policies before going live; the TTL
> and attribution above are the design's defensible defaults, not legal advice.

**305 today:** `reviews.enabled = false` — 305 has no verified Google Business Profile,
so there is no Place ID and no rating. The visitor sees nothing; nothing is invented.

> **Owner decision (2026-07-28):** do **not** activate reviews for 305 until it is
> confirmed that 305 can create an *eligible and verified* Google Business Profile.
> A Business Profile is not to be created merely to unlock stars on the card — the
> eligibility must be real first. The module stays dormant until then.

## 2. Location / service areas — 4 modes

`physical` · `service-area` · `hybrid` · `multiple-locations` (+ `none`).
Component: `WhereWeWork` in `src/components/card/CardModules.tsx`.

| Mode | Renders | Guard |
|---|---|---|
| physical | name, public address, Get directions, Call, hours, "Appointment required" | needs exactly 1 location **with** address |
| service-area | "Service area" + city/county chips + "Check availability in your area" — **no fake pin, no partially hidden address** | needs ≥1 area |
| hybrid | "Visit us" block + "We also serve" areas | needs ≥1 location **and** ≥1 area |
| multiple-locations | branch selector; address/hours/phone (and Place ID for reviews) switch **together**; "Find nearest location" | needs ≥2 locations |

Geolocation is **never** requested on load — only after the user presses
"Find nearest location". `showExactAddress: false` guarantees a private/residential
address is never printed (that's how 305 is configured).

**305 today:** `service-area`, based in Miami, Florida, areas = *Miami, Florida* +
*United States (remote)* — exactly what the brand already publishes.

## 3. vCard with photo / logo

`src/routes/card/[slug]/vcard.ts` generates vCard **3.0** server-side:
CRLF line endings, **75-octet line folding** (UTF-8-safe, continuations start with a
space), RFC 2426 escaping of `, ; \` and newlines, `text/vcard; charset=utf-8`,
safe `Content-Disposition` filename.

- **Person profile** → `PHOTO` (square ~600×600).
- **Organization profile** → the logo is sent as **both `PHOTO` and `LOGO`**, because
  several contact apps ignore `LOGO`; this way the visual identity always shows.
- Source image: `public/card/vcard-logo-305.png` (600×600, logo flattened on solid navy
  for contrast, 52 KB → ~69 KB base64). **SVG is rejected**; only PNG/JPEG.
- Hard cap: images over **200 KB are not embedded** (they corrupt or bloat contact apps);
  the vCard is still served, just without the image.
- Address: printed only when the business publishes an exact address; a service-area
  business exports locality only (Miami, FL, United States).

**Measured output (305):** 144 KB total, max line 75 octets, 1910 folded continuation
lines, `PHOTO` + `LOGO` present, escaping verified (`Websites\, Custom Software\, …`).

**Compatibility testing status:** format/protocol verified locally (structure, folding,
encoding, MIME, download). **Real-device testing on iPhone Contacts, Google/Android
Contacts, Samsung Contacts and Outlook is still PENDING** — it requires the deployed
HTTPS URL. Do not claim device compatibility until that pass is done.

## 4. Analytics added

`reviews_view`, `review_source_open`, `leave_google_review_click`, `directions_click`,
`service_area_check`, `location_select`, `nearest_location_request`.
The vCard download is tracked by the existing `save_contact` event (same user action —
it is not double-counted as `vcard_download`). No review text, form text or precise
location is ever sent to analytics.

## Rollout model

New card = new `CardProfile` in `CARD_PROFILES` (brand/person/company/conversion/nfc
separated) + `/nfc/<slug>` short URL + per-profile vCard + QR assets. Physical tags are
written only with the short URL and locked only after live testing (`nfc.status`).
