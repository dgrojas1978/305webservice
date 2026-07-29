# -*- coding: utf-8 -*-
"""305 — Recomposiciones digitales + half-letter a dos caras.

Cada formato se RECOMPONE con jerarquía propia (nunca se recorta el letter).
Invariante por pieza: 1 wordmark, 1 hook, 1 prueba, 1 CTA, 1 QR, contacto.
QR propio por canal/idioma para atribución correcta.
"""
import io, json, subprocess, tempfile, time, urllib.request, shutil
from pathlib import Path
import cv2, img2pdf, numpy as np, qrcode, websocket
from PIL import Image

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
REPO = BRAND.parent
OUT = BRAND / "out" / "flyers-premium"
OUT.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
QR = ROOT / "qr2"
WORK = REPO / "public" / "work"
ASSETS = BRAND / "src" / "assets"
FONTS = REPO / "node_modules" / "@fontsource"
PHONE = "(305) 833-2984"

WA = ('<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.852L.057 23.743a.5.5 0 00.612.612l5.9-1.476A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>')


def ff(fam, pkg, f, w):
    return (f'@font-face{{font-family:"{fam}";src:url("{(FONTS/pkg/"files"/f).as_uri()}") format("woff2");'
            f'font-weight:{w};font-style:normal;font-display:block}}')


FONT_CSS = "".join([
    ff("Inter", "inter", "inter-latin-400-normal.woff2", 400),
    ff("Inter", "inter", "inter-latin-500-normal.woff2", 500),
    ff("Inter", "inter", "inter-latin-600-normal.woff2", 600),
    ff("Inter", "inter", "inter-latin-700-normal.woff2", 700),
    ff("Inter", "inter", "inter-latin-800-normal.woff2", 800),
    ff("Inter", "inter", "inter-latin-900-normal.woff2", 900),
    ff("Fraunces", "fraunces", "fraunces-latin-600-normal.woff2", 600),
])

# ------------------------------------------------------ contenido por campaña
PROJ = {
    "aguiar":  dict(src=WORK / "aguiar-960.webp",  dom="aguiarflooring.com",
                    ind={"en": "Flooring & remodeling", "es": "Pisos y remodelación"},
                    cap={"en": "Product catalog + quote generation", "es": "Catálogo y cotizaciones"}),
    "lsf":     dict(src=WORK / "lsf-960.webp",     dom="lightspecterfilm.com",
                    ind={"en": "Film & production", "es": "Cine y producción"},
                    cap={"en": "Cinematic brand experience", "es": "Experiencia de marca cinematográfica"}),
    "card":    dict(src=ASSETS / "card-screen-1.jpg", dom="305webservice.com",
                    ind={"en": "Digital business card", "es": "Tarjeta digital"},
                    cap={"en": "One tap opens the experience", "es": "Un toque abre la experiencia"}),
}

CAMPAIGNS = {
    "business-technology": dict(
        proof="lsf",
        en=dict(eyebrow="Technology for business", hook="Move your business forward.",
                sub="Websites, custom software, NFC experiences and IT solutions.",
                cta="START A PROJECT", trust="Miami based · English &amp; Spanish"),
        es=dict(eyebrow="Tecnología para negocios", hook="Haz avanzar tu negocio.",
                sub="Sitios web, software a la medida, experiencias NFC y soluciones informáticas.",
                cta="INICIA TU PROYECTO", trust="Con sede en Miami · Inglés y español")),
    "website-starter-499": dict(
        proof="aguiar", price={"en": "Websites from $499", "es": "Sitios web desde $499"},
        en=dict(eyebrow="Professional website package", hook="Turn more searches into calls.",
                sub="A focused, mobile-ready website that makes contacting you easy.",
                cta="START MY WEBSITE", trust="Miami based · English &amp; Spanish",
                note="Final pricing depends on content, integrations and required functionality."),
        es=dict(eyebrow="Paquete de sitio web profesional", hook="Convierte más búsquedas en llamadas.",
                sub="Un sitio rápido y adaptable que facilita que tus clientes te contacten.",
                cta="QUIERO MI SITIO WEB", trust="Con sede en Miami · Inglés y español",
                note="El precio final depende del contenido, las integraciones y la funcionalidad requerida.")),
    "nfc-solutions": dict(
        proof="card",
        en=dict(eyebrow="NFC business solutions", hook="One tap. A better way to connect.",
                sub="Premium NFC cards linked to a custom digital experience. No app required.",
                cta="BUILD MY NFC EXPERIENCE", trust="Miami based · English &amp; Spanish"),
        es=dict(eyebrow="Soluciones NFC para negocios", hook="Un toque. Una mejor forma de conectar.",
                sub="Tarjetas NFC premium conectadas a una experiencia digital. Sin instalar apps.",
                cta="CREAR MI EXPERIENCIA NFC", trust="Con sede en Miami · Inglés y español")),
}

