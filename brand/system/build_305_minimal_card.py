from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
OUT = BRAND / "out" / "305-minimal-card"
OUT.mkdir(parents=True, exist_ok=True)

DPI = 300
TRIM_W_MM, TRIM_H_MM = 85.60, 53.98
BLEED_MM = 3.0
PAGE_W_MM, PAGE_H_MM = TRIM_W_MM + 2 * BLEED_MM, TRIM_H_MM + 2 * BLEED_MM
PX_MM = DPI / 25.4
W, H = round(PAGE_W_MM * PX_MM), round(PAGE_H_MM * PX_MM)
OX = round(BLEED_MM * PX_MM)
OY = OX

NAVY = (5, 13, 26)
WHITE = (246, 247, 251)
MUTED = (151, 164, 184)
BLUE = (76, 113, 255)
AQUA = (116, 221, 207)
QR_SVG = BRAND / "out" / "305-portal" / "_qr.svg"


def px(value_mm):
    return round(value_mm * PX_MM)


def font(points, bold=False):
    name = "segoeuib.ttf" if bold else "segoeui.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), round(points * DPI / 72))


def letterspaced(draw, xy, text, face, fill, spacing_mm=0.32):
    x, y = xy
    spacing = px(spacing_mm)
    for char in text:
        draw.text((x, y), char, font=face, fill=fill)
        x += draw.textlength(char, font=face) + spacing


def base():
    return Image.new("RGB", (W, H), NAVY)


def wordmark(draw, x, y, scale=1.0):
    f = font(11.8 * scale, True)
    draw.text((x, y), "305", font=f, fill=BLUE)
    offset = draw.textlength("305", font=f) + px(1.1 * scale)
    draw.text((x + offset, y), "WEB SERVICE", font=f, fill=WHITE)


def nfc_mark(draw, cx, cy):
    width = max(2, px(0.22))
    for radius in (2.0, 3.3, 4.6):
        r = px(radius)
        draw.arc((cx-r, cy-r, cx+r, cy+r), -58, 58, fill=AQUA, width=width)
    draw.ellipse((cx-px(.6), cy-px(.6), cx+px(.6), cy+px(.6)), fill=BLUE)


def front():
    image = base()
    draw = ImageDraw.Draw(image)
    left = OX + px(6.2)
    wordmark(draw, left, OY + px(6.3))

    # The physical card uses the same approved central promise as the virtual card.
    draw.text((left, OY + px(20.2)), "TECHNOLOGY THAT", font=font(12.2, True), fill=WHITE)
    draw.text((left, OY + px(27.8)), "MOVES YOU FORWARD.", font=font(12.2, True), fill=BLUE)

    nfc_x, nfc_y = OX + px(70.0), OY + px(43.5)
    nfc_mark(draw, nfc_x, nfc_y)
    letterspaced(draw, (OX + px(55.6), OY + px(45.1)), "TAP TO EXPLORE", font(9, True), WHITE, .26)
    return image


def back():
    if not QR_SVG.exists():
        raise FileNotFoundError(f"Missing QR source: {QR_SVG}")
    image = base()
    draw = ImageDraw.Draw(image)
    left = OX + px(6.2)
    wordmark(draw, left, OY + px(7.0), .72)

    draw.text((left, OY + px(23.0)), "SCAN TO", font=font(11.0, True), fill=WHITE)
    draw.text((left, OY + px(29.4)), "EXPLORE", font=font(11.0, True), fill=BLUE)
    letterspaced(draw, (left, OY + px(41.2)), "305WEBSERVICE.COM", font(9), MUTED, .18)

    qr_size = px(24.0)
    # The approved QR is a 57-module SVG made of one-module path rectangles.
    # Rasterize it directly so there is no anti-aliasing at the module edges.
    qr = Image.new("RGB", (57, 57), "white")
    qr_draw = ImageDraw.Draw(qr)
    svg = QR_SVG.read_text(encoding="utf-8")
    for x, y in re.findall(r"M(\d+),(\d+)H\d+V\d+H\d+z", svg):
        qr_draw.point((int(x), int(y)), fill="black")
    qr = qr.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    qr_x = OX + px(TRIM_W_MM - 6.2) - qr_size
    qr_y = OY + (px(TRIM_H_MM) - qr_size) // 2
    image.paste(qr, (qr_x, qr_y))
    return image


