# Flyer 305 Web Service — guía para Canva (8.5 × 11 in)

Dos formas de usarlo en Canva. Elige la que necesites.

---

## Opción A — usarlo tal cual (rápido)

1. En Canva: **Crear diseño → Tamaño personalizado → 8.5 × 11 in** (o "Flyer (US Letter)").
2. **Subir** `flyer-canva-es.png` (o `-en.png`) y arrástralo hasta cubrir toda la página.
3. Listo para imprimir o publicar. El QR ya funciona (apunta a https://305webservice.com).

- Para imprenta profesional con sangrado, entrega `flyer-canva-es-cmyk.pdf` (CMYK 300 DPI, 8.75×11.25 con sangrado).
- `flyer-canva-es.pdf` es el PDF RGB a tamaño final (8.5×11).

**Nota:** en la Opción A el texto es parte de la imagen, no editable en Canva.

---

## Opción B — reconstruirlo editable en Canva

Para poder cambiar textos/precio dentro de Canva, ármalo por capas con estas
especificaciones. Sube primero las imágenes de `assets/` (QR y capturas).

### Lienzo
- Tamaño: **8.5 × 11 in** (Canva añade su propio margen; deja **0.5 in** de aire a los textos importantes).
- Fondo base: **navy #071426**.

### Colores exactos (guárdalos como paleta de marca en Canva)
| Uso | HEX |
|---|---|
| Navy (fondo/tinta) | `#071426` |
| Azul eléctrico (banda de precio, "305", acentos) | `#146CFF` |
| Turquesa (filetes, etiquetas) | `#20D7C5` |
| Blanco cálido (texto sobre navy) | `#F7F9FC` |
| Gris (texto secundario) | `#526071` |
| Hairline (líneas finas) | `#CDD5DF` |

### Tipografía
- Fuente única: **Inter** (Canva la tiene). Pesos: Black (900), Bold (700), Semibold (600), Regular (400).
- Todos los titulares y etiquetas van en **MAYÚSCULAS**. Las micro-etiquetas usan tracking amplio (letter-spacing).

### Estructura de arriba hacia abajo (6 bloques)

1. **HERO (navy, ~40% superior)**
   - Arriba-izquierda: `305 WEB SERVICE` (Inter Bold 22pt, blanco) + `MIAMI · FL` (Semibold 15pt, turquesa).
   - Filete turquesa debajo: barra de 0.8 in × 3 px.
   - "305" gigante en la esquina superior derecha como textura: Inter Black, color **#146CFF al 34% de opacidad**, cortado por los bordes. Va DETRÁS del titular.
   - Titular (Inter Black ~52pt, mayúsculas): línea 1 blanca `TU NEGOCIO ES BUENO.`, línea 2 azul `¿TU WEB LO DEMUESTRA?`.
   - Subtexto (Inter Regular ~21pt, blanco 80%): "Hoy tus clientes te buscan en el celular antes de llamar. Si tu web es lenta, vieja o no existe, la llamada se la lleva tu competencia."
   - Etiqueta turquesa (Semibold 15pt, tracking): `SITIOS REALES QUE HICIMOS — EN VIVO AHORA MISMO`.
   - Tres capturas en fila (usa `assets/site-lsf.jpg`, `site-polkanea.jpg`, `site-aguiar.jpg`) dentro de "ventanas" de navegador (rectángulo #0e2038, borde 1px blanco 16%, tres puntitos arriba). Debajo de cada una, el dominio en mayúsculas (Semibold ~13pt, blanco 80%): `LIGHTSPECTERFILM.COM`, `POLKANEAPRODUCTIONS.COM`, `AGUIARFLOORING.COM`.

2. **OFERTA (banda azul eléctrico #146CFF)**
   - Izquierda: `PÁGINA WEB PROFESIONAL` (Black ~28pt, blanco) + `8 SERVICIOS · UN SOLO EQUIPO` (Bold 15pt, navy).
   - Derecha: `Antes $800` (Bold 28pt, navy, **tachado en turquesa**) + `AHORA DESDE` (Bold 15pt, navy) + **`$499`** (Black ~68pt, blanco).

3. **VALOR (blanco cálido)**
   - Etiqueta azul: `LO QUE TU WEB HARÁ POR TI`.
   - Fila 01 (línea fina arriba): `01` azul · título `TE ENCUENTRAN CUANDO TE BUSCAN` (Black ~32pt, navy) · beneficio `Rápida, mobile-first y con SEO, para que te encuentren.` (Regular ~21pt, gris).
   - Fila 02 (línea fina arriba): `02` azul · título `CADA VISITA, UNA OPORTUNIDAD` · beneficio `Diseñada para convertir cada visita en llamada o venta.`.

4. **BREADTH (blanco, línea fina arriba)**
   - `UN SOLO EQUIPO PARA TODO LO DIGITAL` (Bold 18pt, navy).
   - `Tiendas online · Software a medida · Automatización · Hosting y correo · Soporte` (Regular 15pt, gris).

5. **CTA (navy, ~18% inferior)**
   - Etiqueta turquesa: `SITIOS EN VIVO · ESPAÑOL E INGLÉS · MIAMI, FL`.
   - `AGENDA TU CONSULTA GRATIS` (Black ~36pt, blanco) + filete turquesa.
   - `(305) 833-2984` (Bold ~32pt, blanco) y `305WEBSERVICE.COM` (Regular ~21pt, blanco 80%).
   - Derecha: `assets/qr-305webservice.png` sobre tarjeta blanca (~1.2 in) + `ESCANEA Y EMPIEZA HOY` (Semibold 14pt, blanco 80%).

### Versión en inglés
Mismo layout con: `YOUR BUSINESS IS GOOD. / DOES YOUR SITE SHOW IT?` · sub "Your customers look you up on their phone before calling. If your site is slow, dated or missing, the call goes to your competitor." · `REAL SITES WE BUILT — LIVE RIGHT NOW` · `PROFESSIONAL WEBSITE` / `8 SERVICES · ONE TEAM` · `WAS $800 / NOW FROM / $499` · `WHAT YOUR WEBSITE WILL DO FOR YOU` · `FOUND WHEN THEY SEARCH` / "Fast, mobile-first and SEO-ready, so customers find you." · `EVERY VISIT, AN OPPORTUNITY` / "Built to turn every visit into a call or a sale." · `ONE TEAM FOR YOUR ENTIRE DIGITAL PRESENCE` / "Online stores · Custom software · Automation · Hosting & email · Support" · `LIVE SITES · ENGLISH & SPANISH · MIAMI, FL` · `BOOK YOUR FREE CONSULTATION` · `SCAN AND START TODAY`.

---

## Datos reales (no inventar)
- Teléfono: **(305) 833-2984** · Web: **305webservice.com** · Miami, FL · bilingüe.
- QR: **https://305webservice.com** (usa `assets/qr-305webservice.png`, no lo re-generes).
- "Antes $800": es un ancla de oferta tuya — asegúrate de poder respaldarla.
- Las tres capturas son de sitios reales de 305 (en vivo). No agregues clientes ni métricas inventadas.

## Archivos en esta carpeta
- `flyer-canva-es.png` / `flyer-canva-en.png` — 2550×3300 px (8.5×11 @300 DPI), listos para Canva.
- `flyer-canva-*-bleed.png` — con sangrado (8.75×11.25).
- `flyer-canva-*.pdf` — PDF RGB tamaño final.
- `flyer-canva-*-cmyk.pdf` — PDF CMYK 300 DPI para imprenta.
- `assets/` — QR + 3 capturas para la reconstrucción editable.
- Fuente editable original: `brand/canva/flyer-canva-es.html` (y `-en.html`).
