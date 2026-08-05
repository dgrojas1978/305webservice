from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
BRAND = ROOT.parent
REPO = BRAND.parent

from PIL import Image, ImageDraw, ImageFont
import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm

DPI = 300
TRIM_W_MM, TRIM_H_MM = 85.60, 53.98
BLEED_MM = 3.0
PAGE_W_MM, PAGE_H_MM = TRIM_W_MM + BLEED_MM * 2, TRIM_H_MM + BLEED_MM * 2
PX_PER_MM = DPI / 25.4
W, H = round(PAGE_W_MM * PX_PER_MM), round(PAGE_H_MM * PX_PER_MM)
OX = round(BLEED_MM * PX_PER_MM)
OY = OX
NAVY = (7, 18, 27)
WHITE = (245, 243, 237)
STEEL = (174, 184, 189)
GOLD = (199, 162, 93)
URL = "https://www.305webservice.com/card/infinite-windows"

OUT = BRAND / "out" / "infinite-windows-card"
OUT.mkdir(exist_ok=True)
ASSETS = REPO / "public" / "card" / "infinite-windows"


def px(mm_value):
    return round(mm_value * PX_PER_MM)


def font(size_pt, bold=False):
    name = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), round(size_pt * DPI / 72))


def fit_logo(width_mm):
    logo = Image.open(ASSETS / "logo-white.png").convert("RGBA")
    target_w = px(width_mm)
    target_h = round(logo.height * target_w / logo.width)
    return logo.resize((target_w, target_h), Image.Resampling.LANCZOS)


def letterspaced(draw, xy, text, fnt, fill, spacing_mm=.55):
    x, y = xy
    spacing = px(spacing_mm)
    for char in text:
        draw.text((x, y), char, font=fnt, fill=fill)
        x += draw.textlength(char, font=fnt) + spacing


def make_qr():
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_Q, box_size=16, border=4)
    qr.add_data(URL)
    qr.make(fit=True)
    image = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    image.save(OUT / "qr-infinite-windows.png", dpi=(DPI, DPI))
    return image


def base():
    return Image.new("RGB", (W, H), NAVY)


def front():
    image = base()
    draw = ImageDraw.Draw(image)
    logo = fit_logo(43)
    x = OX + (px(TRIM_W_MM) - logo.width) // 2
    y = OY + px(17.2)
    image.paste(logo, (x, y), logo)

    # NFC mark and instruction, positioned away from the likely antenna center.
    cx, cy = OX + px(69.2), OY + px(43.5)
    for radius in (2.1, 3.5, 4.9):
        r = px(radius)
        draw.arc((cx-r, cy-r, cx+r, cy+r), -58, 58, fill=GOLD, width=max(2, px(.22)))
    letterspaced(draw, (OX + px(60.2), OY + px(45.3)), "TAP", font(9, True), STEEL, .45)
    return image


def back(qr_source):
    image = base()
    draw = ImageDraw.Draw(image)
    logo = fit_logo(23)
    image.paste(logo, (OX + px(6.2), OY + px(7.0)), logo)

    qr_size = px(24)
    qr = qr_source.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    qr_x = OX + px(TRIM_W_MM - 6.2) - qr_size
    qr_y = OY + (px(TRIM_H_MM) - qr_size) // 2
    image.paste(qr, (qr_x, qr_y))

    letterspaced(draw, (OX + px(6.2), OY + px(34.4)), "SCAN", font(9, True), WHITE, .55)
    letterspaced(draw, (OX + px(6.2), OY + px(40.0)), "INFINITEWINDOWS.COM", font(9), STEEL, .22)
    return image


def save_side(image, stem):
    image.save(OUT / f"{stem}-bleed-300dpi.png", dpi=(DPI, DPI), optimize=True)
    image.convert("CMYK").save(OUT / f"{stem}-bleed-cmyk-300dpi.tif", dpi=(DPI, DPI), compression="tiff_lzw")
    trim = image.crop((OX, OY, OX + px(TRIM_W_MM), OY + px(TRIM_H_MM)))
    trim.save(OUT / f"{stem}-trim-300dpi.png", dpi=(DPI, DPI), optimize=True)


def save_pdf(front_image, back_image):
    pdf_path = OUT / "infinite-windows-nfc-card-front-back-bleed.pdf"
    c = canvas.Canvas(str(pdf_path), pagesize=(PAGE_W_MM * mm, PAGE_H_MM * mm), pageCompression=1)
    for image, name in ((front_image, "front"), (back_image, "back")):
        temp = OUT / f".{name}-pdf-source.png"
        image.save(temp, dpi=(DPI, DPI))
        c.drawImage(str(temp), 0, 0, width=PAGE_W_MM * mm, height=PAGE_H_MM * mm, mask="auto")
        c.showPage()
        temp.unlink()
    c.save()


def save_proof(front_image, back_image):
    gap = px(8)
    margin = px(8)
    proof = Image.new("RGB", (W * 2 + gap + margin * 2, H + margin * 2 + px(10)), (12, 14, 15))
    proof.paste(front_image, (margin, margin))
    proof.paste(back_image, (margin + W + gap, margin))
    draw = ImageDraw.Draw(proof)
    draw.text((margin, margin + H + px(3)), "FRONT · 85.60 × 53.98 MM + 3 MM BLEED", font=font(9, True), fill=STEEL)
    draw.text((margin + W + gap, margin + H + px(3)), "BACK · QR FALLBACK → INFINITEWINDOWS.COM", font=font(9, True), fill=STEEL)
    proof.save(OUT / "infinite-windows-nfc-card-proof.png", dpi=(DPI, DPI), optimize=True)


if __name__ == "__main__":
    qr_image = make_qr()
    front_image = front()
    back_image = back(qr_image)
    save_side(front_image, "infinite-windows-front")
    save_side(back_image, "infinite-windows-back")
    save_pdf(front_image, back_image)
    save_proof(front_image, back_image)
    print(f"Built print files at {PAGE_W_MM:.2f} × {PAGE_H_MM:.2f} mm, {W} × {H} px, {DPI} DPI")
