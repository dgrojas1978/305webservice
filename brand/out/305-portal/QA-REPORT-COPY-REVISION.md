# QA — revisión de copy de la tarjeta física 305 PORTAL

Fase 4 **reabierta** para esta revisión controlada. Aplica **solo** a la tarjeta física de
305 Web Service. No se tocó Light Specter Film, Perlas del Cielo ni ninguna tarjeta futura.

**Fase 4 NO se vuelve a marcar cerrada** hasta que revises la versión nueva a tamaño real.

---

## Copy final aplicada

**Frente**

```
305 WEB SERVICE

TECHNOLOGY THAT
MOVES YOU FORWARD.

WEBSITES · SOFTWARE · CONNECTED EXPERIENCES

TAP TO EXPLORE

MIAMI · WORKING NATIONWIDE
```

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

### Eliminado — verificado por búsqueda en el código fuente del arte

| Cadena retirada | ¿Queda algún rastro? |
|---|---|
| `STRATEGY · DESIGN · ENGINEERING` | no |
| `DIGITAL SYSTEMS, BUILT FOR BUSINESS.` | no |
| `TAP TO CONNECT` | no |
| `LET'S BUILD WHAT'S NEXT.` | no |
| `Explore our work, capabilities and ways to connect.` | no |
| `SCAN TO CONNECT` | no |

No conviven las dos versiones en ninguna parte del arte. `STRATEGY · DESIGN · ENGINEERING`
**sigue vigente para la web y las propuestas corporativas** — solo sale de esta pieza.

La palabra **forward** aparece **una sola vez** en toda la cara frontal.

---

## Recomposición (no fue sustitución de cadenas)

| Elemento | Antes | Ahora | Motivo |
|---|---|---|---|
| Wordmark | 4.95 mm | **3.50 mm** | cede el protagonismo al gancho |
| Mensaje central | 3.75 mm | **4.05 mm** | pasa a ser el ancla visual |
| Filete | 0.325 H | **0.243 H** | sube para abrir el bloque del gancho |
| Descriptor | encima del mensaje | **debajo**, 1.42 mm | queda claramente secundario |
| Portal | x 0.645 W, ancho 0.278 W | **x 0.664 W, ancho 0.262 W** | abre sitio al gancho sin tocar la geometría |

El mensaje central lleva tracking **negativo** (−0.012 em). El espaciado ancho queda
reservado a descriptores y etiquetas terciarias.

---

## Verificaciones ejecutadas (medidas, no impresión visual)

| Prueba | Resultado |
|---|---|
| Safe area 3 mm, frente | ✅ limpia |
| Safe area 3 mm, reverso | ✅ limpia |
| Separación gancho ↔ portal | ✅ **4.74 mm** (56 px) — sin colisión |
| QR decodificado desde el arte exportado | ✅ coincide exacto |
| Tamaño del QR | 25.0 mm (mínimo exigido 22 mm) ✅ |
| Familias tipográficas | 1 (Inter) ✅ |
| Acciones por cara | 1 y 1 ✅ |
| Teléfono / email / precios / iconos sociales / servicios | ninguno ✅ |
| Avisos de proof sobre el arte | ninguno — siempre fuera ✅ |

**Sobre la línea descendente:** el portal son dos **rectángulos abiertos**, no una línea
direccional. No hay flecha ni trazo con energía descendente. Aun así conviene que lo
confirmes a tamaño real.

---

## Comparación antes / después

| Criterio | Antes | Después |
|---|---|---|
| Primera frase que se lee | el wordmark (era lo más grande) | **el gancho** |
| Comprensión en 3 s | «hacen sistemas digitales» | **«esto me mueve hacia adelante»** |
| Relevancia para el cliente | describe a 305 | **habla del efecto en quien lee** |
| Ganas de tocar | `TAP TO CONNECT` = conectar con quién | **`TAP TO EXPLORE` = hay algo que ver** |
| Sofisticación percibida | categoría genérica | frase propia, no intercambiable |
| Legibilidad a tamaño real | mínimo 3.9 pt | mínimo 3.8 pt — **PENDING USER TEST** |

Las cuatro primeras filas son observables en el arte. **«Sofisticación percibida» es un
juicio mío, no una medición**, y la legibilidad física solo la confirma el papel.

---

## Bloqueo de producción — sin cambios

`https://www.305webservice.com/c/305` → **404** (verificado 29 jul 2026).

**No se generan** archivos de impresión directa, CMYK de imprenta, ni NFC grabado o
bloqueado hasta que se cumplan **las cinco** condiciones:

1. La URL canónica HTTPS de la tarjeta esté en vivo.
2. El QR se genere desde esa URL final.
3. El QR se decodifique desde el arte exportado.
4. El destino NFC se pruebe en iPhone y Android — **PENDING USER DEVICE TEST**.
5. La plantilla del fabricante esté confirmada.

---

## Entregables de esta revisión

```
proofs/305-portal-front-PROOF-1011x638-sRGB.png   frente plano
proofs/305-portal-back-PROOF-1011x638-sRGB.png    reverso plano
before/                                            versión anterior, congelada
305-portal-sheet.png                               presentación frente + reverso
305-portal-BEFORE-AFTER.png                        antes/después, 4 caras
305-portal-BEFORE-AFTER-1to1-letter.png            comparación a tamaño CR80 real
305-portal-PROOF-1to1-letter.png                   proof 1:1
305-portal-tech-guides.png                         sangrado, corte, safe area
305-portal-mockup.png                              mockup de presentación (sin fotos de stock)
PORTAL-SPEC.json                                   medidas y QA en JSON
```

---

## Lo que necesito de ti para cerrar Fase 4

1. Imprimir `305-portal-BEFORE-AFTER-1to1-letter.png` **al 100%** y decir cuál gana en mano.
2. Confirmar que el texto más pequeño (3.8 pt) se lee en papel.
3. Confirmar que el portal no te sugiere una línea descendente.