def save_side(image, stem):
    bleed_png = OUT / f"{stem}-bleed-300dpi.png"
    image.save(bleed_png, dpi=(DPI, DPI), optimize=True)
    image.convert("CMYK").save(
        OUT / f"{stem}-bleed-cmyk-300dpi.tif",
        dpi=(DPI, DPI),
        compression="tiff_lzw",
    )
    trim = image.crop((OX, OY, OX + px(TRIM_W_MM), OY + px(TRIM_H_MM)))
    trim.save(OUT / f"{stem}-trim-300dpi.png", dpi=(DPI, DPI), optimize=True)


def save_pdf(front_image, back_image):
    path = OUT / "305-minimal-nfc-card-front-back-bleed.pdf"
    pdf = canvas.Canvas(str(path), pagesize=(PAGE_W_MM * mm, PAGE_H_MM * mm), pageCompression=1)
    for image, name in ((front_image, "front"), (back_image, "back")):
        temp = OUT / f".{name}-pdf.png"
        image.save(temp, dpi=(DPI, DPI))
        pdf.drawImage(str(temp), 0, 0, width=PAGE_W_MM * mm, height=PAGE_H_MM * mm)
        pdf.showPage()
        temp.unlink()
    pdf.save()


def save_proof(front_image, back_image):
    margin, gap, footer = px(8), px(8), px(10)
    proof = Image.new("RGB", (W * 2 + gap + margin * 2, H + margin * 2 + footer), (11, 14, 19))
    proof.paste(front_image, (margin, margin))
    proof.paste(back_image, (margin + W + gap, margin))
    draw = ImageDraw.Draw(proof)
    draw.text((margin, margin + H + px(3)), "FRONT · CR80 + 3 MM BLEED", font=font(9, True), fill=MUTED)
    draw.text((margin + W + gap, margin + H + px(3)), "BACK · QR FALLBACK", font=font(9, True), fill=MUTED)
    proof.save(OUT / "305-minimal-nfc-card-proof.png", dpi=(DPI, DPI), optimize=True)


def save_readme():
    (OUT / "PRINT-README.md").write_text(
        """# 305 Web Service — minimalist NFC card print package

- Trim: 85.60 × 53.98 mm (CR80 / ISO/IEC 7810 ID-1)
- Bleed: 3 mm each edge; supplied canvas: 91.60 × 59.98 mm
- Resolution: 300 DPI
- Production color: CMYK TIFF, front and back
- Vendor PDF: two pages, front then back, both with bleed
- Minimum type: 9 pt
- QR fallback: 24 mm, four-module quiet zone, no embedded logo
- QR destination: `/c/305`, which resolves to the 305 digital card
- NFC destination: use the same canonical card route with NFC campaign attribution

The front has one action: tap. The back has one action: scan. No phone, email,
price, service catalog or social icons are printed. Confirm the vendor's exact
bleed, safe area and antenna/inlay position before the production run. Print one
physical sample and test NFC plus QR on current iPhone and Android devices before
locking the NTAG.
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    front_image = front()
    back_image = back()
    save_side(front_image, "305-minimal-front")
    save_side(back_image, "305-minimal-back")
    save_pdf(front_image, back_image)
    save_proof(front_image, back_image)
    save_readme()
    print(f"Built {W} × {H}px at {DPI} DPI ({PAGE_W_MM:.2f} × {PAGE_H_MM:.2f} mm with bleed)")
