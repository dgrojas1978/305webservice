# -*- coding: utf-8 -*-
"""305 SIGNAL v2 — refinamiento + paquetes de impresión.  ESTADO: PREPRESS READY.

Cambios v1→v2 (orden de refinamiento):
  · fuera `305-001` (no existe sistema de inventario que lo respalde)
  · `305WEBSERVICE.COM` discreto bajo el QR (respaldo humano si falla NFC/QR)
  · QR 25 mm, placa reducida al quiet zone mínimo, esquinas suaves
  · QR + CTA + dominio alineados como UN módulo
  · wordmark con ajuste óptico y más presencia; descriptor con peso real
  · signal line más sutil que wordmark y CTA, sin glow

Paquetes:
  A. DIRECT PRINT (impresora local de PVC): PNG sRGB 1011×638, sin sangrado,
     sin marcas de corte, sin guías, fondo hasta el borde, safe area 3 mm.
  B. VENDOR: PDF CMYK con sangrado PROVISIONAL de 3 mm (a confirmar con el
     proveedor) → lienzo 91.60 × 59.98 mm = 1082 × 708 px @300 DPI.

NO es producción aprobada: /c/305 devuelve 404, el QR es placeholder, no se
programa NFC ni se bloquea chip.
"""
import io, json, subprocess, tempfile, time, urllib.request, shutil
from pathlib import Path
import cv2, img2pdf, numpy as np, qrcode, qrcode.image.svg, websocket
from PIL import Image

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
REPO = BRAND.parent
OUT = BRAND / "out" / "305-signal-v2"
DIRECT = OUT / "direct-print"
VENDOR = OUT / "vendor-cmyk"
for d in (OUT, DIRECT, VENDOR): d.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FONTS = REPO / "node_modules" / "@fontsource"
V1 = BRAND / "out" / "305-signal"

DPI = 300
MM = DPI / 25.4
TRIM_W_MM, TRIM_H_MM = 85.60, 53.98
THICKNESS_MM = 0.76
W, H = round(TRIM_W_MM * MM), round(TRIM_H_MM * MM)     # 1011 × 638
BLEED_MM, SAFE_MM = 3.0, 3.0
BW, BH = round((TRIM_W_MM + 2*BLEED_MM) * MM), round((TRIM_H_MM + 2*BLEED_MM) * MM)
RADIUS_MM = 3.18
QR_MM = 25.0

PLACEHOLDER_URL = "https://www.305webservice.com/c/305?proof=PREPRESS-PLACEHOLDER"
DOMAIN = "305WEBSERVICE.COM"

NAVY, NAVY_DEEP = "#0a1728", "#050d1a"
BLUE, AQUA, PAPER, WARM = "#2f7bff", "#20d7c5", "#f7f9fc", "#f6f4ef"


def ff(fam, pkg, f, w):
    return (f'@font-face{{font-family:"{fam}";src:url("{(FONTS/pkg/"files"/f).as_uri()}") format("woff2");'
            f'font-weight:{w};font-style:normal;font-display:block}}')


FONT_CSS = "".join([ff("Inter", "inter", f"inter-latin-{w}-normal.woff2", w)
                    for w in (400, 500, 600, 700, 800, 900)])


def card_css(w, h, radius_px):
    return f"""
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;background:#0d1013}}
.card{{position:relative;width:{w}px;height:{h}px;border-radius:{radius_px}px;overflow:hidden;
  background:
    radial-gradient(56% 68% at 84% 88%, rgba(47,123,255,0.17), transparent 62%),
    radial-gradient(48% 58% at 6% 4%, rgba(47,123,255,0.09), transparent 60%),
    linear-gradient(152deg, {NAVY} 0%, {NAVY_DEEP} 100%);}}
.grain{{position:absolute;inset:0;opacity:0.26;mix-blend-mode:soft-light;
  background-image:radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.6px);
  background-size:3px 3px}}
"""


def signal(w, h, ox, oy, reverse=False):
    """Señal sutil: 1.4 px de trazo, sin glow. Nace en marca, muere en el NFC."""
    if not reverse:
        d = f"M {ox+0.088*w} {oy+0.335*h} H {ox+0.575*w} L {ox+0.795*w} {oy+0.735*h} H {ox+0.847*w}"
        pulses = [(ox+0.088*w, oy+0.335*h), (ox+0.575*w, oy+0.335*h)]
    else:
        d = f"M {ox} {oy+0.20*h} H {ox+0.185*w} L {ox+0.255*w} {oy+0.315*h} H {ox+0.288*w}"
        pulses = [(ox+0.185*w, oy+0.20*h)]
    dots = "".join(f'<circle cx="{x}" cy="{y}" r="{0.0038*w}" fill="{AQUA}" opacity="0.9"/>' for x, y in pulses)
    return f"""
    <svg viewBox="0 0 {ox*2+w} {oy*2+h}" style="position:absolute;inset:0;width:100%;height:100%">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="{AQUA}" stop-opacity="0.22"/>
        <stop offset="60%" stop-color="{AQUA}" stop-opacity="0.62"/>
        <stop offset="100%" stop-color="{AQUA}" stop-opacity="0.86"/></linearGradient></defs>
      <path d="{d}" fill="none" stroke="url(#sg)" stroke-width="{0.0024*w}"
            stroke-linecap="round" stroke-linejoin="miter"/>{dots}
    </svg>"""


