# -*- coding: utf-8 -*-
"""Utilidades de preprensa compartidas — 305 Web Service.

Resuelve el fallo encontrado el 29 jul 2026: `PIL.Image.convert("CMYK")` es una
separacion ingenua (`c=255-r, m=255-g, y=255-b, k=0`). Nunca genera negro, asi
que un navy oscuro salia construido con ~263 % de C+M+Y y 0 % de K. En vinilo y
en cualquier soporte no estucado eso da exceso de tinta, secado lento, moteado y
texto claro sin definicion, porque tres planchas deben registrar perfectas.

Aqui va una separacion con GCR (sustitucion del componente gris) y tope de
cobertura total, de modo que el negro lo cargue la plancha K.
"""
import numpy as np
from PIL import Image

TAC_LIMIT = 240.0   # cobertura total de tinta, %. Conservador: sirve en vinilo,
                    # no estucado, estucado y digital sin recalcular nada.
GCR = 0.90          # cuanto del gris comun se traslada a K


def separate(img_rgb, tac_limit=TAC_LIMIT, gcr=GCR):
    """RGB -> (C, M, Y, K) en 0..1, con GCR y tope de cobertura."""
    a = np.asarray(img_rgb.convert("RGB"), dtype=np.float32) / 255.0
    c, m, y = 1.0 - a[..., 0], 1.0 - a[..., 1], 1.0 - a[..., 2]

    k = np.minimum(np.minimum(c, m), y) * gcr
    den = np.clip(1.0 - k, 1e-6, None)
    c, m, y = ((c - k) / den, (m - k) / den, (y - k) / den)
    c, m, y = (np.clip(v, 0.0, 1.0) for v in (c, m, y))

    # Tope de cobertura: se recorta solo CMY, nunca K, para no perder densidad.
    total = c + m + y + k
    limit = tac_limit / 100.0
    over = total > limit
    if over.any():
        head = np.clip(limit - k, 0.0, None)
        cmy = np.clip(c + m + y, 1e-6, None)
        s = np.clip(head / cmy, 0.0, 1.0)
        c = np.where(over, c * s, c)
        m = np.where(over, m * s, m)
        y = np.where(over, y * s, y)
    return c, m, y, k


def report(img_rgb, **kw):
    """Metricas de tinta de la separacion, para poder afirmarlas con numeros."""
    c, m, y, k = separate(img_rgb, **kw)
    tac = (c + m + y + k) * 100.0
    return {
        "tac_mean_pct": round(float(tac.mean()), 1),
        "tac_max_pct": round(float(tac.max()), 1),
        "tac_p99_pct": round(float(np.percentile(tac, 99)), 1),
        "tac_limit_pct": kw.get("tac_limit", TAC_LIMIT),
        "over_limit_pct_of_pixels": round(float((tac > kw.get("tac_limit", TAC_LIMIT) + 0.5).mean() * 100), 3),
        "k_mean_pct": round(float(k.mean() * 100), 1),
        "k_max_pct": round(float(k.max() * 100), 1),
        "gcr": kw.get("gcr", GCR),
    }


def cmyk_image(img_rgb, **kw):
    """Imagen PIL en modo CMYK con la separacion controlada."""
    c, m, y, k = separate(img_rgb, **kw)
    arr = (np.stack([c, m, y, k], axis=-1) * 255.0).round().astype(np.uint8)
    return Image.fromarray(arr, mode="CMYK")


# Construccion objetivo del navy de marca, para que la imprenta la iguale
# aunque use su propio perfil. K domina; la cobertura queda bajo el tope.
NAVY_TARGET_CMYK = {"C": 78, "M": 58, "Y": 38, "K": 72, "TAC": 246}
