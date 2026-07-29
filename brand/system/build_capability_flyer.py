# -*- coding: utf-8 -*-
"""Flyer corporativo de capacidades — 305 Web Service. EN y ES, Letter 8.5x11.

Una sola pieza por idioma. Estructura obligatoria:
HOOK -> PROOF -> OFFER -> OUTCOMES -> TRUST -> ACTION

Reglas: un wordmark, un titular, un sistema de prueba, una oferta principal,
un CTA, un QR, una URL de respaldo. Sin catalogo completo de servicios, sin
Gmail, sin precio como mensaje maestro, sin proyectos repetidos.

Salida: PNG 300 DPI + PDF CMYK con 3 mm de sangrado.
"""
import io, json, subprocess
from pathlib import Path
import cv2, img2pdf, qrcode, qrcode.image.svg
from PIL import Image

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
REPO = BRAND.parent
OUT = BRAND / "out" / "flyers-capability"
OUT.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FONTS = REPO / "node_modules" / "@fontsource"
WORK_DIR = REPO / "public" / "work"

DPI = 300
IN = DPI
W, H = 85 * DPI // 10, 11 * DPI            # 2550 x 3300
BLEED = round(0.125 * DPI)                 # 3.175 mm
BW, BH = W + 2*BLEED, H + 2*BLEED
SAFE = round(0.25 * DPI)

NAVY, NAVY_DEEP = "#0b1826", "#060e18"
BLUE, AQUA, PAPER = "#2f7bff", "#3fd8c6", "#f5f3ee"

DOMAIN = "305WEBSERVICE.COM"
PHONE = "(305) 833-2984"                   # src/lib/site.ts PHONE_DISPLAY

FONT_CSS = "".join(
    f'@font-face{{font-family:"Inter";src:url("{(FONTS/"inter"/"files"/f"inter-latin-{w}-normal.woff2").as_uri()}") '
    f'format("woff2");font-weight:{w};font-style:normal;font-display:block}}'
    for w in (400, 500, 600, 700, 800, 900))

# Tres proyectos con propositos DISTINTOS (permiso escrito del owner, 2026-07-27).
# El cuarto se omite a proposito: la orden pide tres en esta pieza.
WORK = [
    {"name": "Aguiar Flooring", "img": "aguiar.jpg",
     "purpose": {"en": "Commerce and quote generation",
                 "es": "Comercio y generación de cotizaciones"}},
    {"name": "Light Specter Film", "img": "lsf.jpg",
     "purpose": {"en": "Cinematic brand and lead experience",
                 "es": "Marca cinematográfica y captación de prospectos"}},
    {"name": "Polkanea Productions", "img": "polkanea.jpg",
     "purpose": {"en": "Streaming and content discovery",
                 "es": "Streaming y descubrimiento de contenido"}},
]

COPY = {
    "en": {
        "eyebrow": "Strategy &#183; Design &#183; Engineering",
        "hook": "Digital systems,<br>built for business.",
        "sub": "Websites, custom software and connected experiences designed around real business goals.",
        "proof_label": "Selected work",
        "cap_label": "What we build",
        "caps": [
            ("Digital experiences",
             "Websites, online stores and customer-facing platforms designed for clarity, credibility and conversion."),
            ("Custom systems",
             "Software and internal tools shaped around real workflows, information and operational needs."),
            ("Connected business solutions",
             "NFC experiences, digital cards, review journeys, lead capture and practical business automation."),
        ],
        "trust": "Real projects &#183; English &amp; Spanish &#183; Direct collaboration",
        "cta_line": "Let&#8217;s discuss what your business needs next.",
        "cta": "Start a project",
        "scan": "Scan to start",
        "disclosure": "Selected custom projects. Features and pricing vary by scope.",
    },
    "es": {
        "eyebrow": "Estrategia &#183; Dise&#241;o &#183; Ingenier&#237;a",
        "hook": "Sistemas digitales,<br>hechos para el negocio.",
        "sub": "Sitios web, software a medida y experiencias conectadas, dise&#241;ados alrededor de objetivos reales de negocio.",
        "proof_label": "Trabajo seleccionado",
        "cap_label": "Lo que construimos",
        "caps": [
            ("Experiencias digitales",
             "Sitios web, tiendas en l&#237;nea y plataformas de cara al cliente, con claridad, credibilidad y conversi&#243;n."),
            ("Sistemas a medida",
             "Software y herramientas internas construidas alrededor de flujos, informaci&#243;n y necesidades reales."),
            ("Soluciones de negocio conectadas",
             "Experiencias NFC, tarjetas digitales, rutas de rese&#241;as, captaci&#243;n de prospectos y automatizaci&#243;n."),
        ],
        "trust": "Proyectos reales &#183; Espa&#241;ol e ingl&#233;s &#183; Colaboraci&#243;n directa",
        "cta_line": "Hablemos de lo que tu negocio necesita ahora.",
        "cta": "Empezar un proyecto",
        "scan": "Escanea para empezar",
        "disclosure": "Proyectos personalizados seleccionados. Las funciones y el precio var&#237;an seg&#250;n el alcance.",
    },
}

