"""Generate the brand QR code (https://305webservice.com) as SVG + PNG.

High error correction (H) so it stays scannable on print, quiet zone = 4 modules.
"""
from pathlib import Path

import qrcode
import qrcode.image.svg

URL = "https://305webservice.com"
ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)

qr = qrcode.QRCode(
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=40,
    border=4,  # quiet zone, spec requires clear space around the code
)
qr.add_data(URL)
qr.make(fit=True)

# PNG (used for decode verification and raster fallback)
img = qr.make_image(fill_color="#0A1F3C", back_color="white")
img.save(ASSETS / "qr-305webservice.png")

# SVG (crisp at any print size)
svg_factory = qrcode.image.svg.SvgPathImage
qr_svg = qrcode.make(URL, error_correction=qrcode.constants.ERROR_CORRECT_H,
                     border=4, image_factory=svg_factory)
qr_svg.save(str(ASSETS / "qr-305webservice.svg"))

print("QR generated:", URL)
print("modules:", qr.modules_count, "version:", qr.version)
