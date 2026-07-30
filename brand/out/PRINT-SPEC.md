# Especificación de impresión — 305 Web Service

Aplica a la tarjeta NFC y a los flyers 4 × 6. Escrito después de que la primera
tirada en **vinilo** saliera mal.

---

## Qué estaba mal

`PIL.Image.convert("CMYK")` hace una separación ingenua: `c=255−r, m=255−g, y=255−b, **k=0**`.
Nunca genera negro. Medido sobre los archivos que se enviaron:

| | Antes | Ahora |
|---|---|---|
| Canal K (media) | **0 %** | **63.5 %** |
| K (máximo) | **0 %** | 90 % |
| Cobertura total de tinta (media) | **263 %** | **203 %** |
| Cobertura total (máxima) | 283–300 % | **240 %** (tope duro) |
| Píxeles por encima del tope | — | **0.00 %** |

Un navy oscuro construido con 263 % de cian+magenta+amarillo y **cero negro** produce en
vinilo exactamente lo que viste: exceso de tinta, secado lento, moteado, y texto claro sin
definición porque **tres planchas** tienen que registrar perfectas en lugar de una.

## Qué se cambió

1. **Separación con GCR** (`brand/system/press.py`): el gris común pasa a la plancha K,
   con tope de cobertura al 240 %. El negro lo carga K, no tres colores.
2. **Fondo plano.** Se eliminaron los degradados: bandean en vinilo y en digital de gama baja.
3. **Sin grano.** El patrón de puntos de 0.5 px se leía como suciedad y provocaba moteado.
4. **Navy un paso más claro** (`#122236`): el texto claro sobre negro casi puro se cierra.
5. **Filetes y marcos más gruesos**: mínimo **0.5 pt** (antes 0.43 pt y algunos a 0.15 mm).
6. **Piso tipográfico de 9 pt.** 8 pt es el mínimo del sector; el texto claro sobre fondo
   oscuro se imprime más delgado, así que se le suma 1 pt. El build **falla** si alguien
   declara algo por debajo.

---

## Construcción objetivo del navy

Si la imprenta usa su propio perfil, pídele que iguale esto:

```
C 78   M 58   Y 38   K 72        cobertura ≈ 246 %
```

Lo esencial: **K debe dominar.** Si te devuelven un navy con K bajo y CMY altos, recházalo.

---

## Válido en cualquier soporte

| Soporte | Notas |
|---|---|
| Vinilo | ✅ el tope de 240 % y el fondo plano son precisamente para esto |
| PVC (tarjeta) | ✅ |
| Estucado mate / brillo | ✅ |
| No estucado / texturado | ✅ pero **sube 1 pt** todo el texto pequeño: la textura come los bordes |
| Digital / tóner | ✅ sin degradados no hay bandeo |

---

## Medidas

| Pieza | Corte | Sangrado | Safe area | Archivo |
|---|---|---|---|---|
| Tarjeta NFC | 85.60 × 53.98 mm | 3 mm **provisional** | 3 mm | `305-portal/vendor-cmyk/` |
| Flyer 4 × 6 | 4.00 × 6.00 in | 0.125 in | 0.1875 in | `flyers-4x6/` |

⚠️ El sangrado de la tarjeta sigue siendo **provisional**: confírmalo con el proveedor.

---

## Antes de mandar cualquier tirada

1. Pedir **una** muestra en el soporte final, no en papel de oficina.
2. Mirar el texto más pequeño (9 pt) a la luz que tendrá en uso.
3. Comprobar que los filetes aqua de 0.5 pt no desaparecieron.
4. Escanear el QR **desde la pieza física**, no de la pantalla.
5. Verificar que el navy no salió morado (exceso de magenta) ni lavado (K bajo).