# ------------------------------------------------------ formatos digitales
# (w, h, qr_name_fragment, escala tipográfica)
DIGITAL = [
    ("instagram-1080x1350", 1080, 1350),
    ("instagram-1080x1080", 1080, 1080),
    ("story-1080x1920", 1080, 1920),
    ("whatsapp-1080x1350", 1080, 1350),
    ("linkedin-1200x630", 1200, 630),
]


def digital_html(camp_id, lang, fmt, W, H):
    c = CAMPAIGNS[camp_id]; t = c[lang]
    p = PROJ[c["proof"]]
    qr = (QR / f"{camp_id}--{fmt}-{lang}.svg").as_uri()
    land = fmt.startswith("linkedin")
    story = fmt.startswith("story")
    sq = fmt == "instagram-1080x1080"

    # escala: base en el ancho, con ajustes por formato
    u = W / 1080.0
    pad = int((58 if not land else 36) * u)
    hook_px = int((78 if story else 66 if not sq else 56) * u)
    if land: hook_px = int(46 * (W / 1200.0))
    if lang == 'es' and (sq or land): hook_px = int(hook_px * 0.82)
    sub_px = int(27 * u) if not land else int(24 * (W / 1200.0))

    sub_html = ("" if (sq or land) else
                f'<div class="sub" style="font-size:{sub_px}px;margin-top:{int(20*u)}px;'
                f'line-height:1.45;max-width:88%">{t["sub"]}</div>')
    price_html = ""
    if c.get("price"):
        price_html = f'<div class="price" style="font-size:{int(31*u)}px;margin-top:{int(16*u)}px">{c["price"][lang]}</div>'

    proof_h = int(H * (0.30 if story else 0.26 if sq else 0.34))
    if land: proof_h = int(H * 0.62)
    if c.get('price') and not story and not land: proof_h = int(proof_h * 0.90)
    proof_style = ('width:100%;aspect-ratio:16/9' if land else f'height:{proof_h}px')
    proof_block = f"""
      <div class="proof" style="{proof_style}"><img src="{p['src'].as_uri()}" alt=""></div>
      <div class="proof-meta" style="margin-top:{int(18*u)}px">
        <div class="ind" style="font-size:{int(18*u)}px">{p['ind'][lang]}</div>
        <div class="cap" style="font-size:{int(24*u)}px;margin-top:{int(6*u)}px">{p['cap'][lang]}</div>
        <div class="dom" style="font-size:{int(19*u)}px;margin-top:{int(5*u)}px">{p['dom']}</div>
      </div>"""

    cta_px = int((28 if not land else 20) * (u if not land else W / 1200.0))
    qr_px = int((200 if not land else 148) * (u if not land else W / 1200.0))
    qr_block = f"""
        <div style="text-align:center;flex-shrink:0">
          <div class="qrbox" style="width:{qr_px}px;padding:{int(10*u)}px"><img src="{qr}" alt="QR"></div>
          <div class="qrlb" style="font-size:{int(16*u)}px;margin-top:{int(10*u)}px">{'Scan to start' if lang=='en' else 'Escanea'}</div>
        </div>"""
    action = f"""
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:{int(28*u)}px">
        <div>
          <span class="cta" style="font-size:{cta_px}px;padding:{int(18*u)}px {int(32*u)}px;
                border-radius:{int(10*u)}px;white-space:nowrap">{t['cta']}</span>
          <div class="contact" style="gap:{int(20*u)}px;margin-top:{int(20*u)}px">
            <span class="tel" style="font-size:{int(30*u)}px">{PHONE}</span>
            <span class="wa" style="font-size:{int(22*u)}px;gap:{int(8*u)}px">
              <span style="width:{int(24*u)}px;height:{int(24*u)}px;display:inline-block">{WA}</span>WhatsApp</span>
          </div>
          <div class="trust" style="font-size:{int(19*u)}px;margin-top:{int(16*u)}px">{t['trust']}</div>
        </div>
        {'' if land else qr_block}
      </div>"""

    if land:  # LinkedIn / Facebook: dos columnas
        body = f"""
        <div style="display:grid;grid-template-columns:1.15fr 0.85fr;gap:{int(46*u)}px;height:100%;align-items:center">
          <div>
            <div class="wordmark" style="font-size:{int(26*u)}px"><b>305</b> Web Service</div>
            <div class="eyebrow" style="font-size:{int(17*u)}px;margin-top:{int(26*u)}px">{t['eyebrow']}</div>
            <div class="hook" style="font-size:{hook_px}px;margin-top:{int(14*u)}px">{t['hook']}</div>
            {sub_html}
            {price_html}
            {action}
          </div>
          <div style="display:flex;flex-direction:column;height:100%;justify-content:center">
            {proof_block}
            <div style="display:flex;align-items:flex-end;gap:{int(24*u)}px;margin-top:{int(12*u)}px">
              {qr_block}
            </div>
          </div>
        </div>"""
    else:
        body = f"""
        <div class="wordmark" style="font-size:{int(30*u)}px"><b>305</b> Web Service</div>
        <div class="eyebrow" style="font-size:{int(19*u)}px;margin-top:{int(38*u)}px">{t['eyebrow']}</div>
        <div class="hook" style="font-size:{hook_px}px;margin-top:{int(18*u)}px">{t['hook']}</div>
        {sub_html}
        {price_html}
        <div style="margin-top:auto;padding-top:{int(34*u)}px">{proof_block}</div>
        <div style="margin-top:{int(34*u)}px">{action}</div>"""

    return f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<style>{FONT_CSS}</style><link rel="stylesheet" href="{(ROOT/'pd.css').as_uri()}">
