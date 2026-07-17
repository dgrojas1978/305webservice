"""Render de piezas sociales — sistema «Monumento 305».

Genera en out/social/ y out/reel-covers/:
  - PNG 1:1 de cada pieza
  - Portada FB: 851×315 PNG + JPG optimizado < 100 KB + crop de zona segura 1280×500
  - Iconos de perfil: pruebas 320/176/64/36 px con máscara circular
  - Portadas de reels: PNG 1080×1920 + preview 420×654 (recorte de grid)
  - Verificación de QR en post y story
"""
import subprocess
from pathlib import Path

import cv2
from PIL import Image, ImageDraw

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ROOT = Path(__file__).resolve().parent.parent
SOCIAL = ROOT / "social"
OUT = ROOT / "out" / "social"
OUT_COVERS = ROOT / "out" / "reel-covers"
ICON_TESTS = OUT / "icon-tests"
for d in (OUT, OUT_COVERS, ICON_TESTS):
    d.mkdir(parents=True, exist_ok=True)

URL = "https://305webservice.com"

PIECES = [
    ("facebook-cover", 1702, 630, OUT, False),
    ("facebook-profile", 1080, 1080, OUT, False),
    ("instagram-profile", 1080, 1080, OUT, False),
    ("instagram-post-services", 1080, 1350, OUT, True),
    ("instagram-story", 1080, 1920, OUT, True),
    ("reel-cover-01", 1080, 1920, OUT_COVERS, False),
    ("reel-cover-02", 1080, 1920, OUT_COVERS, False),
    ("reel-cover-03", 1080, 1920, OUT_COVERS, False),
]


def shot(html: Path, png: Path, w: int, h: int) -> None:
    subprocess.run(
        [EDGE, "--headless", "--disable-gpu", "--hide-scrollbars",
         "--virtual-time-budget=10000", "--force-device-scale-factor=1",
         f"--window-size={w},{h}", f"--screenshot={png}", html.as_uri()],
        check=False, capture_output=True, timeout=120)


def check_qr(png: Path) -> str:
    img = cv2.imread(str(png))
    det = cv2.QRCodeDetector()
    data, _, _ = det.detectAndDecode(img)
    if not data:
        h, w = img.shape[:2]
        data, _, _ = det.detectAndDecode(img[h // 2:, w // 2:])
    return data


for name, w, h, dest, has_qr in PIECES:
    png = dest / f"{name}.png"
    shot(SOCIAL / f"{name}.html", png, w, h)
    im = Image.open(png)
    assert im.size == (w, h), f"{name}: {im.size}"
    if has_qr:
        data = check_qr(png)
        assert data == URL, f"{name}: QR = {data!r}"
        print(f"  {name}: QR OK")
    print(f"{name}: {w}x{h} listo")

# ---- portada FB: derivados ----
cover = Image.open(OUT / "facebook-cover.png").convert("RGB")
cover.resize((851, 315), Image.LANCZOS).save(OUT / "facebook-cover-851x315.png")
for q in (85, 80, 75, 70, 65, 60):
    jpg = OUT / "facebook-cover.jpg"
    cover.save(jpg, "JPEG", quality=q, optimize=True, progressive=True)
    if jpg.stat().st_size < 100_000:
        print(f"facebook-cover.jpg: {jpg.stat().st_size // 1024} KB (q={q})")
        break
assert (OUT / "facebook-cover.jpg").stat().st_size < 100_000, "JPG >= 100 KB"

# crop de zona segura central 1280×500 (recorte móvil aproximado)
cx, cy = (1702 - 1280) // 2, (630 - 500) // 2
cover.crop((cx, cy, cx + 1280, cy + 500)).save(OUT / "facebook-cover-safezone-crop.png")

# ---- iconos: pruebas con recorte circular ----
icon = Image.open(OUT / "facebook-profile.png").convert("RGB")
for size in (320, 176, 64, 36):
    small = icon.resize((size, size), Image.LANCZOS)
    small.save(ICON_TESTS / f"icon-{size}.png")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    circ = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    circ.paste(small, (0, 0), mask)
    circ.save(ICON_TESTS / f"icon-{size}-circle.png")
print("icon tests: 320/176/64/36 + circulares listos")

# hoja de contacto de los iconos para revisión visual
sheet = Image.new("RGB", (320 + 176 + 64 + 36 + 5 * 24, 320 + 48), "#e8ecf1")
x = 24
for size in (320, 176, 64, 36):
    c = Image.open(ICON_TESTS / f"icon-{size}-circle.png")
    sheet.paste(c, (x, 24 + (320 - size) // 2), c)
    x += size + 24
sheet.save(ICON_TESTS / "icon-sheet.png")

# ---- previews 420×654 de portadas de reels (recorte de grid) ----
for n in ("01", "02", "03"):
    full = Image.open(OUT_COVERS / f"reel-cover-{n}.png").convert("RGB")
    # el grid muestra un recorte central; escalamos a 420 de ancho y recortamos 654 de alto
    scaled = full.resize((420, 747), Image.LANCZOS)
    top = (747 - 654) // 2
    scaled.crop((0, top, 420, top + 654)).save(OUT_COVERS / f"reel-cover-{n}-preview-420x654.png")
print("previews de portadas 420x654 listos")

print("\nSocial render completo.")
