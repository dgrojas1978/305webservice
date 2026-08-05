const CARD_URL = 'https://www.305webservice.com/card/infinite-windows';

const gallery = [
  {
    title: '10 Tarpon Island',
    category: 'Private residential',
    location: 'Palm Beach · Florida',
    caption: '10 Tarpon Island · Palm Beach',
    src: 'assets/tarpon-hero.webp',
    alt: '10 Tarpon Island residence in Palm Beach at dusk',
    position: '50% 50%'
  },
  {
    title: '255 Ocean Boulevard',
    category: 'Residential · 2023',
    location: 'Golden Beach · Florida',
    caption: '255 Ocean Boulevard · Treo Construction',
    src: 'https://fxhmjvvmgkwpfowminae.supabase.co/storage/v1/object/public/marketing-projects/255-ocean-blvd/hero-1777392407715.jpg',
    alt: '255 Ocean Boulevard residence in Golden Beach',
    position: '50% 50%'
  },
  {
    title: '255 Ocean Boulevard',
    category: 'Project detail · 01',
    location: 'Golden Beach · Florida',
    caption: '255 Ocean Boulevard · Golden Beach · Florida',
    src: 'https://fxhmjvvmgkwpfowminae.supabase.co/storage/v1/object/public/marketing-projects/255-ocean-blvd/gallery-1777392380796.jpeg',
    alt: 'Architectural glazing detail at 255 Ocean Boulevard',
    position: '50% 50%'
  },
  {
    title: '255 Ocean Boulevard',
    category: 'Project detail · 02',
    location: 'Golden Beach · Florida',
    caption: '255 Ocean Boulevard · Golden Beach · Florida',
    src: 'https://fxhmjvvmgkwpfowminae.supabase.co/storage/v1/object/public/marketing-projects/255-ocean-blvd/gallery-1777392383879.jpg',
    alt: 'Large-span window installation at 255 Ocean Boulevard',
    position: '50% 50%'
  },
  {
    title: '255 Ocean Boulevard',
    category: 'Project detail · 03',
    location: 'Golden Beach · Florida',
    caption: '255 Ocean Boulevard · Golden Beach · Florida',
    src: 'https://fxhmjvvmgkwpfowminae.supabase.co/storage/v1/object/public/marketing-projects/255-ocean-blvd/gallery-1777392385564.jpg',
    alt: 'Impact glazing integrated into the architecture at 255 Ocean Boulevard',
    position: '50% 50%'
  },
  {
    title: '255 Ocean Boulevard',
    category: 'Project detail · 04',
    location: 'Golden Beach · Florida',
    caption: '255 Ocean Boulevard · Golden Beach · Florida',
    src: 'https://fxhmjvvmgkwpfowminae.supabase.co/storage/v1/object/public/marketing-projects/255-ocean-blvd/gallery-1777392387202.jpg',
    alt: 'Glass envelope and coastal architecture at 255 Ocean Boulevard',
    position: '50% 50%'
  }
];

const galleryRoot = document.querySelector('#gallery');
galleryRoot.innerHTML = gallery.map((item, index) => `
  <button class="gallery-item" type="button" data-gallery-index="${index}" aria-label="Open ${item.title}, image ${index + 1} of ${gallery.length}">
    <img src="${item.src}" alt="" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async" style="object-position:${item.position}">
    <span class="gallery-label"><small>${item.category}</small><strong>${item.title}</strong></span>
  </button>`).join('');

const magicbox = document.querySelector('#magicbox');
const magicImage = document.querySelector('#magicbox-image');
const magicTitle = document.querySelector('#magicbox-title');
const magicMeta = document.querySelector('#magicbox-meta');
const magicCaption = document.querySelector('#magicbox-caption');
const magicCount = document.querySelector('#magicbox-count');
let activeImage = 0;
let touchStart = 0;

