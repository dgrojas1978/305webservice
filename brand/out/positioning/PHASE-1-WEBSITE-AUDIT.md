# FASE 1 — Auditoría del sitio antes de editar

Inventario de lo que hay hoy, extraído de `src/data/content.ts` (35.6 KB, EN + ES),
`src/lib/site.ts` y los componentes de página. **Nada editado todavía**: la orden exige
auditar y reconstruir la jerarquía del mensaje, no sustituir frases sueltas.

---

## Diagnóstico transversal

| Hallazgo | Evidencia | Efecto |
|---|---|---|
| **El catálogo es la identidad** | El eyebrow del hero es literalmente `Websites, Custom Software, NFC & IT Solutions`; el `<title>` repite `Web Design, Custom Software & IT Solutions in Miami` | Se presenta como lista de servicios, no como socio tecnológico |
| **El precio es el mensaje maestro** | `$499` aparece en el título de página, en el hero y en el selector de paquetes | Ancla la marca en precio bajo; contradice `STRATEGY · DESIGN · ENGINEERING` |
| **Servicios repetidos en cada sección** | El catálogo de 7 servicios reaparece en home, servicios, industrias y el formulario | Ruido; el visitante no percibe foco |
| **CTAs blandos y múltiples** | `Request a Quote`, `Tell Us What's Slowing You Down`, `Let's turn your technology problem into a clear next step` | Ningún CTA primario claro por viewport |
| **Voz de agencia genérica** | `Technology should remove friction — not create more of it.` · `Honest by design` | Suena a plantilla, no a consultoría técnica |
| **Prueba débil / diferida** | `We show verified proof as it becomes available` | Admite falta de prueba en lugar de mostrar los 4 proyectos reales aprobados |
| **Gmail visible** | `305webservice@gmail.com` en Footer, HomeSections y ContactPage | Daña la credibilidad; la orden lo prohíbe destacar |

---

## Inventario por superficie

### Home — hero

| | |
|---|---|
| Headline actual | `Technology that helps your business sell, operate and grow.` |
| Eyebrow actual | `Websites, Custom Software, NFC & IT Solutions` |
| CTA actual | `Request a Quote` |
| Prueba mostrada | ninguna en el primer viewport |
| Objetivo de conversión | formulario de cotización |
| Reclamos repetidos | el catálogo de servicios (eyebrow) |
| **Reemplazo** | Eyebrow → `STRATEGY · DESIGN · ENGINEERING` · H1 → `Technology designed around how your business works.` · Apoyo → `We create high-performing websites, custom software and connected digital experiences that help businesses operate clearly, serve customers better and move forward with confidence.` · CTA primario → `START A PROJECT` · secundario → `VIEW OUR WORK` · confianza → `REAL PROJECTS · ENGLISH & SPANISH · DIRECT COLLABORATION` |

### Home — sección 2 (hoy: «Choose the outcome your business needs»)

| | |
|---|---|
| Actual | Selector de 7 paquetes con precio, `sub` explicando que cada selección viaja al formulario |
| Problema | Es un catálogo con precio en la segunda posición de la página |
| **Reemplazo** | **Selected work** — `Selected digital work.` / `Websites and platforms designed around distinct business goals.` con los 4 proyectos aprobados (Aguiar Flooring · Light Specter Film · Polkanea Productions · Cosme Proenza), cada uno con categoría, nombre real, un propósito de negocio y enlace al trabajo en vivo |

### Home — sección 3 (hoy: «Built around the way your business actually works»)

| | |
|---|---|
| Actual | Texto sobre software a medida vs. herramientas de catálogo |
| **Reemplazo** | **Capabilities** — `What we build.` con **tres** grupos, no un catálogo: `DIGITAL EXPERIENCES` · `CUSTOM SYSTEMS` · `CONNECTED BUSINESS SOLUTIONS` |

### Home — sección 4 (hoy: «A clear path from problem to working solution» — 5 pasos)