def nfc_mark(px):
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="{AQUA}" stroke-width="1.6" '
            f'stroke-linecap="round" style="width:{px}px;height:{px}px;display:block">'
            f'<path d="M8 8.6a4.6 4.6 0 0 1 0 6.8"/><path d="M11.6 5.9a8.4 8.4 0 0 1 0 12.2"/>'
            f'<path d="M15.2 3.2a12.2 12.2 0 0 1 0 17.6"/></svg>')


def front_body(w, h, ox, oy):
    pad = (SAFE_MM + 2.4) * MM
    return f"""
      <div class="grain"></div>
      {signal(w, h, ox, oy)}
      <div style="position:absolute;left:{ox+pad}px;top:{oy+pad}px">
        <div style="font-size:{5.35*MM}px;font-weight:900;letter-spacing:-0.018em;line-height:0.98;
                    text-transform:uppercase;color:{PAPER}">
          <span style="color:{BLUE}">305</span>&#8202;Web Service</div>
        <div style="margin-top:{2.1*MM}px;font-size:{1.85*MM}px;font-weight:600;letter-spacing:0.34em;
                    text-transform:uppercase;color:rgba(247,249,252,0.58)">Business technology</div>
      </div>
      <div style="position:absolute;right:{ox+pad}px;bottom:{oy+pad}px;
                  display:flex;align-items:center;gap:{2.1*MM}px">
        <span style="font-size:{2.4*MM}px;font-weight:700;letter-spacing:0.24em;
                     text-transform:uppercase;color:{PAPER}">Tap to connect</span>
        {nfc_mark(4.5*MM)}
      </div>"""


def back_body(w, h, ox, oy, qr_uri):
    pad = (SAFE_MM + 2.4) * MM
    plate = QR_MM + 3.0            # quiet zone mínimo, nada más
    return f"""
      <div class="grain"></div>
      {signal(w, h, ox, oy, reverse=True)}
      <!-- UN módulo: CTA + QR + dominio -->
      <div style="position:absolute;right:{ox+pad}px;top:50%;transform:translateY(-50%);
                  display:flex;align-items:center;gap:{3.2*MM}px">
        <div style="text-align:right">
          <div style="font-size:{2.4*MM}px;font-weight:700;letter-spacing:0.24em;
                      text-transform:uppercase;color:{PAPER};white-space:nowrap">Scan to connect</div>
          <div style="margin-top:{1.6*MM}px;font-size:{1.72*MM}px;font-weight:500;line-height:1.4;
                      color:rgba(247,249,252,0.46);max-width:{27*MM}px;margin-left:auto">
            Technology built around your business.</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:{1.5*MM}px;flex-shrink:0">
          <div style="background:{WARM};width:{plate*MM}px;height:{plate*MM}px;border-radius:{1.3*MM}px;
                      display:flex;align-items:center;justify-content:center">
            <img src="{qr_uri}" style="display:block;width:{QR_MM*MM}px;height:{QR_MM*MM}px">
          </div>
          <div style="font-size:{1.55*MM}px;font-weight:700;letter-spacing:0.16em;
                      color:rgba(247,249,252,0.44)">{DOMAIN}</div>
        </div>
      </div>"""


def card_page(side, qr_uri, bleed=False):
    """bleed=False → trim exacto (direct print). bleed=True → +3 mm por lado."""
    w, h = (BW, BH) if bleed else (W, H)
    ox = oy = (BLEED_MM * MM) if bleed else 0
    radius = 0 if bleed else RADIUS_MM * MM      # con sangrado el corte lo hace la troqueladora
    body = front_body(W, H, ox, oy) if side == "front" else back_body(W, H, ox, oy, qr_uri)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
{card_css(w, h, radius)}
body{{width:{w}px;height:{h}px;overflow:hidden}}</style></head>
<body><div class="card">{body}</div></body></html>"""


def page(inner, w, h, bg="#0d1013"):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
{card_css(W, H, RADIUS_MM*MM)}
body{{background:{bg};width:{w}px;height:{h}px;overflow:hidden}}</style></head><body>{inner}</body></html>"""


def img(p, style=""):
    return f'<img src="{Path(p).as_uri()}" style="display:block;{style}">'


def shot(edge_args, out, w, h, html_file):
    subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
        "--virtual-time-budget=9000", f"--window-size={w},{h}", f"--screenshot={out}",
        html_file.as_uri()], check=False, capture_output=True, timeout=200)


