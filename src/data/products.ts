import type { Product } from "~/types";
import { axisErpProduct } from "~/data/axisErp";

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "13051234567";

export const products: Product[] = [
  axisErpProduct,
  {
    id: "fortaleza",
    slug: "fortaleza-zona-0",
    name: "FORTALEZA / ZONA-0",
    tagline: "El universo ARG que homenajea los juegos de aventura cubanos de los 90",
    shortDescription:
      "Plataforma de entretenimiento interactivo masivo: MMO + ARG + aventura de texto. Misiones, economía virtual, NPCs con IA y una comunidad viva que no duerme.",
    fullDescription:
      "FORTALEZA / ZONA-0 es un universo de entretenimiento interactivo inspirado en los legendarios juegos de aventura de texto cubanos de los años 90. Combina MMO, ARG (juego de realidad alternativa) y aventura de texto en una plataforma moderna con IA, economía virtual y misiones que trascienden la pantalla. Construida para la diáspora latina y los amantes del gaming clásico.",
    problem:
      "El gaming moderno perdió algo en el camino: la narrativa profunda, la comunidad real, la sensación de que el mundo del juego importa. Los MMOs actuales son fábricas de contenido sin alma. Los juegos cubanos de los 90 tenían algo que ningún AAA tiene hoy — urgencia, ingenio y comunidad. ¿Dónde está ese espíritu?",
    solution:
      "ZONA-0 lo revive. Una aventura de texto con IA que recuerda cada decisión, un mundo masivo donde la comunidad construye la narrativa, NPCs que piensan y sienten, y misiones ARG que salen de la pantalla hacia el mundo real. El juego que Cuba soñó, construido con la tecnología de hoy.",
    category: "Entretenimiento / ARG",
    tags: ["MMO", "ARG", "Aventura de texto", "IA", "Comunidad latina", "Gaming", "PWA"],
    icon: "Terminal",
    colorFrom: "#065F46",
    colorTo: "#1A1A2E",
    accentColor: "#10B981",
    isHighlighted: true,
    status: "active",
    demoUrl: "https://fortalezacuba.com",
    ctaLabel: "Jugar ahora →",
    features: [
      {
        icon: "Terminal",
        title: "Aventura de Texto Clásica",
        description: "Interfaz retro inspirada en los juegos cubanos de los 90. Comandos, puzzles narrativos y una historia ramificada donde cada decisión cuenta.",
      },
      {
        icon: "Users",
        title: "LA RED — Multijugador Masivo",
        description: "Mundo persistente compartido con toda la comunidad. Explora, comunícate, forma alianzas y compite en tiempo real vía WebSockets.",
      },
      {
        icon: "Zap",
        title: "NPCs con Inteligencia Artificial",
        description: "Personajes no jugables con memoria, personalidad y motivaciones propias, impulsados por Claude AI. Cada conversación es única e irrepetible.",
      },
      {
        icon: "DollarSign",
        title: "Economía MOROCOTA",
        description: "Moneda virtual integrada en el universo ZONA-0. Comercia, invierte, negocia con otros jugadores y construye tu fortuna dentro del juego.",
      },
      {
        icon: "Globe",
        title: "ARG — Realidad Alternativa",
        description: "Misiones que trascienden la pantalla. Pistas en el mundo real, eventos en vivo, URLs secretas y una narrativa que evoluciona con la comunidad.",
      },
      {
        icon: "Monitor",
        title: "Fortaleza Terminal",
        description: "Cliente de escritorio nativo para la experiencia completa. También disponible como PWA en cualquier dispositivo con o sin conexión estable.",
      },
    ],
    modules: [
      { name: "Terminal Engine",    description: "Motor de aventura de texto con parser inteligente", icon: "Terminal"  },
      { name: "LA RED",             description: "Chat y mundo compartido en tiempo real",            icon: "Wifi"      },
      { name: "Sistema de Misiones",description: "Quests ARG single y multi-jugador",                 icon: "Globe"     },
      { name: "MOROCOTA",           description: "Economía y mercado virtual integrado",              icon: "DollarSign"},
      { name: "IA Core",            description: "Motor de NPCs con memoria y personalidad",          icon: "Cpu"       },
      { name: "Eventos ARG",        description: "Live events, pistas físicas y narrativa dinámica",  icon: "Radio"     },
      { name: "Logros",             description: "Rankings, insignias y progresión del jugador",      icon: "Star"      },
      { name: "Panel Admin",        description: "Herramienta de narrativa y moderación",             icon: "Settings"  },
    ],
    benefits: [
      {
        icon: "Heart",
        title: "Nostalgia + Innovación",
        description: "La esencia de los juegos cubanos de los 90 con tecnología de 2025. Reconocible para los que lo vivieron, fresco para los que llegan.",
        metric: "Homenaje a una era",
      },
      {
        icon: "Users",
        title: "Comunidad viva",
        description: "No es un juego solo. Es una comunidad que construye la narrativa colectivamente. Lo que hacen los jugadores hoy cambia el mundo mañana.",
        metric: "Narrativa colaborativa",
      },
      {
        icon: "Zap",
        title: "IA que recuerda",
        description: "Los NPCs de ZONA-0 tienen memoria. Recuerdan lo que les dijiste la semana pasada. Evolucionan. No son bots — son personajes.",
        metric: "Claude AI integrado",
      },
      {
        icon: "Globe",
        title: "El juego no para",
        description: "Los ARGs no tienen pausa. Pistas en el mundo real, eventos sorpresa, mensajes cifrados. El universo ZONA-0 vive 24/7.",
        metric: "Experiencia siempre activa",
      },
    ],
    useCases: [
      { title: "Diáspora Cubana",         description: "Un universo que conecta con las raíces culturales del gaming cubano de los 90, desde cualquier parte del mundo.", industry: "Cultura"       },
      { title: "Fans del ARG",            description: "Para quienes disfrutaron juegos como Perplex City, I Love Bees o Cicada 3301. ZONA-0 lleva el género a otro nivel.", industry: "Gaming"        },
      { title: "Comunidades Gaming LATAM",description: "Un MMO pensado para la comunidad latina, con servidores regionales y narrativa en español.",                       industry: "Entretenimiento"},
      { title: "Escape Room Digital",     description: "Grupos de amigos que buscan experiencias colaborativas de resolución de puzzles con narrativa profunda.",           industry: "Ocio"          },
    ],
    screenshots: [
      { url: "/screenshots/fortaleza-terminal.png", alt: "Fortaleza Terminal",      caption: "Interfaz de aventura de texto clásica"            },
      { url: "/screenshots/fortaleza-la-red.png",   alt: "LA RED — Multijugador",   caption: "El mundo compartido en tiempo real"               },
      { url: "/screenshots/fortaleza-npc.png",      alt: "NPC con IA",              caption: "Conversación con un NPC impulsado por Claude AI"  },
    ],
    faq: [
      {
        question: "¿Qué es un ARG (juego de realidad alternativa)?",
        answer: "Un ARG es un juego interactivo que usa el mundo real como plataforma. Las pistas aparecen en sitios web, correos electrónicos, llamadas telefónicas y ubicaciones físicas. La narrativa cruza la frontera entre el juego y la realidad.",
      },
      {
        question: "¿Necesito conocer los juegos cubanos de los 90 para disfrutarlo?",
        answer: "No. ZONA-0 está diseñado para ser accesible a cualquier jugador. Los que conocen los clásicos encontrarán guiños y homenajes. Los que no, descubrirán un género que se perdieron.",
      },
      {
        question: "¿Cómo funciona la economía MOROCOTA?",
        answer: "MOROCOTA es la moneda virtual del universo ZONA-0. Se gana completando misiones, comerciando con otros jugadores y resolviendo puzzles. Puedes usarla para desbloquear contenido, acceder a zonas especiales y comerciar en el mercado interno.",
      },
      {
        question: "¿Los NPCs realmente tienen inteligencia artificial?",
        answer: "Sí. Los NPCs de ZONA-0 están impulsados por Claude AI. Tienen memoria de conversaciones anteriores, personalidades definidas, motivaciones propias y reaccionan al estado del mundo según lo que los jugadores hayan hecho. Ninguna conversación es igual.",
      },
      {
        question: "¿Está disponible fuera de Cuba y LATAM?",
        answer: "ZONA-0 es accesible desde cualquier parte del mundo. Está optimizado para conexiones lentas y funciona como PWA. La narrativa está en español, con plans de expansión al inglés.",
      },
      {
        question: "¿Cómo puedo participar en el early access?",
        answer: "Escríbenos por WhatsApp o completa el formulario de contacto indicando tu interés en FORTALEZA / ZONA-0. Los primeros jugadores en el early access recibirán un paquete de inicio especial con MOROCOTA exclusiva y acceso a zonas beta.",
      },
    ],
    pricing: {
      type: "contact",
      contactText: "FORTALEZA / ZONA-0 está en acceso anticipado. Los primeros jugadores reciben ventajas exclusivas dentro del universo ZONA-0.",
      plans: [],
      note: "Early access disponible. Escríbenos para unirte a la lista.",
    },
    downloadVersion: "1.0.0-beta",
    downloads: [
      {
        label: "Instalar en Windows",
        filename: "FortalezaTerminal-Setup.exe",
        url: import.meta.env.VITE_FORTALEZA_DOWNLOAD_EXE || "#",
        type: "exe",
        platform: "Windows 10 / 11",
        size: "~45 MB",
      },
      {
        label: "Versión portátil (sin instalar)",
        filename: "FortalezaTerminal-Portable.zip",
        url: import.meta.env.VITE_FORTALEZA_DOWNLOAD_ZIP || "#",
        type: "zip",
        platform: "Windows 10 / 11",
        size: "~40 MB",
      },
    ],
  },
  {
    id: "cambalache",
    slug: "cambalache",
    name: "Cambalache",
    tagline: "El marketplace moderno para tu comunidad",
    shortDescription:
      "Plataforma de marketplace de nueva generación para comunidades locales, cámaras de comercio y mercados verticales. Clasificados modernos, IA, chat en tiempo real y monetización integrada.",
    fullDescription:
      "Cambalache es una plataforma de marketplace white-label lista para desplegar en cualquier comunidad, ciudad o nicho. Combina clasificados modernos, inteligencia artificial para optimización automática de anuncios, mensajería en tiempo real entre compradores y vendedores, y múltiples modelos de monetización — todo en una sola solución escalable construida con SolidStart, MongoDB, Redis, Stripe y OpenAI.",
    problem:
      "Las comunidades locales, cámaras de comercio y asociaciones no tienen una solución moderna de marketplace que puedan llamar suya. Las plataformas genéricas no ofrecen control, branding propio ni monetización real. Construir uno desde cero toma meses y cuesta decenas de miles de dólares.",
    solution:
      "Cambalache es un marketplace listo para lanzar. Tu comunidad, tu marca, tu monetización. Con IA integrada, chat en tiempo real y herramientas profesionales para vendedores recurrentes — sin tener que construirlo desde cero.",
    category: "Marketplace",
    tags: ["Marketplace", "Clasificados", "Comunidades", "IA", "Chat en tiempo real", "White-label", "Multi-ciudad", "LATAM"],
    icon: "ShoppingCart",
    colorFrom: "#7C3AED",
    colorTo: "#EC4899",
    accentColor: "#C084FC",
    isHighlighted: true,
    status: "active",
    demoUrl: "https://cambalache.com",
    ctaLabel: "Ver marketplace →",
    features: [
      {
        icon: "Globe",
        title: "Marketplace Completo",
        description: "Publicación de anuncios con imágenes, categorías ilimitadas, búsqueda avanzada, geolocalización, favoritos y perfiles de vendedores con calificaciones y reputación.",
      },
      {
        icon: "Zap",
        title: "Inteligencia Artificial",
        description: "Generación automática de títulos y descripciones, clasificación de categorías, moderación inteligente de contenido, sugerencias de precio y búsqueda semántica avanzada.",
      },
      {
        icon: "MessageCircle",
        title: "Chat en Tiempo Real",
        description: "Mensajería integrada entre compradores y vendedores con indicadores de escritura, estado en línea, notificaciones instantáneas y respuestas sugeridas por IA.",
      },
      {
        icon: "DollarSign",
        title: "Monetización Integrada",
        description: "Anuncios destacados, posicionamiento prioritario en búsquedas y suscripciones Pro, Dealer y Realtor para vendedores frecuentes y profesionales.",
      },
      {
        icon: "BellRing",
        title: "Crecimiento y Retención",
        description: "Alertas de búsqueda, seguimiento de vendedores, notificaciones push, campañas automáticas de email y recomendaciones personalizadas.",
      },
      {
        icon: "Users",
        title: "Multi-ciudad y Multi-nicho",
        description: "Escala a múltiples ciudades, mercados y categorías desde una sola plataforma. Ideal para franquicias, portales regionales y redes de clasificados.",
      },
    ],
    modules: [
      { name: "Marketplace Core",     description: "Anuncios, categorías, búsqueda y geolocalización",    icon: "Globe"          },
      { name: "Motor de IA",          description: "Títulos, descripciones, moderación y precios",         icon: "Zap"            },
      { name: "Chat en Tiempo Real",  description: "Mensajería entre compradores y vendedores",            icon: "MessageCircle"  },
      { name: "Monetización",         description: "Anuncios destacados y suscripciones premium",          icon: "DollarSign"     },
      { name: "Notificaciones",       description: "Push, email y alertas de búsqueda",                    icon: "BellRing"       },
      { name: "Perfiles y Reputación",description: "Calificaciones, reseñas y verificación de vendedores", icon: "Star"           },
      { name: "Panel del Vendedor",   description: "Estadísticas, automatización y herramientas Pro",      icon: "BarChart3"      },
      { name: "Admin & Moderación",   description: "Control de contenido, usuarios y configuración",       icon: "Settings"       },
    ],
    benefits: [
      {
        icon: "Globe",
        title: "Tu marca, tu marketplace",
        description: "White-label completo. Tu comunidad, tu dominio, tu branding. Los usuarios ven tu marca en todo momento.",
        metric: "100% personalizable",
      },
      {
        icon: "Zap",
        title: "IA que trabaja sola",
        description: "Los vendedores publican más rápido y con mejor calidad. La IA genera los textos, sugiere la categoría y el precio. Menos fricción, más anuncios.",
        metric: "IA integrada con OpenAI",
      },
      {
        icon: "DollarSign",
        title: "Monetización desde el día 1",
        description: "Anuncios destacados y suscripciones Pro funcionan desde el primer vendedor recurrente. No necesitas esperar miles de usuarios.",
        metric: "Múltiples fuentes de ingreso",
      },
      {
        icon: "TrendingUp",
        title: "Escala sin límites",
        description: "Empieza con una ciudad, expande a cien. Arquitectura multi-tenant que crece contigo sin costos adicionales de desarrollo.",
        metric: "Multi-ciudad y multi-nicho",
      },
    ],
    useCases: [
      { title: "Comunidades Locales",    description: "Marketplaces de barrio, ciudad o región donde vecinos compran y venden entre sí con confianza.",              industry: "Comunidad"   },
      { title: "Cámaras de Comercio",   description: "Directorio comercial + marketplace para negocios y profesionales afiliados a la cámara.",                    industry: "Asociaciones" },
      { title: "Marketplace de Autos",  description: "Portal para concesionarios y vendedores privados con herramientas Dealer: inventario masivo y gestión de leads.", industry: "Automotriz" },
      { title: "Portal Inmobiliario",   description: "Marketplace de propiedades con captura de leads y automatización para agentes y compañías Realtor.",          industry: "Inmobiliario" },
      { title: "Comunidades Hispanas",  description: "Plataforma en español pensada para la diáspora latina: confianza, comunidad y comercio local.",               industry: "Cultura"      },
      { title: "Redes de Clasificados", description: "Franquicias y portales regionales que operan múltiples mercados desde una sola plataforma.",                  industry: "Media"        },
    ],
    screenshots: [
      { url: "/screenshots/cambalache-home.png",    alt: "Cambalache Home",   caption: "Marketplace principal"                       },
      { url: "/screenshots/cambalache-listing.png", alt: "Anuncio detallado", caption: "Vista de anuncio con chat integrado"          },
      { url: "/screenshots/cambalache-ai.png",      alt: "IA en acción",      caption: "Generación automática de anuncios con IA"     },
    ],
    faq: [
      {
        question: "¿Cambalache es white-label?",
        answer: "Sí. La plataforma se despliega con tu dominio, tu logo y tus colores. Los usuarios ven tu marca, no la nuestra.",
      },
      {
        question: "¿Cómo genera ingresos la plataforma?",
        answer: "Mediante anuncios destacados (vendedores pagan para aparecer primero en búsquedas), suscripciones Pro para vendedores frecuentes, y planes especializados Dealer para autos y Realtor para inmobiliario.",
      },
      {
        question: "¿Qué necesito para lanzar mi marketplace?",
        answer: "Un dominio y decidir el nicho o comunidad. Nosotros manejamos todo el setup técnico. En 2–4 semanas tienes tu marketplace operando con tu branding completo.",
      },
      {
        question: "¿Puede escalar a varias ciudades?",
        answer: "Sí. La arquitectura multi-tenant permite agregar nuevas ciudades, regiones o categorías sin desarrollo adicional. Empieza local y expande cuando quieras.",
      },
      {
        question: "¿Qué tecnologías usa Cambalache?",
        answer: "SolidStart SSR, MongoDB, Redis, OpenAI, Stripe, Twilio, Resend y AWS S3/CloudFront. Stack moderno, escalable y probado en producción.",
      },
      {
        question: "¿Cómo solicito una demo o cotización?",
        answer: "Escríbenos por WhatsApp o usa el formulario de contacto. Te hacemos una demo en vivo con datos reales y preparamos una propuesta según el alcance de tu proyecto.",
      },
    ],
    pricing: {
      type: "contact",
      contactText: "Cambalache es una plataforma personalizada. El precio depende del alcance, número de ciudades, integraciones y nivel de soporte que necesites.",
      note: "Incluye setup, capacitación y soporte. Solicita tu propuesta sin compromiso.",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getHighlightedProducts(): Product[] {
  return products.filter((p) => p.isHighlighted && p.status === "active");
}

export function getWhatsAppUrl(product?: string): string {
  const message = product
    ? `Hola, me interesa saber más sobre ${product}. ¿Pueden darme información?`
    : "Hola, me interesan los servicios de 305 Web Service. ¿Pueden contactarme?";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
