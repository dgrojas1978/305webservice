# Website $499 flyer — portfolio inventory, assets & permissions

Per the revision order: **no invented brands or "sample concept" content in the final flyer.**
The flyer must show *real, approved* 305 Web Service projects, each with a recorded live URL
and permission status. This file is the required-assets / permission record.

Status legend: ✅ have · ⚠️ need confirmation · ❌ missing

## 1. Portfolio inventory (real work — all four LIVE, verified 2026-07-27)

All four are real 305 projects already published in a prior 305 flyer (`brand/src/flyer-en.html`)
as "Real sites we built — live right now." Each live URL was fetched and confirmed rendering.

| Project | Live URL | Verified live | Industry label | Desktop shot | Mobile shot | Display permission |
|---|---|---|---|---|---|---|
| Aguiar Flooring | aguiarflooring.com | ✅ real business site | Flooring & remodeling | ✅ `src/shots/aguiar.png` (2560×1600) | ❌ not captured | ✅ **Approved for portfolio & marketing display** (owner-confirmed 2026-07-27) |
| Light Specter Film | lightspecterfilm.com | ✅ renders | Film & production | ✅ `src/shots/lsf.png` | ❌ not captured | ✅ Approved |
| Polkanea | polkaneaproductions.com | ✅ renders (JS/SPA; full streaming UI + plans) | Streaming platform | ✅ `src/shots/polkanea.png` | ❌ not captured | ✅ Approved |
| Cosme Proenza | cosmeproenza.com | ✅ renders (art archive) | Arts & culture | ✅ `src/shots/cosme.png` | ❌ not captured | ✅ Approved |

**Permission status: all four APPROVED for portfolio & marketing display** (owner-confirmed 2026-07-27).
Aguiar Flooring name, logo and website approved for this campaign. Do not remove/replace the real-project screenshots.

**Used in the flyer now:** Aguiar → **hero** (once). Light Specter Film + Polkanea + Cosme → **gallery**.
No project repeats. Gallery carries the note "Selected custom projects. Features and pricing vary by scope."

## 1b. Print QA — final proof (verified 2026-07-27)
- Fits 8.75×11.25 canvas, **no hidden/overflow content** (package fully visible).
- QR decodes → `305webservice.com/website-packages?utm_source=print&utm_medium=flyer&utm_campaign=website-starter-499`
  (campaign landing, not a generic home). QR + label crisp at actual size.
- Disclaimer legible at 8.4pt with improved contrast; project screenshots legible at print size.
- Export: 300 DPI, **CMYK** (`/DeviceCMYK` confirmed), 8.5×11 trim + 0.125" bleed. PNG + CMYK PDF written.

## 2. What the site itself has — nothing

- No portfolio / projects / "our work" page. The old `/projects`, `/productos`, `/es/proyectos`
  routes were intentionally removed and now 301-redirect (services-only site).
- `REDESIGN-NOTES.md`: "no real testimonials, logos, metrics or awards available."
- So the flyer's proof relies entirely on the 3 screenshots above.

## 3. Required before this is printed / distributed

1. ⚠️ **Display permission for each site shown** — especially **Aguiar Flooring** (a real external
   business). LSF and Polkanea are your projects; still confirm they can be shown as 305 work.
   *If permission for any site is not confirmed, that site must be pulled and replaced with another
   approved project (or the gallery drops to the approved ones).*
2. ❌ **Mobile captures (390×844)** for the sites shown, so the hero can include a phone and the
   flyer can prove "mobile-ready." I can capture these from the live URLs (per the order's capture
   rules) once you approve the sites. Right now the hero shows desktop only.
3. ⚠️ **Consistent fresh desktop captures (1440×1000)** — the existing shots are 2560×1600 hero
   crops and look clean, but the order specifies 1440×1000. I can re-capture for consistency.
4. ⚠️ **QR landing** — the QR points to
   `305webservice.com/website-packages?utm_source=print&utm_medium=flyer&utm_campaign=website-starter-499`.
   The order recommends a landing that **leads with these same real projects, then the package**.
   That page does not lead with projects yet (services-only redesign). Options: (a) build a
   projects-first `/website-packages` intro block, or (b) accept the current package page. PENDING your call.

## 4. Not used / explicitly excluded (per order)

- The three invented "sample concept" mockups (Summit Roofing, Bella Skin Studio, Coastal Dental)
  built earlier in `build_website_flyer.py` are **retired** — not shown in the flyer. Kept in code
  only as an unused fallback; can be deleted.
- No testimonials, star ratings, client logos (beyond the sites' own logos inside the screenshots),
  metrics or awards are shown — none are verified/approved.
