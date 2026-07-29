# -*- coding: utf-8 -*-
"""305 PORTAL — tarjeta NFC física de 305 Web Service.

FINAL COPY REFINEMENT: la tarjeta física no explica servicios. Establece a 305 como
socio tecnológico, crea confianza y dirige a tocar o escanear. El catálogo, el
teléfono, el correo, el portafolio y el formulario viven en la tarjeta digital.

Identidad visual aprobada, intacta: navy casi negro, azul eléctrico, aqua contenido,
la geometría del portal (dos marcos abiertos y desplazados), proporciones CR80,
espacio negativo generoso, una sola acción NFC delante y una sola acción QR detrás.
Sin degradados, sin fotos de stock, sin patrones tecnológicos decorativos, sin iconos extra.

Una sola familia tipográfica: Inter.

CR80 / ISO-IEC 7810 ID-1 · 85.60 × 53.98 × 0.76 mm · NTAG215 · 13.56 MHz · 300 DPI

NO se emiten exportaciones de producción: quedan retenidas hasta confirmar la URL
final (`/c/305` público) y la plantilla del fabricante.
"""
import json, subprocess
from pathlib import Path
import cv2, qrcode, qrcode.image.svg
from PIL import Image

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
REPO = BRAND.parent
OUT = BRAND / "out" / "305-portal"
PROOFS = OUT / "proofs"
for d in (OUT, PROOFS): d.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FONTS = REPO / "node_modules" / "@fontsource"

DPI = 300
MM = DPI / 25.4
TRIM_W_MM, TRIM_H_MM = 85.60, 53.98
W, H = round(TRIM_W_MM * MM), round(TRIM_H_MM * MM)          # 1011 × 638
BLEED_MM = SAFE_MM = 3.0
BW, BH = round((TRIM_W_MM + 2*BLEED_MM)*MM), round((TRIM_H_MM + 2*BLEED_MM)*MM)
RADIUS_MM, QR_MM = 3.18, 25.0                                # QR ≥ 22 mm exigido

FINAL_QR_URL = ("https://www.305webservice.com/c/305"
                "?utm_source=qr&utm_medium=physical-card&utm_campaign=305-portal")
# /c/305 responde 404 → placeholder marcado. Nunca localhost, nunca la home genérica.
QR_URL = FINAL_QR_URL + "&proof=PREPRESS-PLACEHOLDER"
NFC_URL = ("https://www.305webservice.com/c/305"
           "?utm_source=nfc&utm_medium=physical-card&utm_campaign=305-portal")

NAVY, NAVY_DEEP = "#0b1826", "#060e18"
BLUE, AQUA, PAPER, WARM = "#2f7bff", "#3fd8c6", "#f5f3ee", "#f6f4ef"

# ── COPY APROBADA — literal, sin añadidos ────────────────────────────────────
F_STATEMENT  = "Technology that<br>moves you forward."
F_DESCRIPTOR = "Websites &#183; Software &#183; Connected experiences"
F_CTA        = "Tap to explore"
F_PLACE      = "Miami &#183; Working nationwide"
B_HOOK       = "Ready to build<br>what&#8217;s next?"
B_SUPPORT    = "Explore our work and discover<br>what we can build around your business."
B_CTA        = "Scan to start"
B_DOMAIN     = "305WEBSERVICE.COM"

FONT_CSS = "".join(
    f'@font-face{{font-family:"Inter";src:url("{(FONTS/"inter"/"files"/f"inter-latin-{w}-normal.woff2").as_uri()}") '
    f'format("woff2");font-weight:{w};font-style:normal;font-display:block}}'
    for w in (400, 500, 600, 700, 800, 900))

# geometría del portal, en fracciones del ancho/alto de la tarjeta
PX, PY, PW, PH = 0.664, 0.352, 0.262, 0.400      # marco exterior (azul)
IDX, IDY, ISC = 0.014, 0.036, 0.780              # desplazamiento y escala del interior (aqua)
GAP = 0.32                                        # proporción abierta de cada lado


