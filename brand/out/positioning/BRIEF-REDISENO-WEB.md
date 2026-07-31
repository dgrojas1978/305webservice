# Brief para la sesión nueva — rediseño de 305webservice.com

Pégale esto a Claude al abrir la sesión. Contiene el estado real, lo que está
verificado, lo que no, y qué no se debe tocar.

Repo: `dgrojas1978/305webservice` · rama `main` · dir de trabajo
`C:\Users\danyg\.claude\sessions\305-web-service`

---

## 1. El objetivo

Que la web de 305 sea la pieza que hace que un dueño de negocio en Miami escriba.
No «la mejor del mundo» — eso no se puede verificar. Lo que sí se mide son los
taps, los eventos y los leads, que ya están instrumentados.

Hoy el problema **no es de tendencias, es de dirección visual**. El mensaje ya
está afinado y hay 4 proyectos reales que apenas se ven.

---

## 2. Lo que ya está resuelto — no rehacer

| | |
|---|---|
| **Mensaje de marca** | `TECHNOLOGY THAT MOVES YOU FORWARD.` / `Tecnología que te impulsa.` Única, en web, tarjeta física, tarjeta digital y flyers |
| **Descriptor** | `STRATEGY · DESIGN · ENGINEERING` |
| **CTAs** | primario `START A PROJECT`, secundario `VIEW OUR WORK` |
| **Home** | 5 secciones: hero · trabajo seleccionado · qué construimos (3 grupos) · cómo trabajamos (4 pasos) · cierre. 21 → 7.7 pantallas |
| **Tarjeta digital** | `/card/305`, columna única, 2.99 pantallas, 0 CTA duplicados, 1 QR |
| **Tarjeta física** | 305 PORTAL, `RELEASED FOR PRINT`, todo ≥ 9 pt, K 67.8 %, cobertura 218 % |
| **Flyers** | Letter y 4×6, EN/ES, QR decodificado del arte |
| **Enlaces NFC** | `/c/<slug>` desde BD + panel en `/admin/links` |
| **Analítica** | taps y eventos en Mongo, visitante anónimo, retención 12 meses por índice TTL |

Documentos que mandan:
- `brand/out/identity/305-DIGITAL-IDENTITY.md` — la identidad completa
- `brand/out/identity/DIGITAL-CARD-PAGE-GUIDE.md` — reglas de tarjetas digitales
- `brand/out/positioning/PHASE-1-WEBSITE-AUDIT.md` — auditoría original

---

## 3. El plan, en tres sesiones

### Sesión 1 — Dirección visual

Analizar **6–8 sitios de estudios que cobran lo que 305 quiere cobrar**. No
agencias locales: estudios de producto y marca.

Entregar **una** dirección argumentada, no un catálogo de opciones:
- Escala tipográfica y densidad
- Sistema de movimiento (qué se mueve, cuándo, por qué)
- Tratamiento del trabajo real — es el activo más fuerte y hoy se desaprovecha
- Maquetas del hero a 375 y 1440

**Criterio de la investigación de hoy:** los sitios que más convierten **quitan
copy, no la añaden**. Tipografía fina, contraste alto, menos fatiga de decisión.
El movimiento sutil gana al espectacular: un titular que entra con un fundido y
un desplazamiento mínimo ya es tipografía cinética.

### Sesión 2 — Copy

Cada sección, EN y ES, contra la identidad. El español es **equivalente en
significado, no traducción literal**, con acentuación completa.

### Sesión 3 — Implementación y QA

Motion con `prefers-reduced-motion` respetado. QA medida en 320, 375, 414, 768,
1024 y 1440, teclado, contraste y Lighthouse. Capturas antes/después.

---

## 4. Reglas duras — no negociables

**Honestidad**
- Cero métricas, testimonios, clientes o certificaciones inventados.
- Solo 4 proyectos, con permiso escrito (2026-07-27): Aguiar Flooring, Light
  Specter Film, Polkanea Productions, Cosme Proenza.
- Nunca insinuar que todos tuvieron el mismo alcance, precio o resultado.
- Ninguna promesa que no se pueda verificar. Ya se retiró
  «No-obligation initial response» por esto.

**Palabras prohibidas**
premium · revolutionary · cutting-edge · world-class · best · affordable ·
cheap · one-stop shop · we do it all · lenguaje genérico de IA.

**Sistema visual**
- Navy `#122236` plano · azul `#2f7bff` · aqua `#3fd8c6` · paper `#f5f3ee`
- **Inter, familia única.** Nada de serif: rompía la continuidad con la tarjeta
  física y ya se corrigió.
- El portal (dos marcos abiertos y desplazados) es el elemento propietario.
- Un wordmark por composición. Un CTA primario por viewport.

**Precio**
`$499` vive **solo** en la página del paquete starter. Nunca en el hero ni como
mensaje maestro.

**Correo**
`305webservice@gmail.com` sigue siendo el real. No destacarlo. No inventar
`hello@305webservice.com` hasta que el buzón exista y esté probado.

---

## 5. Pendiente y bloqueos

| Qué | Estado |
|---|---|
| Texto de privacidad de la analítica | **redactado, sin integrar.** Está en el historial de la sesión anterior, EN y ES. Obligatorio: ya se guardan IP, identificador de 1 año y comportamiento |
| Dashboard de taps y embudo | pendiente. Los datos ya entran |
| Niveles 3 y 9 del plan de analítica | formularios ampliados y lead score |
| Muestra impresa en vinilo | pendiente de Dany, antes del lote |
| Plantilla del fabricante NFC | pendiente de terceros |
| Chips NFC | **no grabados, no bloqueados** |
| Titular «Built around the business — not around a template.» | Dany lo cuestionó. Salió de su propia orden maestra. Decidir si se mantiene |

---

## 6. Verificación obligatoria antes de dar nada por hecho

No opinar: medir. Estos comandos ya se usaron y funcionan.

```bash
npm run typecheck
npm run build
```

```js
// largo en pantallas
document.documentElement.scrollHeight / 812
// CTA duplicados visibles
[...document.querySelectorAll('a,button')].map(e => e.innerText.trim().toUpperCase())
```

Y las lecciones caras de la sesión anterior:

1. **Medir solo lo visible.** Contar sobre el DOM completo infló cifras por
   copias responsive ocultas y llevó a reportar duplicados que no existían.
2. **`.output/` puede estar rancio.** Con preset Vercel la salida va a
   `.vercel/output`. Verificar contra `vinxi dev`, no contra un build viejo.
3. **Vercel no lee el `.env` local.** Las variables se añaden en el proyecto.
4. **Los cambios de la web no afectan a tarjetas ya impresas ni a chips ya
   grabados.**

---

## 7. Cómo trabaja Dany

- Ante duda, preguntar — pero con una recomendación, no un menú.
- Preguntas en lista numerada de texto plano.
- Él revisa la UI; el trabajo funcional y la medición son de Claude.
- Nunca verificar en producción sin avisar.
- Nada de afirmar de más: distinguir siempre lo verificado de lo inferido.
