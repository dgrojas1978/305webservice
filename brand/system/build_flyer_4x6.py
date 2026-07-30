# -*- coding: utf-8 -*-
"""Flyer 4 x 6 in de 305 Web Service — EN y ES, dos caras.

Formato: 4.00 x 6.00 in (1200 x 1800 px @300 DPI) + 0.125 in de sangrado.

Piso tipografico: 8 pt es el minimo del sector para pieza en mano; el texto
claro sobre fondo oscuro se imprime mas delgado (reverse printing), asi que se
le suma 1 pt -> MIN_PT = 9. Ninguna cadena baja de ahi; `pt()` lo asegura y
revienta el build si alguien lo intenta.

Cara A  gancho + prueba real + accion (un QR, un CTA)
Cara B  que hace 305, explicado, + contacto

Reglas: un wordmark por cara, un QR en toda la pieza, sin Gmail, sin precio
como mensaje maestro, sin proyectos repetidos.
"""
import io, json, subprocess
from pathlib import Path
import cv2, img2pdf, qrcode, qrcode.image.svg
from PIL import Image
import press

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
REPO = BRAND.parent
OUT = BRAND / "out" / "flyers-4x6"
OUT.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FONTS = REPO / "node_modules" / "@fontsource"
WORK_DIR = REPO / "public" / "work"

DPI = 300
IN = DPI
W, H = 4 * DPI, 6 * DPI                    # 1200 x 1800
BLEED = round(0.125 * DPI)
BW, BH = W + 2*BLEED, H + 2*BLEED
SAFE = round(0.1875 * DPI)                 # 3/16 in
PAD = 0.34 * IN

MIN_PT = 9.0
PT = DPI / 72.0
def pt(v):
    assert v >= MIN_PT, f"{v} pt < piso de {MIN_PT} pt"
    return v * PT

NAVY, NAVY_DEEP = "#122236", "#0b1826"
BLUE, AQUA, PAPER = "#2f7bff", "#3fd8c6", "#f5f3ee"

DOMAIN = "305WEBSERVICE.COM"
PHONE = "(305) 833-2984"                   # src/lib/site.ts

FONT_CSS = "".join(
    f'@font-face{{font-family:"Inter";src:url("{(FONTS/"inter"/"files"/f"inter-latin-{w}-normal.woff2").as_uri()}") '
    f'format("woff2");font-weight:{w};font-style:normal;font-display:block}}'
    for w in (400, 500, 600, 700, 800, 900))

WORK = [
    {"name": "Aguiar Flooring", "img": "aguiar.jpg",
     "purpose": {"en": "Commerce and quote generation",
                 "es": "Comercio y generaci\u00f3n de cotizaciones"}},
    {"name": "Light Specter Film", "img": "lsf.jpg",
     "purpose": {"en": "Cinematic brand and lead experience",
                 "es": "Marca cinematogr\u00e1fica y captaci\u00f3n"}},
    {"name": "Polkanea Productions", "img": "polkanea.jpg",
     "purpose": {"en": "Streaming and content discovery",
                 "es": "Streaming y descubrimiento"}},
]

