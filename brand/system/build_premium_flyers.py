# -*- coding: utf-8 -*-
"""305 Premium Flyer System — 3 campañas × EN/ES, Letter 8.5×11.

Traduce a print el sistema visual aprobado en la tarjeta digital.
Estructura fija: Hook → Proof → Offer/Outcomes → Trust → Action.
Un wordmark, un CTA, un QR por pieza. Solo proyectos reales aprobados.
Salida: PNG 300 DPI (trim) + PNG con sangrado + PDF CMYK. QR decodificado
desde el arte final.
"""
import io, json, subprocess, tempfile, time, urllib.request, shutil
from pathlib import Path
import cv2, img2pdf, websocket
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

WA_SVG = ('<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.852L.057 23.743a.5.5 0 00.612.612l5.9-1.476A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>')


def font_face(family: str, pkg: str, file: str, weight: int) -> str:
    p = (FONTS / pkg / "files" / file).as_uri()
    return (f'@font-face{{font-family:"{family}";src:url("{p}") format("woff2");'
            f'font-weight:{weight};font-style:normal;font-display:block}}')


FONT_CSS = "".join([
    font_face("Inter", "inter", "inter-latin-400-normal.woff2", 400),
    font_face("Inter", "inter", "inter-latin-500-normal.woff2", 500),
    font_face("Inter", "inter", "inter-latin-600-normal.woff2", 600),
    font_face("Inter", "inter", "inter-latin-700-normal.woff2", 700),
    font_face("Inter", "inter", "inter-latin-800-normal.woff2", 800),
    font_face("Inter", "inter", "inter-latin-900-normal.woff2", 900),
    font_face("Fraunces", "fraunces", "fraunces-latin-600-normal.woff2", 600),
])

# ---------------------------------------------------------------- proyectos reales
PROJECTS = {
    "aguiar":   dict(img="aguiar-960.webp",   dom="aguiarflooring.com",
                     ind={"en": "Flooring & remodeling", "es": "Pisos y remodelación"},
                     cap={"en": "Product catalog + quote generation", "es": "Catálogo de productos y cotizaciones"}),
    "lsf":      dict(img="lsf-960.webp",      dom="lightspecterfilm.com",
                     ind={"en": "Film & production", "es": "Cine y producción"},
                     cap={"en": "Cinematic brand and lead experience", "es": "Marca cinematográfica y captación"}),
    "polkanea": dict(img="polkanea-960.webp", dom="polkaneaproductions.com",
                     ind={"en": "Streaming platform", "es": "Plataforma de streaming"},
                     cap={"en": "Subscription streaming platform", "es": "Plataforma de streaming por suscripción"}),
    "cosme":    dict(img="cosme-960.webp",    dom="cosmeproenza.com",
                     ind={"en": "Arts & culture", "es": "Arte y cultura"},
                     cap={"en": "Digital art archive", "es": "Archivo digital de arte"}),
}


def shots_html(keys, lang):
    out = []
    for k in keys:
        p = PROJECTS[k]
        out.append(
            f'<div class="shot"><div class="img"><img src="{(WORK / p["img"]).as_uri()}" alt=""></div>'
            f'<div class="ind">{p["ind"][lang]}</div>'
            f'<div class="cap">{p["cap"][lang]}</div>'
            f'<div class="dom">{p["dom"]}</div></div>')
    return f'<div class="shots">{"".join(out)}</div>'


def outcomes_html(items):
    return '<div class="outcomes">' + "".join(
        f'<div class="outcome"><div class="bar"></div><div class="t">{t}</div></div>' for t in items) + "</div>"


def render(cfg) -> str:
    lang = cfg["lang"]
    proof = cfg["proof_html"]
    price = ""
    if cfg.get("price"):
        price = (f'<div class="price"><span class="v">{cfg["price"]["v"]}</span>'
                 f'<span class="k">{cfg["price"]["k"]}</span></div>')
    offer = cfg["offer_html"]
    note = f'<p class="note">{cfg["note"]}</p>' if cfg.get("note") else ""
    qr_uri = (QR / f'{cfg["campaign"]}.svg').as_uri()

    return f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<style>{FONT_CSS}</style>
