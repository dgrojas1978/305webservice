# -*- coding: utf-8 -*-
"""305 SIGNAL — tarjeta NFC física de 305 Web Service. CONCEPT PROOF.

Concepto: una señal que nace en la marca, recorre la tarjeta con un giro
preciso y muere en el punto de interacción NFC. Business → Technology →
Connection. Una sola dirección resuelta, sin alternativas.

CR80: trim 85.60 × 53.98 mm (ratio 1.586) · 300 DPI → 1011 × 638 px.
Esquinas redondeadas 3.18 mm (radio de tarjeta bancaria).

NO es archivo de producción: sin PDF/X, sin programar NFC, sin bloquear chip.
La marca de proof va FUERA del arte; las guías técnicas, en lámina aparte.
"""
import json, subprocess, tempfile, time, urllib.request, shutil
from pathlib import Path
import qrcode, qrcode.image.svg, websocket

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
REPO = BRAND.parent
OUT = BRAND / "out" / "305-signal"
OUT.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FONTS = REPO / "node_modules" / "@fontsource"

DPI = 300
MM = DPI / 25.4                       # 11.811 px/mm
TRIM_W_MM, TRIM_H_MM = 85.60, 53.98
W = round(TRIM_W_MM * MM)             # 1011
H = round(TRIM_H_MM * MM)             # 638
RADIUS = 3.18 * MM                    # esquina de tarjeta bancaria
BLEED_MM, SAFE_MM = 2.0, 3.0          # PROVISIONALES (pendiente plantilla)

PLACEHOLDER_URL = "https://www.305webservice.com/c/305?proof=CONCEPT-NOT-FOR-PRINT"

NAVY = "#0a1728"
NAVY_DEEP = "#050d1a"
BLUE = "#2f7bff"
AQUA = "#20d7c5"
PAPER = "#f7f9fc"
WARM = "#f4f2ed"


def ff(fam, pkg, f, w):
    return (f'@font-face{{font-family:"{fam}";src:url("{(FONTS/pkg/"files"/f).as_uri()}") format("woff2");'
            f'font-weight:{w};font-style:normal;font-display:block}}')


FONT_CSS = "".join([
    ff("Inter", "inter", "inter-latin-400-normal.woff2", 400),
    ff("Inter", "inter", "inter-latin-500-normal.woff2", 500),
    ff("Inter", "inter", "inter-latin-600-normal.woff2", 600),
    ff("Inter", "inter", "inter-latin-700-normal.woff2", 700),
    ff("Inter", "inter", "inter-latin-900-normal.woff2", 900),
])

BASE_CSS = f"""
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;background:#101418}}
.card{{position:relative;width:{W}px;height:{H}px;border-radius:{RADIUS}px;overflow:hidden;
  background:
    radial-gradient(58% 70% at 84% 88%, rgba(47,123,255,0.20), transparent 62%),
    radial-gradient(50% 60% at 6% 4%, rgba(47,123,255,0.10), transparent 60%),
    linear-gradient(152deg, {NAVY} 0%, {NAVY_DEEP} 100%);
}}
.grain{{position:absolute;inset:0;opacity:0.30;mix-blend-mode:soft-light;
  background-image:radial-gradient(rgba(255,255,255,0.55) 0.5px, transparent 0.6px);
  background-size:3px 3px}}
"""

# --- SIGNAL LINE ------------------------------------------------------------
# Nace bajo el wordmark, avanza, hace UN giro preciso y termina en el punto NFC
# (inferior derecha). Un solo pulso. No es un circuito ni un patrón.
SX, SY = 0.088 * W, 0.335 * H          # origen: bajo el wordmark
TX, TY = 0.795 * W, 0.735 * H          # destino: punto de interacción
CORNER_X = 0.575 * W                    # el giro


