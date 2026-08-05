"""Láminas de REVISIÓN de la tarjeta NFC (no son archivos de producción).

  out/nfc/comparison-1to1.png  current vs 305 OBJECT, ambas a 85.60 × 53.98 mm reales
  out/nfc/print-1to1.pdf       hoja Carta para imprimir al 100% y juzgar en mano,
                               con marcas de corte y una regla de 50 mm para verificar
                               que la impresora no escaló.

Requiere haber corrido build_nfc.py antes (usa los recortes al corte).
"""
from pathlib import Path

import img2pdf
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out" / "nfc"
CURRENT = Path("C:/Users/danyg/Documents/Codex/2026-07-15/cue/outputs/"
               "nfc-card-concepts/305-portal-concept-v1.png")

DPI = 300
mm = lambda v: round(v / 25.4 * DPI)
CW, CH = mm(85.60), mm(53.98)          # CR80 exacto a 300 DPI


def font(size, bold=True):
    for path in (r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
                 r"C:\Windows\Fonts\arialbd.ttf"):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def refined(face):
    return Image.open(OUT / f"nfc-{face}-trim.png").convert("RGB").resize((CW, CH), Image.LANCZOS)


def current(face):
    """Recorta la cara pedida del proof actual, forzando la proporción CR80."""
    im = Image.open(CURRENT).convert("RGB")
    w = 908
    h = round(w / (85.60 / 53.98))
    top = 123 if face == "front" else 783
    return im.crop((57, top, 57 + w, top + h)).resize((CW, CH), Image.LANCZOS)


def comparison():
    M, GX, GY, HEAD, LBL = 120, 150, 80, 190, 54
    sw = M + CW + GX + CW + M
    sh = HEAD + (LBL + CH + GY) * 2 + M
    sheet = Image.new("RGB", (sw, sh), "#0B0B0F")
    d = ImageDraw.Draw(sheet)
    d.text((M, 70), "305 NFC · CURRENT vs 305 OBJECT", font=font(58), fill="#FFFFFF")
    d.text((M, 140), "Escala 1:1 — cada tarjeta mide 85.60 × 53.98 mm (CR80)",
           font=font(30, False), fill="#8A93A6")
    cols = ((M, "CURRENT — 305 PORTAL", "#7A8296"),
            (M + CW + GX, "REFINED — 305 OBJECT", "#4C86FF"))
    rows = ((HEAD, "front", "ANVERSO / FRONT"),
            (HEAD + LBL + CH + GY, "back", "REVERSO / BACK"))
    for y, face, rl in rows:
        for (x, cl, colour), img in zip(cols, (current(face), refined(face))):
            d.text((x, y), f"{cl}   ·   {rl}", font=font(26), fill=colour)
            sheet.paste(img, (x, y + LBL))
            d.rectangle([x - 1, y + LBL - 1, x + CW, y + LBL + CH], outline="#2A2E39")
    sheet.save(OUT / "comparison-1to1.png", dpi=(DPI, DPI))
    return sheet.size


def print_sheet():
    """Carta 216 × 279 mm, blanco, con marcas de corte y regla de control."""
    W, H = mm(216), mm(279)
    sheet = Image.new("RGB", (W, H), "#FFFFFF")
    d = ImageDraw.Draw(sheet)
    d.text((mm(18), mm(16)), "305 OBJECT — vista de impresión 1:1", font=font(46), fill="#101014")
    d.text((mm(18), mm(24)),
           "Imprimir al 100% (sin «ajustar a página»). Verificar la regla antes de juzgar.",
           font=font(26, False), fill="#5A6070")

    for i, face in enumerate(("front", "back")):
        x, y = mm(18), mm(38) + i * (CH + mm(22))
        sheet.paste(refined(face), (x, y))
        d.text((x, y - mm(5)), "ANVERSO" if face == "front" else "REVERSO",
               font=font(24), fill="#5A6070")
        # marcas de corte: fuera del trim, nunca encima del arte
        t = mm(4)
        for cx, cy in ((x, y), (x + CW, y), (x, y + CH), (x + CW, y + CH)):
            d.line([cx - t, cy, cx - mm(1), cy], fill="#101014", width=3)
            d.line([cx + mm(1), cy, cx + t, cy], fill="#101014", width=3)
            d.line([cx, cy - t, cx, cy - mm(1)], fill="#101014", width=3)
            d.line([cx, cy + mm(1), cx, cy + t], fill="#101014", width=3)

    # regla de control de 50 mm
    ry = mm(38) + 2 * (CH + mm(22)) + mm(6)
    rx = mm(18)
    d.line([rx, ry, rx + mm(50), ry], fill="#101014", width=4)
    for k in range(11):
        h = mm(3) if k % 5 == 0 else mm(1.6)
        d.line([rx + mm(5 * k), ry, rx + mm(5 * k), ry - h], fill="#101014", width=3)
    d.text((rx, ry + mm(3)), "50 mm exactos — si no mide 50 mm, la impresión está escalada",
           font=font(24, False), fill="#5A6070")
    d.text((rx, ry + mm(10)),
           "CR80 / ISO ID-1 · 85.60 × 53.98 mm · esquinas r=3.18 mm · QR 24 mm",
           font=font(24, False), fill="#5A6070")

    png = OUT / "_print-1to1.png"
    sheet.save(png, dpi=(DPI, DPI))
    layout = img2pdf.get_fixed_dpi_layout_fun((DPI, DPI))
    (OUT / "print-1to1.pdf").write_bytes(img2pdf.convert(str(png), layout_fun=layout))
    return sheet.size


print("comparación:", comparison())
print("hoja 1:1   :", print_sheet())