def main():
    # ---- QR placeholder (definitivo solo cuando /c/305 sea público) ----
    qr_svg = OUT / "_qr-placeholder.svg"
    qrcode.make(PLACEHOLDER_URL, error_correction=qrcode.constants.ERROR_CORRECT_H, border=1,
                image_factory=qrcode.image.svg.SvgPathImage).save(str(qr_svg))
    qr_uri = qr_svg.as_uri()

    jobs = []
    # A · DIRECT PRINT (sin sangrado, sin marcas, sin guías)
    for side in ("front", "back"):
        f = ROOT / f"_v2-direct-{side}.html"
        f.write_text(card_page(side, qr_uri, bleed=False), encoding="utf-8")
        jobs.append((f, DIRECT / f"305-signal-{side}-DIRECT-1011x638-sRGB.png", W, H))
    # B · VENDOR (con sangrado provisional 3 mm)
    for side in ("front", "back"):
        f = ROOT / f"_v2-bleed-{side}.html"
        f.write_text(card_page(side, qr_uri, bleed=True), encoding="utf-8")
        jobs.append((f, VENDOR / f"_bleed-{side}.png", BW, BH))

    for f, out, w, h in jobs:
        shot(None, out, w, h, f)
        print(f"  {out.name}  {w}x{h}")

    # ---- PDF CMYK para imprenta ----
    for side in ("front", "back"):
        src = VENDOR / f"_bleed-{side}.png"
        im = Image.open(src).convert("RGB").convert("CMYK")
        buf = io.BytesIO(); im.save(buf, "JPEG", quality=97, dpi=(DPI, DPI))
        pdf = VENDOR / f"305-signal-{side}-VENDOR-CMYK-3mm-bleed.pdf"
        pdf.write_bytes(img2pdf.convert(buf.getvalue(),
                        layout_fun=img2pdf.get_fixed_dpi_layout_fun((DPI, DPI))))
        print(f"  {pdf.name}")

    # ---- verificaciones ----
    rep = {"status": "PREPRESS READY", "reason": "/c/305 devuelve 404 en producción; QR es placeholder"}
    det = cv2.QRCodeDetector()
    a = cv2.imread(str(DIRECT / "305-signal-back-DIRECT-1011x638-sRGB.png"))
    d, _, _ = det.detectAndDecode(a)
    if not d:
        big = cv2.resize(a, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
        d, _, _ = det.detectAndDecode(big)
    rep["qr_decode"] = {"ok": d == PLACEHOLDER_URL, "decoded": d, "expected": PLACEHOLDER_URL,
                        "physical_mm": QR_MM}
    rep["dimensions"] = {"standard": "CR80 / ISO-IEC 7810 ID-1", "trim_mm": [TRIM_W_MM, TRIM_H_MM],
                         "thickness_mm": THICKNESS_MM, "ratio": round(TRIM_W_MM/TRIM_H_MM, 3),
                         "corner_radius_mm": RADIUS_MM, "dpi": DPI,
                         "direct_px": [W, H], "vendor_bleed_px": [BW, BH],
                         "bleed_mm": BLEED_MM, "safe_mm": SAFE_MM,
                         "bleed_note": "PROVISIONAL — confirmar con el proveedor"}
    rep["chip"] = {"model": "NTAG215", "user_memory_bytes": 504, "freq": "13.56 MHz",
                   "ndef_payload_bytes": len("https://www.305webservice.com/c/305"),
                   "fits_ntag215": True, "note": "URI NDEF corta; sobra memoria de sobra"}
    rep["typography_physical"] = {
        "wordmark": f"{5.35} mm ({5.35*2.8346:.1f} pt)",
        "descriptor": f"{1.85} mm ({1.85*2.8346:.1f} pt)",
        "cta": f"{2.4} mm ({2.4*2.8346:.1f} pt)",
        "tagline": f"{1.72} mm ({1.72*2.8346:.1f} pt)",
        "domain": f"{1.55} mm ({1.55*2.8346:.1f} pt)",
        "minimum_legible_note": "todo ≥1.5 mm (~4.3 pt); revisar en muestra impresa"}
    rep["signal_line"] = {"stroke_px": round(0.0024*W, 2),
                          "stroke_mm": round(0.0024*W/MM, 3),
                          "note": "trazo fino; confirmar reproducción en muestra física"}
    rep["qr_geometry"] = {"size_mm": QR_MM, "plate_mm": QR_MM + 3.0,
                          "edge_distance_mm": round(SAFE_MM + 2.4, 2),
                          "contrast": "negro puro sobre blanco cálido #f6f4ef",
                          "logo_inside_qr": False}
    (OUT / "PRODUCTION-SPEC.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False), encoding="utf-8")
    print("\nQR decode:", rep["qr_decode"]["ok"], "| estado:", rep["status"])
    return rep


if __name__ == "__main__":
    main()
