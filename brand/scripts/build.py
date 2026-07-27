"""Pipeline de producción — 305 Web Service brand kit.

Por cada pieza de imprenta genera:
  out/pdf-vector/<n>.pdf   PDF vectorial RGB (Edge print-to-pdf, fuentes embebidas)
  out/png/<n>.png          PNG raster a 300 DPI reales
  out/print-cmyk/<n>.pdf   PDF CMYK 300 DPI listo para imprenta (raster)

El post social solo se exporta a PNG 1080×1080 (pieza digital RGB).
Al final re-verifica que cada QR escanee a la URL correcta.
"""
import io
import subprocess
import sys
from pathlib import Path

import cv2
import img2pdf
from PIL import Image

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT_VEC = ROOT / "out" / "pdf-vector"
OUT_PNG = ROOT / "out" / "png"
OUT_CMYK = ROOT / "out" / "print-cmyk"
for d in (OUT_VEC, OUT_PNG, OUT_CMYK):
    d.mkdir(parents=True, exist_ok=True)

URL = "https://305webservice.com"
SCALE = 300 / 96  # CSS px → 300 DPI

# (nombre, ancho CSS px, alto CSS px, es_imprenta, tiene_qr)
PIECES = [
    ("card-front", 360, 216, True, False),
    ("card-back", 360, 216, True, True),
    ("flyer-es", 504, 696, True, True),
    ("flyer-en", 504, 696, True, True),
    ("social-post", 1080, 1080, False, True),
]


# Filtro opcional: `py scripts/build.py flyer-es flyer-en` reconstruye solo esas
# piezas y omite los pipelines de social y reels.
ONLY = set(sys.argv[1:])
if ONLY:
    PIECES = [p for p in PIECES if p[0] in ONLY]
    unknown = ONLY - {p[0] for p in PIECES}
    if unknown:
        raise SystemExit(f"Piezas desconocidas: {', '.join(sorted(unknown))}")


def edge(args: list[str]) -> None:
    subprocess.run([EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
                    "--virtual-time-budget=10000", *args],
                   check=False, capture_output=True, timeout=120)


for name, w, h, is_print, has_qr in PIECES:
    url = (SRC / f"{name}.html").as_uri()

    # --- PNG 300 DPI (o 1:1 para el post social) ---
    png = OUT_PNG / f"{name}.png"
    scale = SCALE if is_print else 1
    edge([f"--force-device-scale-factor={scale}", f"--window-size={w},{h}",
          f"--screenshot={png}", url])
    im = Image.open(png)
    expected = (round(w * scale), round(h * scale))
    assert im.size == expected, f"{name}: {im.size} != {expected}"

    if is_print:
        # --- PDF vectorial ---
        edge(["--no-pdf-header-footer", f"--print-to-pdf={OUT_VEC / (name + '.pdf')}", url])

        # --- PDF CMYK 300 DPI ---
        cmyk = im.convert("RGB").convert("CMYK")
        buf = io.BytesIO()
        cmyk.save(buf, "JPEG", quality=97, dpi=(300, 300))
        layout = img2pdf.get_fixed_dpi_layout_fun((300, 300))
        (OUT_CMYK / f"{name}.pdf").write_bytes(
            img2pdf.convert(buf.getvalue(), layout_fun=layout))

    # --- verificación QR sobre el render final ---
    if has_qr:
        img = cv2.imread(str(png))
        data, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
        if not data:
            hh, ww = img.shape[:2]
            data, _, _ = cv2.QRCodeDetector().detectAndDecode(img[hh // 2:, ww // 2:])
        assert data == URL, f"{name}: QR = {data!r}"
        print(f"  {name}: QR OK -> {data}")
    print(f"{name}: listo ({im.size[0]}x{im.size[1]} px)")

print("\nPiezas de imprenta completas.")

if ONLY:
    raise SystemExit(0)

# ---- piezas sociales y reels (pipelines dedicados) ----
HERE = Path(__file__).resolve().parent
for script in ("render_social.py", "render_reels.py"):
    print(f"\n=== {script} ===")
    subprocess.run([sys.executable, str(HERE / script)], check=True)

print("\nBuild completo: imprenta + social + reels.")