</head><body><div class="canvas" style="width:{W}px;height:{H}px;padding:{pad}px">{body}</div></body></html>"""


# ------------------------------------------------------ half-letter (2 caras)
HALF_W, HALF_H = 1725, 2625   # 5.75×8.75in @300dpi (5.5×8.5 + 0.125 bleed)


def half_html(camp_id, lang, side):
    c = CAMPAIGNS[camp_id]; t = c[lang]
    p = PROJ[c["proof"]]
    u = HALF_W / 1080.0
    pad = int(96 * u)
    qr = (QR / f"{camp_id}.svg").as_uri()   # cara impresa → QR de print

    if side == "front":
        price_html = (f'<div class="price" style="font-size:{int(44*u)}px;margin-top:{int(26*u)}px">{c["price"][lang]}</div>'
                      if c.get("price") else "")
        body = f"""
        <div class="wordmark" style="font-size:{int(28*u)}px"><b>305</b> Web Service</div>
        <div class="eyebrow" style="font-size:{int(17*u)}px;margin-top:{int(46*u)}px">{t['eyebrow']}</div>
        <div class="hook" style="font-size:{int(62*u)}px;margin-top:{int(18*u)}px">{t['hook']}</div>
        <div class="sub" style="font-size:{int(25*u)}px;margin-top:{int(20*u)}px;line-height:1.45">{t['sub']}</div>
        {price_html}
        <div style="margin-top:auto">
          <div class="proof" style="height:{int(HALF_H*0.30)}px"><img src="{p['src'].as_uri()}" alt=""></div>
          <div class="proof-meta" style="margin-top:{int(16*u)}px">
            <div class="ind" style="font-size:{int(17*u)}px">{p['ind'][lang]}</div>
            <div class="cap" style="font-size:{int(23*u)}px;margin-top:{int(6*u)}px">{p['cap'][lang]}</div>
            <div class="dom" style="font-size:{int(18*u)}px;margin-top:{int(5*u)}px">{p['dom']}</div>
          </div>
        </div>"""
    else:
        incl = {
            "business-technology": {"en": ["Look more professional", "Turn more visitors into customers", "Operate with less manual work"],
                                    "es": ["Proyecta una imagen profesional", "Convierte más visitantes en clientes", "Reduce el trabajo manual"]},
            "website-starter-499": {"en": ["Responsive design", "Clear service presentation", "Contact form and WhatsApp", "Domain and SSL setup", "Basic on-page SEO", "One revision round"],
                                    "es": ["Diseño adaptable", "Presentación clara de servicios", "Formulario y WhatsApp", "Dominio y SSL", "SEO básico", "Una ronda de revisión"]},
            "nfc-solutions": {"en": ["Branded digital card", "Save Contact", "WhatsApp and direct actions", "Location or service areas", "Contact exchange", "Editable destination"],
                              "es": ["Tarjeta digital con tu marca", "Guardar contacto", "WhatsApp y acciones directas", "Ubicación o zonas de servicio", "Intercambio de contacto", "Destino editable"]},
        }[camp_id][lang]
        lis = "".join(
            f'<li style="display:flex;gap:{int(14*u)}px;font-size:{int(24*u)}px;color:rgba(247,249,252,0.82);'
            f'line-height:1.35;padding:{int(7*u)}px 0;list-style:none">'
            f'<span style="margin-top:{int(11*u)}px;width:{int(9*u)}px;height:{int(9*u)}px;border-radius:50%;'
            f'background:#20d7c5;flex-shrink:0"></span>{i}</li>' for i in incl)
        note = (f'<div class="note" style="font-size:{int(18*u)}px;margin-top:{int(20*u)}px;max-width:92%">{t["note"]}</div>'
                if t.get("note") else "")
        label = {"en": "What's included", "es": "Qué incluye"}[lang]
        body = f"""
        <div class="eyebrow" style="font-size:{int(17*u)}px;color:rgba(247,249,252,0.55)">{label}</div>
        <ul style="margin-top:{int(24*u)}px">{lis}</ul>
        <div style="margin-top:{int(70*u)}px">
          <span class="cta" style="font-size:{int(30*u)}px;padding:{int(22*u)}px {int(42*u)}px;border-radius:{int(11*u)}px">{t['cta']}</span>
          <div class="contact" style="gap:{int(22*u)}px;margin-top:{int(24*u)}px">
            <span class="tel" style="font-size:{int(32*u)}px">{PHONE}</span>
            <span class="wa" style="font-size:{int(23*u)}px;gap:{int(9*u)}px">
              <span style="width:{int(26*u)}px;height:{int(26*u)}px;display:inline-block">{WA}</span>WhatsApp</span>
          </div>
          <div class="trust" style="font-size:{int(19*u)}px;margin-top:{int(18*u)}px">{t['trust']}</div>
          {note}
          <div style="display:flex;align-items:center;gap:{int(22*u)}px;margin-top:{int(30*u)}px">
            <div class="qrbox" style="width:{int(185*u)}px;padding:{int(11*u)}px"><img src="{qr}" alt="QR"></div>
            <div class="qrlb" style="font-size:{int(18*u)}px">{'Scan to start' if lang=='en' else 'Escanea para empezar'}</div>
          </div>
        </div>"""

    just = "center" if side == "back" else "flex-start"
    return f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<style>{FONT_CSS}</style><link rel="stylesheet" href="{(ROOT/'pd.css').as_uri()}">
</head><body><div class="canvas" style="width:{HALF_W}px;height:{HALF_H}px;padding:{pad}px;
justify-content:{just}">{body}</div></body></html>"""