def signal_svg(reverse=False):
    """En el reverso continúa la misma señal, entrando desde el borde izquierdo."""
    if not reverse:
        d = f"M {SX} {SY} H {CORNER_X} L {TX} {TY} H {TX + 0.052*W}"
        pulses = [(SX, SY), (CORNER_X, SY)]
    else:
        d = f"M 0 {0.20*H} H {0.185*W} L {0.255*W} {0.315*H} H {0.288*W}"
        pulses = [(0.185 * W, 0.20 * H)]
    dots = "".join(
        f'<circle cx="{x}" cy="{y}" r="{0.0042*W}" fill="{AQUA}" opacity="0.95"/>' for x, y in pulses)
    return f"""
    <svg viewBox="0 0 {W} {H}" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">
      <defs>
        <linearGradient id="sig" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="{AQUA}" stop-opacity="0.30"/>
          <stop offset="55%" stop-color="{AQUA}" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="{AQUA}" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <path d="{d}" fill="none" stroke="url(#sig)" stroke-width="{0.0028*W}"
            stroke-linecap="round" stroke-linejoin="miter"/>
      {dots}
    </svg>"""


def nfc_mark(size_px, color=AQUA):
    """Símbolo NFC monolínea, discreto."""
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.6" '
            f'stroke-linecap="round" style="width:{size_px}px;height:{size_px}px;display:block">'
            f'<path d="M8 8.6a4.6 4.6 0 0 1 0 6.8"/><path d="M11.6 5.9a8.4 8.4 0 0 1 0 12.2"/>'
            f'<path d="M15.2 3.2a12.2 12.2 0 0 1 0 17.6"/></svg>')


def front():
    pad = (SAFE_MM + 2.6) * MM
    return f"""
    <div class="card">
      <div class="grain"></div>
      {signal_svg()}
      <div style="position:absolute;inset:0;padding:{pad}px">
        <div style="font-size:{5.0*MM}px;font-weight:900;letter-spacing:-0.012em;line-height:1;
                    text-transform:uppercase;color:{PAPER}">
          <span style="color:{BLUE}">305</span> Web Service
        </div>
        <div style="margin-top:{1.9*MM}px;font-size:{1.75*MM}px;font-weight:700;letter-spacing:0.30em;
                    text-transform:uppercase;color:rgba(247,249,252,0.46)">Business technology</div>
      </div>
      <!-- punto de interacción: CTA + símbolo NFC donde termina la señal -->
      <div style="position:absolute;right:{(SAFE_MM+2.6)*MM}px;bottom:{(SAFE_MM+2.4)*MM}px;
                  display:flex;align-items:center;gap:{2.1*MM}px">
        <span style="font-size:{2.35*MM}px;font-weight:700;letter-spacing:0.24em;
                     text-transform:uppercase;color:{PAPER}">Tap to connect</span>
        {nfc_mark(4.4*MM)}
      </div>
    </div>"""


def back(qr_uri):
    pad = (SAFE_MM + 2.6) * MM
    qr_mm = 22.5
    plate_mm = qr_mm + 5.2
    return f"""
    <div class="card">
      <div class="grain"></div>
      {signal_svg(reverse=True)}
      <!-- bloque único: superficie cálida + QR + CTA -->
      <div style="position:absolute;right:{pad}px;top:50%;transform:translateY(-50%);
                  display:flex;align-items:center;gap:{3.4*MM}px">
        <div style="text-align:right">
          <div style="font-size:{2.35*MM}px;font-weight:700;letter-spacing:0.24em;
                      text-transform:uppercase;color:{PAPER};white-space:nowrap">Scan to connect</div>
          <div style="margin-top:{1.5*MM}px;font-size:{1.7*MM}px;font-weight:500;line-height:1.35;
                      color:rgba(247,249,252,0.44);max-width:{26*MM}px;margin-left:auto">
            Technology built around your business.</div>
        </div>
        <div style="background:{WARM};width:{plate_mm*MM}px;height:{plate_mm*MM}px;
                    border-radius:{1.8*MM}px;display:flex;align-items:center;justify-content:center;
                    flex-shrink:0">
          <img src="{qr_uri}" alt="" style="display:block;width:{qr_mm*MM}px;height:{qr_mm*MM}px">
        </div>
      </div>
      <div style="position:absolute;left:{pad}px;bottom:{(SAFE_MM+2.4)*MM}px;
                  font-size:{1.62*MM}px;font-weight:600;letter-spacing:0.2em;
                  color:rgba(247,249,252,0.34)">305-001</div>
    </div>"""


