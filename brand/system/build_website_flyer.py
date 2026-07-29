# -*- coding: utf-8 -*-
"""305 Website Sales Flyer (proof-first) — Option A, US Letter, single side.

Hook -> visual proof (3 SAMPLE DESIGN CONCEPT websites) -> offer -> outcomes
-> transformation + trust -> action. Reutiliza tokens/WA/CK de build_flyers.
Las maquetas son CONCEPTOS DE MUESTRA (etiquetados), nunca clientes reales.
"""
import io, json, subprocess, tempfile, time, urllib.request, shutil
from pathlib import Path
import cv2, img2pdf, websocket
from PIL import Image
import build_flyers as B

ROOT = Path(__file__).resolve().parent
OUT = B.OUT
QRDIR = ROOT / "qr"
EDGE = B.EDGE
WA, CK, PHONE, WEB = B.WA, B.CK, B.PHONE, B.WEB

# ------------------------------------------------------------------ THEMES
# Nombres plausibles-genéricos; SIEMPRE etiquetados "SAMPLE DESIGN CONCEPT".
THEMES = {
 "contractor": dict(
   domain="summitroofing-miami.com", logo="SUMMIT ROOFING",
   vars={"--m-bg":"#0f1a26","--m-ink":"#eaf1f8","--m-navbg":"transparent","--m-logo":"#ffffff",
         "--m-muted":"rgba(234,241,248,0.6)","--m-accent":"#f97316","--m-btnink":"#0f1a26",
         "--m-head-ink":"#ffffff","--m-cardbg":"rgba(255,255,255,0.06)","--m-line":"rgba(255,255,255,0.28)",
         "--m-img":"linear-gradient(135deg,#f97316 0%,#7c2d12 55%,#1c1207 100%)"},
   menu=["Services","Projects","Reviews"], btn="Free Estimate",
   h="Roofing Miami trusts, done right.", p="Repairs, replacements and inspections with clear pricing.",
   cta="Get Free Estimate", industry="Contractor website", outcome="Built to generate quote requests"),
 "wellness": dict(
   domain="bellaskinstudio.com", logo="Bella Skin Studio", head="Georgia, 'Times New Roman', serif",
   vars={"--m-bg":"#fbf5ef","--m-ink":"#3b2e28","--m-navbg":"transparent","--m-logo":"#7a4a38",
         "--m-muted":"#9c8577","--m-accent":"#c2703f","--m-btnink":"#ffffff",
         "--m-head-ink":"#3b2e28","--m-cardbg":"#f2e6da","--m-line":"rgba(122,74,56,0.25)",
         "--m-img":"linear-gradient(135deg,#e9c9b3 0%,#c2703f 60%,#7a4a38 100%)"},
   menu=["Treatments","Pricing","Gallery"], btn="Book Now",
   h="Skincare & beauty, made for you.", p="Facials, lashes and skin treatments by appointment.",
   cta="Book Appointment", industry="Wellness & beauty", outcome="Services & booking made easy"),
 "professional": dict(
   domain="coastalfamilydental.com", logo="Coastal Dental",
   vars={"--m-bg":"#ffffff","--m-ink":"#0b1f2e","--m-navbg":"#ffffff","--m-logo":"#0b3a53",
         "--m-muted":"#5f7183","--m-accent":"#0ea5a4","--m-btnink":"#ffffff",
         "--m-head-ink":"#0b1f2e","--m-cardbg":"#eef4f5","--m-line":"rgba(11,31,46,0.15)",
         "--m-img":"linear-gradient(135deg,#5eead4 0%,#0ea5a4 45%,#0b3a53 100%)"},
   menu=["Services","Insurance","Team"], btn="Request Visit",
   h="Modern dental care for your family.", p="Gentle, on-time care with same-week appointments.",
   cta="Request a Visit", industry="Professional services", outcome="Professional presence on every device"),
}


def _style(t):
    v = dict(t["vars"])
    if t.get("head"):
        v["--m-head"] = t["head"]
    return ";".join(f"{k}:{val}" for k, val in v.items())


def desktop_mock(key):
    t = THEMES[key]
    menu = "".join(f"<span>{m}</span>" for m in t["menu"])
    cards = "".join('<div class="m-card"><div class="ico"></div><b></b><s></s></div>' for _ in range(3))
    return (f'<div class="mock" style="{_style(t)}">'
            f'<div class="chrome"><i></i><i></i><i></i><div class="addr">{t["domain"]}</div></div>'
            f'<div class="site"><div class="m-nav"><div class="m-logo">{t["logo"]}</div>'
            f'<div class="m-menu">{menu}</div><div class="m-btn">{t["btn"]}</div></div>'
            f'<div class="m-hero"><div><div class="h">{t["h"]}</div><div class="p">{t["p"]}</div>'
            f'<span class="cta">{t["cta"]}</span></div><div class="m-shot"></div></div>'
            f'<div class="m-strip">{cards}</div></div></div>')