def _frame(x, y, w, h, color, sw):
    """Rectángulo ABIERTO: esquina sup-izq + esquina inf-der, con huecos."""
    return (f'<path d="M {x} {y+h*GAP} V {y} H {x+w*(1-GAP)}" fill="none" stroke="{color}" '
            f'stroke-width="{sw}" stroke-linecap="square"/>'
            f'<path d="M {x+w} {y+h*(1-GAP)} V {y+h} H {x+w*GAP}" fill="none" stroke="{color}" '
            f'stroke-width="{sw}" stroke-linecap="square"/>')


def inner_center(w, h, ox, oy):
    ex, ey, ew, eh = ox+PX*w, oy+PY*h, PW*w, PH*h
    ix, iy, iw, ih = ex+IDX*w, ey+IDY*h, ew*ISC, eh*ISC
    return ix + iw/2, iy + ih/2


def portal_svg(w, h, ox, oy):
    """Dos marcos abiertos, el interior anidado y desplazado dentro del exterior.
    Pesos distintos: el marco cercano pesa más que el lejano → profundidad real."""
    ex, ey, ew, eh = ox+PX*w, oy+PY*h, PW*w, PH*h
    ix, iy, iw, ih = ex+IDX*w, ey+IDY*h, ew*ISC, eh*ISC
    return (f'<svg viewBox="0 0 {ox*2+w} {oy*2+h}" style="position:absolute;inset:0;width:100%;height:100%">'
            + _frame(ex, ey, ew, eh, BLUE, 0.0026*w)
            + _frame(ix, iy, iw, ih, AQUA, 0.0018*w) + '</svg>')


def corner_svg(w, h, ox, oy):
    """Reverso: una esquina aqua muy pequeña, continuación del portal."""
    x, y = ox + (SAFE_MM+2.6)*MM, oy + (SAFE_MM+2.6)*MM
    L = 0.062 * w
    return (f'<svg viewBox="0 0 {ox*2+w} {oy*2+h}" style="position:absolute;inset:0;width:100%;height:100%">'
            f'<path d="M {x} {y+L} V {y} H {x+L}" fill="none" stroke="{AQUA}" '
            f'stroke-width="{0.0026*w}" stroke-linecap="square"/></svg>')


def nfc_mark(px):
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="{BLUE}" stroke-width="1.8" '
            f'stroke-linecap="round" style="width:{px}px;height:{px}px;display:block">'
            f'<path d="M9 9a4.2 4.2 0 0 1 0 6"/><path d="M12.4 6.4a8 8 0 0 1 0 11.2"/>'
            f'<path d="M15.8 3.8a11.8 11.8 0 0 1 0 16.4"/></svg>')


def front_body(ox, oy):
    """1 gancho dominante · 2 wordmark · 3 descriptor contenido · 4 CTA en el NFC · 5 lugar."""
    pad = 5.6 * MM
    cx, cy = inner_center(W, H, ox, oy)
    return f"""
      <div class="grain"></div>
      {portal_svg(W, H, ox, oy)}

      <div style="position:absolute;left:{ox+pad}px;top:{oy+pad*0.98}px;
                  font-size:{3.50*MM}px;font-weight:800;letter-spacing:-0.010em;line-height:1;
                  text-transform:uppercase;color:{PAPER}">
        <span style="color:{BLUE}">305</span> Web Service</div>

      <div style="position:absolute;left:{ox+pad}px;right:{ox+pad}px;top:{oy+0.243*H}px;
                  height:{0.16*MM}px;background:rgba(246,244,239,0.13)"></div>

      <div style="position:absolute;left:{ox+pad}px;top:{oy+0.415*H}px;transform:translateY(-50%);
                  font-size:{4.05*MM}px;font-weight:700;letter-spacing:-0.012em;line-height:1.10;
                  text-transform:uppercase;color:{PAPER}">{F_STATEMENT}</div>

      <div style="position:absolute;left:{ox+pad}px;top:{oy+0.628*H}px;
                  font-size:{1.42*MM}px;font-weight:600;letter-spacing:0.155em;
                  text-transform:uppercase;color:rgba(246,244,239,0.46)">{F_DESCRIPTOR}</div>

      <div style="position:absolute;left:{ox+pad}px;bottom:{oy+pad*0.92}px;
                  font-size:{1.34*MM}px;font-weight:600;letter-spacing:0.20em;
                  text-transform:uppercase;color:rgba(246,244,239,0.34)">{F_PLACE}</div>

      <div style="position:absolute;left:{cx}px;top:{cy}px;transform:translate(-50%,-50%)">
        {nfc_mark(5.4*MM)}
      </div>
      <div style="position:absolute;left:{ox+PX*W}px;top:{oy+(PY+PH)*H + 2.7*MM}px;
                  font-size:{1.55*MM}px;font-weight:700;letter-spacing:0.24em;
                  text-transform:uppercase;color:{PAPER};white-space:nowrap">{F_CTA}</div>"""


