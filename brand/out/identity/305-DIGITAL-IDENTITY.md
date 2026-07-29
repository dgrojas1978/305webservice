# 305 Web Service — Identidad digital

Sistema único del que copian la web, la tarjeta digital, la tarjeta física y los flyers.
Si una frase no está aquí, no se inventa: se añade aquí primero.

Fuente de verdad en código: `src/data/content.ts` (EN + ES) y `src/lib/site.ts`.

---

## 1. Posicionamiento

305 Web Service **no** es un proveedor de bajo costo ni un catálogo de servicios sueltos.
Es un socio de tecnología digital enfocado, que combina:

```
STRATEGY · DESIGN · ENGINEERING
```

**Declaración de marca**

```
DIGITAL SYSTEMS,
BUILT FOR BUSINESS.
```

**Posicionamiento de apoyo**

> We design and build websites, digital experiences and custom systems around how each
> business operates and grows.

Cubre: sitios web y tiendas en línea · software a medida · automatización · soluciones NFC ·
tarjetas digitales · rutas de reseñas y captación de prospectos · soluciones IT a medida.

**NFC es una solución que 305 ofrece, no la identidad de la empresa.**

---

## 2. Jerarquía de mensaje

| Nivel | Texto |
|---|---|
| Descriptor | `STRATEGY · DESIGN · ENGINEERING` |
| Declaración | `DIGITAL SYSTEMS, BUILT FOR BUSINESS.` |
| Hero web | `Technology designed around how your business works.` |
| Apoyo | `We create high-performing websites, custom software and connected digital experiences that help businesses operate clearly, serve customers better and move forward with confidence.` |
| CTA primario | `START A PROJECT` |
| CTA secundario | `VIEW OUR WORK` |

**CTAs contextuales:** `EXPLORE WEBSITE SOLUTIONS` · `DISCUSS A CUSTOM SYSTEM` ·
`EXPLORE NFC SOLUTIONS` · `CHAT ON WHATSAPP` · `SAVE CONTACT`.

**Un solo CTA primario por viewport o composición.**

### Excepción documentada: la tarjeta física

La tarjeta NFC usa un gancho distinto, aprobado el 29 jul 2026:

```
TECHNOLOGY THAT
MOVES YOU FORWARD.
```
con `WEBSITES · SOFTWARE · CONNECTED EXPERIENCES` y `TAP TO EXPLORE`.

Motivo: en 6 cm la pieza debe **provocar**, no describir la categoría. La explicación de
capacidades y metodología ocurre después, en la experiencia digital.
`STRATEGY · DESIGN · ENGINEERING` sigue vigente en web y propuestas corporativas.

---

## 3. Tono

Conciso · seguro · sofisticado · técnicamente creíble · orientado a negocio · directo y humano.

**Palabras prohibidas:** premium · revolutionary · cutting-edge · world-class · best ·
affordable · cheap · one-stop shop · we do it all · lenguaje genérico de IA.

**Prohibido también:** inventarios largos de funciones · cifras sin respaldo ·
testimonios o clientes inventados · repetir «305» o el logo varias veces ·
repetir los mismos servicios en cada sección.

---

## 4. Sistema visual

| Token | Valor | Uso |
|---|---|---|
| Navy | `#0b1826` → `#060e18` | fondo base de toda pieza oscura |
| Azul eléctrico | `#2f7bff` | `305` del wordmark, CTA primario, marco exterior del portal |
| Aqua | `#3fd8c6` | acento contenido: etiquetas de sección, filetes, marco interior |
| Paper | `#f5f3ee` | texto principal sobre navy |
| Warm | `#f6f4ef` | placa del QR |

**Tipografía: Inter, familia única.** Máximo dos familias en cualquier pieza; hoy basta una.
Los mensajes principales llevan tracking **negativo**. El espaciado ancho (`0.16em`–`0.38em`)
queda reservado a descriptores y etiquetas terciarias.

**Wordmark:** `305` en azul eléctrico + `WEB SERVICE` en paper, versalitas, peso 800.
Aparece **una sola vez** por composición.

**El portal:** dos marcos rectangulares abiertos y desplazados, exterior azul (0.22 mm) e
interior aqua (0.15 mm). El desplazamiento produce la profundidad, no el tamaño.
Sin flechas, sin circuitos, sin gráficas ascendentes o descendentes, sin degradados
llamativos, sin símbolos de IA. Es el elemento propietario de la marca.

**Filete de sección:** 1 px `rgba(246,244,239,0.13)` a ancho de columna.
**Marcador de lista:** filete aqua corto — nunca numerales ni viñetas.

---

## 5. Reglas por superficie

| Superficie | Debe tener | Nunca |
|---|---|---|
| **Web** | 1 CTA primario por viewport · prueba real · 5 secciones en home | catálogo repetido, precio como mensaje maestro |
| **Tarjeta digital** | acciones inmediatas arriba · 1 QR, dentro del módulo de compartir | QR compitiendo con el CTA principal, logos o etiquetas repetidas |
| **Tarjeta física** | 1 acción por cara: NFC delante, QR detrás | teléfono, email, precios, iconos sociales, servicios |
| **Flyer** | HOOK → PROOF → OFFER → OUTCOMES → TRUST → ACTION · 1 wordmark, 1 titular, 1 oferta, 1 CTA, 1 QR | catálogo completo, proyectos repetidos, QR decorativo |

---

## 6. Prueba

Solo estos cuatro proyectos, con permiso escrito del propietario (2026-07-27):

| Proyecto | Propósito |
|---|---|
| Aguiar Flooring | Commerce and quote generation |
| Light Specter Film | Cinematic brand and lead experience |
| Polkanea Productions | Streaming and content discovery |
| Cosme Proenza | Digital archive and cultural preservation |

Nunca insinuar que todos tuvieron el mismo alcance, precio o resultado.
Divulgación obligatoria cuando se muestran junto a un precio:
*Selected custom projects. Features and pricing vary by scope.*

---

## 7. Contacto y credibilidad

| Dato | Estado |
|---|---|
| `305WEBSERVICE.COM` | ✅ usar siempre como respaldo |
| `(305) 833-2984` | ✅ flyers y web |
| `305webservice@gmail.com` | ⚠️ **fuera** de la tarjeta física y de arte destacado |
| `hello@305webservice.com` | ❌ **no existe todavía** — no imprimir hasta crearlo y probarlo |

**Nunca colocar un correo sin configurar en arte de producción.**

---

## 8. Español

Equivalente en significado, no traducción literal. Acentuación completa
(`generación`, `cinematográfica`, `captación`, `diseño`, `ingeniería`).
El descriptor en español es `ESTRATEGIA · DISEÑO · INGENIERÍA`.

---

## 9. Estado de cada pieza

| Pieza | Estado |
|---|---|
| Tarjeta física 305 PORTAL | **PRINT TEST READY** — QR definitivo verificado contra producción; imprimir **una** unidad antes del lote |
| Flyer de capacidades EN | listo — QR decodificado del arte, safe area limpia |
| Flyer de capacidades ES | listo — ídem |
| Tarjeta digital `/card/305` | **en vivo**; falta reordenar acciones y dejar un solo QR |
| Web | hero y posicionamiento aplicados; falta consolidar la home a 5 secciones y reencuadrar las páginas de servicio |

**Pendiente de terceros:** plantilla del fabricante (reposiciona el símbolo NFC sobre la
antena), sangrado real a confirmar con el proveedor, prueba NFC en iPhone/Android antes de
grabar el chip, y `MONGODB_URI` en Vercel para que el formulario envíe.