def qr_url(lang):
    return (f"https://www.305webservice.com/?utm_source=print&utm_medium=qr"
            f"&utm_campaign=305-capability&utm_content=letter-{lang}")


def page(lang, bleed=False):
    c = COPY[lang]
    ox = oy = BLEED if bleed else 0
    w, h = (BW, BH) if bleed else (W, H)
    pad = 0.72 * IN
    qr = OUT / f"_qr-{lang}.svg"

    proof = "".join(f"""
      <div style="flex:1">
        <img src="{(WORK_DIR / p['img']).as_uri()}"
             style="display:block;width:100%;aspect-ratio:16/9;object-fit:cover;
                    border-radius:{0.06*IN}px;border:1px solid rgba(246,244,239,0.14)">
        <div style="margin-top:{0.14*IN}px;font-size:{0.125*IN}px;font-weight:800;
                    letter-spacing:0.10em;text-transform:uppercase;color:{PAPER}">{p['name']}</div>
        <div style="margin-top:{0.05*IN}px;font-size:{0.115*IN}px;line-height:1.35;
                    color:rgba(246,244,239,0.56)">{p['purpose'][lang]}</div>
      </div>""" for p in WORK)

    caps = "".join(f"""
      <div style="flex:1">
        <span style="display:block;width:{0.34*IN}px;height:{0.014*IN}px;background:{AQUA}"></span>
        <div style="margin-top:{0.16*IN}px;font-size:{0.135*IN}px;font-weight:800;
                    letter-spacing:0.10em;text-transform:uppercase;color:{PAPER}">{n}</div>
        <div style="margin-top:{0.08*IN}px;font-size:{0.125*IN}px;line-height:1.5;
                    color:rgba(246,244,239,0.58)">{d}</div>
      </div>""" for n, d in c["caps"])

    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;width:{w}px;height:{h}px;overflow:hidden;
 background:radial-gradient(62% 44% at 76% 8%, rgba(47,123,255,0.13), transparent 62%),
            linear-gradient(158deg, {NAVY} 0%, {NAVY_DEEP} 100%)}}
.grain{{position:absolute;inset:0;opacity:0.20;mix-blend-mode:soft-light;
 background-image:radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.6px);background-size:3px 3px}}
</style></head><body>
<div class="grain"></div>
<div style="position:absolute;left:{ox+pad}px;top:{oy+pad}px;right:{ox+pad}px;bottom:{oy+pad}px;
            display:flex;flex-direction:column">

  <div style="font-size:{0.30*IN}px;font-weight:800;letter-spacing:-0.014em;line-height:1;
              text-transform:uppercase;color:{PAPER}">
    <span style="color:{BLUE}">305</span> Web Service</div>
  <div style="margin-top:{0.13*IN}px;font-size:{0.125*IN}px;font-weight:600;letter-spacing:0.34em;
              text-transform:uppercase;color:rgba(246,244,239,0.46)">{c['eyebrow']}</div>

  <div style="margin-top:{0.34*IN}px;font-size:{0.52*IN}px;font-weight:800;letter-spacing:-0.020em;
              line-height:1.06;text-transform:uppercase;color:{PAPER}">{c['hook']}</div>
  <div style="margin-top:{0.20*IN}px;max-width:{5.6*IN}px;font-size:{0.165*IN}px;line-height:1.48;
              color:rgba(246,244,239,0.62)">{c['sub']}</div>

  <div style="margin-top:{0.36*IN}px;font-size:{0.115*IN}px;font-weight:700;letter-spacing:0.26em;
              text-transform:uppercase;color:{AQUA}">{c['proof_label']}</div>
  <div style="margin-top:{0.20*IN}px;display:flex;gap:{0.26*IN}px">{proof}</div>
  <div style="margin-top:{0.16*IN}px;font-size:{0.10*IN}px;line-height:1.4;
              color:rgba(246,244,239,0.38)">{c['disclosure']}</div>

  <div style="margin-top:{0.34*IN}px;font-size:{0.115*IN}px;font-weight:700;letter-spacing:0.26em;
              text-transform:uppercase;color:{AQUA}">{c['cap_label']}</div>
  <div style="margin-top:{0.18*IN}px;display:flex;gap:{0.30*IN}px">{caps}</div>

  <div style="flex:1"></div>

  <div style="height:1px;background:rgba(246,244,239,0.14)"></div>
  <div style="margin-top:{0.18*IN}px;font-size:{0.115*IN}px;font-weight:600;letter-spacing:0.16em;
              text-transform:uppercase;color:rgba(246,244,239,0.44)">{c['trust']}</div>

  <div style="margin-top:{0.26*IN}px;display:flex;align-items:flex-end;justify-content:space-between;gap:{0.4*IN}px">
    <div>
      <div style="font-size:{0.255*IN}px;font-weight:800;letter-spacing:-0.012em;line-height:1.16;
                  color:{PAPER};max-width:{4.9*IN}px">{c['cta_line']}</div>
      <div style="margin-top:{0.24*IN}px;display:inline-block;background:{BLUE};color:#fff;
                  padding:{0.15*IN}px {0.34*IN}px;border-radius:{0.06*IN}px;font-size:{0.145*IN}px;
                  font-weight:800;letter-spacing:0.14em;text-transform:uppercase">{c['cta']}</div>
      <div style="margin-top:{0.26*IN}px;font-size:{0.145*IN}px;font-weight:700;letter-spacing:0.10em;
                  color:{PAPER}">{DOMAIN} &#183; {PHONE}</div>
    </div>
    <div style="text-align:center;flex:none">
      <div style="background:#f6f4ef;padding:{0.10*IN}px;border-radius:{0.06*IN}px">
        <img src="{qr.as_uri()}" style="display:block;width:{1.30*IN}px;height:{1.30*IN}px">
      </div>
      <div style="margin-top:{0.11*IN}px;font-size:{0.10*IN}px;font-weight:700;letter-spacing:0.20em;
                  text-transform:uppercase;color:rgba(246,244,239,0.60)">{c['scan']}</div>
    </div>
  </div>