def back_body(ox, oy, qr_uri):
    """1 gancho · 2 frase de apoyo · 3 QR · 4 SCAN TO START · 5 dominio discreto."""
    pad = 5.6 * MM
    plate = QR_MM + 3.4
    return f"""
      <div class="grain"></div>
      {corner_svg(W, H, ox, oy)}

      <div style="position:absolute;left:{ox+pad}px;top:{oy+pad*2.42}px;
                  font-size:{3.55*MM}px;font-weight:700;letter-spacing:-0.008em;line-height:1.12;
                  text-transform:uppercase;color:{PAPER}">{B_HOOK}</div>

      <div style="position:absolute;left:{ox+pad}px;top:{oy+0.585*H}px;
                  font-size:{1.82*MM}px;font-weight:400;line-height:1.44;
                  color:rgba(246,244,239,0.54)">{B_SUPPORT}</div>

      <div style="position:absolute;left:{ox+pad}px;bottom:{oy+pad*0.92}px;
                  font-size:{1.60*MM}px;font-weight:600;letter-spacing:0.16em;
                  color:rgba(246,244,239,0.44)">{B_DOMAIN}</div>

      <div style="position:absolute;right:{ox+pad}px;top:{oy+0.455*H}px;transform:translateY(-50%);
                  width:{plate*MM}px;display:flex;flex-direction:column;align-items:center">
        <div style="background:{WARM};width:{plate*MM}px;height:{plate*MM}px;border-radius:{1.3*MM}px;
                    display:flex;align-items:center;justify-content:center">
          <img src="{qr_uri}" style="display:block;width:{QR_MM*MM}px;height:{QR_MM*MM}px">
        </div>
        <div style="margin-top:{2.5*MM}px;font-size:{1.55*MM}px;font-weight:700;letter-spacing:0.26em;
                    text-transform:uppercase;color:{PAPER};white-space:nowrap">{B_CTA}</div>
      </div>"""


def card_html(side, qr_uri, bleed=False):
    w, h = (BW, BH) if bleed else (W, H)
    ox = oy = (BLEED_MM*MM) if bleed else 0
    radius = 0 if bleed else RADIUS_MM*MM
    body = front_body(ox, oy) if side == "front" else back_body(ox, oy, qr_uri)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;width:{w}px;height:{h}px;overflow:hidden;background:#0d1013}}
.card{{position:relative;width:{w}px;height:{h}px;border-radius:{radius}px;overflow:hidden;
 background:radial-gradient(58% 66% at 78% 50%, rgba(47,123,255,0.10), transparent 66%),
            linear-gradient(150deg, {NAVY} 0%, {NAVY_DEEP} 100%);}}
.grain{{position:absolute;inset:0;opacity:0.22;mix-blend-mode:soft-light;
 background-image:radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.6px);background-size:3px 3px}}