| | |
|---|---|
| Actual | Discovery · Scope · Design · Build & Test · Launch & Support |
| **Reemplazo** | `Built around the business—not around a template.` con **cuatro** pasos: `UNDERSTAND` · `DESIGN` · `BUILD` · `EVOLVE` |

### Home — secciones 5–9 (industrias, expectativas, niveles de ayuda, FAQ, «Honest by design»)

| | |
|---|---|
| Actual | Cinco bloques adicionales que repiten servicios y promesas |
| **Reemplazo** | **Consolidar.** La estructura aprobada tiene 5 secciones. Industrias, «what to expect», «start with the level of help you need» y FAQ salen de la home; lo que sobreviva pasa a páginas de servicio |

### Home — cierre

| | |
|---|---|
| Actual | `Let's turn your technology problem into a clear next step.` + repetición del catálogo antes del footer |
| **Reemplazo** | `Let's build what your business needs next.` / `Tell us what you want to improve. We'll recommend a practical direction and a clear next step.` · CTA `START A PROJECT` + `CHAT ON WHATSAPP` · **sin** repetir el catálogo |

### Páginas de servicio

| Página | Headline actual | Reemplazo |
|---|---|---|
| `website-packages` | `Website Packages from $499` (también en `<title>`) | `A stronger digital presence starts with a better website.` — el `$499` **solo** en la página del paquete starter, nunca como mensaje maestro |
| `custom-software` | `Custom Software Development in Miami` | `Software shaped around the way your business operates.` |
| `nfc-business-solutions` | `NFC Business Cards & Contactless Solutions Miami` | `One tap. A more connected customer experience.` |
| `automation` · `it-infrastructure` | títulos descriptivos de servicio | Reencuadrar bajo `CONNECTED BUSINESS SOLUTIONS` / `CUSTOM SYSTEMS`; estructura obligatoria **problema → resultado → solución → prueba → proceso → CTA** |

Ninguna página de servicio empieza hoy por el problema de negocio: todas abren con el
nombre del servicio.

### Correo — bloqueo real

`305webservice@gmail.com` está en `src/lib/site.ts` (`CONTACT_EMAIL`) y se renderiza en
`Footer.tsx`, `HomeSections.tsx` y `ContactPage.tsx`.

**No puedo sustituirlo por `hello@305webservice.com` porque ese buzón no existe todavía**
—inventarlo dejaría un correo muerto en producción, que es exactamente lo que la orden
prohíbe. Necesito que lo crees y lo pruebes; entonces cambio la constante y se propaga
a las tres superficies de golpe.

Mientras tanto: el Gmail **ya salió** de la tarjeta física, y en el sitio y la tarjeta
digital dejo de destacarlo (WhatsApp y el formulario pasan al frente).

---

## Qué NO se toca

- La identidad visual aprobada: navy casi negro, azul eléctrico, aqua contenido, geometría
  del portal, espacio negativo.
- Los 4 proyectos reales con permiso escrito. No se añaden proyectos ni se insinúa que
  todos tuvieran el mismo alcance, precio o resultado.
- Las reglas congeladas de `CARD-SYSTEM.md`.
- Cero métricas, testimonios, clientes o certificaciones inventados.

---

## Orden de ejecución propuesto

| Fase | Alcance | Estado |
|---|---|---|
| 4 | Tarjeta NFC física | ✅ **hecha** — `PREPRESS PENDING FINAL QR` |
| 1 | Auditoría | ✅ **este documento** |
| 1 | Reconstrucción home (5 secciones) + páginas de servicio, EN y ES | siguiente |
| 2 | Página de tarjeta digital: orden de acciones, un solo QR dentro del módulo de compartir | después |
| 3 | Sistema de flyers: 3 campañas × EN/ES × 7 formatos, recompuestos (no recortados) | último |

La fase 3 es la más pesada: son 42 piezas nuevas. Voy en ese orden salvo que prefieras otro.