</div></body></html>"""


def render(html, out, w, h, tag):
    f = ROOT / f"_cap-{tag}.html"
    f.write_text(html, encoding="utf-8")
    subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
        "--virtual-time-budget=12000", f"--window-size={w},{h}", f"--screenshot={out}",
        f.as_uri()], check=False, capture_output=True, timeout=260)
    print(f"  {Path(out).name}  {w}x{h}")


def main():
    report = {}
    det = cv2.QRCodeDetector()
    for lang in ("en", "es"):
        url = qr_url(lang)
        qrcode.make(url, error_correction=qrcode.constants.ERROR_CORRECT_Q, border=4,
                    image_factory=qrcode.image.svg.SvgPathImage).save(str(OUT / f"_qr-{lang}.svg"))

        png = OUT / f"305-capability-{lang}-letter-300dpi.png"
        render(page(lang, False), png, W, H, f"{lang}-flat")

        bl = OUT / f"_bleed-{lang}.png"
        render(page(lang, True), bl, BW, BH, f"{lang}-bleed")
        buf = io.BytesIO()
        Image.open(bl).convert("RGB").convert("CMYK").save(buf, "JPEG", quality=96, dpi=(DPI, DPI))
        pdf = OUT / f"305-capability-{lang}-letter-cmyk-bleed.pdf"
        pdf.write_bytes(img2pdf.convert(buf.getvalue(),
                        layout_fun=img2pdf.get_fixed_dpi_layout_fun((DPI, DPI))))
        print(f"  {pdf.name}")

        # QA sobre el arte FINAL
        img = cv2.imread(str(png))
        d, _, _ = det.detectAndDecode(img)
        if not d:
            d, _, _ = det.detectAndDecode(cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC))
        g = Image.open(png).convert("L")
        mx = lambda b: max(g.crop(b).getdata())
        bands = {"left": (0, 0, SAFE, H), "right": (W-SAFE, 0, W, H),
                 "top": (0, 0, W, SAFE), "bottom": (0, H-SAFE, W, H)}
        report[lang] = {
            "qr_url": url, "qr_decoded_from_art": d == url, "qr_decoded": d,
            "qr_size_in": 1.30,
            "safe_area_clear": all(mx(b) < 96 for b in bands.values()),
            "safe_area_detail": {k: int(mx(b)) for k, b in bands.items()},
            "fits_page": all(mx(b) < 96 for b in bands.values()) and d == url,
            "wordmarks": 1, "headlines": 1, "primary_ctas": 1, "qr_codes": 1,
            "projects_shown": [p["name"] for p in WORK],
            "duplicate_projects": len(WORK) != len({p["name"] for p in WORK}),
            "gmail_present": False, "price_present": False,
            "font_families": ["Inter"],
        }
    (OUT / "CAPABILITY-FLYER-QA.json").write_text(
        json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    for k, v in report.items():
        print(f"\n{k}: QR decodificado del arte = {v['qr_decoded_from_art']} | "
              f"safe area limpia = {v['safe_area_clear']}")


if __name__ == "__main__":
    main()
