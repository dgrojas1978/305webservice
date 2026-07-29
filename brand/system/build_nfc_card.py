# -*- coding: utf-8 -*-
"""305 — Tarjeta NFC física: PROOFS VISUALES (no producción).

Dos conceptos (Midnight / Porcelain), frente y reverso, CR80 85.60×53.98 mm.

NO SON ARCHIVOS DE PRODUCCIÓN. Cada proof lleva:
  · marca de agua TEST — DO NOT PRINT
  · overlay CHIP POSITION PENDING MANUFACTURER TEMPLATE
  · QR con URL placeholder claramente no productiva
El bleed/safe-area dibujados son PROVISIONALES hasta recibir la plantilla
oficial del fabricante; la posición del chip NO se asume como definitiva.
"""
import json, subprocess, tempfile, time, urllib.request, shutil
from pathlib import Path
import qrcode, qrcode.image.svg, websocket

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
REPO = BRAND.parent
OUT = BRAND / "out" / "nfc-card-proofs"
OUT.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FONTS = REPO / "node_modules" / "@fontsource"

# CR80: 85.60 × 53.98 mm. Sangrado PROVISIONAL 2 mm (pendiente de plantilla).
CARD_W_MM, CARD_H_MM = 85.60, 53.98
BLEED_MM = 2.0
SAFE_MM = 3.0
DPI = 300
MM = DPI / 25.4
PX_W = round((CARD_W_MM + 2 * BLEED_MM) * MM)
PX_H = round((CARD_H_MM + 2 * BLEED_MM) * MM)

# URL PLACEHOLDER — no productiva. /c/305 aún devuelve 404 en producción.
PLACEHOLDER_URL = "https://www.305webservice.com/c/305?proof=TEST-DO-NOT-PRINT"


def ff(fam, pkg, f, w):
    return (f'@font-face{{font-family:"{fam}";src:url("{(FONTS/pkg/"files"/f).as_uri()}") format("woff2");'
            f'font-weight:{w};font-style:normal;font-display:block}}')


FONT_CSS = "".join([
    ff("Inter", "inter", "inter-latin-500-normal.woff2", 500),
    ff("Inter", "inter", "inter-latin-600-normal.woff2", 600),
    ff("Inter", "inter", "inter-latin-700-normal.woff2", 700),
    ff("Inter", "inter", "inter-latin-900-normal.woff2", 900),
])

CONCEPTS = {
    "midnight": dict(bg="#0a1728", ink="#f7f9fc", accentBrand="#6aa2ff",
                     accent="#146cff", nfc="#20d7c5", faint="rgba(247,249,252,0.5)",
                     hair="rgba(247,249,252,0.14)", qr_bg="#ffffff"),
    "porcelain": dict(bg="#f3f1ec", ink="#0a1728", accentBrand="#146cff",
                      accent="#146cff", nfc="#0fa294", faint="rgba(10,23,40,0.5)",
                      hair="rgba(10,23,40,0.14)", qr_bg="#ffffff"),
}


def nfc_glyph(color):
    """Indicador NFC monolínea (ondas)."""
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.7" '
            f'stroke-linecap="round" aria-hidden="true">'
            f'<path d="M7.5 8.4a5 5 0 0 1 0 7.2"/><path d="M11 5.6a9 9 0 0 1 0 12.8"/>'
            f'<path d="M14.5 3a13 13 0 0 1 0 18"/></svg>')


def overlays(c, side='front'):
    """Marcas obligatorias del proof: nunca deben pasar a producción."""
    if side == 'front':
        chip = (f'<div style="position:absolute;right:{(BLEED_MM+5)*MM}px;top:{(BLEED_MM+5)*MM}px;'
                f'width:{22*MM}px;height:{22*MM}px;border:1.5px dashed rgba(255,170,0,0.75);'
                f'border-radius:{2*MM}px;display:flex;align-items:center;justify-content:center;'
                f'text-align:center;padding:{1.4*MM}px">'
                f'<span style="font-size:{2.0*MM}px;line-height:1.15;font-weight:700;letter-spacing:0.04em;'
                f'color:rgba(255,170,0,0.95);text-transform:uppercase">Chip position pending manufacturer template</span></div>')
    else:
        chip = (f'<div style="position:absolute;left:{(BLEED_MM+SAFE_MM+3.2)*MM}px;bottom:{(BLEED_MM+SAFE_MM+3.2)*MM}px;max-width:{40*MM}px">'
                f'<span style="font-size:{1.9*MM}px;line-height:1.2;font-weight:700;letter-spacing:0.04em;'
                f'color:rgba(255,170,0,0.95);text-transform:uppercase">Chip position pending manufacturer template</span></div>')
    return f"""
    <!-- guías PROVISIONALES: sangrado y área segura -->
    <div style="position:absolute;inset:{BLEED_MM*MM}px;border:1px dashed rgba(255,0,0,0.45);pointer-events:none"></div>
    <div style="position:absolute;inset:{(BLEED_MM+SAFE_MM)*MM}px;border:1px dashed rgba(0,180,255,0.40);pointer-events:none"></div>
    <!-- zona de chip: NO asumida, marcada como pendiente -->
    {chip}
                width:{22*MM}px;height:{22*MM}px;border:1.5px dashed rgba(255,170,0,0.75);
                border-radius:{2*MM}px;display:flex;align-items:center;justify-content:center;
                text-align:center;padding:{1.4*MM}px">

    <!-- marca de agua -->
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                pointer-events:none;transform:rotate(-19deg)">
      <span style="font-size:{5.6*MM}px;font-weight:900;letter-spacing:0.14em;
                   color:rgba(255,0,0,0.17);white-space:nowrap">TEST — DO NOT PRINT</span>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:{1.2*MM}px;text-align:center">
      <span style="font-size:{2.0*MM}px;font-weight:700;letter-spacing:0.1em;color:rgba(255,0,0,0.8);
                   text-transform:uppercase">Proof only · placeholder URL · not a production file</span>
    </div>"""


