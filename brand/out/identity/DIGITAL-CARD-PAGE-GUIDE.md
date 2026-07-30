# Guía de páginas de tarjeta digital — 305 Web Service

Documento de referencia para **todas** las tarjetas digitales que 305 construya:
la propia y las de clientes. Se escribió después de auditar `/card/305` en
producción, en móvil, con medición real del DOM.

---

## 1. Qué hace la competencia

| Plataforma | Enfoque | Lo que se le copia | Lo que no |
|---|---|---|---|
| **Blinq** | Alta rapidísima, QR + NFC | Una sola acción dominante; el perfil es corto | El perfil es genérico: no vende al negocio, solo identifica a la persona |
| **HiHello** | Compartir por QR, enlace, NFC y widgets | Guardar contacto sin fricción, sin app del receptor | Cero prueba de trabajo, cero propuesta comercial |
| **Popl** | Ecosistema de objetos NFC (tags, fundas, pulseras) | Consistencia entre objeto físico y perfil | El perfil existe para capturar el lead, no para explicar valor |
| **V1CE** | Material premium (metal, bambú, 24K) | El objeto comunica antes de tocarlo | Imprimen casi nada; delegan todo al móvil |
| **Mobilo** | Equipos y CRM | Atribución y seguimiento por tarjeta | Estructura de perfil intercambiable entre clientes |

**El patrón del sector, según sus propias guías:** arriba van nombre, cargo, empresa,
teléfono, correo, web y guardar contacto; debajo, los enlaces que ayudan al siguiente paso
— reserva, LinkedIn, portafolio, pago, WhatsApp, reseñas.

**El hueco que deja:** ninguno de ellos **vende**. Son directorios de contacto bonitos.
No hay propuesta de valor, no hay prueba, no hay oferta. Ahí está la ventaja de 305: la
tarjeta puede ser una **página de conversión** que además guarda el contacto.

**Principio de conversión aplicable, no específico de tarjetas:** el primer viewport tiene
que hacer todo el trabajo de persuasión — propuesta de valor, prueba y una acción primaria.
El titular va primero y debe expresar un resultado, no una categoría.

---

## 2. Auditoría de `/card/305` (30 jul 2026, producción, viewport 375 × 812)

### Lo que está bien

El **orden del primer viewport es correcto** y coincide con el modelo aprobado:

```
305 WEB SERVICE  ·  selector EN/ES
MIAMI · AVAILABLE FOR PROJECTS
H1: Technology that moves you forward.        [unificado 30 jul 2026]
sub: Websites, custom software, NFC experiences and IT solutions—
[un proyecto real: Light Specter Film · Cinematic brand and lead experience · View Project]
REAL PROJECTS · ENGLISH & SPANISH · DIRECT SUPPORT
SAVE CONTACT   WHATSAPP   MORE
```

Identidad → relevancia → una prueba → acciones. **Un solo QR en toda la página.** Correcto.

### Lo que sobra — medido, no opinado

| Hallazgo | Medición | Regla que rompe |
|---|---|---|
| `START A PROJECT` repetido | **3 veces** | un CTA primario por viewport |
| `CHAT ON WHATSAPP` repetido | **2 veces** (+ `WHATSAPP` en el dock = 3 rutas al mismo canal) | sin grupos de acción duplicados |
| `SAVE CONTACT` repetido | **2 veces** | ídem |
| `SHARE` / `SHARE YOUR CONTACT` / `COPY LINK` | **4 variantes** de compartir | una sola forma de compartir, en un módulo |
| Wordmark `305 Web Service` | **4 veces** | una vez por composición |
| Largo total | **4 012 px = 4.9 pantallas** | la competencia se mueve en 1.5–2.5 |
| Lista de necesidades | **6 opciones** (ganar clientes, vender en línea, automatizar, software, NFC, IT) | tres grupos de capacidad, no un catálogo de seis |

29 elementos accionables en total. Es un menú, no un camino.

### Lo que falta

1. **`START A PROJECT` no está en el primer viewport.** El modelo aprobado dice que debe
   ser la acción más fuerte; hoy arriba solo hay `SAVE CONTACT` y `WHATSAPP`.
2. ~~El mensaje de marca tiene tres versiones distintas.~~ **RESUELTO el 30 jul 2026.**
   Decisión del propietario: la declaración única es **`TECHNOLOGY THAT MOVES YOU FORWARD.`**
   (`Tecnología que te impulsa.` en español). Se aplicó al hero de la web, a la tarjeta
   digital y a los dos formatos de flyer; la tarjeta física ya la usaba.