def phone_mock(key):
    t = THEMES[key]
    return (f'<div class="phone" style="{_style(t)}"><div class="scr"><div class="notch"></div>'
            f'<div class="p-nav"><div class="p-logo">{t["logo"]}</div>'
            f'<div class="p-burger"><i></i><i></i><i></i></div></div>'
            f'<div class="p-hero"><div class="h">{t["h"]}</div><span class="cta">{t["cta"]}</span></div>'
            f'<div class="p-shot"></div></div></div>')


def gallery_card(key):
    t = THEMES[key]
    return (f'<div class="gal-card"><div class="gal-shot">{desktop_mock(key)}</div>'
            f'<div class="gal-meta"><span class="gal-ind">{t["industry"]}</span>'
            f'<span class="gal-tag">Sample concept</span></div>'
            f'<div class="gal-out">{t["outcome"]}</div></div>')


# ------------------------------------------------------------------ REAL PROJECTS
# Sitios reales EN VIVO ya publicados por 305 como trabajo propio. La captura
# vive en brand/src/shots/*.png. Mostrar solo con permiso del dueño.
SHOTS = B.BRAND / "src" / "shots"
PROJECTS = {
 "aguiar": dict(shot="aguiar.png", domain="aguiarflooring.com", industry="Flooring & remodeling",
                outcome="Built to turn visitors into quote requests"),
 "lsf": dict(shot="lsf.png", domain="lightspecterfilm.com", industry="Film & production",
             outcome="A cinematic, credible brand presence"),
 "polkanea": dict(shot="polkanea.png", domain="polkaneaproductions.com", industry="Streaming platform",
                  outcome="Built for subscriptions & content discovery"),
 "cosme": dict(shot="cosme.png", domain="cosmeproenza.com", industry="Arts & culture",
               outcome="A refined gallery & archive experience"),
}


def real_frame(key):
    p = PROJECTS[key]
    uri = (SHOTS / p["shot"]).as_uri()
    return (f'<div class="rshot"><div class="chrome"><i></i><i></i><i></i>'
            f'<div class="addr">{p["domain"]}</div></div>'
            f'<div class="win"><img src="{uri}" alt="{p["domain"]} — website by 305 Web Service"></div></div>')


def real_gallery_card(key):
    p = PROJECTS[key]
    return (f'<div class="gal-card"><div class="gal-shot">{real_frame(key)}</div>'
            f'<div class="gal-meta"><span class="gal-ind">{p["industry"]}</span>'
            f'<span class="gal-tag">{p["domain"]}</span></div>'
            f'<div class="gal-out">{p["outcome"]}</div></div>')


def render(cfg):
    lang = cfg["lang"]
    descriptor = ("Websites, Custom Software, NFC &amp; IT Solutions" if lang == "en"
                  else "Webs, Software a medida, NFC y Soluciones IT")
    trust = (["Clear scope", "Direct communication", "English & Spanish", "Local in Miami"] if lang == "en"
             else ["Alcance claro", "Comunicación directa", "Español e inglés", "Local en Miami"])
    trust_html = '<span class="dot"></span>'.join(f'<span class="chip">{c}</span>' for c in trust)
    t = cfg["t"]  # textos por idioma

    hero_key = cfg.get("hero_project", "aguiar")
    montage = (f'<div class="montage"><div class="m-desktop">{real_frame(hero_key)}</div>'
               f'<div class="m-label">{t["montage_label"]}</div></div>')

    gallery = "".join(real_gallery_card(k) for k in cfg.get("gallery_projects", ("aguiar", "lsf", "polkanea")))

    def og(title, items):
        lis = "".join(f"<li>{i}</li>" for i in items)
        return f'<div class="out-g"><h4>{title}</h4><ul>{lis}</ul></div>'
    outcomes = (og(t["og1_h"], t["og1"]) + og(t["og2_h"], t["og2"]) + og(t["og3_h"], t["og3"]))

    flow = (f'<span class="trans-step">{t["flow1"]}</span><span class="trans-arrow">&rarr;</span>'
            f'<span class="trans-step on">{t["flow2"]}</span><span class="trans-arrow">&rarr;</span>'
            f'<span class="trans-step">{t["flow3"]}</span>')

    hook = "<br>".join(f'<span class="hl">{p}</span>' if isinstance(p, dict) is False and p.startswith("§") else p
                       for p in [])  # placeholder no usado
    hook_html = t["hook"]

    qr_uri = (QRDIR / ("qr-" + cfg["campaign"] + ".svg")).as_uri()
    return f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
