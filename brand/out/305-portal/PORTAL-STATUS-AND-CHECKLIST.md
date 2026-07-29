# 305 PORTAL — tarjeta NFC física · estado y checklists

**305 PORTAL reemplaza a 305 SIGNAL.** Ver [`../305-signal-v2/SUPERSEDED.md`](../305-signal-v2/SUPERSEDED.md).

## ESTADO

| | |
|---|---|
| Arte | `PREPRESS PENDING FINAL QR` |
| Exportaciones de producción | **RETENIDAS** — se emiten solo tras confirmar URL final **y** plantilla del fabricante |
| NFC | no programado, no bloqueado |

Verificado el 29 jul 2026: `https://www.305webservice.com/c/305` → **404**
(y `/card/305` → 404). El QR embebido es un **placeholder marcado**
(`…&proof=PREPRESS-PLACEHOLDER`). **No imprimir.**

Los paquetes `direct-print/` y `vendor-cmyk/` generados antes de este refinamiento
**se eliminaron**: contenían la copy anterior y podían imprimirse por error.

---

## Copy aprobada — literal, sin añadidos

> **Fase 4 REABIERTA** el 29 jul 2026 para una revisión controlada de copy.
> El detalle y la comparación antes/después están en
> [`QA-REPORT-COPY-REVISION.md`](QA-REPORT-COPY-REVISION.md).
> **No volver a marcar Fase 4 cerrada** hasta revisar la nueva versión a tamaño real.

**Frente**

```
305 WEB SERVICE
TECHNOLOGY THAT
MOVES YOU FORWARD.
WEBSITES · SOFTWARE · CONNECTED EXPERIENCES
TAP TO EXPLORE
MIAMI · WORKING NATIONWIDE
```

Jerarquía: 1 gancho dominante · 2 wordmark (más pequeño que el gancho) · 3 descriptor
contenido · 4 CTA junto al punto NFC · 5 lugar, terciario y silencioso.

**Reverso**

```
READY TO BUILD
WHAT'S NEXT?

Explore our work and discover
what we can build around your business.

[QR]

SCAN TO START

305WEBSERVICE.COM
```

Jerarquía: 1 gancho · 2 frase que explica qué abre el QR · 3 QR (objeto funcional
principal) · 4 `SCAN TO START` como única instrucción · 5 dominio, respaldo discreto.

### Eliminado por completo

`STRATEGY · DESIGN · ENGINEERING` · `DIGITAL SYSTEMS, BUILT FOR BUSINESS.` ·
`TAP TO CONNECT` · `LET'S BUILD WHAT'S NEXT.` ·
`Explore our work, capabilities and ways to connect.` · `SCAN TO CONNECT` ·
`BUSINESS TECHNOLOGY` · las cuatro capacidades y sus detalles ·
`MIAMI, FLORIDA · UNITED STATES` · `DIRECT LINE` · teléfono impreso ·
la dirección **Gmail** · `Technology built around your business.` ·
`Tell us what you're trying to improve.` · `305-001`.

`STRATEGY · DESIGN · ENGINEERING` sigue vigente para la web y las propuestas corporativas;
solo sale de esta pieza.

**Una acción por cara:** NFC delante, QR detrás. Sin catálogo de servicios, sin teléfono,
sin correo, sin iconos sociales, sin precios en la pieza física.

### Sobre el correo

`305webservice@gmail.com` queda **fuera** del arte. No se imprimirá ningún correo hasta que
exista y esté probado un buzón del dominio (`hello@305webservice.com` o
`projects@305webservice.com`). **Nunca colocar un correo sin configurar en arte de producción.**

---

## Especificación física

| | |
|---|---|
| Estándar | CR80 / ISO-IEC 7810 ID-1 |
| Trim | 85.60 × 53.98 mm · 1011 × 638 px @300 DPI |
| Sangrado | 91.60 × 59.98 mm · 1082 × 708 px (3 mm **provisional**) |
| Safe area | 3 mm |
| Grosor | 0.76 mm (30 mil) |
| Radio de esquina | 3.18 mm |
| Chip | NTAG215 · 504 bytes útiles · 13.56 MHz |