# ------------------------------------------------------ render
def decode_robust(png_path, expected):
    det = cv2.QRCodeDetector()
    img = cv2.imread(str(png_path))
    for scale in (1.0, 1.6, 2.4):
        a = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC) if scale != 1.0 else img
        d, _, _ = det.detectAndDecode(a)
        if d == expected:
            return True, d
        h, w = a.shape[:2]
        for region in (a[h // 2:, :], a[h // 2:, w // 2:], a[:, w // 2:]):
            d2, _, _ = det.detectAndDecode(region)
            if d2 == expected:
                return True, d2
    return False, ""


def run(jobs):
    profile = Path(tempfile.mkdtemp(prefix="edge-pd-"))
    proc = subprocess.Popen([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        "--remote-debugging-port=9441", "--remote-allow-origins=*", f"--user-data-dir={profile}",
        "--window-size=1400,1000", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        try:
            tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9441/json").read())
            ws = next(t for t in tabs if t["type"] == "page")["webSocketDebuggerUrl"]; break
        except Exception: time.sleep(0.5)
    c = websocket.create_connection(ws, timeout=180); mid = [0]
    def cmd(m, p=None):
        mid[0] += 1; c.send(json.dumps({"id": mid[0], "method": m, "params": p or {}}))
        while True:
            r = json.loads(c.recv())
            if r.get("id") == mid[0]: return r.get("result", {})
    def ev(e, ap=False): return cmd("Runtime.evaluate", {"expression": e, "awaitPromise": ap, "returnByValue": True}).get("result", {}).get("value")
    cmd("Page.enable")

    inv = []
    reg = json.loads((QR / "registry.json").read_text(encoding="utf-8"))
    for j in jobs:
        html = ROOT / f"_pd-{j['name']}.html"
        html.write_text(j["html"], encoding="utf-8")
        cmd("Emulation.setDeviceMetricsOverride", {"width": j["w"], "height": j["h"], "deviceScaleFactor": 1, "mobile": False})
        cmd("Page.navigate", {"url": html.as_uri()}); time.sleep(1.9)
        ev("document.fonts.ready.then(()=>true)", True)
        qa = json.loads(ev("""(function(){
          var cv=document.querySelector('.canvas');
          return JSON.stringify({over: cv.scrollHeight-cv.clientHeight,
            wordmarks: document.querySelectorAll('.wordmark').length,
            hooks: document.querySelectorAll('.hook').length,
            qrs: document.querySelectorAll('.qrbox img').length,
            ctas: document.querySelectorAll('.cta').length,
            proofs: document.querySelectorAll('.proof img').length});
        })()"""))
        png = OUT / f"{j['name']}.png"
        subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=12000",
            f"--window-size={j['w']},{j['h']}", f"--screenshot={png}", html.as_uri()],
            check=False, capture_output=True, timeout=240)
        has_qr = j.get("has_qr", True)
        ok, dec = decode_robust(png, j["qr_url"]) if has_qr else (True, "n/a")
        rec = dict(file=png.name, w=j["w"], h=j["h"], lang=j["lang"], campaign=j["campaign"],
                   fmt=j["fmt"], color=j["color"], dpi=j.get("dpi", "—"),
                   qr_url=j["qr_url"] if has_qr else "—",
                   qr_decode=("OK" if ok else "FAIL") if has_qr else "n/a", **qa)
        if j.get("cmyk"):
            im = Image.open(png).convert("RGB").convert("CMYK")
            buf = io.BytesIO(); im.save(buf, "JPEG", quality=95, dpi=(300, 300))
            pdf = OUT / f"{j['name']}-cmyk.pdf"
            pdf.write_bytes(img2pdf.convert(buf.getvalue(), layout_fun=img2pdf.get_fixed_dpi_layout_fun((300, 300))))
            rec["pdf"] = pdf.name
        inv.append(rec)
        print(f"{j['name']:52} {j['w']}x{j['h']} over={qa['over']} wm={qa['wordmarks']} "
              f"hook={qa['hooks']} qr={qa['qrs']} cta={qa['ctas']} decode={rec['qr_decode']}")
    proc.terminate(); shutil.rmtree(profile, ignore_errors=True)
    return inv


def jobs():
    reg = json.loads((QR / "registry.json").read_text(encoding="utf-8"))
    J = []
    for camp in CAMPAIGNS:
        for lang in ("en", "es"):
            for fmt, W, H in DIGITAL:
                key = f"{camp}--{fmt}-{lang}"
                J.append(dict(name=f"305-{camp}-{fmt}-{lang}", html=digital_html(camp, lang, fmt, W, H),
                              w=W, h=H, lang=lang, campaign=camp, fmt=fmt, color="RGB",
                              qr_url=reg[key]["url"]))
            for side in ("front", "back"):
                J.append(dict(name=f"305-{camp}-halfletter-{side}-{lang}", html=half_html(camp, lang, side),
                              w=HALF_W, h=HALF_H, lang=lang, campaign=camp,
                              fmt=f"halfletter-{side}", color="CMYK", dpi=300,
                              qr_url=reg[camp]["url"], cmyk=True,
                              has_qr=(side == "back"), exp_wm=(1 if side == "front" else 0),
                              exp_cta=(0 if side == "front" else 1)))
    return J


if __name__ == "__main__":
    inv = run(jobs())
    (OUT / "inventory-digital.json").write_text(json.dumps(inv, indent=1, ensure_ascii=False), encoding="utf-8")
    def problem(r):
        if r["qr_decode"] == "FAIL" or r["over"] > 2: return True
        exp_wm = 0 if r["fmt"] == "halfletter-back" else 1
        exp_qr = 0 if r["fmt"] == "halfletter-front" else 1
        exp_cta = 0 if r["fmt"] == "halfletter-front" else 1
        return r["wordmarks"] != exp_wm or r["qrs"] != exp_qr or r["ctas"] != exp_cta
    bad = [r for r in inv if problem(r)]
    print(f"\nPiezas: {len(inv)} | con problema: {len(bad)}")
    for r in bad: print("  !", r["file"], r["qr_decode"], "over", r["over"], "wm", r["wordmarks"], "qr", r["qrs"])
