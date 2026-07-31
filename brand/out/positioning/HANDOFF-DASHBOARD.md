# Handoff — Dashboard de tarjetas NFC

Para otra instancia. Construye `/admin/dashboard` sobre datos que **ya existen y
ya entran solos**. No hay que instrumentar nada: la captura funciona.

Repo `dgrojas1978/305webservice` · rama `main` · dir
`C:\Users\danyg\.claude\sessions\305-web-service`

---

## 1. Qué hay hoy en la base

Medido el 31 jul 2026 contra producción (`305-web-service-db`):

```
taps     3    todos city="Miami"
events  32    card_view 16 · qr_view 5 · project_visit 4
               language_change 2 · copy_link 1 · call_click 1
links    6
leads    0
```

**Muestra minúscula.** El dashboard debe seguir siendo honesto con 3 toques:
avisar cuando el volumen no permite concluir, nunca pintar una tasa de
conversión sobre 3 eventos como si fuera un dato.

---

## 2. Formas de los documentos

Definidas en código, no las adivines:

| Colección | Fuente de verdad |
|---|---|
| `taps` | `src/lib/tapLog.ts` → `interface TapEvent` |
| `events` | `src/routes/api/track.ts` → `interface CardEvent` |
| `links` | `src/lib/shortlinks.ts` → `interface ShortLink` |

Campos clave:

- **`taps`**: `slug`, `at`, `kind` (`profile`|`link`), `business`, `owner`,
  `cardId`, `context`, `ip`, `country`, `region`, `city`, `timezone`,
  `userAgent`, `referer`, `utm`, `target`, `visitorId`, `firstVisit`
- **`events`**: `event`, `card`, `at`, `visitorId`, `props`, `path`,
  `country`, `city`
- **`links`**: `slug`, `target`, `label`, `business`, `owner`, `cardId`,
  `context`, `active`, `taps`, `createdAt`, `updatedAt`, `history`

**`visitorId` es la bisagra.** Es el mismo en `taps` y en `events`, así que une
el toque con lo que la persona hizo después. Sin él no hay embudo.

**La atribución en `taps` está congelada** en el momento del toque. Si una
tarjeta cambia de dueño, los taps viejos siguen contando para el anterior. **No
la re-resuelvas desde `links`**: reescribiría la historia.

---

## 3. Qué construir

Ruta nueva `/admin/dashboard`, protegida igual que el panel de enlaces.

**Reutiliza `src/lib/adminAuth.ts` tal cual.** Ya resuelve login, cookie firmada
con HMAC, `adminEnabled()` y comparación en tiempo constante. Copia el patrón de
`src/routes/admin/links.tsx`:

- `loadState` es un `cache()` de `@solidjs/router` — **`cache()`, no `query()`**:
  el router es 0.14 y `query` llegó en 0.15.
- Errores por `redirect("/admin/...?e=...")`, nunca devolviendo un objeto: en un
  envío nativo el navegador pinta el payload serializado.
- Añade `Disallow` en `public/robots.txt` si creas rutas nuevas bajo `/admin`.

### Bloques, por orden de valor

**1 · Cuatro números arriba**
Toques · Visitantes únicos (`distinct visitorId`) · Acciones de contacto
(`call_click` + `whatsapp_click`) · Tasa toque→contacto.

**2 · Embudo**
```
toques → card_view → project_visit → call_click / whatsapp_click
```
Cruzando por `visitorId`. Muestra números absolutos **y** porcentaje, pero
oculta el porcentaje si la base es menor de ~30.

**3 · Ubicación**
Agrupa por `city` y `region`. Es aproximada, derivada de IP — etiquétalo así en
la interfaz. **Nunca la presentes como ubicación de una persona.**

**4 · Por tarjeta, vendedor y contexto**
`business`, `owner`, `cardId`, `context`. Es lo que convierte esto en una
herramienta de ventas: «Carlos generó 240 toques y 8 contactos».

**5 · Cuándo**
Por hora del día y día de semana, desde `at`. Sirve para decidir cuándo repartir.

**6 · Nuevos vs recurrentes**
Desde `firstVisit`.

**7 · Dispositivo**
Parsea `userAgent` para móvil/tablet/escritorio, iOS/Android. No metas una
librería pesada: cuatro expresiones regulares bastan.

**8 · Origen**
`utm.utm_source` distingue toque NFC de escaneo QR de enlace compartido.

### Filtros

Rango de fechas y, si hay más de un negocio, filtro por `business`.

---

## 4. Rendimiento

Con 3 documentos da igual. Con 200 000 no.

- Índices sugeridos: `taps` por `{at:-1}`, `{slug:1, at:-1}`, `{owner:1, at:-1}`;
  `events` por `{at:-1}`, `{visitorId:1}`.
- **Crea los índices como se hace ya en `tapLog.ts`**: una vez por proceso, con
  `void`, tragando el error. Nunca bloqueando.
- Ojo: `taps` y `events` ya tienen un índice TTL sobre `at` a 365 días. **No lo
  toques ni lo dupliques** — hace cumplir la retención declarada.

---

## 5. Reglas de honestidad

Son las mismas de todo el proyecto y aquí importan más que en ningún sitio:

- **Nada de datos de ejemplo.** Si no hay datos, el bloque dice que no hay datos.
- **Nada de proyecciones ni estimaciones de ingresos.** No existe ese dato.
- **Avisar cuando la muestra es pequeña.** Una tasa sobre 3 eventos no es una
  tasa.
- **La ubicación es aproximada**, siempre etiquetada como tal.
- **No mostrar IPs completas en la interfaz.** Se guardan porque el propietario
  lo pidió y está declarado, pero pintarlas en pantalla no aporta nada y expone.
- El texto de privacidad **sigue sin integrarse**. Está redactado en EN y ES en
  el historial de la sesión del 31 jul. Es obligatorio: ya se guardan IP,
  identificador de 1 año y comportamiento.

---

## 6. Verificación obligatoria

```bash
npm run typecheck
npm run build
```

Y contra datos reales, no supuestos. Patrón que ya funciona: un script `.mjs`
temporal **en la raíz del proyecto** (no en `/tmp`, ahí no resuelve `mongodb`),
que lee `.env` a mano y consulta. Borra el script y cualquier dato de prueba al
terminar.

### Trampas que ya costaron caro

1. **Mide solo lo visible.** Contar sobre el DOM completo infla cifras por copias
   responsive ocultas.
2. **`.output/` puede estar rancio.** Con preset Vercel la salida va a
   `.vercel/output`. Verifica contra `vinxi dev`.
3. **Vercel no lee el `.env` local.** `MONGODB_URI` y `ADMIN_PASSWORD` ya están
   en el proyecto de Vercel, solo en Production.
4. **`ADMIN_PASSWORD` exige 12+ caracteres** o `adminEnabled()` devuelve false y
   el panel no existe.
5. **Colisiones de nombres de variable.** Un `ink` sobrescrito por otro `ink`
   hizo que un informe entero se publicara vacío sin que nada fallara.

---

## 7. Antes de dar nada por bueno

El propietario tiene 6 enlaces creados y tarjetas en la calle. **Con 3 toques
cualquier gráfica miente.** Conviene decirle explícitamente que reparta tarjetas
antes de sacar conclusiones, y que el dashboard empieza a ser útil hacia los
~200 toques.

Contexto completo del proyecto en:
- `brand/out/identity/305-DIGITAL-IDENTITY.md`
- `brand/out/positioning/BRIEF-REDISENO-WEB.md`
