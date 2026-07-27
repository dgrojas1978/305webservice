"""Entregables del flyer Canva 8.5×11 + kit de reconstrucción editable.

Por idioma genera en out/canva/:
  flyer-canva-<l>-bleed.png     2625×3375 (8.75×11.25 @300, CON sangrado) — para imprenta
  flyer-canva-<l>.png           2550×3300 (8.5×11 @300, tamaño final) — para Canva / pantalla
  flyer-canva-<l>.pdf           PDF RGB tamaño final
  flyer-canva-<l>-cmyk.pdf      PDF CMYK 300 DPI (imprenta)
Kit editable en out/canva/assets/ (QR + capturas) + verifica el QR.
"""
import io, subprocess, shutil
from pathlib import Path
import cv2, img2pdf
from PIL import Image

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ROOT = Path(__file__).resolve().parent.parent
CANVA = ROOT / "canva"
OUT = ROOT / "out" / "canva"
ASSETS = OUT / "assets"
for d in (OUT, ASSETS): d.mkdir(parents=True, exist_ok=True)
URL = "https://305webservice.com"
SCALE = 3.125  # 300/96 → 300 DPI exacto

for lang in ("es", "en"):
    html = (CANVA / f"flyer-canva-{lang}.html").as_uri()
    bleed = OUT / f"flyer-canva-{lang}-bleed.png"
    subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
                    "--virtual-time-budget=12000", f"--force-device-scale-factor={SCALE}",
                    "--window-size=840,1080", f"--screenshot={bleed}", html],
                   check=False, capture_output=True, timeout=180)
    im = Image.open(bleed)
    assert im.size == (2625, 3375), f"{lang}: {im.size}"

    # tamaño final 8.5×11 (recorta 0.125in = 37.5px por lado → 2550×3300)
    trim = im.crop((37, 37, 2587, 3337))
    assert trim.size == (2550, 3300), trim.size
    trim.save(OUT / f"flyer-canva-{lang}.png", dpi=(300, 300))

    # PDF RGB (tamaño final)
    buf = io.BytesIO(); trim.convert("RGB").save(buf, "JPEG", quality=95, dpi=(300, 300))
    layout = img2pdf.get_fixed_dpi_layout_fun((300, 300))
    (OUT / f"flyer-canva-{lang}.pdf").write_bytes(img2pdf.convert(buf.getvalue(), layout_fun=layout))

    # PDF CMYK (con sangrado, para imprenta)
    cmyk = Image.open(bleed).convert("RGB").convert("CMYK")
    cbuf = io.BytesIO(); cmyk.save(cbuf, "JPEG", quality=96, dpi=(300, 300))
    (OUT / f"flyer-canva-{lang}-cmyk.pdf").write_bytes(
        img2pdf.convert(cbuf.getvalue(), layout_fun=img2pdf.get_fixed_dpi_layout_fun((300, 300))))

    # verifica QR sobre el render final
    img = cv2.imread(str(OUT / f"flyer-canva-{lang}.png"))
    data, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
    if not data:
        h, w = img.shape[:2]
        data, _, _ = cv2.QRCodeDetector().detectAndDecode(img[2*h//3:, 2*w//3:])
    assert data == URL, f"{lang}: QR = {data!r}"
    print(f"flyer-canva-{lang}: PNG+PDF+CMYK OK · QR {data}")

# kit editable: assets a 300+ dpi
Image.open(ROOT / "src/assets/qr-305webservice.png").save(ASSETS / "qr-305webservice.png")
for s in ("site-lsf", "site-polkanea", "site-aguiar"):
    shutil.copy(ROOT / f"src/assets/{s}.jpg", ASSETS / f"{s}.jpg")
print("kit de assets copiado ->", ASSETS)
