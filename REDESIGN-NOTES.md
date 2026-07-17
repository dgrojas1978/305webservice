# REDESIGN-NOTES — «Monumento 305» (julio 2026)

## Concepto

Rediseño completo del sitio sobre el sistema visual aprobado **«Monumento 305»**:
el número 305 como forma tipográfica monumental (recortado deliberadamente por
los bordes), composiciones editoriales con abundante espacio negativo, bloques
navy `#071426` y blanco cálido `#F7F9FC`, azul eléctrico `#146CFF` para
protagonistas, turquesa `#20D7C5` solo en filetes/acentos, hairlines `#CDD5DF`,
Inter 400–900 autoalojada, micro-caps con tracking amplio. Sin degradados,
sombras, glassmorphism, tarjetas genéricas ni fotografía de stock.

**Idioma:** inglés por defecto (raíz) + español completo bajo `/es/*`, con
selector EN/ES accesible en header y menú móvil (orden directa de Dany
2026-07-17; sustituye el "español principal" del prompt original).

## Arquitectura

- Rutas EN: `/`, `/services`, `/projects`, `/process`, `/about`, `/contact`, `/privacy`, 404.
- Rutas ES: `/es`, `/es/servicios`, `/es/proyectos`, `/es/proceso`, `/es/nosotros`, `/es/contacto`, `/es/privacidad`.
- Páginas compartidas parametrizadas por locale en `src/components/pages/*`;
  todo el copy en `src/data/content.ts` (`C[locale]`, nunca se mezclan idiomas).
- `src/lib/i18n.ts`: mapa de rutas por idioma, `altPath` para selector y hreflang.
- `<html lang>` dinámico por request en `entry-server.tsx`.
- Redirects 301 (`src/routes/*.ts`): rutas EN retiradas (`/web-design`,
  `/custom-software`, `/it-infrastructure` → `/services#…`) y rutas legacy
  españolas (`/contacto`, `/servicios`, `/precios`, `/demo`, `/solicitar-*`,
  `/privacidad`, `/productos/*`) → páginas nuevas.

## Componentes creados / reescritos

- `layout/Header.tsx` — transparente sobre el hero → barra navy compacta al
  hacer scroll (hairline inferior); menú móvil full-screen navy con enlaces
  numerados 01–05, stagger, Escape cierra, scroll bloqueado, trap de foco y
  retorno de foco al botón.
- `layout/Footer.tsx` — 4 columnas (marca/navegación/servicios/contacto),
  copyright dinámico, privacidad, BACK TO TOP, sin redes (no hay URLs confirmadas).
- `pages/HomePage.tsx` — hero 100svh con 305 monumental (entrada por máscara
  ≤1.4 s, una vez por sesión vía `sessionStorage`, parallax sutil con rAF,
  `prefers-reduced-motion` respetado), posicionamiento asimétrico, lista
  editorial de 8 servicios (acordeón accesible), proyectos "COMING SOON",
  proceso 01–06 con números en contorno, diferenciadores, bloque Miami en azul
  eléctrico, CTA final con 305 fantasma y contacto real. JSON-LD
  `ProfessionalService` (solo datos reales).
- `pages/ServicesPage.tsx` — 8 servicios con problema / qué incluye / para
  quién / integraciones / CTA (sin precios ni promesas de tiempos).
- `pages/ProjectsPage.tsx` — sección estructural sin proyectos inventados;
  estados tipográficos abstractos etiquetados PRÓXIMAMENTE / COMING SOON.
- `pages/ProcessPage.tsx`, `pages/AboutPage.tsx`, `pages/PrivacyPage.tsx`,
  `pages/NotFoundPage.tsx` (404 con status real), `pages/ContactPage.tsx`.
- `sections/ServiceAccordion.tsx`, `pages/PageHero.tsx`, `Reveal.tsx`
  (IntersectionObserver, reveals una sola vez; sin JS todo queda visible),
  `Seo.tsx` (canonical + hreflang + OG por idioma), `ui/Button.tsx`, `ui/Container.tsx`.

## Formulario de contacto

- Campos del spec: nombre*, empresa, correo*, teléfono (opcional), servicio*,
  presupuesto (opcional), mensaje*, consentimiento* con enlace a privacidad.
- Server action existente conservada → `saveLead` (MongoDB `305-web-service.leads`).
- Honeypot `website_url`, validación nativa + servidor con mensajes por idioma,
  estado de envío, y **nunca simula éxito**: sin `MONGODB_URI` muestra error
  visible y la información escrita se conserva (verificado en dev).

## Resultados de pruebas

- `npm run typecheck` — limpio.
- `NITRO_PRESET=node-server npm run build` — OK (preset Vercel intacto para deploy).
- No hay suite de tests en el proyecto (no existía) — verificación = QA browser.
- QA vía CDP sobre dev server: **0 px de overflow horizontal** en 360×800,
  390×844, 768×1024, 1024×768, 1366×768, 1440×900 y 1920×1080; menú móvil
  (abre, bloquea scroll, Escape cierra, desbloquea) ✓; acordeón
  (`aria-expanded`/panel) ✓; formulario (envío vacío bloqueado, error de
  servidor honesto) ✓; `prefers-reduced-motion` deja todo visible ✓;
  **0 errores de consola**.
- **Lighthouse (móvil, home, build de producción):** Performance **99**,
  Accessibility **100**, Best Practices **100**, SEO **100** ·
  LCP 1.7 s · CLS 0.026 · TBT 0 ms.
- Redirects verificados (301 con destino correcto), 404 devuelve status 404,
  `lang` correcto por ruta (en/es).

## SEO

- Title/description únicos por página e idioma, canonical, OG + Twitter,
  `hreflang` (en/es/x-default), sitemap bilingüe, robots.txt, favicon «305»,
  JSON-LD ProfessionalService (Miami FL, tel +13058332984,
  305webservice@gmail.com — sin dirección postal porque no está publicada).
- `og-image.png` regenerado al sistema (el anterior mencionaba "$499", ya no
  se publica ese precio). Fuente editable: `brand/social/og-image.html`.

## Datos pendientes / decisiones a revisar

- **Proyectos reales:** la sección está lista para recibirlos; hoy muestra
  PRÓXIMAMENTE. Cuando existan, añadirlos con imágenes reales optimizadas.
- **Correo público:** se usa `305webservice@gmail.com` (confirmado por Dany
  para las piezas impresas). Si prefieres `info@305webservice.com` en la web,
  basta con setear `VITE_CONTACT_EMAIL` en Vercel.
- **Redes sociales:** sin URLs confirmadas → no se muestran.
- **Precio "$499":** eliminado del sitio y del og-image por indicación del
  nuevo spec (no publicar precios sin confirmación).

## Ejecución

```bash
npm run dev            # dev server (usamos --port 3005)
npm run typecheck
npm run build          # preset vercel (deploy)
NITRO_PRESET=node-server npm run build && node .output/server/index.mjs  # prod local
```

## Capturas

`qa-screenshots/` — home hero y página completa en 390×844 y 1440×900,
menú móvil abierto, acordeón abierto, formulario, páginas interiores a 390 y
1440, y `lighthouse-home-mobile.json`.

*(Sin commit ni push, pendiente de autorización.)*