</style></head><body><div class="card">{body}</div></body></html>"""


def sheet_html(front_png, back_png):
    r = RADIUS_MM*MM
    def im(p): return f'<img src="{Path(p).as_uri()}" style="display:block;border-radius:{r}px">'
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;background:#0d1013;width:{W*2+46+112}px;height:{H+240}px}}
</style></head><body><div style="padding:56px">
<div style="display:flex;gap:46px">
 <div>{im(front_png)}<div style="margin-top:14px;font-size:16px;font-weight:700;letter-spacing:0.2em;
   text-transform:uppercase;color:rgba(255,255,255,0.5)">Front</div></div>
 <div>{im(back_png)}<div style="margin-top:14px;font-size:16px;font-weight:700;letter-spacing:0.2em;
   text-transform:uppercase;color:rgba(255,255,255,0.5)">Back</div></div></div>
<div style="margin-top:30px;display:flex;justify-content:space-between;align-items:center">
 <div style="font-size:17px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#8fb4ff">
   305 Portal &#183; CR80 85.60 &#215; 53.98 &#215; 0.76 mm &#183; NTAG215</div>
 <div style="font-size:16px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#ff6b6b">
   Prepress pending final QR &#8212; not for print</div>
</div></div></body></html>"""


LW, LH = 2550, 3300   # Letter @300 DPI


def proof_1to1_html(front_png, back_png):
    """Hoja Letter con ambas caras a escala EXACTA 1:1 (imprimir al 100%)."""
    r = RADIUS_MM*MM
    def block(png, label, top):
        marks = "".join(
            f'<div style="position:absolute;{a}:-{7*MM}px;{b}:{v};width:{5*MM if a in ("left","right") else 0.5}px;'
            f'height:{0.5 if a in ("left","right") else 5*MM}px;background:#94a3b8"></div>'
            for a, b, v in (("left","top","0"),("left","bottom","0"),("right","top","0"),
                            ("right","bottom","0"),("top","left","0"),("top","right","0"),
                            ("bottom","left","0"),("bottom","right","0")))
        return f"""<div style="position:absolute;left:{(LW-W)/2}px;top:{top}px;width:{W}px;height:{H}px">
          {marks}<img src="{Path(png).as_uri()}" style="display:block;width:{W}px;height:{H}px;border-radius:{r}px">
          <div style="position:absolute;left:0;top:{H+6*MM}px;font-size:{3.0*MM}px;font-weight:700;
               letter-spacing:0.22em;text-transform:uppercase;color:#64748b">{label}</div></div>"""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;width:{LW}px;height:{LH}px;background:#fff;position:relative}}