<link rel="stylesheet" href="{(ROOT / 'flyer.css').as_uri()}">
<link rel="stylesheet" href="{(ROOT / 'wsf.css').as_uri()}">
<style>@page{{size:8.75in 11.25in;margin:0}}</style></head>
<body><div class="wsf">

  <header class="wsf-hero"><div class="mono" aria-hidden="true">305</div>
    <div class="f-brandrow"><span class="f-wordmark"><b>305</b> Web Service</span><span class="f-descriptor">{descriptor}</span></div>
    <div class="wsf-grid">
      <div>
        <div class="f-eyebrow">{t["eyebrow"]}</div><div class="f-rule"></div>
        <h1 class="wsf-hook">{hook_html}</h1>
        <div class="wsf-priceline"><span class="k">{t["price_k"]}</span><span class="v">$499</span></div>
        <p class="wsf-support">{t["support"]}</p>
      </div>
      <div>{montage}</div>
    </div>
  </header>

  <section class="wsf-gallery">
    <div class="wsf-seclabel">{t["gallery_label"]}</div>
    <div class="gal-grid">{gallery}</div>
    <div class="gal-note">{t["gallery_note"]}</div>
  </section>

  <section class="wsf-pkg">
    <div>
      <div class="pkg-name">{t["pkg_name"]}</div>
      <div class="pkg-for">{t["pkg_for"]}</div>
      <div class="pkg-from">{t["pkg_from"]}</div>
    </div>
    <div class="out-groups">{outcomes}</div>
  </section>

  <section class="wsf-trans">
    <div class="trans-h">{t["trans_h"]}</div>
    <div class="trans-flow">{flow}</div>
  </section>
  <section class="wsf-trust">{trust_html}</section>

  <section class="wsf-cta">
    <div>
      <div class="cta-q">{t["cta_q"]}</div>
      <div class="cta-scan">{t["cta_scan"]}</div>
      <div class="cta-lines"><span class="tel">{PHONE}</span>
        <span class="wa">{WA}WhatsApp</span><span class="web">{WEB}</span></div>
    </div>
    <div class="cta-qr"><div class="card"><img src="{qr_uri}" alt="QR"></div>
      <div class="lb">{t["qr_label"]}</div></div>
  </section>

  <section class="wsf-clarify">{t["clarify"]}</section>