3. **Un bloque duplicado en el DOM.** El h2 `Let's build what your business needs next.`
   aparece dos veces; la segunda con altura 0. No se ve, pero un lector de pantalla lo
   anuncia igual. Hay que confirmar si es el panel del formulario y, si lo es, ocultarlo
   correctamente para tecnología asistiva.

---

## 3. La guía — reglas para cualquier tarjeta digital de 305

### 3.1 Longitud

**Máximo 3 pantallas** en móvil (≈ 2 400 px a 812 px de alto). Si no cabe, sobra contenido,
no falta espacio.

### 3.2 Orden obligatorio

```
1  Identidad          wordmark UNA vez + selector de idioma + disponibilidad UNA vez
2  Posicionamiento    un titular de resultado + una línea de apoyo
3  Acciones           un grupo, una sola vez, con UNA acción dominante
4  Prueba             UN proyecto o UN dato verificable
5  Caminos            TRES como máximo, nunca seis
6  Intercambio        guardar contacto / compartir, en UN módulo
7  Ubicación          solo si está configurada de verdad
8  Reseñas            solo con Place ID verificado; si no, no existe la sección
9  Legal              al final, discreto
```

### 3.3 Presupuesto de elementos

| Elemento | Máximo por página |
|---|---|
| Wordmark | 1 |
| Etiqueta de disponibilidad | 1 |
| CTA primario | 1 (repetible **una** vez al cierre, nunca 3) |
| Canal de contacto por tipo | 1 (un WhatsApp, un teléfono) |
| QR | 1, dentro del módulo de compartir |
| Formas de compartir | 1 módulo, no 4 botones sueltos |
| Grupos de capacidad | 3 |
| Piezas de prueba arriba | 1 |

### 3.4 Jerarquía de acción

Una acción **domina** visualmente. Las demás son secundarias y se ven secundarias.
Nunca dos botones del mismo peso lado a lado.

Para 305: **`START A PROJECT`** manda y debe estar en el primer viewport.
`SAVE CONTACT` va junto pero con menos peso — es cortesía, no conversión.

### 3.5 Consistencia de mensaje

Una idea, **una** frase, en todas las superficies. Si la tarjeta física dice
`TECHNOLOGY THAT MOVES YOU FORWARD.`, la digital no dice otra variante.
Las frases viven en un solo sitio del código (`src/data/`), nunca escritas a mano en un
componente.

### 3.6 Honestidad

- Sin métricas, testimonios, clientes ni certificaciones inventados.
- Reseñas de Google solo con Place ID verificado y sin filtrar quién puede opinar:
  todos los visitantes ven el mismo CTA.
- Ubicación exacta solo si el negocio la tiene y quiere mostrarla; si opera por zona,
  se dice zona.
- Ningún correo sin buzón creado y probado.

### 3.7 Sin QR dominante en escritorio

El visitante ya abrió la página. Un QR grande arriba no le sirve de nada y le roba
protagonismo al CTA. El QR existe para que **otra** persona entre.

### 3.8 Verificación obligatoria antes de publicar

Estas comprobaciones se **miden**, no se opinan:

```js
// contar duplicados de accion
[...document.querySelectorAll('a,button')].map(e=>e.innerText.trim().toUpperCase())
// largo en pantallas
document.documentElement.scrollHeight / 812
// wordmarks
(document.body.innerText.match(/WORDMARK/gi)||[]).length
```

| Comprobación | Criterio |
|---|---|
| Largo | ≤ 3 pantallas a 375 × 812 |
| CTA duplicados | 0 (salvo el cierre, que puede repetir el primario una vez) |
| Wordmarks | 1 |
| QR | 1 |
| Primer viewport | contiene la acción dominante |
| EN y ES | revisados por separado, con acentuación completa |
| Teclado | recorrido completo, foco visible |
| Anchos | 320, 375, 414, 768, 1024, 1440 |

---

## 4. Trabajo pendiente en `/card/305`

Por orden de impacto:

1. Subir `START A PROJECT` al primer viewport y bajarle peso a `SAVE CONTACT`.
2. Eliminar las repeticiones: `START A PROJECT` 3 → 2, WhatsApp 3 → 1, `SAVE CONTACT` 2 → 1.
3. Unificar compartir: 4 variantes → 1 módulo con el QR dentro.
4. Reducir la lista de 6 necesidades a los 3 grupos de capacidad.
5. Bajar de 4.9 a ≤ 3 pantallas.
6. Wordmark de 4 → 1.
8. Revisar el bloque duplicado en el DOM y su tratamiento accesible.

Nada de esto se ha ejecutado: este documento es el diagnóstico y la norma.
