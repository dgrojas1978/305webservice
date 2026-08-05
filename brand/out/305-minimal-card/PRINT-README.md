# 305 Web Service — minimalist NFC card print package

- Trim: 85.60 × 53.98 mm (CR80 / ISO/IEC 7810 ID-1)
- Bleed: 3 mm each edge; supplied canvas: 91.60 × 59.98 mm
- Resolution: 300 DPI
- Production color: CMYK TIFF, front and back
- Vendor PDF: two pages, front then back, both with bleed
- Minimum type: 9 pt
- QR fallback: 24 mm, four-module quiet zone, no embedded logo
- QR destination: `/c/305`, which resolves to the 305 digital card
- NFC destination: use the same canonical card route with NFC campaign attribution

The front carries only the centered wordmark; the NFC remains intentionally
unlabelled. The back has one instruction: scan. No phone, email, price, service
catalog, social icons or marketing claim are printed. Confirm the vendor's exact
bleed, safe area and antenna/inlay position before the production run. Print one
physical sample and test NFC plus QR on current iPhone and Android devices before
locking the NTAG.