<link rel="stylesheet" href="{(ROOT / 'pf.css').as_uri()}">
<style>@page{{size:8.75in 11.25in;margin:0}} .headline{{--h:{cfg.get("h","40pt")}}}</style></head>
<body><div class="flyer">

  <section class="z-hook">
    <div class="wordmark"><b>305</b> Web Service</div>
    <div class="eyebrow">{cfg["eyebrow"]}</div>
    <h1 class="headline">{cfg["headline"]}</h1>
    <p class="support">{cfg["support"]}</p>
    {price}
  </section>

  <section class="z-proof">
    <div class="sec-label">{cfg["proof_label"]}</div>
    <div class="proof-h">{cfg["proof_h"]}</div>
    {proof}
  </section>

  <section class="z-offer">
    <div class="sec-label">{cfg["offer_label"]}</div>
    {offer}
  </section>

  <section class="z-act">
    <div>
      <span class="cta">{cfg["cta"]}</span>
      <div class="contact"><span class="tel">{PHONE}</span>
        <span class="wa">{WA_SVG}WhatsApp</span></div>
      <div class="trust">{cfg["trust"]}</div>
      {note}
    </div>
    <div class="qr"><div class="card"><img src="{qr_uri}" alt="QR"></div>
      <div class="lb">{cfg["qr_label"]}</div></div>
  </section>

