# -*- coding: utf-8 -*-
"""305 PORTAL — piezas de comparación y presentación de la revisión de copy.

Genera:
  1. Hoja antes/después (4 caras, presentación)
  2. Comparación a tamaño CR80 REAL (Letter @300 DPI, imprimir al 100%)
  3. Mockup de presentación (no es arte de impresión, sin fotos de stock)

Lee los PNG ya renderizados; no vuelve a componer la tarjeta.
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent / "out" / "305-portal"
BEFORE, AFTER = OUT / "before", OUT / "proofs"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FONTS = ROOT.parent.parent / "node_modules" / "@fontsource"

DPI = 300; MM = DPI/25.4
W, H = 1011, 638
RADIUS = 3.18*MM
LW, LH = 2550, 3300

FONT_CSS = "".join(
    f'@font-face{{font-family:"Inter";src:url("{(FONTS/"inter"/"files"/f"inter-latin-{w}-normal.woff2").as_uri()}") '
    f'format("woff2");font-weight:{w};font-style:normal;font-display:block}}'
    for w in (400, 500, 600, 700, 800, 900))

def u(p): return Path(p).as_uri()
def card(p, w=W): return (f'<img src="{u(p)}" style="display:block;width:{w}px;'
                          f'height:{w*H/W}px;border-radius:{RADIUS*w/W}px">')

BEF_F = BEFORE / "305-portal-front-PROOF-1011x638-sRGB.png"
BEF_B = BEFORE / "305-portal-back-PROOF-1011x638-sRGB.png"
AFT_F = AFTER  / "305-portal-front-PROOF-1011x638-sRGB.png"
AFT_B = AFTER  / "305-portal-back-PROOF-1011x638-sRGB.png"


def render(html, out, w, h, tag):
    f = ROOT / f"_cmp-{tag}.html"
    f.write_text(html, encoding="utf-8")
    subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
        "--virtual-time-budget=9000", f"--window-size={w},{h}", f"--screenshot={out}",
        f.as_uri()], check=False, capture_output=True, timeout=200)
    print(f"  {Path(out).name}  {w}x{h}")


def ba_sheet():
    cw = 760
    def row(label, color, note, f, b):
        return f"""<div style="margin-bottom:54px">
          <div style="display:flex;align-items:baseline;gap:20px;margin-bottom:20px">
            <span style="font-size:26px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;
                  color:{color}">{label}</span>
            <span style="font-size:22px;color:#64748b">{note}</span></div>
          <div style="display:flex;gap:38px">{card(f,cw)}{card(b,cw)}</div></div>"""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;background:#0d1013;width:{cw*2+38+120}px;height:{int(cw*H/W)*2+300}px}}
</style></head><body><div style="padding:60px">
{row("Antes","#64748b","Digital systems, built for business. &#183; Tap to connect &#183; Let&#8217;s build what&#8217;s next.",BEF_F,BEF_B)}
{row("Despu&#233;s","#3fd8c6","Technology that moves you forward. &#183; Tap to explore &#183; Ready to build what&#8217;s next?",AFT_F,AFT_B)}
<div style="font-size:22px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#ff6b6b">
  Prepress pending final QR &#8212; not for print</div>
</div></body></html>"""


def ba_1to1():
    def block(png, label, sub, top):
        return f"""<div style="position:absolute;left:{(LW-W)/2}px;top:{top}px;width:{W}px">
          {card(png)}
          <div style="margin-top:{4*MM}px;font-size:{3.1*MM}px;font-weight:800;letter-spacing:0.2em;
               text-transform:uppercase;color:#334155">{label}</div>
          <div style="margin-top:{1.4*MM}px;font-size:{2.7*MM}px;color:#64748b">{sub}</div></div>"""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;width:{LW}px;height:{LH}px;background:#fff;position:relative}}
</style></head><body>
<div style="position:absolute;left:{(LW-W)/2}px;top:{20*MM}px;width:{W}px">
  <div style="font-size:{4.6*MM}px;font-weight:800;color:#0b1826">Antes / Despu&#233;s &#8212; tama&#241;o real</div>
  <div style="margin-top:{2*MM}px;font-size:{2.9*MM}px;color:#475569;line-height:1.5">
    Imprimir al <b>100%</b>. Ambas caras frontales a escala CR80 exacta (85.60 &#215; 53.98 mm).<br>
    Juzgar: qu&#233; frase se lee primero, comprensi&#243;n en 3 segundos, ganas de tocar, legibilidad.</div>
  <div style="margin-top:{2.6*MM}px;font-size:{2.9*MM}px;font-weight:800;letter-spacing:0.14em;
       text-transform:uppercase;color:#dc2626">Prepress pending final QR &#8212; not for print</div>
</div>
{block(BEF_F, "Antes", "Digital systems, built for business. &#183; Tap to connect", 60*MM)}
{block(AFT_F, "Despu&#233;s", "Technology that moves you forward. &#183; Tap to explore", 60*MM + H + 26*MM)}
</body></html>"""


def mockup():
    """Escena de presentación: sin fotos de stock, solo luz, sombra y perspectiva."""
    cw = 1180
    ch = cw*H/W
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:"Inter",Arial,sans-serif;width:1900px;height:1180px;
 background:radial-gradient(120% 90% at 50% 12%, #1b2734 0%, #0a0f16 62%, #05080d 100%);
 display:flex;align-items:center;justify-content:center;position:relative}}
</style></head><body>
<div style="position:relative;perspective:2600px">
  <div style="transform:rotateX(16deg) rotateZ(-7deg);transform-style:preserve-3d;
              filter:drop-shadow(0 90px 90px rgba(0,0,0,0.72))">
    {card(AFT_F, cw)}
    <div style="position:absolute;inset:0;border-radius:{RADIUS*cw/W}px;pointer-events:none;
         background:linear-gradient(118deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 34%,
                    rgba(255,255,255,0) 70%, rgba(255,255,255,0.07) 100%)"></div>
  </div>
  <div style="position:absolute;left:8%;top:{ch*1.02}px;width:84%;height:{ch*0.5}px;
       transform:rotateX(16deg) rotateZ(-7deg) scaleY(-1);opacity:0.10;
       -webkit-mask-image:linear-gradient(to bottom, rgba(0,0,0,0.8), transparent 62%);
       overflow:hidden">{card(AFT_F, cw)}</div>
</div>
<div style="position:absolute;left:58px;bottom:46px;font-size:24px;font-weight:800;
     letter-spacing:0.2em;text-transform:uppercase;color:#8fb4ff">
  305 Portal &#183; mockup de presentaci&#243;n</div>
<div style="position:absolute;right:58px;bottom:46px;font-size:24px;font-weight:800;
     letter-spacing:0.2em;text-transform:uppercase;color:#ff6b6b">
  Presentation only &#8212; not for print</div>
</body></html>"""


if __name__ == "__main__":
    cw = 760
    render(ba_sheet(), OUT / "305-portal-BEFORE-AFTER.png",
           cw*2+38+120, int(cw*H/W)*2+300, "ba")
    render(ba_1to1(), OUT / "305-portal-BEFORE-AFTER-1to1-letter.png", LW, LH, "ba1")
    render(mockup(), OUT / "305-portal-mockup.png", 1900, 1180, "mock")
