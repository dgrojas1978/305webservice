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