**Tipografía — una sola familia (Inter):** gancho frontal 4.05 mm (11.5 pt) ·
gancho del reverso 3.55 mm (10.1 pt) · wordmark 3.50 mm (9.9 pt) ·
frase de apoyo 1.82 mm (5.2 pt) · dominio 1.60 mm (4.5 pt) · CTA 1.55 mm (4.4 pt) ·
descriptor 1.42 mm (4.0 pt) · lugar 1.34 mm (3.8 pt).
Los mensajes principales llevan tracking **negativo**; el espaciado ancho queda reservado
a descriptores y etiquetas terciarias.

**Separación medida gancho ↔ portal: 4.74 mm.** Sin colisión.

---

## QR

| | |
|---|---|
| URL definitiva (cuando `/c/305` esté público) | `https://www.305webservice.com/c/305?utm_source=qr&utm_medium=physical-card&utm_campaign=305-portal` |
| URL actual incrustada | la anterior **+ `&proof=PREPRESS-PLACEHOLDER`** |
| Tamaño | 25.0 mm (mínimo exigido: 22 mm) ✅ |
| ECC · quiet zone | Q · 4 módulos |
| Logo central / localhost / home genérica | ninguno ✅ |
| Decodificado **desde el arte exportado** | ✅ coincide exacto |

---

## NFC — **no programar todavía**

NDEF URI a escribir más adelante:
`https://www.305webservice.com/c/305?utm_source=nfc&utm_medium=physical-card&utm_campaign=305-portal`
= 101 bytes. Cabe de sobra en los 504 del NTAG215.

---

## QA ejecutada

- Safe area de 3 mm **limpia en ambas caras** (medición pixel a pixel, no visual).
- QR decodificado desde el PNG final.
- Una sola familia tipográfica.
- Una acción por cara; ningún CTA duplicado.
- Avisos de proof **siempre fuera** del arte de la tarjeta.

---

## Entregables

```
proofs/305-portal-front-PROOF-1011x638-sRGB.png
proofs/305-portal-back-PROOF-1011x638-sRGB.png
305-portal-sheet.png              presentación frente + reverso
305-portal-PROOF-1to1-letter.png  escala 1:1, imprimir al 100%
305-portal-tech-guides.png        lámina técnica: sangrado, corte, safe area
PORTAL-SPEC.json
```

Producción (`direct-print/`, `vendor-cmyk/`): **se emitirán después** de confirmar
la URL final y la plantilla del fabricante.

---

## Checklist para pasar a `PRINT TEST READY`

1. Publicar `/c/305` en HTTPS y comprobar el redirect.
2. Regenerar el QR con la URL definitiva (sin `proof=`) y volver a decodificarlo del arte.
3. Recibir la plantilla del fabricante y la **posición del chip**; realinear el símbolo NFC.
4. Confirmar el sangrado real con el proveedor (3 mm es provisional).
5. Imprimir `305-portal-PROOF-1to1-letter.png` al **100%** y verificar con un NTAG215 encima.
6. Revisar el texto más pequeño (lugar, 3.9 pt) y el trazo del portal (0.22 / 0.15 mm).
7. Emitir entonces los paquetes de producción.
8. Imprimir **una sola** tarjeta PVC antes del lote.

## Checklist NFC

1. Escribir el NDEF URI **solo cuando `/c/305` responda 200**.
2. Leer de vuelta y confirmar la URL exacta.
3. iPhone — **PENDING USER DEVICE TEST**.
4. Android / Samsung — **PENDING USER DEVICE TEST**.
5. Probar con estuche estándar.
6. Confirmar analítica (`utm_source=nfc`).
7. **No bloquear la primera unidad** — tarjeta maestra regrabable.
8. Bloquear el lote solo tras validar URL, redirect, tarjeta digital, tracking, dominio
   y proceso de reemplazo.

---

## Acabado

PVC premium, mate / soft-touch, navy impreso, contraste blanco cálido / azul, aqua contenido.
Opcional futuro (no incorporado al arte): spot UV limitado al portal o a `305`; foil azul solo
si el fabricante lo soporta y con muestra aprobada.
**El diseño funciona sin ningún acabado especial.**
