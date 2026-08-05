"""305 OBJECT — render de la tarjeta NFC física (CR80).

Por cada cara genera:
  out/nfc/<n>-bleed.png   PNG 300 DPI con sangrado (lienzo 91.60 × 59.98 mm)
  out/nfc/<n>-trim.png    PNG 300 DPI recortado al corte (85.60 × 53.98 mm)
  out/nfc/<n>.pdf         PDF vectorial (fuentes embebidas) — arte de producción

No genera CMYK todavía: el encargo pide aprobar la comparación 1:1 antes de
producir archivos finales.
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "out" / "nfc"
OUT.mkdir(parents=True, exist_ok=True)

DPI = 300
MM_IN = 25.4
BLEED_MM = 3.0
TRIM_W, TRIM_H = 85.60, 53.98
CANVAS_W, CANVAS_H = TRIM_W + 2 * BLEED_MM, TRIM_H + 2 * BLEED_MM  # 91.60 × 59.98

mm_to_px = lambda mm: round(mm / MM_IN * DPI)
mm_to_css = lambda mm: round(mm / MM_IN * 96)
SCALE = DPI / 96


def edge(args):
    subprocess.run(
        [EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
         "--virtual-time-budget=15000", *args],
        check=False, capture_output=True, timeout=120,
    )


for name in ("mabel-nfc-front", "mabel-nfc-back"):
    url = (SRC / f"{name}.html").as_uri()

    png = OUT / f"{name}-bleed.png"
    edge([f"--force-device-scale-factor={SCALE}",
          f"--window-size={mm_to_css(CANVAS_W)},{mm_to_css(CANVAS_H)}",
          f"--screenshot={png}", url])

    im = Image.open(png)
    # Recorte al corte: se descuenta el sangrado real que se renderizó.
    px_per_mm = im.size[0] / CANVAS_W
    b = round(BLEED_MM * px_per_mm)
    im.crop((b, b, im.size[0] - b, im.size[1] - b)).save(OUT / f"{name}-trim.png")

    edge(["--no-pdf-header-footer", f"--print-to-pdf={OUT / (name + '.pdf')}", url])

    print(f"{name}: {im.size[0]}×{im.size[1]} px bleed "
          f"({im.size[0] / DPI * MM_IN:.2f} × {im.size[1] / DPI * MM_IN:.2f} mm) · "
          f"trim {mm_to_px(TRIM_W)}×{mm_to_px(TRIM_H)} px objetivo")

print("\nCaras renderizadas. Falta aprobar la comparación 1:1 antes de CMYK.")
