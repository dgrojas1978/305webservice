# -*- coding: utf-8 -*-
"""305 Sales Flyer System — genera los flyers desde configs (un solo layout).

Cada flyer = un dict de contenido + tokens. La estructura (anatomía A–H) es
compartida. Render 8.5×11 print (bleed 8.75×11.25) → PNG 300 DPI + CMYK PDF.
QA: encaje en el lienzo, área segura ≥ 0.25in, QR decodifica.
"""
import io, json, re, subprocess, sys, tempfile, time, urllib.request, shutil
from pathlib import Path
import cv2, img2pdf, websocket
from PIL import Image

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
OUT = BRAND / "out" / "flyers"
OUT.mkdir(parents=True, exist_ok=True)
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
QRDIR = ROOT / "qr"

TRUST = ["Based in Miami", "English & Spanish", "Local & remote support", "Clear project scope", "Direct communication"]
PHONE = "(305) 833-2984"
WEB = "305WEBSERVICE.COM"

CK = ('<svg class="ck" viewBox="0 0 16 16" fill="none"><path d="M3 8.5 6.5 12 13 4.5" '
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')
WA = ('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.852L.057 23.743a.5.5 0 00.612.612l5.9-1.476A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>')


def viz(name, lang):
    web_h = "YOUR<br>BRAND" if lang == "en" else "TU<br>MARCA"
    web_cta = "Get a quote" if lang == "en" else "Cotizar"
    if name == "browser":
        return (f'<div class="viz viz-browser"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>'
                f'<div class="pg"><div class="h">{web_h}</div><span class="cta">{web_cta}</span>'
                f'<div class="rows"><span></span><span></span><span></span></div></div></div>')
    if name == "nfc":
        tap = ["Tap", "Open", "Connect"] if lang == "en" else ["Toca", "Abre", "Conecta"]
        icons = ["◉", "▢", "✓"]
        steps = '<span class="arrow">→</span>'.join(
            f'<div class="step"><div class="ic">{ic}</div><div class="lb">{t}</div></div>' for ic, t in zip(icons, tap))
        return (f'<div class="viz viz-nfc"><div class="steps">{steps}</div>'
                f'<div class="card"><div class="avatar"></div><div class="lines"><span></span><span></span></div></div></div>')
    if name == "store":
        items = ''.join('<div class="item"><div class="ph"></div><div class="lb"></div></div>' for _ in range(4))
        co = "Checkout" if lang == "en" else "Pagar"
        return f'<div class="viz viz-store"><div class="grid">{items}</div><div class="checkout">{co}</div></div>'
    if name == "dashboard":
        kpis = ''.join('<div class="kpi"><div class="b"></div><div class="s"></div></div>' for _ in range(3))
        bars = ''.join('<i style="height:%d%%"></i>' % h for h in (40, 62, 48, 74, 58, 90))
        return f'<div class="viz viz-dash"><div class="top">{kpis}</div><div class="chart">{bars}</div></div>'
    if name == "network":
        labels = (["Internet", "Firewall", "Network", "Cloud"] if lang == "en"
                  else ["Internet", "Firewall", "Red", "Nube"])
        nodes = '<div class="link"></div>'.join(
            f'<div class="node"><div class="ic"></div><div class="lb">{l}</div></div>' for l in labels)
        return f'<div class="viz viz-net"><div class="flow">{nodes}</div></div>'
    if name == "ecosystem":
        tiles = ""  # ecosystem se dibuja en el body, no en el hero
        return ""
    return ""


def headline_html(lines):
    out = []
    for ln in lines:
        if isinstance(ln, dict):
            out.append(f'<span class="hl">{ln["t"]}</span>')
        else:
            out.append(ln)
    return "<br>".join(out)


def render_flyer(cfg) -> str:
    lang = cfg["lang"]
    has_visual = cfg.get("visual") and cfg["visual"] != "ecosystem"
    hero_grid_cls = "has-visual" if has_visual else ""
    visual_html = f'<div>{viz(cfg["visual"], lang)}</div>' if has_visual else ""

    # OFFER band
    offer = cfg.get("offer")
    offer_html = ""
    if offer:
        if offer["mode"] == "price":
            offer_html = (f'<section class="f-offer blue"><div class="f-offer-what">'
                          f'<div class="f-offer-name">{offer["name"]}</div><div class="f-offer-sub">{offer["sub"]}</div></div>'
                          f'<div class="f-price"><span class="k">{offer["k"]}</span><span class="v">{offer["v"]}</span></div></section>')
        else:
            offer_html = (f'<section class="f-offer light"><div class="f-offer-what">'
                          f'<div class="f-offer-name">{offer["name"]}</div><div class="f-offer-sub">{offer["sub"]}</div></div>'
                          f'<div class="f-price"><span class="state">{offer["state"]}</span></div></section>')

    # BODY
    body = cfg["body"]
    body_inner = ""
    if body["kind"] == "list":
        cols = "one" if len(body["items"]) <= 4 else ""
        fill = "fill" if body.get("fill") else ""
        lis = ''.join(f'<li>{CK}<span>{it}</span></li>' for it in body["items"])
        body_inner = f'<ul class="f-list {cols} {fill}">{lis}</ul>'
    elif body["kind"] == "tiles":
        def tile(t):
            d = f'<div class="d">{t["d"]}</div>' if t.get("d") else ""
            return f'<div class="f-tile"><div class="n">{t["n"]}</div><div class="t">{t["t"]}</div>{d}</div>'
        body_inner = '<div class="f-tiles">' + ''.join(tile(t) for t in body["items"]) + '</div>'
    elif body["kind"] == "prompts+list":
        fill = "fill" if body.get("fill") else ""
        pr = ''.join(f'<div class="f-prompt"><b>{p["k"]}</b>{p["t"]}</div>' for p in body["prompts"])
        lis = ''.join(f'<li>{CK}<span>{it}</span></li>' for it in body["items"])
        body_inner = f'<div class="f-prompts">{pr}</div><ul class="f-list {fill}">{lis}</ul>'

    body_html = (f'<section class="f-body"><div class="f-body-label">{body["label"]}</div>{body_inner}</section>')

    # TRUST
    trust = TRUST if lang == "en" else ["Con base en Miami", "Español e inglés", "Soporte local y remoto", "Alcance claro", "Comunicación directa"]
    trust_html = '<section class="f-trust">' + '<span class="dot"></span>'.join(f'<span class="chip">{c}</span>' for c in trust) + '</section>'

    # CTA
    sec = f'<span class="f-cta-btn secondary">{cfg["secondary_cta"]}</span>' if cfg.get("secondary_cta") else ""
    wa_label = "WhatsApp"
    cta_html = (f'<section class="f-cta"><div class="f-cta-main">'
                f'<div class="lead">{cfg.get("cta_lead","")}</div>'
                f'<div><span class="f-cta-btn">{cfg["cta"]}</span>{sec}</div>'
                f'<div class="f-cta-contact"><span class="tel">{PHONE}</span>'
                f'<span class="wa">{WA}{wa_label}</span><span class="web">{WEB}</span></div></div>'
                f'<div class="f-qr"><div class="f-qr-card"><img src="{(QRDIR / ("qr-" + cfg["campaign"] + ".svg")).as_uri()}" alt="QR"></div>'
                f'<div class="f-qr-label">{cfg["qr_label"]}</div></div></section>')

    clarify = f'<section class="f-clarify">{cfg["clarify"]}</section>' if cfg.get("clarify") else ""

    descriptor = "Websites, Custom Software, NFC &amp; IT Solutions" if lang == "en" else "Webs, Software a medida, NFC y Soluciones IT"
    h_size = cfg.get("h_size", "30pt")

    return f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
<link rel="stylesheet" href="{(ROOT / 'flyer.css').as_uri()}">
<style>@page{{size:8.75in 11.25in;margin:0}} .f-headline{{--h-size:{h_size}}}</style></head>
<body><div class="flyer">
  <header class="f-hero"><div class="mono" aria-hidden="true">305</div>
    <div class="f-brandrow"><span class="f-wordmark"><b>305</b> Web Service</span><span class="f-descriptor">{descriptor}</span></div>
    <div class="f-hero-grid {hero_grid_cls}">
      <div><div class="f-eyebrow">{cfg["eyebrow"]}</div><div class="f-rule"></div>
        <h1 class="f-headline">{headline_html(cfg["headline"])}</h1>
        <p class="f-promise">{cfg["promise"]}</p></div>
      {visual_html}
    </div>
  </header>
  {offer_html}
  {body_html}
  {trust_html}
  {cta_html}
  {clarify}
</div></body></html>"""


# ------------------------------------------------------------------ configs EN
def offer_price(name, sub, v="$499", k="Starting at"):
    return {"mode": "price", "name": name, "sub": sub, "k": k, "v": v}
def offer_state(name, sub, state):
    return {"mode": "state", "name": name, "sub": sub, "state": state}

EN = [
 dict(id="general", lang="en", campaign="general", h_size="29pt",
   eyebrow="Business Technology Solutions",
   headline=["One team for your website,", {"t": "software, NFC and IT."}],
   promise="305 Web Service helps small and growing businesses improve how they sell, operate and stay connected — with practical technology designed around their needs.",
   visual="ecosystem", offer=None,
   body=dict(label="Everything under one team", kind="tiles", items=[
     {"n": "01", "t": "Professional websites", "d": "Sites that explain your services and turn visitors into calls and messages."},
     {"n": "02", "t": "Online stores", "d": "Sell products, take bookings and get paid online."},
     {"n": "03", "t": "Custom software", "d": "Portals and tools built around how your team actually works."},
     {"n": "04", "t": "Automation & integrations", "d": "Connect your apps and cut out repetitive manual work."},
     {"n": "05", "t": "NFC business solutions", "d": "One tap to share contact, reviews, menu or booking."},
     {"n": "06", "t": "Networks, servers & IT", "d": "Keep your business connected, secure and running."}]),
   cta_lead="Tell us what you need", cta="Tell Us What Your Business Needs",
   qr_label="Scan to request a quote",
   clarify="Professional websites start at $499. Other services are quoted after a short scope conversation. Final pricing depends on content, integrations and functionality."),

 dict(id="website-499", lang="en", campaign="website", h_size="30pt",
   eyebrow="Professional Website Package",
   headline=["A professional website", "for your business —", {"t": "starting at $499."}],
   promise="Get a fast, mobile-ready website designed to explain your services clearly and turn visitors into calls, messages and quote requests.",
   visual="browser", offer=offer_price("Website Starter", "Fast · mobile-first · built to convert"),
   body=dict(label="What's included", kind="list", fill=True, items=[
     "One-page website or landing page", "Responsive design for every device",
     "Contact form + WhatsApp button", "Domain & SSL setup",
     "Basic on-page SEO", "One revision round"]),
   cta_lead="The fastest way to launch", cta="Start My Website",
   qr_label="Scan to view the package",
   clarify="Starting at $499 — not a guaranteed final price. Final pricing depends on content, integrations and required functionality. Domain registration, hosting, maintenance and additional services are detailed separately in the quote."),

 dict(id="custom-software", lang="en", campaign="software", h_size="28pt",
   eyebrow="Custom Software & Automation",
   headline=["Replace manual work with", {"t": "software built around"}, "your business."],
   promise="We create portals, dashboards, web applications and automated workflows that reduce repetitive work and connect the tools your team already uses.",
   visual="dashboard", offer=offer_state("Custom Software", "Built around your workflow", "Scoped Proposal"),
   body=dict(label="Sound familiar?", kind="prompts+list", fill=True,
     prompts=[{"k": "Problem", "t": "A spreadsheet is running part of your business."},
              {"k": "Problem", "t": "Your team enters the same information more than once."},
              {"k": "Problem", "t": "Customers wait for updates your system could send automatically."}],
     items=["Internal business tools", "Customer portals",
            "Dashboards & reporting", "CRM & system integrations"]),
   cta_lead="Let's scope it together", cta="Discuss My Software Idea",
   qr_label="Scan to describe your workflow",
   clarify="Custom software is delivered as a scoped proposal after a short discovery — a fixed scope, usually starting with the smallest version that delivers real value."),

 dict(id="nfc", lang="en", campaign="nfc", h_size="28pt",
   eyebrow="Smart NFC Solutions for Business",
   headline=["One tap can start", {"t": "the next business"}, "opportunity."],
   promise="Turn an NFC card, sign, sticker or display into a fast path to your contact details, reviews, menu, booking page, portfolio or lead form.",
   visual="nfc", offer=offer_state("NFC Business Solutions", "Physical tap · real digital action", "Custom Quote"),
   body=dict(label="What you can build", kind="list", fill=True, items=[
     "NFC digital business cards", "Managed cards for teams", "Tap-to-review cards & displays",
     "Tap-to-WhatsApp or booking", "Contactless menus & catalogs", "Lead-capture & CRM workflows",
     "NFC tags for products, services or properties"]),
   cta_lead="See it in action", cta="Explore NFC Solutions", secondary_cta="Request an NFC Quote",
   qr_label="Scan to see how NFC works",
   clarify="Includes a QR fallback when appropriate. NFC opens a page you control — nothing is collected without the visitor's consent. Compatible devices and final functionality depend on the selected NFC implementation."),

 dict(id="online-store", lang="en", campaign="ecommerce", h_size="27pt",
   eyebrow="Online Stores & Digital Sales",
   headline=["Make it easier for customers", {"t": "to discover, order and pay."}],
   promise="We build mobile-friendly online stores, catalogs, booking experiences and payment flows designed around your products and operation.",
   visual="store", offer=offer_state("Online Store", "Discover · order · pay", "Custom Quote"),
   body=dict(label="What's included", kind="list", fill=True, items=[
     "Store or catalog architecture", "Product or service pages", "Mobile checkout",
     "Payment integration", "Shipping, pickup or booking setup", "Order notifications",
     "Analytics & client training"]),
   cta_lead="Start selling online", cta="Plan My Online Store",
   qr_label="Scan to discuss your store",
   clarify="Delivered as a custom quote based on catalog size, payment and shipping needs and integrations. Scope and price are confirmed before any work begins."),

 dict(id="it-support", lang="en", campaign="it", h_size="28pt",
   eyebrow="IT Infrastructure & Support",
   headline=["Keep your business connected,", {"t": "protected and running."}],
   promise="We help Miami businesses configure and maintain the networks, cloud tools, servers, backups and support systems their teams depend on.",
   visual="network", offer=offer_state("IT Infrastructure & Support", "Connected · protected · managed", "Assessment Required"),
   body=dict(label="What we handle", kind="list", fill=True, items=[
     "Business Wi-Fi", "Routers, switches & cabling", "Microsoft 365 & Google Workspace",
     "Servers & cloud services", "Backups & recovery planning", "Security & remote access",
     "Remote & on-site support"]),
   cta_lead="Start with an assessment", cta="Request an IT Assessment",
   qr_label="Scan to request an assessment",
   clarify="We start with an assessment of your current setup, then recommend and quote only what your business actually needs."),
]


def build(cfgs, verify_qr=True):
    profile = Path(tempfile.mkdtemp(prefix="edge-fly-"))
    proc = subprocess.Popen([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        "--remote-debugging-port=9420", "--remote-allow-origins=*", f"--user-data-dir={profile}",
        "--window-size=840,1080", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ws = None
    for _ in range(60):
        try:
            tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9420/json").read())
            ws = next(t for t in tabs if t["type"] == "page")["webSocketDebuggerUrl"]; break
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
        html_path = ROOT / f"_flyer-{cfg['id']}-{cfg['lang']}.html"
        html_path.write_text(render_flyer(cfg), encoding="utf-8")
        cmd("Emulation.setDeviceMetricsOverride", {"width": 840, "height": 1080, "deviceScaleFactor": 1, "mobile": False})
        cmd("Page.navigate", {"url": html_path.as_uri()}); time.sleep(2.4)
        ev("document.fonts.ready.then(()=>true)", True)
        # QA: encaje + área segura (0.25in=24px del trim 12px)
        qa = json.loads(ev("""(function(){
          var cv=document.querySelector('.flyer'); var T=12,R=828,TP=12,BT=1068,worst=99;
          document.querySelectorAll('.f-eyebrow,.f-headline,.f-promise,.f-offer-name,.f-price,.f-body-label,.f-list li,.f-tile,.f-prompt,.chip,.f-cta-btn,.tel,.web,.f-qr-card,.f-qr-label,.f-clarify')
            .forEach(function(el){var r=el.getBoundingClientRect(); if(r.width===0)return;
              worst=Math.min(worst,r.left-T,R-r.right,r.top-TP,BT-r.bottom);});
          // overflow interno: contenido del cuerpo tapado por la franja de confianza / CTA
          function bot(sel){var m=0; document.querySelectorAll(sel).forEach(function(e){var r=e.getBoundingClientRect(); if(r.width) m=Math.max(m,r.bottom);}); return m;}
          function top(sel){var e=document.querySelector(sel); return e?e.getBoundingClientRect().top:1e9;}
          var bodyBottom=Math.max(bot('.f-body-label'),bot('.f-list li'),bot('.f-tile'),bot('.f-prompt'));
          var ov=Math.round(bodyBottom-top('.f-trust'));
          return JSON.stringify({fits: cv.scrollHeight<=1080.5 && ov<=3, h:+(cv.scrollHeight/96).toFixed(2),
            safe:+(worst/96).toFixed(3), overflow:ov});
        })()"""))
        # render 300dpi
        png_bleed = OUT / f"305-{cfg['id']}-{cfg['lang']}-print-bleed.png"
        subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=10000",
            "--force-device-scale-factor=3.125", "--window-size=840,1080", f"--screenshot={png_bleed}", html_path.as_uri()],
            check=False, capture_output=True, timeout=180)
        im = Image.open(png_bleed)
        trim = im.crop((37, 37, 2587, 3337))  # 8.5×11 @300
        png = OUT / f"305-{cfg['id']}-{cfg['lang']}-print.png"; trim.save(png, dpi=(300, 300))
        # CMYK PDF (con sangrado)
        cmyk = Image.open(png_bleed).convert("RGB").convert("CMYK")
        buf = io.BytesIO(); cmyk.save(buf, "JPEG", quality=95, dpi=(300, 300))
        (OUT / f"305-{cfg['id']}-{cfg['lang']}-print-cmyk.pdf").write_bytes(
            img2pdf.convert(buf.getvalue(), layout_fun=img2pdf.get_fixed_dpi_layout_fun((300, 300))))
        qr = ""
        if verify_qr:
            img = cv2.imread(str(png)); d, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
            if not d:
                h, w = img.shape[:2]; d, _, _ = cv2.QRCodeDetector().detectAndDecode(img[2*h//3:, w//2:])
            qr = d
        results.append((cfg["id"], qa, qr))
        print(f"{cfg['id']:16} fits={qa['fits']} h={qa['h']} safe={qa['safe']} qr={'OK' if qr else 'FAIL'}")
    proc.terminate(); shutil.rmtree(profile, ignore_errors=True)
    return results


if __name__ == "__main__":
    build(EN)
    print("\nEN flyers listos ->", OUT)
