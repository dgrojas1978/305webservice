"""Paquete de produccion — tarjeta NFC de Mabel Toledo.

Genera en out/nfc/production/:
  mabel-nfc-front-proof.png / back   proof RGB 300 dpi al corte
  mabel-nfc-front-print.pdf / back   PDF con sangrado, texto VECTORIAL y fuentes embebidas
  mabel-nfc-front-cmyk.pdf  / back   CMYK 300 dpi — conversion MECANICA, provisional
  mabel-technical-sheet.pdf          bleed / trim / safe area / inlay (escala 2:1)
  mabel-color-spec.png               swatches RGB + CMYK medidos del arte

Lo que este script NO puede hacer y queda documentado en el informe:
  - PDF/X-4 real con perfil ICC del impresor (requiere Ghostscript, ausente).
  - Conversion de color gestionada: la CMYK de aqui es la naive de PIL y sirve
    solo como referencia; el impresor debe convertir desde el PDF vectorial.
"""
import io
from pathlib import Path

import img2pdf
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out" / "nfc"
PROD = OUT / "production"
PROD.mkdir(parents=True, exist_ok=True)

DPI = 300
mm = lambda v: round(v / 25.4 * DPI)
TRIM_W, TRIM_H = 85.60, 53.98
BLEED = 3.0
SAFE = 3.0
RADIUS = 3.18


def font(size, bold=True):
    for path in (r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


# ---------- 1 · proofs RGB al corte ----------
for face in ("front", "back"):
    im = Image.open(OUT / f"mabel-nfc-{face}-trim.png").convert("RGB")
    im.save(PROD / f"mabel-nfc-{face}-proof.png", dpi=(DPI, DPI))

# ---------- 2 · PDF vectorial con sangrado (el que debe usar el impresor) ----------
for face in ("front", "back"):
    src = OUT / f"mabel-nfc-{face}.pdf"
    if src.exists():
        (PROD / f"mabel-nfc-{face}-print.pdf").write_bytes(src.read_bytes())

# ---------- 3 · CMYK raster (referencia, NO gestionado por perfil) ----------
for face in ("front", "back"):
    im = Image.open(OUT / f"mabel-nfc-{face}-bleed.png").convert("RGB").convert("CMYK")
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=97, dpi=(DPI, DPI))
    layout = img2pdf.get_fixed_dpi_layout_fun((DPI, DPI))
    (PROD / f"mabel-nfc-{face}-cmyk.pdf").write_bytes(
        img2pdf.convert(buf.getvalue(), layout_fun=layout))

# ---------- 4 · lamina tecnica (escala 2:1 para que las guias se lean) ----------
S = 2
W, H = mm(216), mm(279)
sheet = Image.new("RGB", (W, H), "#FFFFFF")
d = ImageDraw.Draw(sheet)
d.text((mm(15), mm(13)), "Mabel Toledo — NFC · LAMINA TECNICA", font=font(48), fill="#101014")
d.text((mm(15), mm(21)), "Escala 2:1 — NO imprimir estas guias en la tarjeta final.",
       font=font(26, False), fill="#B03A2E")

cw, ch = mm(TRIM_W) * S, mm(TRIM_H) * S
bw, bh = mm(TRIM_W + 2 * BLEED) * S, mm(TRIM_H + 2 * BLEED) * S
ox, oy = mm(15), mm(32)

art = Image.open(OUT / "mabel-nfc-front-bleed.png").convert("RGB").resize((bw, bh), Image.LANCZOS)
sheet.paste(art, (ox, oy))

bx, by = ox, oy                                   # borde de sangrado
tx, ty = ox + mm(BLEED) * S, oy + mm(BLEED) * S   # linea de corte
sx, sy = tx + mm(SAFE) * S, ty + mm(SAFE) * S     # area segura


def dashed(box, colour, width=3, dash=14):
    x0, y0, x1, y1 = box
    for x in range(x0, x1, dash * 2):
        d.line([x, y0, min(x + dash, x1), y0], fill=colour, width=width)
        d.line([x, y1, min(x + dash, x1), y1], fill=colour, width=width)
    for y in range(y0, y1, dash * 2):
        d.line([x0, y, x0, min(y + dash, y1)], fill=colour, width=width)
        d.line([x1, y, x1, min(y + dash, y1)], fill=colour, width=width)