COPY = {
    "en": {
        "eyebrow": "Strategy &#183; Design &#183; Engineering",
        "hook": "Digital systems,<br>built for<br>business.",
        "hook_pt": 23.0,
        "sub": "Websites, custom software and connected experiences designed around real business goals.",
        "proof_label": "Selected work",
        "disclosure": "Selected custom projects. Features and pricing vary by scope.",
        "cta_line": "Let&#8217;s discuss what your business needs next.",
        "cta": "Start a project",
        "scan": "Scan to start",
        "build_label": "What we build",
        "groups": [
            ("Digital experiences",
             "Websites, online stores and customer-facing platforms built for clarity, credibility and conversion."),
            ("Custom systems",
             "Software, portals, dashboards and internal tools shaped around your real workflows."),
            ("Connected business solutions",
             "NFC cards and touchpoints, review journeys, lead capture and practical automation."),
        ],
        "how_label": "How it works",
        "steps": ["Understand the business and the objective.",
                  "Design the experience and the system.",
                  "Build, integrate and test.",
                  "Support improvements as you grow."],
        "talk_label": "Let&#8217;s talk",
        "place": "Miami &#183; Working nationwide",
        "langs": "English &amp; Spanish",
    },
    "es": {
        "eyebrow": "Estrategia &#183; Dise&#241;o &#183; Ingenier&#237;a",
        "hook": "Sistemas digitales,<br>hechos para<br>tu negocio.",
        "hook_pt": 19.0,
        "sub": "Sitios web, software a medida y experiencias conectadas para objetivos reales de negocio.",
        "proof_label": "Trabajo seleccionado",
        "disclosure": "Proyectos personalizados seleccionados. Las funciones y el precio var&#237;an seg&#250;n el alcance.",
        "cta_line": "Hablemos de lo que tu negocio necesita ahora.",
        "cta": "Empezar un proyecto",
        "scan": "Escanea para empezar",
        "build_label": "Lo que construimos",
        "groups": [
            ("Experiencias digitales",
             "Sitios web, tiendas en l&#237;nea y plataformas de cara al cliente, con claridad, credibilidad y conversi&#243;n."),
            ("Sistemas a medida",
             "Software, portales, paneles y herramientas internas hechas alrededor de tus flujos reales."),
            ("Soluciones de negocio conectadas",
             "Tarjetas y puntos NFC, rutas de rese&#241;as, captaci&#243;n de prospectos y automatizaci&#243;n pr&#225;ctica."),
        ],
        "how_label": "C&#243;mo trabajamos",
        "steps": ["Entendemos el negocio y el objetivo.",
                  "Dise&#241;amos la experiencia y el sistema.",
                  "Construimos, integramos y probamos.",
                  "Acompa&#241;amos las mejoras al crecer."],
        "talk_label": "Hablemos",
        "place": "Miami &#183; Trabajamos en todo EE. UU.",
        "langs": "Espa&#241;ol e ingl&#233;s",
    },
}

def qr_url(lang):
    return (f"https://www.305webservice.com/?utm_source=print&utm_medium=qr"
            f"&utm_campaign=305-flyer-4x6&utm_content={lang}")


def shell(inner, w, h):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;width:{w}px;height:{h}px;overflow:hidden;
 background:{NAVY}}}
.rule{{height:{max(2, round(0.006*IN))}px;background:rgba(246,244,239,0.30)}}
.lbl{{font-size:{pt(9.0)}px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:{AQUA}}}
</style></head><body>{inner}</body></html>"""


def wordmark(size_pt):
    return (f'<div style="font-size:{pt(size_pt)}px;font-weight:800;letter-spacing:-0.014em;'
            f'line-height:1;text-transform:uppercase;color:{PAPER}">'
            f'<span style="color:{BLUE}">305</span> Web Service</div>')


def side_a(lang, bleed):
    c = COPY[lang]
    ox = oy = BLEED if bleed else 0
    proof = "".join(f"""
      <div style="flex:1;min-width:0">
        <img src="{(WORK_DIR / p['img']).as_uri()}"
             style="display:block;width:100%;aspect-ratio:16/10;object-fit:cover;
                    border-radius:{0.045*IN}px;border:1px solid rgba(246,244,239,0.16)">
        <div style="margin-top:{0.085*IN}px;font-size:{pt(9.0)}px;font-weight:800;line-height:1.15;
                    color:{PAPER}">{p['name']}</div>
      </div>""" for p in WORK)

    inner = f"""