</div></body></html>"""


# ------------------------------------------------------------------ CONTENT (EN)
EN_A = dict(id="website-starter-499", lang="en", campaign="website-499", format="letter", variant="A",
  hero_project="aguiar", gallery_projects=("lsf", "polkanea", "cosme"),
  t=dict(
    eyebrow="Professional Website Package",
    hook='Turn more website visitors into <span class="hl">calls</span> with a professional website.',
    price_k="Starting at",
    support="Get a fast, mobile-ready website that makes your business look credible and gives customers an easy way to contact you.",
    montage_label="Real websites we've built — live right now",
    gallery_label="Websites we've built",
    gallery_note="Selected custom projects. Features and pricing vary by scope.",
    pkg_name="Website Starter",
    pkg_for="Best for professionals and small businesses that need a credible online presence.",
    pkg_from="A strong foundation to launch · from $499",
    og1_h="Look professional", og1=["Custom, business-focused design", "Responsive on phone & desktop"],
    og2_h="Make contact easy", og2=["Contact form + WhatsApp button", "Clear services & call-to-action"],
    og3_h="Launch correctly", og3=["Domain & SSL setup", "Basic SEO + one revision"],
    trans_h="From invisible to ready for business",
    flow1="No clear online presence", flow2="Professional website", flow3="More ways to be contacted",
    cta_q="Ready to look more professional online?",
    cta_scan="Scan to view our work and request your website",
    qr_label="Scan to view our work\n& request your website",
    clarify="Websites start at $499. Final pricing depends on content, integrations and functionality. Domain, hosting and maintenance are quoted separately. Projects shown are real work built by 305 Web Service, live at the address shown.",
  ))

# Variante B (headline de A/B): mismo precio, alcance y contacto.
EN_B = dict(id="website-starter-499", lang="en", campaign="website-499", format="letter", variant="B",
  t={**EN_A["t"],
     "hook": 'Your next customer is <span class="hl">searching</span>. Make sure your business looks ready.',
     "eyebrow": "Professional Website Package"})


# ------------------------------------------------------------------ BUILD (CDP)
def build(cfgs):
    profile = Path(tempfile.mkdtemp(prefix="edge-wsf-"))
    proc = subprocess.Popen([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        "--remote-debugging-port=9422", "--remote-allow-origins=*", f"--user-data-dir={profile}",
        "--window-size=840,1080", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ws = None
    for _ in range(60):
        try:
            tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9422/json").read())
            ws = next(x for x in tabs if x["type"] == "page")["webSocketDebuggerUrl"]; break
        except Exception: time.sleep(0.5)
    c = websocket.create_connection(ws, timeout=90); mid = [0]
    def cmd(m, p=None):
        mid[0] += 1; c.send(json.dumps({"id": mid[0], "method": m, "params": p or {}}))
        while True:
            r = json.loads(c.recv())
            if r.get("id") == mid[0]: return r.get("result", {})
    def ev(e, ap=False): return cmd("Runtime.evaluate", {"expression": e, "awaitPromise": ap, "returnByValue": True}).get("result", {}).get("value")
    cmd("Page.enable")
    results = []
    for cfg in cfgs:
        base = f"305-{cfg['id']}-{cfg['lang']}-{cfg['format']}-{cfg['variant']}"
        html_path = ROOT / f"_wsf-{cfg['lang']}-{cfg['variant']}.html"
        html_path.write_text(render(cfg), encoding="utf-8")
        cmd("Emulation.setDeviceMetricsOverride", {"width": 840, "height": 1080, "deviceScaleFactor": 1, "mobile": False})
        cmd("Page.navigate", {"url": html_path.as_uri()}); time.sleep(2.6)
        ev("document.fonts.ready.then(()=>true)", True)
        qa = json.loads(ev("""(function(){
          var cv=document.querySelector('.wsf'); var T=12,R=828,TP=12,BT=1068,worst=99;
          document.querySelectorAll('.f-eyebrow,.wsf-hook,.wsf-priceline .v,.wsf-support,.wsf-seclabel,.gal-ind,.gal-out,.pkg-name,.out-g h4,.out-g li,.trans-step,.wsf-trust .chip,.cta-q,.cta-scan,.tel,.web,.cta-qr .card,.cta-qr .lb,.wsf-clarify')
            .forEach(function(el){var r=el.getBoundingClientRect(); if(r.width===0)return;
              worst=Math.min(worst,r.left-T,R-r.right,r.top-TP,BT-r.bottom);});
          function bot(s){var m=0;document.querySelectorAll(s).forEach(function(e){var r=e.getBoundingClientRect();if(r.width)m=Math.max(m,r.bottom);});return m;}
          function top(s){var e=document.querySelector(s);return e?e.getBoundingClientRect().top:1e9;}
          var galBottom=Math.max(bot('.gal-out'),bot('.gal-shot'));
          var pkgBottom=Math.max(bot('.pkg-for'),bot('.pkg-from'),bot('.out-g li'));
          var pkgOver=Math.round(pkgBottom-top('.wsf-trans'));
          return JSON.stringify({fits: cv.scrollHeight<=1080.5 && pkgOver<=3, h:+(cv.scrollHeight/96).toFixed(2),
            safe:+(worst/96).toFixed(3), galOverlap:Math.round(galBottom-top('.wsf-pkg')), pkgOver:pkgOver});
        })()"""))
        png_bleed = OUT / f"{base}-print-bleed.png"
        subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=12000",
            "--force-device-scale-factor=3.125", "--window-size=840,1080", f"--screenshot={png_bleed}", html_path.as_uri()],
            check=False, capture_output=True, timeout=180)
        im = Image.open(png_bleed)
        trim = im.crop((37, 37, 2587, 3337)); png = OUT / f"{base}-print.png"; trim.save(png, dpi=(300, 300))
        cmyk = Image.open(png_bleed).convert("RGB").convert("CMYK")
        buf = io.BytesIO(); cmyk.save(buf, "JPEG", quality=95, dpi=(300, 300))
        (OUT / f"{base}-print-cmyk.pdf").write_bytes(
            img2pdf.convert(buf.getvalue(), layout_fun=img2pdf.get_fixed_dpi_layout_fun((300, 300))))
        img = cv2.imread(str(png)); d, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
        if not d:
            h, w = img.shape[:2]; d, _, _ = cv2.QRCodeDetector().detectAndDecode(img[2*h//3:, w//2:])
        results.append((base, qa, d))
        print(f"{base:38} fits={qa['fits']} h={qa['h']} safe={qa['safe']} pkgOver={qa['pkgOver']} qr={'OK' if d else 'FAIL'}")
    proc.terminate(); shutil.rmtree(profile, ignore_errors=True)
    return results


if __name__ == "__main__":
    build([EN_A])