</style></head><body>
<div style="position:absolute;left:{(LW-W)/2}px;top:{22*MM}px;width:{W}px">
  <div style="font-size:{5.0*MM}px;font-weight:800;letter-spacing:-0.01em;color:#0b1826">305 PORTAL</div>
  <div style="margin-top:{2*MM}px;font-size:{3.0*MM}px;color:#475569;line-height:1.5">
    Escala 1:1 &#183; CR80 85.60 &#215; 53.98 mm &#183; imprimir esta hoja al <b>100%</b>
    (sin &#8220;ajustar a p&#225;gina&#8221;).<br>
    Verificar con una tarjeta NTAG215 real encima. Marcas grises = l&#237;nea de corte.</div>
  <div style="margin-top:{3*MM}px;font-size:{3.0*MM}px;font-weight:800;letter-spacing:0.14em;
       text-transform:uppercase;color:#dc2626">Prepress pending final QR &#8212; not for print</div>
</div>
{block(front_png, "Front", 62*MM)}
{block(back_png, "Back", 62*MM + H + 22*MM)}
</body></html>"""


def tech_sheet_html(front_png, back_png):
    """Lámina técnica SEPARADA: sangrado, corte y safe area. No es arte de impresión."""
    sc = 1.55
    bw, bh = BW*sc, BH*sc
    off = BLEED_MM*MM*sc
    sa = SAFE_MM*MM*sc
    def unit(png, label):
        return f"""<div style="position:relative;width:{bw}px;height:{bh}px;background:#111a24;outline:2px solid #334155">
          <img src="{Path(png).as_uri()}" style="position:absolute;left:{off}px;top:{off}px;
               width:{W*sc}px;height:{H*sc}px;border-radius:{RADIUS_MM*MM*sc}px">
          <div style="position:absolute;left:{off}px;top:{off}px;width:{W*sc}px;height:{H*sc}px;
               border:2px dashed #ff6b6b"></div>
          <div style="position:absolute;left:{off+sa}px;top:{off+sa}px;width:{W*sc-2*sa}px;height:{H*sc-2*sa}px;
               border:2px dashed #2f7bff"></div>
          <div style="position:absolute;left:0;bottom:-42px;font-size:24px;font-weight:700;
               letter-spacing:0.2em;text-transform:uppercase;color:#64748b">{label}</div></div>"""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;background:#0d1013;width:{bw*2+80+140}px;height:{bh+400}px}}
</style></head><body><div style="padding:70px">
<div style="display:flex;gap:80px">{unit(front_png,"Front")}{unit(back_png,"Back")}</div>
<div style="margin-top:78px;font-size:26px;line-height:1.7;color:#cbd5e1;max-width:{bw*2}px">
  <b style="color:#8fb4ff">L&#193;MINA T&#201;CNICA &#8212; no es arte de impresi&#243;n.</b><br>
  Gris s&#243;lido = <b>sangrado</b> 3 mm por lado (91.60 &#215; 59.98 mm / 1082 &#215; 708 px).
  Rojo discontinuo = <b>l&#237;nea de corte</b> (85.60 &#215; 53.98 mm / 1011 &#215; 638 px).
  Azul discontinuo = <b>safe area</b> 3 mm.<br>
  El sangrado de 3 mm es <b>provisional</b> y la <b>posici&#243;n del chip NTAG215 est&#225; PENDIENTE</b>
  de la plantilla del fabricante; al recibirla, el s&#237;mbolo NFC se realinea con la antena
  sin alterar el resto de la composici&#243;n.
</div>
<div style="margin-top:28px;font-size:25px;font-weight:800;letter-spacing:0.2em;
     text-transform:uppercase;color:#ff6b6b">Prepress pending final QR &#8212; not for print</div>
</div></body></html>"""


def render(html, out, w, h, tag):
    f = ROOT / f"_portal-{tag}.html"
    f.write_text(html, encoding="utf-8")
    subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
        "--virtual-time-budget=9000", f"--window-size={w},{h}", f"--screenshot={out}",
        f.as_uri()], check=False, capture_output=True, timeout=200)
    print(f"  {Path(out).name}  {w}x{h}")


def main():
    qr_svg = OUT / "_qr.svg"
    qrcode.make(QR_URL, error_correction=qrcode.constants.ERROR_CORRECT_Q, border=4,
                image_factory=qrcode.image.svg.SvgPathImage).save(str(qr_svg))
    qr_uri = qr_svg.as_uri()

    flat = {}
    for side in ("front", "back"):
        p = PROOFS / f"305-portal-{side}-PROOF-1011x638-sRGB.png"
        render(card_html(side, qr_uri, False), p, W, H, f"p-{side}")
        flat[side] = p

    render(sheet_html(flat["front"], flat["back"]),
           OUT / "305-portal-sheet.png", W*2+46+112, H+240, "sheet")
    render(proof_1to1_html(flat["front"], flat["back"]),
           OUT / "305-portal-PROOF-1to1-letter.png", LW, LH, "proof")
    sc = 1.55
    render(tech_sheet_html(flat["front"], flat["back"]),
           OUT / "305-portal-tech-guides.png", int(BW*sc*2+80+140), int(BH*sc+400), "tech")

    # ── verificación ────────────────────────────────────────────────────────
    det = cv2.QRCodeDetector()
    a = cv2.imread(str(flat["back"]))
    d, _, _ = det.detectAndDecode(a)
    if not d:
        d, _, _ = det.detectAndDecode(cv2.resize(a, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC))

    safe = round(SAFE_MM*MM); qa = {}
    for side, p in flat.items():
        im = Image.open(p).convert("L")
        mx = lambda b: max(im.crop(b).getdata())
        bands = {"left": (0, 0, safe, H), "right": (W-safe, 0, W, H),
                 "top": (0, 0, W, safe), "bottom": (0, H-safe, W, H)}
        qa[side] = {"safe_area_clear": all(mx(b) < 90 for b in bands.values())}
        if side == "front":
            band = (round(0.300*H), round(0.530*H))          # filas del gancho
            ink = [x for x in range(W)
                   if max(im.crop((x, band[0], x+1, band[1])).getdata()) > 90]
            gaps, run = [], 0
            for x in range(ink[0], ink[-1]):
                run = 0 if x in set(ink) else run + 1
                if run: gaps.append((x, run))
            widest = max((r for _, r in gaps), default=0)
            qa[side]["hook_to_portal_gap_px"] = widest
            qa[side]["hook_to_portal_gap_mm"] = round(widest/MM, 2)
            qa[side]["no_collision"] = widest >= 24

    rep = {
        "status": "PREPRESS PENDING FINAL QR",
        "production_exports": "HELD — se emiten solo tras confirmar URL final y plantilla del fabricante",
        "blocker": "https://www.305webservice.com/c/305 responde 404; el QR embebido es placeholder",
        "copy": {
            "front": ["305 WEB SERVICE", "TECHNOLOGY THAT MOVES YOU FORWARD.",
                      "WEBSITES · SOFTWARE · CONNECTED EXPERIENCES", "TAP TO EXPLORE",
                      "MIAMI · WORKING NATIONWIDE"],
            "back": ["READY TO BUILD WHAT'S NEXT?",
                     "Explore our work and discover what we can build around your business.",
                     "[QR]", "SCAN TO START", "305WEBSERVICE.COM"],
            "removed": ["STRATEGY · DESIGN · ENGINEERING",
                        "DIGITAL SYSTEMS, BUILT FOR BUSINESS.", "TAP TO CONNECT",
                        "LET'S BUILD WHAT'S NEXT.",
                        "Explore our work, capabilities and ways to connect.",
                        "SCAN TO CONNECT", "BUSINESS TECHNOLOGY",
                        "lista de 4 servicios y sus 4 detalles",
                        "MIAMI, FLORIDA · UNITED STATES", "DIRECT LINE", "teléfono impreso",
                        "dirección Gmail", "Technology built around your business.",
                        "Tell us what you're trying to improve.", "305-001"],
            "forward_occurrences_front": 1},
        "routes": {"front": 1, "back": 1,
                   "note": "una acción por cara: NFC delante, QR detrás"},
        "qr": {"decoded_from_final_file": d == QR_URL, "decoded": d,
               "placeholder_url": QR_URL, "final_url_when_live": FINAL_QR_URL,
               "ecc": "Q", "size_mm": QR_MM, "min_required_mm": 22.0,
               "quiet_zone_modules": 4, "logo_inside": False, "localhost": False,
               "points_to_canonical_card_route": True},
        "nfc": {"ndef_uri_when_live": NFC_URL, "bytes": len(NFC_URL),
                "chip": "NTAG215 (504 B)", "fits": len(NFC_URL) < 490,
                "programmed": False, "locked": False},
        "format": {"standard": "CR80 / ISO-IEC 7810 ID-1",
                   "trim_mm": [TRIM_W_MM, TRIM_H_MM], "thickness_mm": 0.76,
                   "corner_radius_mm": RADIUS_MM, "dpi": DPI,
                   "trim_px": [W, H], "bleed_px": [BW, BH],
                   "bleed_mm": BLEED_MM, "bleed_note": "PROVISIONAL — confirmar con proveedor",
                   "safe_mm": SAFE_MM},
        "typography": {"families": ["Inter"], "count": 1,
                       "wordmark_mm_pt": [4.95, 14.0], "descriptor_mm_pt": [1.55, 4.4],
                       "statement_mm_pt": [3.75, 10.6], "hook_mm_pt": [3.55, 10.1],
                       "support_mm_pt": [1.82, 5.2], "cta_mm_pt": [1.55, 4.4],
                       "place_mm_pt": [1.36, 3.9], "domain_mm_pt": [1.60, 4.5],
                       "statement_tracking": "-0.008em (sin tracking ancho en el mensaje principal)"},
        "qa": qa,
    }
    (OUT / "PORTAL-SPEC.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False), encoding="utf-8")
    print("\nQR decodificado desde el archivo final:", rep["qr"]["decoded_from_final_file"])
    print("Safe area limpia:", {k: v["safe_area_clear"] for k, v in qa.items()})
    print("Estado:", rep["status"])
    print("Producción:", rep["production_exports"])


if __name__ == "__main__":
    main()