def page(inner, w, h, bg="#101418"):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}{BASE_CSS}
body{{background:{bg};width:{w}px;height:{h}px;overflow:hidden}}</style></head>
<body>{inner}</body></html>"""


def proof_wrap(card_html, label="CONCEPT PROOF — NOT FOR PRINT"):
    """Marca de proof FUERA del arte (nunca encima del diseño)."""
    m = 54
    return page(f"""
    <div style="padding:{m}px;display:flex;flex-direction:column;align-items:center;gap:{22}px">
      <div style="box-shadow:0 26px 70px rgba(0,0,0,0.55)">{card_html}</div>
      <div style="font-size:19px;font-weight:800;letter-spacing:0.26em;text-transform:uppercase;
                  color:#ff6b6b">{label}</div>
    </div>""", W + 2 * m, H + 2 * m + 60)


def sheet(front_html, back_html):
    m, gap = 56, 46
    return page(f"""
    <div style="padding:{m}px">
      <div style="display:flex;gap:{gap}px;align-items:flex-start">
        <div>
          <div style="box-shadow:0 26px 70px rgba(0,0,0,0.55)">{front_html}</div>
          <div style="margin-top:16px;font-size:16px;font-weight:700;letter-spacing:0.2em;
                      text-transform:uppercase;color:rgba(255,255,255,0.55)">Front</div>
        </div>
        <div>
          <div style="box-shadow:0 26px 70px rgba(0,0,0,0.55)">{back_html}</div>
          <div style="margin-top:16px;font-size:16px;font-weight:700;letter-spacing:0.2em;
                      text-transform:uppercase;color:rgba(255,255,255,0.55)">Back</div>
        </div>
      </div>
      <div style="margin-top:34px;display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:17px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#8fb4ff">
          305 SIGNAL · CR80 85.60 × 53.98 mm</div>
        <div style="font-size:17px;font-weight:800;letter-spacing:0.24em;text-transform:uppercase;color:#ff6b6b">
          Concept proof — not for print</div>
      </div>
    </div>""", W * 2 + gap + 2 * m, H + 2 * m + 100)


def concept_sheet(front_html):
    m = 56
    steps = [("Business", "El wordmark: de dónde nace la señal."),
             ("Technology", "El giro preciso: la ingeniería que la dirige."),
             ("Connection", "El punto NFC: donde la señal se vuelve acción.")]
    items = "".join(
        f'<div style="display:flex;gap:18px;align-items:flex-start">'
        f'<span style="width:9px;height:9px;border-radius:50%;background:{AQUA};margin-top:9px;flex-shrink:0"></span>'
        f'<div><div style="font-size:20px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;'
        f'color:{PAPER}">{t}</div>'
        f'<div style="margin-top:6px;font-size:18px;color:rgba(247,249,252,0.62);line-height:1.5">{d}</div></div></div>'
        for t, d in steps)
    return page(f"""
    <div style="padding:{m}px;display:flex;gap:52px;align-items:center">
      <div style="box-shadow:0 26px 70px rgba(0,0,0,0.55);flex-shrink:0">{front_html}</div>
      <div style="max-width:640px">
        <div style="font-size:15px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:{AQUA}">
          Concept</div>
        <div style="margin-top:14px;font-size:44px;font-weight:900;letter-spacing:-0.02em;color:{PAPER}">
          305 SIGNAL</div>
        <div style="margin-top:16px;font-size:19px;line-height:1.55;color:rgba(247,249,252,0.72)">
          Una señal que conecta un negocio físico con su experiencia digital.
          Nace en la marca, la ingeniería la dirige y termina exactamente donde
          el dedo toca la tarjeta.</div>
        <div style="margin-top:30px;display:grid;gap:20px">{items}</div>
        <div style="margin-top:32px;font-size:16px;font-weight:800;letter-spacing:0.24em;
                    text-transform:uppercase;color:#ff6b6b">Concept proof — not for print</div>
      </div>
    </div>""", W + 640 + 52 + 2 * m + 40, H + 2 * m + 90)


def tech_sheet(front_html):
    """Guías técnicas SEPARADAS del arte principal."""
    m, scale = 60, 1.0
    bl, sa = BLEED_MM * MM, SAFE_MM * MM
    return page(f"""
    <div style="padding:{m}px">
      <div style="position:relative;width:{W}px;height:{H}px">
        {front_html}
        <div style="position:absolute;inset:0;border-radius:{RADIUS}px;
                    outline:2px dashed rgba(255,90,90,0.9);outline-offset:0px;pointer-events:none"></div>
        <div style="position:absolute;inset:{sa}px;border:2px dashed rgba(90,190,255,0.9);
                    border-radius:{RADIUS*0.6}px;pointer-events:none"></div>
        <div style="position:absolute;right:{sa}px;bottom:{sa}px;width:{24*MM}px;height:{24*MM}px;
                    border:2px dashed rgba(255,180,0,0.95);border-radius:{2*MM}px;
                    display:flex;align-items:center;justify-content:center;text-align:center;padding:8px">
          <span style="font-size:13px;font-weight:800;line-height:1.2;letter-spacing:0.05em;
                       color:rgba(255,190,60,1);text-transform:uppercase">Chip position pending manufacturer template</span>
        </div>
      </div>
      <div style="margin-top:30px;display:grid;grid-template-columns:repeat(2,1fr);gap:14px 40px;
                  font-size:17px;color:rgba(247,249,252,0.8);max-width:{W}px">
        <div><span style="color:#ff5a5a">■</span> Trim CR80 — 85.60 × 53.98 mm (ratio 1.586)</div>
        <div><span style="color:#5abeff">■</span> Safe area PROVISIONAL — {SAFE_MM} mm</div>
        <div><span style="color:#ffb400">■</span> Chip: posición NO asumida</div>
        <div>Bleed PROVISIONAL — {BLEED_MM} mm (pendiente plantilla)</div>
        <div>Proof plano — {W} × {H} px @ {DPI} DPI</div>
        <div>Radio de esquina — 3.18 mm</div>
      </div>
      <div style="margin-top:26px;font-size:16px;font-weight:800;letter-spacing:0.24em;
                  text-transform:uppercase;color:#ff6b6b">
        Technical sheet · concept proof — not for print</div>
    </div>""", W + 2 * m, H + 2 * m + 250)


def real_size(front_html, back_html):
    """Vista a tamaño físico real: 85.60 mm a 96 CSS px/in = 323.5 px."""
    css_w = TRIM_W_MM / 25.4 * 96
    css_h = TRIM_H_MM / 25.4 * 96
    k = css_w / W
    m = 46
    def scaled(c):
        return (f'<div style="width:{css_w}px;height:{css_h}px;overflow:hidden">'
                f'<div style="transform:scale({k});transform-origin:top left">{c}</div></div>')
    return page(f"""
    <div style="padding:{m}px">
      <div style="font-size:15px;font-weight:800;letter-spacing:0.24em;text-transform:uppercase;
                  color:rgba(247,249,252,0.6)">Actual physical size · 85.60 × 53.98 mm</div>
      <div style="margin-top:20px;display:flex;gap:28px;align-items:flex-start">
        <div style="box-shadow:0 14px 34px rgba(0,0,0,0.5);border-radius:{RADIUS*k}px">{scaled(front_html)}</div>
        <div style="box-shadow:0 14px 34px rgba(0,0,0,0.5);border-radius:{RADIUS*k}px">{scaled(back_html)}</div>
      </div>
      <div style="margin-top:22px;font-size:14px;color:rgba(247,249,252,0.5)">
        Impreso a 100% esta vista mide exactamente lo que medirá la tarjeta.</div>
      <div style="margin-top:14px;font-size:14px;font-weight:800;letter-spacing:0.22em;
                  text-transform:uppercase;color:#ff6b6b">Concept proof — not for print</div>
    </div>""", int(css_w * 2 + 28 + 2 * m), int(css_h + 2 * m + 150))


def mockup(front_html, back_html):
    """Presentación secundaria: acabado mate, sin prometer producción."""
    m = 60
    return page(f"""
    <div style="padding:{m}px;background:linear-gradient(160deg,#171b20,#0d1013);
                width:100%;height:100%;display:flex;align-items:center;justify-content:center;gap:52px">
      <div style="transform:rotate(-7deg) scale(0.82);filter:brightness(0.97) contrast(1.02);
                  box-shadow:0 40px 90px rgba(0,0,0,0.72)">{front_html}</div>
      <div style="transform:rotate(5deg) scale(0.82);filter:brightness(0.94);
                  box-shadow:0 40px 90px rgba(0,0,0,0.72)">{back_html}</div>
      <div style="position:absolute;bottom:26px;left:0;right:0;text-align:center;
                  font-size:15px;font-weight:800;letter-spacing:0.24em;text-transform:uppercase;color:#ff6b6b">
        Matte finish simulation · concept proof — not for print</div>
    </div>""", W * 2 + 200, H + 260)


def main():
    qr_path = OUT / "_qr-placeholder.svg"
    qrcode.make(PLACEHOLDER_URL, error_correction=qrcode.constants.ERROR_CORRECT_H, border=2,
                image_factory=qrcode.image.svg.SvgPathImage).save(str(qr_path))
    qr_uri = qr_path.as_uri()

    F, B = front(), back(qr_uri)
    pages = {
        "305-signal-front": (proof_wrap(F), W + 108, H + 168),
        "305-signal-back": (proof_wrap(B), W + 108, H + 168),
        "305-signal-sheet-front-back": (sheet(F, B), W * 2 + 46 + 112, H + 212),
        "305-signal-concept": (concept_sheet(F), W + 640 + 52 + 160, H + 202),
        "305-signal-technical": (tech_sheet(F), W + 120, H + 370),
        "305-signal-actual-size": (real_size(F, B), int(TRIM_W_MM / 25.4 * 96 * 2 + 28 + 92),
                                   int(TRIM_H_MM / 25.4 * 96 + 242)),
        "305-signal-mockup-matte": (mockup(F, B), W * 2 + 200, H + 260),
    }

    profile = Path(tempfile.mkdtemp(prefix="edge-sig-"))
    proc = subprocess.Popen([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        "--remote-debugging-port=9443", "--remote-allow-origins=*", f"--user-data-dir={profile}",
        "--window-size=1400,900", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        try:
            urllib.request.urlopen("http://127.0.0.1:9443/json").read(); break
        except Exception: time.sleep(0.5)

    for name, (html, pw, ph) in pages.items():
        f = ROOT / f"_sig-{name}.html"
        f.write_text(html, encoding="utf-8")
        subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
            "--virtual-time-budget=9000", f"--window-size={pw},{ph}",
            f"--screenshot={OUT / (name + '.png')}", f.as_uri()],
            check=False, capture_output=True, timeout=180)
        print(f"  {name}.png  ({pw}x{ph})")
    proc.terminate(); shutil.rmtree(profile, ignore_errors=True)
    print(f"\nTrim CR80 {TRIM_W_MM}×{TRIM_H_MM} mm · proof plano {W}×{H} px @ {DPI} DPI · ratio {TRIM_W_MM/TRIM_H_MM:.3f}")
    print("QR placeholder:", PLACEHOLDER_URL)


if __name__ == "__main__":
    main()