<div style="position:absolute;left:{ox+PAD}px;top:{oy+PAD}px;right:{ox+PAD}px;bottom:{oy+PAD}px;
            display:flex;flex-direction:column">
  {wordmark(13.0)}
  <div style="margin-top:{0.10*IN}px" class="lbl">{c['eyebrow']}</div>

  <div style="margin-top:{0.20*IN}px;font-size:{pt(c['hook_pt'])}px;font-weight:800;
              letter-spacing:-0.022em;line-height:1.04;text-transform:uppercase;
              color:{PAPER}">{c['hook']}</div>

  <div style="margin-top:{0.16*IN}px;font-size:{pt(10.0)}px;line-height:1.42;
              color:rgba(246,244,239,0.64)">{c['sub']}</div>

  <div style="margin-top:{0.22*IN}px" class="lbl">{c['proof_label']}</div>
  <div style="margin-top:{0.13*IN}px;display:flex;gap:{0.13*IN}px">{proof}</div>

  <div style="flex:1"></div>

  <div class="rule"></div>
  <div style="margin-top:{0.20*IN}px;display:flex;align-items:flex-end;
              justify-content:space-between;gap:{0.22*IN}px">
    <div style="flex:1;min-width:0">
      <div style="font-size:{pt(12.5)}px;font-weight:800;letter-spacing:-0.014em;line-height:1.14;
                  color:{PAPER}">{c['cta_line']}</div>
      <div style="margin-top:{0.15*IN}px;display:inline-block;background:{BLUE};color:#fff;
                  padding:{0.085*IN}px {0.20*IN}px;border-radius:{0.045*IN}px;
                  font-size:{pt(10.0)}px;font-weight:800;letter-spacing:0.10em;
                  text-transform:uppercase">{c['cta']}</div>
    </div>
    <div style="flex:none;text-align:center">
      <div style="background:#f6f4ef;padding:{0.055*IN}px;border-radius:{0.045*IN}px">
        <img src="{(OUT / f'_qr-{lang}.svg').as_uri()}"
             style="display:block;width:{1.05*IN}px;height:{1.05*IN}px">
      </div>
      <div style="margin-top:{0.07*IN}px;font-size:{pt(9.0)}px;font-weight:700;
                  letter-spacing:0.08em;text-transform:uppercase;
                  color:rgba(246,244,239,0.62)">{c['scan']}</div>
    </div>
  </div>
</div>"""
    return shell(inner, *((BW, BH) if bleed else (W, H)))


def side_b(lang, bleed):
    c = COPY[lang]
    ox = oy = BLEED if bleed else 0
    groups = "".join(f"""
      <div style="margin-top:{0 if i == 0 else 0.20*IN}px;display:flex;gap:{0.15*IN}px">
        <span style="flex:none;width:{0.20*IN}px;height:{max(2, round(0.007*IN))}px;background:{AQUA};
                     margin-top:{0.055*IN}px"></span>
        <div style="min-width:0">
          <div style="font-size:{pt(10.5)}px;font-weight:800;line-height:1.15;
                      color:{PAPER}">{n}</div>
          <div style="margin-top:{0.05*IN}px;font-size:{pt(9.0)}px;line-height:1.42;
                      color:rgba(246,244,239,0.60)">{d}</div>
        </div>
      </div>""" for i, (n, d) in enumerate(c["groups"]))

    steps = "".join(f"""
      <div style="margin-top:{0 if i == 0 else 0.075*IN}px;font-size:{pt(9.0)}px;line-height:1.4;
                  color:rgba(246,244,239,0.60)">
        <span style="color:{AQUA};font-weight:800">{i+1}</span>&nbsp;&nbsp;{s}</div>"""
        for i, s in enumerate(c["steps"]))

    inner = f"""
<div style="position:absolute;left:{ox+PAD}px;top:{oy+PAD}px;right:{ox+PAD}px;bottom:{oy+PAD}px;
            display:flex;flex-direction:column">
  {wordmark(11.5)}

  <div style="margin-top:{0.26*IN}px" class="lbl">{c['build_label']}</div>
  <div style="margin-top:{0.14*IN}px">{groups}</div>

  <div style="flex:1"></div>

  <div class="rule"></div>
  <div style="margin-top:{0.18*IN}px" class="lbl">{c['talk_label']}</div>
  <div style="margin-top:{0.11*IN}px;font-size:{pt(15.0)}px;font-weight:800;letter-spacing:-0.010em;
              color:{PAPER}">{PHONE}</div>
  <div style="margin-top:{0.07*IN}px;font-size:{pt(11.0)}px;font-weight:700;letter-spacing:0.06em;
              color:{PAPER}">{DOMAIN}</div>
  <div style="margin-top:{0.10*IN}px;font-size:{pt(9.0)}px;font-weight:600;letter-spacing:0.075em;
              text-transform:uppercase;color:rgba(246,244,239,0.46)">
    {c['place']} &#183; {c['langs']}</div>
  <div style="margin-top:{0.12*IN}px;font-size:{pt(9.0)}px;line-height:1.35;
              color:rgba(246,244,239,0.34)">{c['disclosure']}</div>