function paintMagicbox(index) {
  activeImage = (index + gallery.length) % gallery.length;
  const item = gallery[activeImage];
  magicImage.src = item.src;
  magicImage.alt = item.alt;
  magicTitle.textContent = item.title;
  magicMeta.textContent = `${item.category} · ${item.location}`;
  magicCaption.textContent = item.caption;
  magicCount.textContent = `${String(activeImage + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
  [gallery[activeImage - 1], gallery[activeImage + 1]].filter(Boolean).forEach(next => { const preload = new Image(); preload.src = next.src; });
}

function openMagicbox(index) {
  paintMagicbox(index);
  magicbox.showModal();
  document.body.style.overflow = 'hidden';
  track('project_image_open', { index, project: gallery[index].title });
}

galleryRoot.addEventListener('click', event => {
  const trigger = event.target.closest('[data-gallery-index]');
  if (trigger) openMagicbox(Number(trigger.dataset.galleryIndex));
});

document.querySelectorAll('[data-gallery-nav]').forEach(button => button.addEventListener('click', () => paintMagicbox(activeImage + Number(button.dataset.galleryNav))));
document.querySelector('[data-close="magicbox"]').addEventListener('click', () => magicbox.close());
magicbox.addEventListener('close', () => { document.body.style.overflow = ''; });
magicbox.addEventListener('click', event => { if (event.target === magicbox) magicbox.close(); });
magicbox.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
magicbox.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 55) paintMagicbox(activeImage + (distance < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener('keydown', event => {
  if (!magicbox.open) return;
  if (event.key === 'ArrowRight') paintMagicbox(activeImage + 1);
  if (event.key === 'ArrowLeft') paintMagicbox(activeImage - 1);
});

const atlasSheet = document.querySelector('#atlas-sheet');
const shareSheet = document.querySelector('#share-sheet');

document.querySelectorAll('[data-open="atlas"]').forEach(button => button.addEventListener('click', () => {
  const prompt = button.dataset.prompt;
  document.querySelector('#atlas-selection').textContent = prompt
    ? `You selected “${prompt}.” Continue to the live Infinite Windows site to work with Atlas.`
    : 'Atlas can help with products, specifications, maintenance, quotations, and site visits.';
  atlasSheet.showModal();
  track('atlas_open', prompt ? { prompt } : {});
}));

document.querySelector('[data-open="share"]').addEventListener('click', () => {
  shareSheet.showModal();
  track('share_open');
});

function closeOnBackdrop(dialog) {
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
closeOnBackdrop(atlasSheet);
closeOnBackdrop(shareSheet);

function downloadVcard() {
  window.location.href = '/card/infinite-windows/vcard';
  track('save_contact');
}

document.querySelector('[data-action="save"]').addEventListener('click', downloadVcard);

async function shareCard() {
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Infinite Windows', text: 'The windows of the houses you remember.', url: CARD_URL });
      track('share_complete', { method: 'native' });
      return;
    }
  } catch (error) {
    if (error.name === 'AbortError') return;
  }
  await copyCardLink();
}

async function copyCardLink() {
  const status = document.querySelector('#share-status');
  try {
    await navigator.clipboard.writeText(CARD_URL);
    status.textContent = 'Link copied.';
    track('share_complete', { method: 'copy' });
  } catch {
    status.textContent = 'Copy the address from your browser.';
  }
}

document.querySelector('[data-action="native-share"]').addEventListener('click', shareCard);
document.querySelector('[data-action="copy"]').addEventListener('click', copyCardLink);

document.querySelectorAll('[data-track]').forEach(element => element.addEventListener('click', () => track(element.dataset.track)));

function track(event, details = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, card: 'infinite-windows-demo', ...details });
}

track('card_view', { source: new URLSearchParams(location.search).get('utm_source') || 'direct' });

const ES = new Map(Object.entries({
  'Studio online': 'Estudio disponible',
  '10 Tarpon Island · Palm Beach': '10 Tarpon Island · Palm Beach',
  'The windows of the houses you remember.': 'Las ventanas de las casas que recuerdas.',
  'Impact glazing': 'Cristalería de impacto',
  'Architectural fabrication': 'Fabricación arquitectónica',
  'Since 2005': 'Desde 2005',
  'Start a project': 'Iniciar un proyecto',
  'Ask Atlas': 'Preguntar a Atlas',
  'Studio assistant · online': 'Asistente del estudio · disponible',
  'Explore the work': 'Explorar proyectos',
  'Save': 'Guardar', 'Call': 'Llamar', 'Directions': 'Cómo llegar', 'Share': 'Compartir',
  'Two practices, one studio': 'Dos especialidades, un estudio',
  'Two fronts of the same work —': 'Dos facetas del mismo trabajo —',
  'the house on the water, and the tower on the skyline.': 'la casa frente al agua y la torre en el horizonte.',
  'For homeowners · architects · designers': 'Para propietarios · arquitectos · diseñadores',
  'For developers · general contractors': 'Para desarrolladores · contratistas generales',
  'Residential': 'Residencial', 'Commercial': 'Comercial',
  'Explore residential →': 'Explorar residencial →', 'Explore commercial →': 'Explorar comercial →',
  'Selected work': 'Proyectos seleccionados', 'Recent work': 'Proyectos recientes',
  'A few of the houses, and towers,': 'Algunas de las casas y torres',
  'you might remember.': 'que quizás recuerdes.', 'Full portfolio': 'Portafolio completo',
  'Atlas · Studio assistant · Online': 'Atlas · Asistente del estudio · Disponible',
  'The window expert': 'El experto en ventanas', 'who never goes home.': 'que siempre está disponible.',
  'Ask about products, specifications, maintenance, or the next step for your project.': 'Pregunta sobre productos, especificaciones, mantenimiento o el próximo paso de tu proyecto.',
  'Spec a window': 'Especificar una ventana', 'Maintenance question': 'Pregunta de mantenimiento',
  'Request a quote': 'Solicitar cotización', 'Book a site visit': 'Programar visita',
  'The platform behind the windows': 'La plataforma detrás de las ventanas',
  'Every project.': 'Cada proyecto.', 'Live.': 'En tiempo real.',
  'Permits, factory ship dates, install schedule, punch list, invoicing — updated in real time, visible to every client who logs in.': 'Permisos, fechas de envío de fábrica, calendario de instalación, lista de pendientes y facturación: todo actualizado en tiempo real y visible para cada cliente que inicia sesión.',
  'The client portal': 'Portal del cliente', 'After installation': 'Después de la instalación',
  'Maintenance': 'Mantenimiento', 'Proprietary systems': 'Sistemas propios',
  'How the studio works': 'Cómo trabaja el estudio', 'Explore the platform': 'Explorar la plataforma',
  'The studio': 'El estudio', 'Visit': 'Visítanos', 'Write': 'Escríbenos', 'Credentials': 'Credenciales',
  "Hurricane-impact windows, doors, and architectural fabrication for South Florida's most significant residential and commercial projects. Since 2005.": 'Ventanas y puertas resistentes a huracanes, y fabricación arquitectónica para destacados proyectos residenciales y comerciales del sur de Florida. Desde 2005.',
  'Sofia answers 24/7': 'Sofia responde 24/7',
  'View NFC card proof →': 'Ver prueba de tarjeta NFC →',
  'Demo concept · Information sourced from Infinite Windows public pages · August 2026': 'Concepto de demostración · Información obtenida de las páginas públicas de Infinite Windows · Agosto de 2026',
  'Additional social profiles will appear only after ownership is verified.': 'Se añadirán otros perfiles sociales cuando se verifique su titularidad.',
  'Digital card by': 'Tarjeta digital por', 'Close': 'Cerrar', 'Previous image': 'Imagen anterior', 'Next image': 'Imagen siguiente',
  'Continue with Atlas': 'Continuar con Atlas', 'Share this card': 'Compartir esta tarjeta',
  'Copy link': 'Copiar enlace', 'Share…': 'Compartir…'
}));

const textNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const parent = walker.currentNode.parentElement;
  if (parent && !['SCRIPT', 'STYLE'].includes(parent.tagName) && walker.currentNode.nodeValue.trim()) {
    textNodes.push({ node: walker.currentNode, en: walker.currentNode.nodeValue });
  }
}

let locale = 'en';
document.querySelector('.lang').addEventListener('click', event => {
  locale = locale === 'en' ? 'es' : 'en';
  document.documentElement.lang = locale;
  event.currentTarget.setAttribute('aria-pressed', String(locale === 'es'));
  textNodes.forEach(({ node, en }) => {
    const value = en.trim();
    const translated = ES.get(value);
    node.nodeValue = locale === 'es' && translated ? en.replace(value, translated) : en;
  });
  track('language_change', { locale });
});