</div></body></html>"""


# ---------------------------------------------------------------- campañas
def steps_html(items):
    return '<div class="steps">' + "".join(
        f'<div class="step"><div class="n">{i+1}</div><div class="t">{t}</div></div>'
        for i, t in enumerate(items)) + "</div>"


def nfc_proof(lang):
    s1 = (ASSETS / "card-screen-1.jpg").as_uri()
    s2 = (ASSETS / "card-screen-2.jpg").as_uri()
    steps = {"en": ["Tap or scan", "Open the business experience", "Save, contact, book, review or buy"],
             "es": ["Toca o escanea", "Se abre la experiencia del negocio", "Guarda, contacta, reserva, reseña o compra"]}[lang]
    return (f'<div class="hero-proof"><div class="phones">'
            f'<div class="phone-frame"><img src="{s1}" alt=""></div>'
            f'<div class="phone-frame"><img src="{s2}" alt=""></div></div>'
            f'<div>{steps_html(steps)}</div></div>')


def incl_html(items):
    return '<ul class="incl">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def campaigns():
    C = []
    # ---- 1 · BUSINESS TECHNOLOGY ----
    for lang in ("en", "es"):
        t = {
            "en": dict(eyebrow="Technology for business", headline="Move your business forward.",
                       support="Websites, custom software, NFC experiences and IT solutions—built around how your business works.",
                       proof_label="Real work", proof_h="Built for real businesses.",
                       offer_label="What changes for you",
                       outcomes=["Look more professional", "Turn more visitors into customers", "Operate with less manual work"],
                       cta="START A PROJECT", trust="Miami based · English &amp; Spanish · Local &amp; remote support",
                       qr_label="Scan to start"),
            "es": dict(eyebrow="Tecnología para negocios", headline="Haz avanzar tu negocio.",
                       support="Sitios web, software a la medida, experiencias NFC y soluciones informáticas adaptadas a la forma en que opera tu negocio.",
                       proof_label="Trabajo real", proof_h="Soluciones creadas para negocios reales.",
                       offer_label="Lo que cambia para ti",
                       outcomes=["Proyecta una imagen profesional", "Convierte más visitantes en clientes", "Reduce el trabajo manual"],
                       cta="INICIA TU PROYECTO", trust="Con sede en Miami · Servicio en inglés y español · Atención local y remota",
                       qr_label="Escanea para empezar"),
        }[lang]
        C.append(dict(id="business-technology", lang=lang, campaign="business-technology", h="40pt",
                      eyebrow=t["eyebrow"], headline=t["headline"], support=t["support"],
                      proof_label=t["proof_label"], proof_h=t["proof_h"],
                      proof_html=shots_html(["aguiar", "lsf", "polkanea"], lang),
                      offer_label=t["offer_label"], offer_html=outcomes_html(t["outcomes"]),
                      cta=t["cta"], trust=t["trust"], qr_label=t["qr_label"]))

    # ---- 2 · WEBSITE STARTER $499 ----
    for lang in ("en", "es"):
        t = {
            "en": dict(eyebrow="Professional website package", headline="Turn more searches into calls.",
                       support="A focused, mobile-ready website that makes your business look credible and makes contacting you easy.",
                       price=dict(v="Websites from $499", k=""), proof_label="Real work",
                       proof_h="Websites we've built.", offer_label="What's included",
                       incl=["Responsive design", "Clear service presentation", "Contact form and WhatsApp",
                             "Domain and SSL setup", "Basic on-page SEO", "One revision round"],
                       cta="START MY WEBSITE", trust="Miami based · English &amp; Spanish · Local &amp; remote support",
                       note="Final pricing depends on content, integrations and required functionality. Domain, hosting and maintenance are quoted separately.",
                       qr_label="Scan to start"),
            "es": dict(eyebrow="Paquete de sitio web profesional", headline="Convierte más búsquedas en llamadas.",
                       support="Un sitio rápido y adaptable que proyecta confianza, explica tus servicios y facilita que tus clientes te contacten.",
                       price=dict(v="Sitios web desde $499", k=""), proof_label="Trabajo real",
                       proof_h="Sitios que hemos construido.", offer_label="Qué incluye",
                       incl=["Diseño adaptable", "Presentación clara de servicios", "Formulario de contacto y WhatsApp",
                             "Dominio y SSL configurados", "SEO básico en la página", "Una ronda de revisión"],
                       cta="QUIERO MI SITIO WEB", trust="Con sede en Miami · Servicio en inglés y español · Atención local y remota",
                       note="El precio final depende del contenido, las integraciones y la funcionalidad requerida. El dominio, el alojamiento y el mantenimiento se cotizan por separado.",
                       qr_label="Escanea para empezar"),
        }[lang]
        C.append(dict(id="website-starter-499", lang=lang, campaign="website-starter-499", h="38pt",
                      eyebrow=t["eyebrow"], headline=t["headline"], support=t["support"], price=t["price"],
                      proof_label=t["proof_label"], proof_h=t["proof_h"],
                      proof_html=shots_html(["aguiar", "cosme", "lsf"], lang),
                      offer_label=t["offer_label"], offer_html=incl_html(t["incl"]),
                      cta=t["cta"], trust=t["trust"], note=t["note"], qr_label=t["qr_label"]))

    # ---- 3 · NFC BUSINESS SOLUTIONS ----
    for lang in ("en", "es"):
        t = {
            "en": dict(eyebrow="NFC business solutions", headline="One tap. A better way to connect.",
                       support="Premium NFC cards linked to a custom digital experience for contact sharing, reviews, bookings, menus, portfolios and lead capture.",
                       proof_label="The system", proof_h="No app required for the recipient.",
                       offer_label="What it can do",
                       incl=["Branded digital card", "Save Contact", "WhatsApp and direct actions",
                             "Google Reviews when eligible", "Location or service areas", "Contact exchange"],
                       cta="BUILD MY NFC EXPERIENCE", trust="Miami based · English &amp; Spanish · Local &amp; remote support",
                       qr_label="Scan to start"),
            "es": dict(eyebrow="Soluciones NFC para negocios", headline="Un toque. Una mejor forma de conectar.",
                       support="Tarjetas NFC premium conectadas a una experiencia digital personalizada para contactos, reseñas, reservas, menús, portafolios y captación de clientes.",
                       proof_label="El sistema", proof_h="El receptor no necesita instalar una aplicación.",
                       offer_label="Qué puede hacer",
                       incl=["Tarjeta digital con tu marca", "Guardar contacto", "WhatsApp y acciones directas",
                             "Reseñas de Google cuando aplique", "Ubicación o zonas de servicio", "Intercambio de contacto"],
                       cta="CREAR MI EXPERIENCIA NFC", trust="Con sede en Miami · Servicio en inglés y español · Atención local y remota",
                       qr_label="Escanea para empezar"),
        }[lang]
        C.append(dict(id="nfc-solutions", lang=lang, campaign="nfc-solutions", h="36pt",
                      eyebrow=t["eyebrow"], headline=t["headline"], support=t["support"],
                      proof_label=t["proof_label"], proof_h=t["proof_h"], proof_html=nfc_proof(lang),
                      offer_label=t["offer_label"], offer_html=incl_html(t["incl"]),
                      cta=t["cta"], trust=t["trust"], qr_label=t["qr_label"]))
    return C


# ---------------------------------------------------------------- render (CDP)
def build(cfgs):
    profile = Path(tempfile.mkdtemp(prefix="edge-pf-"))
    proc = subprocess.Popen([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        "--remote-debugging-port=9440", "--remote-allow-origins=*", f"--user-data-dir={profile}",
        "--window-size=840,1080", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ws = None
    for _ in range(60):
        try:
            tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9440/json").read())
            ws = next(t for t in tabs if t["type"] == "page")["webSocketDebuggerUrl"]; break
        except Exception: time.sleep(0.5)
    c = websocket.create_connection(ws, timeout=120); mid = [0]
    def cmd(m, p=None):
        mid[0] += 1; c.send(json.dumps({"id": mid[0], "method": m, "params": p or {}}))
        while True:
            r = json.loads(c.recv())
            if r.get("id") == mid[0]: return r.get("result", {})
    def ev(e, ap=False): return cmd("Runtime.evaluate", {"expression": e, "awaitPromise": ap, "returnByValue": True}).get("result", {}).get("value")
    cmd("Page.enable")

    rows = []
    for cfg in cfgs:
        base = f'305-{cfg["id"]}-{cfg["lang"]}-letter'
        html = ROOT / f'_pf-{cfg["id"]}-{cfg["lang"]}.html'
        html.write_text(render(cfg), encoding="utf-8")
        cmd("Emulation.setDeviceMetricsOverride", {"width": 840, "height": 1080, "deviceScaleFactor": 1, "mobile": False})
        cmd("Page.navigate", {"url": html.as_uri()}); time.sleep(2.6)
        ev("document.fonts.ready.then(()=>true)", True)

        qa = json.loads(ev("""(function(){
          var cv=document.querySelector('.flyer'); var T=12,R=828,TP=12,BT=1068,worst=99;
          document.querySelectorAll('.wordmark,.eyebrow,.headline,.support,.price,.sec-label,.proof-h,.shot .cap,.shot .dom,.outcome .t,.incl li,.cta,.tel,.trust,.note,.qr .card,.qr .lb,.step .t')
            .forEach(function(el){var r=el.getBoundingClientRect(); if(!r.width)return;
              worst=Math.min(worst,r.left-T,R-r.right,r.top-TP,BT-r.bottom);});
          function bot(s){var m=0;document.querySelectorAll(s).forEach(function(e){var r=e.getBoundingClientRect();if(r.width)m=Math.max(m,r.bottom);});return m;}
          var actTop=document.querySelector('.z-act').getBoundingClientRect().top;
          var offerBottom=Math.max(bot('.outcome .t'),bot('.incl li'));
          return JSON.stringify({fits: cv.scrollHeight<=1080.5, h:+(cv.scrollHeight/96).toFixed(2),
            safe:+(worst/96).toFixed(3), offerOver:Math.round(offerBottom-actTop),
            wordmarks: document.querySelectorAll('.wordmark').length,
            qrs: document.querySelectorAll('.qr img').length});
        })()"""))

        bleed = OUT / f"{base}-bleed.png"
        subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=14000",
            "--force-device-scale-factor=3.125", "--window-size=840,1080", f"--screenshot={bleed}", html.as_uri()],
            check=False, capture_output=True, timeout=240)
        im = Image.open(bleed)
        trim = im.crop((37, 37, 2587, 3337))
        png = OUT / f"{base}-proof.png"; trim.save(png, dpi=(300, 300))
        cmyk = Image.open(bleed).convert("RGB").convert("CMYK")
        buf = io.BytesIO(); cmyk.save(buf, "JPEG", quality=95, dpi=(300, 300))
        (OUT / f"{base}-cmyk.pdf").write_bytes(
            img2pdf.convert(buf.getvalue(), layout_fun=img2pdf.get_fixed_dpi_layout_fun((300, 300))))

        img = cv2.imread(str(png)); d, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
        if not d:
            h, w = img.shape[:2]; d, _, _ = cv2.QRCodeDetector().detectAndDecode(img[2*h//3:, w//2:])
        rows.append((base, qa, d))
        print(f'{base:34} fits={qa["fits"]} h={qa["h"]} safe={qa["safe"]} offerOver={qa["offerOver"]} '
              f'wordmarks={qa["wordmarks"]} qrs={qa["qrs"]} qr={"OK" if d else "FAIL"}')
    proc.terminate(); shutil.rmtree(profile, ignore_errors=True)
    print("\nQR destinos:")
    for base, _, d in rows:
        print(" ", base, "->", d[:92] if d else "FAIL")
    return rows


if __name__ == "__main__":
    build(campaigns())
    print("\n->", OUT)