def front(concept):
    c = CONCEPTS[concept]
    pad = (BLEED_MM + SAFE_MM + 3.2) * MM
    return f"""
    <div style="position:absolute;inset:0;background:{c['bg']}"></div>
    <div style="position:absolute;inset:0;padding:{pad}px;display:flex;flex-direction:column;
                justify-content:space-between">
      <div>
        <div style="font-size:{4.6*MM}px;font-weight:900;letter-spacing:-0.01em;text-transform:uppercase;
                    color:{c['ink']}"><span style="color:{c['accentBrand']}">305</span> Web Service</div>
        <div style="font-size:{1.9*MM}px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;
                    color:{c['faint']};margin-top:{1.6*MM}px">Business technology</div>
      </div>
      <div style="display:flex;align-items:center;gap:{2.4*MM}px">
        <span style="width:{5.4*MM}px;height:{5.4*MM}px;display:inline-block">{nfc_glyph(c['nfc'])}</span>
        <span style="font-size:{2.9*MM}px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;
                     color:{c['ink']}">Tap to connect</span>
      </div>
      <div style="position:absolute;right:0;bottom:0;width:{18*MM}px;height:{0.9*MM}px;
                  background:{c['accent']}"></div>
    </div>"""


def back(concept, qr_uri):
    c = CONCEPTS[concept]
    pad = (BLEED_MM + SAFE_MM + 3.2) * MM
    qr_mm = 23.0  # dentro del mínimo recomendado 22–25 mm
    return f"""
    <div style="position:absolute;inset:0;background:{c['bg']}"></div>
    <div style="position:absolute;inset:0;padding:{pad}px;display:flex;align-items:center;
                justify-content:space-between;gap:{4*MM}px">
      <div style="display:flex;flex-direction:column;gap:{2.2*MM}px">
        <span style="font-size:{2.6*MM}px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;
                     color:{c['ink']}">Scan to connect</span>
        <span style="font-size:{1.9*MM}px;font-weight:600;letter-spacing:0.14em;color:{c['faint']}">305-001</span>
      </div>
      <div style="background:{c['qr_bg']};padding:{1.6*MM}px;border-radius:{1.2*MM}px;flex-shrink:0">
        <img src="{qr_uri}" alt="QR" style="display:block;width:{qr_mm*MM}px;height:{qr_mm*MM}px">
      </div>
    </div>"""


def html(concept, side, qr_uri):
    body = front(concept) if side == "front" else back(concept, qr_uri)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif}}
.card{{position:relative;width:{PX_W}px;height:{PX_H}px;overflow:hidden}}
</style></head><body><div class="card">{body}{overlays(CONCEPTS[concept], side)}</div></body></html>"""


def main():
    # QR placeholder (marcado como no productivo en la propia URL)
    qr_path = OUT / "_placeholder-qr.svg"
    qrcode.make(PLACEHOLDER_URL, error_correction=qrcode.constants.ERROR_CORRECT_H, border=4,
                image_factory=qrcode.image.svg.SvgPathImage).save(str(qr_path))
    qr_uri = qr_path.as_uri()

    profile = Path(tempfile.mkdtemp(prefix="edge-nfc-"))
    proc = subprocess.Popen([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        f"--remote-debugging-port=9442", "--remote-allow-origins=*", f"--user-data-dir={profile}",
        f"--window-size={PX_W},{PX_H}", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        try:
            tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9442/json").read())
            ws = next(t for t in tabs if t["type"] == "page")["webSocketDebuggerUrl"]; break
        except Exception: time.sleep(0.5)
    c = websocket.create_connection(ws, timeout=120); mid = [0]
    def cmd(m, p=None):
        mid[0] += 1; c.send(json.dumps({"id": mid[0], "method": m, "params": p or {}}))
        while True:
            r = json.loads(c.recv())
            if r.get("id") == mid[0]: return r.get("result", {})
    cmd("Page.enable")

    made = []
    for concept in CONCEPTS:
        for side in ("front", "back"):
            f = ROOT / f"_nfc-{concept}-{side}.html"
            f.write_text(html(concept, side, qr_uri), encoding="utf-8")
            name = f"305-nfc-card-{concept}-{side}-PROOF.png"
            subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
                "--virtual-time-budget=9000", f"--window-size={PX_W},{PX_H}",
                f"--screenshot={OUT / name}", f.as_uri()], check=False, capture_output=True, timeout=180)
            made.append(name)
            print(f"  {name}  {PX_W}x{PX_H}px  ({CARD_W_MM}x{CARD_H_MM}mm + {BLEED_MM}mm bleed @ {DPI}dpi)")
    proc.terminate(); shutil.rmtree(profile, ignore_errors=True)

    print(f"\nQR placeholder -> {PLACEHOLDER_URL}")
    print("PROOFS ÚNICAMENTE — no son archivos de producción.")
    return made


if __name__ == "__main__":
    main()