dashed((bx, by, bx + bw, by + bh), "#E04B2F")                       # sangrado
d.rectangle([tx, ty, tx + cw, ty + ch], outline="#101014", width=4)  # corte
dashed((sx, sy, sx + mm(TRIM_W - 2 * SAFE) * S, sy + mm(TRIM_H - 2 * SAFE) * S), "#1E9E5A")
# radio de esquina real
r = mm(RADIUS) * S
for cx, cy, a0 in ((tx, ty, 180), (tx + cw - 2 * r, ty, 270), (tx, ty + ch - 2 * r, 90), (tx + cw - 2 * r, ty + ch - 2 * r, 0)):
    d.arc([cx, cy, cx + 2 * r, cy + 2 * r], a0, a0 + 90, fill="#101014", width=4)
# zona de antena/inlay — PROVISIONAL
inset = mm(4) * S
d.rectangle([tx + inset, ty + inset, tx + cw - inset, ty + ch - inset], outline="#2F6FE0", width=3)

ly = oy + bh + mm(6)
for colour, label in (("#E04B2F", f"Sangrado {BLEED} mm (provisional — sustituir por plantilla del fabricante)"),
                      ("#101014", f"Corte / trim  {TRIM_W} × {TRIM_H} mm  ·  esquinas r={RADIUS} mm"),
                      ("#1E9E5A", f"Area segura  {SAFE} mm hacia dentro del corte"),
                      ("#2F6FE0", "Recorrido aproximado de la antena NTAG215/216 — PROVISIONAL, sin confirmar")):
    d.rectangle([mm(15), ly + 4, mm(15) + mm(7), ly + mm(4)], fill=colour)
    d.text((mm(15) + mm(9), ly), label, font=font(24, False), fill="#101014")
    ly += mm(7)

ly += mm(3)
d.text((mm(15), ly), "MEDIDAS DE TEXTO (medidas sobre el arte)", font=font(26), fill="#101014")
ly += mm(7)
for k, v in (("MABEL TOLEDO", "16 pt"), ("PRODUCER · EL CLOSET", "8.5 pt"),
             ("Stories brought to life.", "13 pt (Fraunces)"), ("TAP / SCAN", "9 pt"),
             ("Simbolo NFC", "5.4 mm"), ("QR impreso", "24.98 × 24.84 mm"),
             ("Retrato", "33 mm de ancho (38.6%) · 449 dpi efectivos")):
    d.text((mm(15), ly), f"{k}", font=font(23, False), fill="#3A4050")
    d.text((mm(95), ly), v, font=font(23), fill="#101014")
    ly += mm(5.6)

ly += mm(2)
d.text((mm(15), ly), "NO imprimir guias, posicion de chip ni marcas de corte salvo que el fabricante las pida.",
       font=font(23, False), fill="#B03A2E")

png = PROD / "mabel-technical-sheet.png"
sheet.save(png, dpi=(DPI, DPI))
(PROD / "mabel-technical-sheet.pdf").write_bytes(
    img2pdf.convert(str(png), layout_fun=img2pdf.get_fixed_dpi_layout_fun((DPI, DPI))))

# ---------- 5 · swatches de color, muestreados del arte real ----------
sw = Image.new("RGB", (mm(180), mm(78)), "#FFFFFF")
d = ImageDraw.Draw(sw)
d.text((mm(8), mm(6)), "Colores — RGB medido / CMYK de referencia", font=font(34), fill="#101014")
d.text((mm(8), mm(14)), "El CMYK es orientativo: convertir desde el PDF vectorial con el perfil del impresor.",
       font=font(21, False), fill="#B03A2E")
colours = (("Carbon (fondo)", (23, 21, 28)), ("Marfil (texto)", (244, 239, 230)),
           ("Dorado (acento)", (212, 175, 55)), ("Gris tap", (201, 194, 182)))
x = mm(8)
for name, rgb in colours:
    d.rectangle([x, mm(24), x + mm(30), mm(44)], fill=rgb, outline="#B9BEC8")
    r, g, b = [v / 255 for v in rgb]
    k = 1 - max(r, g, b)
    c, m, y = ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k)) if k < 1 else (0, 0, 0)
    d.text((x, mm(46)), name, font=font(21), fill="#101014")
    d.text((x, mm(51)), "#%02X%02X%02X" % rgb, font=font(20, False), fill="#3A4050")
    d.text((x, mm(56)), f"C{c*100:.0f} M{m*100:.0f} Y{y*100:.0f} K{k*100:.0f}", font=font(20, False), fill="#3A4050")
    x += mm(42)
sw.save(PROD / "mabel-color-spec.png", dpi=(DPI, DPI))

print("paquete en:", PROD)
for f in sorted(PROD.iterdir()):
    print(f"  {f.name:38s} {f.stat().st_size/1024:7.0f} KB")