</div>"""
    return shell(inner, *((BW, BH) if bleed else (W, H)))


def render(html, out, w, h, tag):
    f = ROOT / f"_f46-{tag}.html"
    f.write_text(html, encoding="utf-8")
    subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
        "--virtual-time-budget=12000", f"--window-size={w},{h}", f"--screenshot={out}",
        f.as_uri()], check=False, capture_output=True, timeout=260)
    print(f"  {Path(out).name}  {w}x{h}")


def main():
    det = cv2.QRCodeDetector()
    report = {"format": {"trim_in": [4.0, 6.0], "trim_px": [W, H],
                         "bleed_in": 0.125, "bleed_px": [BW, BH],
                         "safe_in": 0.1875, "dpi": DPI},
              "press": {"flat_background": True, "gradients": False, "grain": False,
                        "min_rule_pt": 0.5, "navy_target_cmyk": press.NAVY_TARGET_CMYK,
                        "note": "fondo plano y sin grano para que funcione en vinilo, "
                                "no estucado, estucado y digital sin recalcular"},
              "typography": {"floor_pt": MIN_PT,
                             "rationale": "8 pt minimo del sector +1 pt por reverse printing",
                             "families": ["Inter"]}}
    for lang in ("en", "es"):
        url = qr_url(lang)
        qrcode.make(url, error_correction=qrcode.constants.ERROR_CORRECT_Q, border=4,
                    image_factory=qrcode.image.svg.SvgPathImage).save(str(OUT / f"_qr-{lang}.svg"))
        r = {}
        for face, fn in (("A", side_a), ("B", side_b)):
            png = OUT / f"305-flyer-4x6-{lang}-side{face}-300dpi.png"
            render(fn(lang, False), png, W, H, f"{lang}{face}")
            bl = OUT / f"_bleed-{lang}{face}.png"
            render(fn(lang, True), bl, BW, BH, f"{lang}{face}b")
            src = Image.open(bl).convert("RGB")
            ink = press.report(src)
            buf = io.BytesIO()
            press.cmyk_image(src).save(buf, "JPEG", quality=96, dpi=(DPI, DPI))
            pdf = OUT / f"305-flyer-4x6-{lang}-side{face}-cmyk-bleed.pdf"
            pdf.write_bytes(img2pdf.convert(buf.getvalue(),
                            layout_fun=img2pdf.get_fixed_dpi_layout_fun((DPI, DPI))))
            print(f"  {pdf.name}")

            g = Image.open(png).convert("L")
            mx = lambda b: max(g.crop(b).getdata())
            bands = {"left": (0, 0, SAFE, H), "right": (W-SAFE, 0, W, H),
                     "top": (0, 0, W, SAFE), "bottom": (0, H-SAFE, W, H)}
            r[f"side{face}"] = {"safe_area_clear": all(mx(b) < 96 for b in bands.values()),
                                "safe_area_detail": {k: int(mx(b)) for k, b in bands.items()},
                                "ink": ink}
            if face == "A":
                img = cv2.imread(str(png))
                d, _, _ = det.detectAndDecode(img)
                for f in (2, 3, 4):
                    if d:
                        break
                    d, _, _ = det.detectAndDecode(cv2.resize(img, None, fx=f, fy=f,
                                                             interpolation=cv2.INTER_CUBIC))
                r["qr_url"] = url
                r["qr_decoded_from_art"] = d == url
                r["qr_size_in"] = 1.05
                r["qr_size_mm"] = 26.7
        r["qr_codes_in_piece"] = 1
        r["gmail_present"] = False
        r["price_present"] = False
        report[lang] = r
    (OUT / "FLYER-4x6-QA.json").write_text(json.dumps(report, indent=1, ensure_ascii=False),
                                           encoding="utf-8")
    for lang in ("en", "es"):
        v = report[lang]
        print(f"\n{lang}: QR del arte = {v['qr_decoded_from_art']} | "
              f"A limpia = {v['sideA']['safe_area_clear']} | B limpia = {v['sideB']['safe_area_clear']}")


if __name__ == "__main__":
    main()
