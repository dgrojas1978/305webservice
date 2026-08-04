/**
 * Digital-card profile system (NFC / QR / link).
 *
 * Modelo reutilizable por diseño (brief §20): un CardProfile separa marca,
 * persona, empresa, conversión y NFC para que futuros perfiles (empleados,
 * Light Specter Film, Perlas del Cielo) cambien tokens y contenido, no código.
 *
 * Solo existe el perfil de EMPRESA "305". No se inventan personas, retratos
 * ni cargos: un perfil personal se añade cuando haya datos verificados.
 */
import {
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_NAME,
  SITE_URL,
  WHATSAPP_NUMBER,
} from "~/lib/site";
import type {
  BusinessReviewConfig,
  CardLocationConfig,
  VCardMediaConfig,
} from "~/lib/cardModules";
import type { CardPaymentsConfig } from "~/lib/cardPayments";

export type CardLocale = "en" | "es";

/**
 * Modalidad estructural de la tarjeta (benchmark maestro 2026-07-28).
 * Todas comparten calidad/arquitectura/contacto/analítica; cada modo cambia
 * CTA, prueba, flujo y módulos:
 *  - professional: Identity → Save Contact → Book/Call → Credentials → Links → Exchange
 *  - business:     Brand → Primary Business Action → Save Contact → Proof → Services → Exchange   (305)
 *  - review:       Brand → Leave a Review → Rating → Location/Call → Social
 *  - commerce:     Brand → Shop Now → Featured Products → Contact → Social
 *  - creator:      Identity → Watch/Discover → Featured Work → Contact/Booking → Social            (LSF futuro)
 *  - nonprofit:    Mission → Donate/Participate → Impact → Contact → Social
 * Solo "business" está implementado (perfil 305). Los demás se construyen
 * cuando exista un negocio real con datos aprobados — no se inventa contenido.
 */
export type CardMode = "professional" | "business" | "review" | "commerce" | "creator" | "nonprofit";

/* ---------------- tipos del sistema ---------------- */

export interface CardBrand {
  /** Wordmark: parte acentuada + resto ("305" + "Web Service"). */
  wordmarkAccent: string;
  wordmarkRest: string;
  /** Activo de logo real (raster) para vCard/compartir. */
  logoUrl: string;
}

/** Datos de persona (solo para tarjetas personales; requiere datos verificados). */
export interface CardPerson {
  name: string;
  role: Record<CardLocale, string>;
  portraitUrl?: string;
  statement?: Record<CardLocale, string>;
}

export interface CardCompany {
  name: string;
  descriptor: Record<CardLocale, string>;
  positioning: Record<CardLocale, string>;
  location: Record<CardLocale, string>;
  website: string;
  websiteDisplay: string;
  /**
   * Contacto directo OPCIONAL. Un tenant que no publica teléfono/correo (p. ej.
   * CN Brandings) no los lleva, y aquí no se inventan: el vCard y las acciones
   * solo los muestran cuando existen.
   */
  phoneTel?: string;
  phoneDisplay?: string;
  whatsappNumber?: string;
  email?: string;
}

export interface CardServiceOption {
  id: string;
  /** id del servicio en el formulario de cotización (content.formServices). */
  formService: string;
  label: Record<CardLocale, string>;
  outcome: Record<CardLocale, string>;
  price: Record<CardLocale, string>;
  ctaLabel: Record<CardLocale, string>;
  /** Ruta del sitio para "ver más" (EN; la ES se deriva en la página). */
  href: string;
}

/** Necesidad del concierge («What are you ready to improve?»). */
export interface CardNeed {
  id: string;
  /** Servicio del selector al que mapea (CardServiceOption.id). */
  serviceId: string;
  label: Record<CardLocale, string>;
  /** Recomendación breve (1 frase). */
  recommendation: Record<CardLocale, string>;
  /** Resultado esperado (1 frase). */
  outcome: Record<CardLocale, string>;
  /** Proyecto real relacionado (key de CardProject) — solo cuando exista. */
  projectKey?: string;
  /** Nota de prueba textual cuando la prueba no es un proyecto (p. ej. esta tarjeta). */
  proofNote?: Record<CardLocale, string>;
  /** Precio inicial SOLO cuando está aprobado. */
  price?: Record<CardLocale, string>;
}

export interface CardProject {
  key: string;
  domain: string;
  url: string;
  img: string;
  industry: Record<CardLocale, string>;
  fact: Record<CardLocale, string>;
  alt: Record<CardLocale, string>;
}

export interface CardConversion {
  quoteHref: string; // EN; ES derivada
  packageHref: string;
  services: CardServiceOption[];
  needs: CardNeed[];
  projects: CardProject[];
}

export interface CardNfc {
  /** Slug público corto; el chip NFC guarda solo https://…/nfc/<slug>. */
  slug: string;
  /** Perfil canónico al que redirige el slug. */
  canonicalPath: string;
  /** Estado documentado (no se bloquea la tarjeta física sin aprobación). */
  status: "draft" | "testing" | "live";
  /**
   * Excluir de buscadores. Se usa cuando la tarjeta ya está publicada para que
   * el cliente la revise pero AÚN NO tiene su aprobación: sigue accesible por
   * enlace directo, pero no se indexa. Se quita al aprobar.
   */
  noindex?: boolean;
  /**
   * Atribución del perfil, congelada en cada toque igual que la de los enlaces
   * de la BD.
   *
   * Sin esto, los toques de los perfiles fijos en código —entre ellos `/c/305`,
   * la URL impresa en NUESTRAS tarjetas— se guardaban sin negocio, sin dueño y
   * sin tarjeta: eran los únicos que no se podían asignar a nadie.
   *
   * `cardId` es el valor por defecto. Como un mismo perfil puede vivir en
   * varias unidades físicas, cada chip puede traer el suyo con `?card=<id>` y
   * ese gana.
   */
  attribution: {
    business: string;
    owner: string;
    cardId: string;
    context: string;
  };
}

/**
 * Configuración de una tarjeta de CLIENTE (tenant con marca propia).
 *
 * El componente `DigitalCard` (concierge de 305: navy/turquesa, proyectos, panel
 * de conversión) es de 305. Un cliente con otra marca —CN Brandings es rojo,
 * tienda primero, sin concierge— se renderiza con `ClientCard` a partir de esto.
 * La ruta elige el renderer según exista `client`. Todo aquí es dato verificado
 * del cliente; sin datos reales, un campo no se pinta.
 */
export interface ClientCardConfig {
  /** Logo raster real del cliente en `public/`. */
  logoUrl: string;
  logoAlt: Record<CardLocale, string>;
  /** Acento de marca del cliente (CN Brandings: rojo). */
  accent: string;
  accentDeep: string;
  availability: Record<CardLocale, string>;
  taglineA: Record<CardLocale, string>;
  taglineB: Record<CardLocale, string>;
  sub: Record<CardLocale, string>;
  /** Acción dominante. Debe apuntar a una ruta REAL verificada. */
  primaryLabel: Record<CardLocale, string>;
  primaryHref: string;
  /** Imagen dominante del hero: producto real del cliente, nunca stock. */
  heroImg: { src: string; alt: Record<CardLocale, string> };
  /** Crops macro del MISMO trabajo real (puntadas, impresión) para el hero. */
  heroCrops?: { src: string; alt: Record<CardLocale, string> }[];
  /** Trabajo real: producto + técnica. Sin clientes ni cifras inventados. */
  work: {
    src: string;
    type: Record<CardLocale, string>;
    method: Record<CardLocale, string>;
    alt: Record<CardLocale, string>;
  }[];
  /** Capacidades con foto real de detalle cuando existe; sin foto, sin inventar. */
  capabilities: {
    title: Record<CardLocale, string>;
    body: Record<CardLocale, string>;
    src?: string;
    alt?: Record<CardLocale, string>;
  }[];
  /** Proceso de pedido, sin promesas de plazo no verificadas. */
  steps: { title: Record<CardLocale, string>; body: Record<CardLocale, string> }[];
  /** Categorías del catálogo real: cada href verificado con HTTP 200. */
  categories: { label: Record<CardLocale, string>; href: string }[];
  credibility: {
    body: Record<CardLocale, string>;
    src?: string;
    alt?: Record<CardLocale, string>;
  };
  instagram?: string;
  /** URL canónica para el QR y "copiar enlace". */
  shareUrl: string;
}


/**
 * Configuracion de una tarjeta PERSONAL con marca propia.
 *
 * `DigitalCard` es el concierge de 305 y `ClientCard` vende un pedido de
 * producto. Ninguno sirve para una persona cuya tarjeta tiene DOS caras -ella
 * y su tienda-, asi que existe este tercer renderer (`PersonCard`).
 * Todo lo de aqui es dato verificado: si un campo no consta, no se pinta.
 */
export interface PersonCardConfig {
  /** Acento de marca. En Mabel es el dorado REAL de EL CLOSET. */
  accent: string;
  accentDeep: string;
  portrait: { src: string; alt: Record<CardLocale, string> };
  /** Frase de impacto, en dos lineas. */
  hookA: Record<CardLocale, string>;
  hookB: Record<CardLocale, string>;
  support: Record<CardLocale, string>;
  /** Accion dominante (la tienda) y accion secundaria (lo profesional). */
  primaryLabel: Record<CardLocale, string>;
  primaryHref: string;
  secondaryLabel: Record<CardLocale, string>;
  secondaryHref: string;
  /** La otra cara de la tarjeta: el negocio de la persona. */
  shop: {
    eyebrow: Record<CardLocale, string>;
    name: string;
    sub: string;
    kind: Record<CardLocale, string>;
    line: Record<CardLocale, string>;
    handle: string;
    href: string;
    /** Logo real del negocio; sin archivo, manda el lockup tipografico. */
    markUrl?: string;
    markAlt?: Record<CardLocale, string>;
    looksTitle: Record<CardLocale, string>;
    looks: { src: string; alt: Record<CardLocale, string> }[];
  };
  productionsEyebrow: Record<CardLocale, string>;
  productions: { title: string; meta: Record<CardLocale, string>; role: Record<CardLocale, string> }[];
  pillars: Record<CardLocale, string>;
  noteEyebrow: Record<CardLocale, string>;
  note: Record<CardLocale, string>;
  /** URL canonica para el QR y copiar enlace. */
  shareUrl: string;
}

export interface CardProfile {
  id: string;
  kind: "company" | "person";
  /** Modalidad estructural (ver CardMode). Define orden de capas y CTA dominante. */
  mode: CardMode;
  /** Módulos opcionales por negocio (reseñas / ubicación / media del vCard). */
  reviews?: BusinessReviewConfig;
  location?: CardLocationConfig;
  vcardMedia?: VCardMediaConfig;
  /** Cómo cobra el negocio. Sin datos reales no se renderiza. */
  payments?: CardPaymentsConfig;
  brand: CardBrand;
  company: CardCompany;
  person?: CardPerson;
  /** Solo tarjetas concierge de 305 (proyectos + necesidades). Los clientes no lo usan. */
  conversion?: CardConversion;
  /** Presente solo en tarjetas de cliente: activa el renderer `ClientCard`. */
  client?: ClientCardConfig;
  /** Presente solo en tarjetas personales: activa el renderer `PersonCard`. */
  personCard?: PersonCardConfig;
  nfc: CardNfc;
}

/* ---------------- perfil «305» (empresa) ---------------- */

export const CARD_305: CardProfile = {
  id: "305",
  kind: "company",
  mode: "business",
  /**
   * Reseñas DESACTIVADAS: 305 no tiene todavía un Google Business Profile
   * verificado, así que no hay Place ID ni URL oficial. No se inventa rating,
   * conteo ni reseñas → el módulo no se renderiza para el visitante.
   * Para activarlo: poner enabled:true + placeId + requestReviewUrl reales.
   */
  reviews: {
    enabled: false,
    provider: "google",
    displayReviews: true,
    maxDisplayedReviews: 3,
    sortDisclosure: "Most relevant",
  },
  /**
   * 305 no publica dirección postal (decisión de negocio ya vigente en el
   * sitio y en el schema): es un negocio de ZONA DE SERVICIO. Las zonas son
   * exactamente lo que la marca ya declara públicamente.
   */
  location: {
    mode: "service-area",
    showExactAddress: false,
    headquartersLabel: "Miami, Florida",
    serviceAreas: [
      { label: "Miami, Florida", kind: "city" },
      { label: "United States (remote)", labelEs: "Estados Unidos (remoto)", kind: "region" },
    ],
  },
  /** vCard de organización con el logo real embebido (PHOTO + LOGO). */
  vcardMedia: {
    kind: "organization",
    logoUrl: "/card/vcard-logo-305.png",
    embedImage: true,
  },
  brand: {
    wordmarkAccent: "305",
    wordmarkRest: "Web Service",
    logoUrl: `${SITE_URL}/icon-512.png`,
  },
  company: {
    name: SITE_NAME,
    descriptor: {
      en: "Websites, Custom Software, NFC & IT Solutions",
      es: "Páginas web, software personalizado, NFC y soluciones informáticas",
    },
    positioning: {
      en: "Technology that helps your business sell, operate and grow.",
      es: "Tecnología que ayuda a tu negocio a vender, operar y crecer.",
    },
    location: {
      en: "Miami, Florida · Serving businesses across the United States",
      es: "Miami, Florida · Servicio a negocios en todo Estados Unidos",
    },
    website: SITE_URL,
    websiteDisplay: "305webservice.com",
    phoneTel: PHONE_TEL,
    phoneDisplay: PHONE_DISPLAY,
    whatsappNumber: WHATSAPP_NUMBER,
    email: CONTACT_EMAIL,
  },
  conversion: {
    quoteHref: "/contact",
    packageHref: "/website-packages",
    services: [
      {
        id: "website", formService: "website-starter",
        label: { en: "Website", es: "Página web" },
        outcome: {
          en: "Build a professional online presence that makes contacting your business easy.",
          es: "Crea una presencia profesional que haga fácil contactar a tu negocio.",
        },
        price: { en: "Starting at $499", es: "Desde $499" },
        ctaLabel: { en: "Start My Website", es: "Empezar mi página web" },
        href: "/website-packages",
      },
      {
        id: "online-store", formService: "online-store",
        label: { en: "Online Store", es: "Tienda en línea" },
        outcome: {
          en: "Make it easier for customers to discover, order and pay online.",
          es: "Haz más fácil descubrir, pedir y pagar en línea.",
        },
        price: { en: "Custom quote", es: "Cotización personalizada" },
        ctaLabel: { en: "Plan My Online Store", es: "Planear mi tienda" },
        href: "/website-packages#online-store",
      },
      {
        id: "custom-software", formService: "custom-software",
        label: { en: "Custom Software", es: "Software a medida" },
        outcome: {
          en: "Replace manual work with software built around your workflow.",
          es: "Reemplaza trabajo manual con software hecho para tu flujo.",
        },
        price: { en: "Scoped proposal", es: "Propuesta con alcance" },
        ctaLabel: { en: "Discuss My Software Idea", es: "Hablar de mi idea" },
        href: "/custom-software",
      },
      {
        id: "automation", formService: "automation",
        label: { en: "Automation", es: "Automatización" },
        outcome: {
          en: "Connect your tools and cut out repetitive manual work.",
          es: "Conecta tus herramientas y elimina trabajo repetitivo.",
        },
        price: { en: "Scoped proposal", es: "Propuesta con alcance" },
        ctaLabel: { en: "Find What We Can Automate", es: "Ver qué automatizar" },
        href: "/automation-integrations",
      },
      {
        id: "nfc", formService: "nfc",
        label: { en: "NFC Business Solutions", es: "Soluciones NFC" },
        outcome: {
          en: "Turn a tap into a contact, review, booking, menu or lead.",
          es: "Convierte un toque en contacto, reseña, reserva, menú o lead.",
        },
        price: { en: "Custom quote", es: "Cotización personalizada" },
        ctaLabel: { en: "Explore NFC Solutions", es: "Explorar NFC" },
        href: "/nfc-business-solutions",
      },
      {
        id: "it", formService: "it-infrastructure",
        label: { en: "IT Infrastructure & Support", es: "Infraestructura y soporte IT" },
        outcome: {
          en: "Keep your business connected, protected and running.",
          es: "Mantén tu negocio conectado, protegido y funcionando.",
        },
        price: { en: "Assessment first", es: "Evaluación primero" },
        ctaLabel: { en: "Request an IT Assessment", es: "Pedir una evaluación" },
        href: "/it-infrastructure",
      },
    ],
    /** Concierge: necesidades del negocio → recomendación + prueba real. */
    needs: [
      {
        id: "win-customers", serviceId: "website",
        label: { en: "Win more customers", es: "Ganar más clientes" },
        recommendation: {
          en: "A professional website that explains what you do and makes contacting you effortless.",
          es: "Una página profesional que explique lo que haces y haga fácil contactarte.",
        },
        outcome: {
          en: "More calls, messages and quote requests from people already searching.",
          es: "Más llamadas, mensajes y cotizaciones de gente que ya te busca.",
        },
        projectKey: "aguiar",
        price: { en: "Websites from $499", es: "Webs desde $499" },
      },
      {
        id: "sell-online", serviceId: "online-store",
        label: { en: "Sell online", es: "Vender en línea" },
        recommendation: {
          en: "A store, catalog or subscription flow built around your products and how you charge.",
          es: "Una tienda, catálogo o flujo de suscripción hecho para tus productos y tu forma de cobrar.",
        },
        outcome: {
          en: "Customers can discover, order and pay without calling you first.",
          es: "Tus clientes descubren, piden y pagan sin tener que llamarte primero.",
        },
        projectKey: "polkanea",
      },
      {
        id: "automate", serviceId: "automation",
        label: { en: "Automate operations", es: "Automatizar operaciones" },
        recommendation: {
          en: "Connect the tools you already use and remove the repetitive manual steps.",
          es: "Conecta las herramientas que ya usas y elimina los pasos manuales repetitivos.",
        },
        outcome: {
          en: "Fewer errors, faster follow-ups and hours back every week.",
          es: "Menos errores, seguimiento más rápido y horas recuperadas cada semana.",
        },
      },
      {
        id: "custom-software", serviceId: "custom-software",
        label: { en: "Build custom software", es: "Crear software a medida" },
        recommendation: {
          en: "Portals, dashboards and platforms designed around your exact workflow.",
          es: "Portales, dashboards y plataformas diseñadas para tu flujo exacto.",
        },
        outcome: {
          en: "Software that fits your business — instead of forcing your business to fit software.",
          es: "Software que se adapta a tu negocio — y no al revés.",
        },
        projectKey: "polkanea",
      },
      {
        id: "nfc-experience", serviceId: "nfc",
        label: { en: "Create an NFC experience", es: "Crear una experiencia NFC" },
        recommendation: {
          en: "Cards, stands and tags that turn one tap into a contact, review, menu or lead.",
          es: "Tarjetas, stands y tags que convierten un toque en contacto, reseña, menú o lead.",
        },
        outcome: {
          en: "Every in-person encounter becomes a saved contact or a next step.",
          es: "Cada encuentro en persona se convierte en contacto guardado o siguiente paso.",
        },
        proofNote: {
          en: "You're using one right now — this card is a live NFC experience by 305.",
          es: "Estás usando una ahora mismo — esta tarjeta es una experiencia NFC de 305.",
        },
      },
      {
        id: "it", serviceId: "it",
        label: { en: "Improve IT infrastructure", es: "Mejorar la infraestructura IT" },
        recommendation: {
          en: "Networks, cloud tools, backups and support your team can rely on.",
          es: "Redes, nube, respaldos y soporte en los que tu equipo pueda confiar.",
        },
        outcome: {
          en: "Your business stays connected, protected and running.",
          es: "Tu negocio se mantiene conectado, protegido y funcionando.",
        },
      },
    ],
    /** Proyectos reales, los 4 APROBADOS para exhibición (2026-07-27). */
    projects: [
      {
        key: "aguiar", domain: "aguiarflooring.com", url: "https://aguiarflooring.com", img: "/work/aguiar.jpg",
        industry: { en: "Flooring & remodeling", es: "Pisos y remodelación" },
        fact: {
          en: "Product catalog + quote generation",
          es: "Catálogo de productos + cotizaciones",
        },
        alt: {
          en: "aguiarflooring.com — flooring company website built by 305 Web Service",
          es: "aguiarflooring.com — web de pisos construida por 305 Web Service",
        },
      },
      {
        key: "lsf", domain: "lightspecterfilm.com", url: "https://lightspecterfilm.com", img: "/work/lsf.jpg",
        industry: { en: "Film & production", es: "Cine y producción" },
        fact: {
          en: "Cinematic brand and lead experience",
          es: "Marca cinematográfica y captación de leads",
        },
        alt: {
          en: "lightspecterfilm.com — film production website built by 305 Web Service",
          es: "lightspecterfilm.com — web de producción de cine construida por 305 Web Service",
        },
      },
      {
        key: "polkanea", domain: "polkaneaproductions.com", url: "https://polkaneaproductions.com", img: "/work/polkanea.jpg",
        industry: { en: "Streaming platform", es: "Plataforma de streaming" },
        fact: {
          en: "Subscription streaming platform",
          es: "Plataforma de streaming por suscripción",
        },
        alt: {
          en: "polkaneaproductions.com — streaming platform built by 305 Web Service",
          es: "polkaneaproductions.com — plataforma de streaming construida por 305 Web Service",
        },
      },
      {
        key: "cosme", domain: "cosmeproenza.com", url: "https://cosmeproenza.com", img: "/work/cosme.jpg",
        industry: { en: "Arts & culture", es: "Arte y cultura" },
        fact: {
          en: "Digital art archive",
          es: "Archivo digital de arte",
        },
        alt: {
          en: "cosmeproenza.com — art archive website built by 305 Web Service",
          es: "cosmeproenza.com — web de archivo de arte construida por 305 Web Service",
        },
      },
    ],
  },
  payments: {
    enabled: true,
    zelle: {
      enabled: true,
      /**
       * Tal cual lo muestra el banco, EN MAYÚSCULAS incluidas. Es el texto que
       * el cliente tiene que reconocer en su propia app antes de enviar; si
       * aquí se "arregla" a Daniel González Rojas, deja de coincidir y el
       * cotejo —lo único que impide que el dinero acabe en otra cuenta— pierde
       * su sentido.
       */
      recipientName: "DANIEL GONZALEZ ROJAS",
      phone: "305-833-2984",
      /**
       * QR emitido por el banco, recortado de su pantalla y con zona de
       * silencio añadida. NO está generado aquí: decodifica a
       * `enroll.zellepay.com/qr-codes?data=…` con el token 3058332984, el mismo
       * teléfono de arriba, y el recorte decodifica idéntico al original.
       */
      qrImage: "/card/zelle-qr-305.png",
      /** Lo que ese QR lleva dentro. Un botón evita tener que escanearlo. */
      zelleUrl: "https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiREFOSUVMIiwidG9rZW4iOiIzMDU4MzMyOTg0In0=",
    },
    // Venmo, Cash App y PayPal sin datos: no se renderizan.
  },
  nfc: {
    slug: "305",
    canonicalPath: "/card/305",
    status: "draft", // no bloquear tarjetas físicas hasta aprobar el destino
    attribution: {
      business: "305 Web Service",
      owner: "Daniel Gonzalez",
      // Vacío a propósito: hay más de una unidad física con esta URL. Cada chip
      // trae el suyo en `?card=<UID>`; poner uno fijo aquí las mezclaría todas.
      cardId: "",
      context: "",
    },
  },
};

/* ---------------- tenant de cliente: CN Brandings ---------------- */

/**
 * CN Brandings (Custom Nation LLC) — tienda de ropa personalizada y branding en
 * el sur de Florida. Tenant con marca PROPIA (rojo), se renderiza con
 * `ClientCard`, no con el concierge de 305.
 *
 * TODO lo de aquí está verificado en cnbrandings.com (jul 2026): nombre legal,
 * tagline, servicios (About), región, logo (asset del sitio) e Instagram. El
 * sitio NO publica teléfono, correo ni dirección postal → no se inventan: la
 * acción dominante es su tienda y el canal directo es Instagram. Sin proyectos
 * ni concierge ni cobros: CN no los tiene en nuestro sistema.
 */
export const CARD_CNBRANDINGS: CardProfile = {
  id: "cnbrandings",
  kind: "company",
  mode: "business",
  brand: {
    wordmarkAccent: "CN",
    wordmarkRest: "BRANDINGS",
    logoUrl: "/card/cn-brandings-logo.png",
  },
  company: {
    name: "CN Brandings",
    descriptor: {
      en: "Custom Nation · Brand Solutions",
      es: "Custom Nation · Soluciones de marca",
    },
    positioning: {
      en: "Custom apparel, embroidery and printing for South Florida.",
      es: "Ropa personalizada, bordado y estampado en el sur de Florida.",
    },
    location: { en: "South Florida", es: "Sur de Florida" },
    website: "https://cnbrandings.com",
    websiteDisplay: "cnbrandings.com",
    // Sin teléfono, correo ni WhatsApp: el sitio no los publica.
  },
  client: {
    logoUrl: "/card/cn-brandings-logo.png",
    logoAlt: {
      en: "CN Brandings — Custom Nation, Brand Solutions",
      es: "CN Brandings — Custom Nation, Soluciones de marca",
    },
    accent: "#c12026",
    accentDeep: "#a81b21",
    availability: {
      en: "South Florida · Custom Apparel & Brand Solutions",
      es: "Sur de la Florida · Ropa personalizada y soluciones de marca",
    },
    taglineA: { en: "Make your brand", es: "Haga que su marca" },
    taglineB: { en: "impossible to miss.", es: "sea imposible de ignorar." },
    sub: {
      en: "Custom apparel and branded products created for businesses, schools, teams and growing organizations.",
      es: "Prendas y productos personalizados para empresas, escuelas, equipos y organizaciones en crecimiento.",
    },
    /**
     * Acción de CATÁLOGO (secundaria desde ago 2026): /products verificado 200.
     * La acción primaria es «Request a quote», que abre el formulario propio de
     * cotización — con backend real en 305 (colección leads), no un enlace roto
     * al placeholder de contacto del sitio de CN.
     */
    primaryLabel: { en: "Explore apparel", es: "Explorar prendas" },
    primaryHref: "https://cnbrandings.com/products",
    /** Emblema bordándose en el bastidor — el bordado es la especialidad de CN. */
    heroImg: {
      src: "/card/cn/hero.jpg",
      alt: {
        en: "A Sheriff's Office emblem being embroidered in the hoop at CN Brandings",
        es: "Un emblema del Sheriff bordándose en el bastidor en CN Brandings",
      },
    },
    /**
     * Los dos crops del hero muestran técnicas y productos DISTINTOS a la
     * imagen grande (bordado en bastidor): un estampado multicolor y una gorra
     * de marca comercial bordada. Así el primer viewport no parece un
     * especialista en placas policiales — demuestra bordado + estampado +
     * headwear, todo trabajo real.
     */
    heroCrops: [
      {
        src: "/card/cn/hero-detail-print.jpg",
        alt: {
          en: "Multi-color printed design on a heather t-shirt",
          es: "Diseño estampado multicolor sobre una camiseta jaspeada",
        },
      },
      {
        src: "/card/cn/hero-detail-cap.jpg",
        alt: {
          en: "Embroidered brand cap on the embroidery machine, thread cones behind",
          es: "Gorra de marca bordada sobre la máquina de bordar, con conos de hilo detrás",
        },
      },
    ],
    /* Trabajo real del carrusel público «What Our Clients Have Done» de
       cnbrandings.com. Etiquetado por producto y técnica; los nombres visibles
       en las fotos los publicó CN en su propio portafolio. */
    work: [
      {
        src: "/card/cn/work-emblem.jpg",
        type: { en: "Embroidered emblems", es: "Emblemas bordados" },
        method: { en: "In-hoop embroidery", es: "Bordado en bastidor" },
        alt: {
          en: "Agency emblem being embroidered in the hoop at CN Brandings",
          es: "Emblema institucional bordándose en bastidor en CN Brandings",
        },
      },
      {
        src: "/card/cn/work-event.jpg",
        type: { en: "Event t-shirts", es: "Camisetas de evento" },
        method: { en: "Multi-color printing", es: "Estampado multicolor" },
        alt: {
          en: "Centennial event t-shirt with multi-color front print",
          es: "Camiseta conmemorativa con estampado frontal multicolor",
        },
      },
      {
        src: "/card/cn/work-tee.jpg",
        type: { en: "Printed tees", es: "Camisetas estampadas" },
        method: { en: "Chest logo print", es: "Estampado de logo al pecho" },
        alt: {
          en: "Heather t-shirt with printed circular chest logo",
          es: "Camiseta jaspeada con logo circular estampado al pecho",
        },
      },
      {
        src: "/card/cn/work-polo.jpg",
        type: { en: "Staff polos", es: "Polos de uniforme" },
        method: { en: "Embroidery", es: "Bordado" },
        alt: {
          en: "Navy uniform polo with embroidered county seal and lettering",
          es: "Polo de uniforme azul marino con escudo y texto bordados",
        },
      },
    ],
    capabilities: [
      {
        title: { en: "Custom apparel", es: "Ropa personalizada" },
        body: {
          en: "T-shirts, polos, woven shirts, fleece, headwear and uniforms selected around the people, event and brand.",
          es: "Camisetas, polos, camisas, sudaderas, prendas de abrigo, gorras y uniformes seleccionados según las necesidades del equipo, el evento y la marca.",
        },
        src: "/card/cn/cap-apparel.jpg",
        alt: {
          en: "Black tactical polo with embroidered support-team patch",
          es: "Polo táctico negro con parche de equipo bordado",
        },
      },
      {
        title: { en: "Embroidery & printing", es: "Bordado y estampado" },
        body: {
          en: "Embroidery, screen printing and DTF production developed for clear, consistent brand reproduction.",
          es: "Bordado, serigrafía y producción DTF para una reproducción de marca clara y consistente.",
        },
        src: "/card/cn/cap-embroidery.jpg",
        alt: {
          en: "Multi-color police badge embroidery in the hoop",
          es: "Bordado multicolor de placa policial en bastidor",
        },
      },
      {
        // Sin foto: no hay imagen verificada de productos promocionales y no se
        // presenta stock como trabajo de CN.
        title: { en: "Promotional products", es: "Productos promocionales" },
        body: {
          en: "Branded accessories and practical promotional items designed to extend the identity beyond apparel.",
          es: "Accesorios de marca y artículos promocionales prácticos que llevan la identidad más allá de la ropa.",
        },
      },
    ],
    steps: [
      {
        title: { en: "Choose", es: "Elija" },
        body: {
          en: "Select the apparel or product.",
          es: "Seleccione la prenda o el producto.",
        },
      },
      {
        title: { en: "Customize", es: "Personalice" },
        body: {
          en: "Provide the artwork, colors and requirements.",
          es: "Comparta el diseño, los colores y los requisitos.",
        },
      },
      {
        title: { en: "Approve", es: "Apruebe" },
        body: {
          en: "Review placement and the production proof.",
          es: "Revise la ubicación y la prueba de producción.",
        },
      },
      {
        title: { en: "Produce", es: "Producimos" },
        body: {
          en: "The approved order moves into production.",
          es: "El pedido aprobado pasa a producción.",
        },
      },
    ],
    /* Categorías reales del sitio; cada href respondió HTTP 200 (ago 2026). */
    categories: [
      { label: { en: "T-Shirts", es: "Camisetas" }, href: "https://cnbrandings.com/category/t-shirts" },
      { label: { en: "Polos & Knits", es: "Polos y tejidos" }, href: "https://cnbrandings.com/category/polos-knits" },
      { label: { en: "Woven / Dress Shirts", es: "Camisas" }, href: "https://cnbrandings.com/category/woven-dress-shirts" },
      { label: { en: "Sweatshirts & Fleece", es: "Sudaderas y abrigo" }, href: "https://cnbrandings.com/category/sweatshirts-fleece" },
      { label: { en: "Headwear", es: "Gorras" }, href: "https://cnbrandings.com/category/headwears" },
      { label: { en: "Accessories", es: "Accesorios" }, href: "https://cnbrandings.com/category/accessories" },
    ],
    credibility: {
      body: {
        en: "Every approved order is handled with attention to placement, color, consistency and final presentation.",
        es: "Cada pedido aprobado se trabaja cuidando la ubicación, el color, la consistencia y la presentación final.",
      },
      src: "/card/cn/shop.jpg",
      alt: {
        en: "A finished cap with an embroidered brand logo, thread cones in the shop behind",
        es: "Una gorra terminada con el logo de marca bordado, con conos de hilo del taller detrás",
      },
    },
    instagram: "https://www.instagram.com/cnbrandings/",
    shareUrl: "https://www.305webservice.com/c/cnbrandings",
  },
  nfc: {
    slug: "cnbrandings",
    canonicalPath: "/card/cnbrandings",
    status: "draft",
    attribution: {
      business: "CN Brandings",
      owner: "CN Brandings",
      cardId: "",
      context: "",
    },
  },
};


/* ---------------- perfil «Mabel Toledo» (persona) ---------------- */

/**
 * Productora ejecutiva y empresaria (Miami). La tarjeta tiene dos caras:
 * ella y EL CLOSET, su tienda de ropa.
 *
 * Verificado: creditos de Farandula (2023) y Mirame Asi; LinkedIn publico;
 * Instagram @elcloset226 con su categoria y su biografia literal.
 * NO se afirma antiguedad, volumen, envios, ubicacion fisica ni catalogo de la
 * tienda -tiene 12 publicaciones-; tampoco telefono ni correo, porque no hay
 * canal directo confirmado: «Message» va a su LinkedIn.
 */
export const CARD_MABEL: CardProfile = {
  id: "mabel-toledo",
  kind: "person",
  mode: "creator",
  brand: {
    wordmarkAccent: "Mabel",
    wordmarkRest: "Toledo",
    logoUrl: "/card/mabel/portrait.jpg",
  },
  person: {
    name: "Mabel Toledo",
    role: { en: "Executive Producer \u00b7 Entrepreneur", es: "Productora ejecutiva \u00b7 Empresaria" },
    portraitUrl: "/card/mabel/portrait.jpg",
    statement: { en: "Vision, brought to life.", es: "Visi\u00f3n que cobra vida." },
  },
  company: {
    name: "Mabel Toledo",
    descriptor: { en: "Executive Producer \u00b7 Entrepreneur", es: "Productora ejecutiva \u00b7 Empresaria" },
    positioning: {
      en: "Executive producer and entrepreneur in Miami \u2014 film, media and EL CLOSET Shop.",
      es: "Productora ejecutiva y empresaria en Miami \u2014 cine, medios y EL CLOSET Shop.",
    },
    location: { en: "Miami, Florida", es: "Miami, Florida" },
    website: SITE_URL + "/card/mabel-toledo",
    websiteDisplay: "305webservice.com/card/mabel-toledo",
  },
  vcardMedia: { kind: "person", logoUrl: "/card/mabel/portrait.jpg", embedImage: true },
  personCard: {
    accent: "#D4AF37",
    accentDeep: "#B8942C",
    portrait: {
      src: "/card/mabel/portrait.jpg",
      alt: { en: "Portrait of Mabel Toledo", es: "Retrato de Mabel Toledo" },
    },
    hookA: { en: "Vision,", es: "Visi\u00f3n que" },
    hookB: { en: "brought to life.", es: "cobra vida." },
    support: {
      en: "Turning vision into productions, partnerships and opportunity.",
      es: "Convirtiendo visi\u00f3n en producciones, alianzas y oportunidades.",
    },
    primaryLabel: { en: "Shop EL CLOSET", es: "Ver EL CLOSET" },
    primaryHref: "https://www.instagram.com/elcloset226/",
    secondaryLabel: { en: "Discuss an opportunity", es: "Conversemos sobre una oportunidad" },
    secondaryHref: "https://www.linkedin.com/in/mabel-toledo-43080a16",
    shop: {
      eyebrow: { en: "The shop", es: "La tienda" },
      name: "EL CLOSET",
      sub: "Shop",
      kind: { en: "Clothing", es: "Ropa y accesorios" },
      line: {
        en: "Ladies modern, fresh and elegant clothing and accessories. Limited items for men.",
        es: "Ropa para damas y accesorios. Algunas piezas para caballeros.",
      },
      handle: "@elcloset226",
      href: "https://www.instagram.com/elcloset226/",
      markUrl: "/card/mabel/elcloset-mark.png",
      markAlt: { en: "EL CLOSET Shop", es: "EL CLOSET Shop" },
      looksTitle: { en: "From the shop", es: "De la tienda" },
      /* Imagenes del propio perfil de la tienda; autorizacion del proveedor
         confirmada por el cliente. Techo del grid publico: 640 px. */
      looks: [
        { src: "/card/mabel/looks/look-1.jpg", alt: { en: "Blue and white striped kaftan", es: "Kaft\u00e1n de rayas azul y blanco" } },
        { src: "/card/mabel/looks/look-2.jpg", alt: { en: "Blue print matching set", es: "Conjunto estampado en azul" } },
        { src: "/card/mabel/looks/look-3.jpg", alt: { en: "Black crochet dress", es: "Vestido negro de crochet" } },
        { src: "/card/mabel/looks/look-4.jpg", alt: { en: "Green off-shoulder set", es: "Conjunto verde de hombros descubiertos" } },
        { src: "/card/mabel/looks/look-5.jpg", alt: { en: "Floral off-shoulder set", es: "Conjunto floral de hombros descubiertos" } },
        { src: "/card/mabel/looks/look-6.jpg", alt: { en: "Printed shirt and linen trousers for men", es: "Camisa estampada y pantal\u00f3n de lino para caballero" } },
      ],
    },
    productionsEyebrow: { en: "Selected productions", es: "Producciones seleccionadas" },
    productions: [
      {
        title: "Far\u00e1ndula, la pel\u00edcula",
        meta: { en: "2023 \u00b7 Feature film \u00b7 Dir. Jazz Vil\u00e1", es: "2023 \u00b7 Largometraje \u00b7 Dir. Jazz Vil\u00e1" },
        role: { en: "Executive Producer \u2014 ALIN Entertainment", es: "Productora ejecutiva \u2014 ALIN Entertainment" },
      },
      {
        title: "M\u00edrame As\u00ed",
        meta: { en: "Comedy \u00b7 Dir. H\u00e9ctor M\u00e1rquez \u00b7 Filmed in Miami", es: "Comedia \u00b7 Dir. H\u00e9ctor M\u00e1rquez \u00b7 Filmada en Miami" },
        role: { en: "Executive Production", es: "Producci\u00f3n ejecutiva" },
      },
    ],
    pillars: { en: "Vision \u00b7 Production \u00b7 Partnerships", es: "Visi\u00f3n \u00b7 Producci\u00f3n \u00b7 Alianzas" },
    noteEyebrow: { en: "A brief note", es: "Una nota breve" },
    note: {
      en: "I work where film, media and business meet \u2014 recognizing potential early, producing it with discipline, and building the partnerships that carry a project further. Recent credits include Far\u00e1ndula, la pel\u00edcula and M\u00edrame As\u00ed.",
      es: "Trabajo donde se encuentran el cine, los medios y los negocios: reconozco el potencial a tiempo, lo produzco con disciplina y construyo las alianzas que llevan cada proyecto m\u00e1s lejos. Mis cr\u00e9ditos recientes incluyen Far\u00e1ndula, la pel\u00edcula y M\u00edrame As\u00ed.",
    },
    shareUrl: SITE_URL + "/card/mabel-toledo",
  },
  nfc: {
    slug: "mabel-toledo",
    canonicalPath: "/card/mabel-toledo",
    status: "draft",
    // Publicada para revisión de Mabel; sin su aprobación no se indexa.
    noindex: true,
    attribution: {
      business: "Mabel Toledo",
      owner: "Mabel Toledo",
      cardId: "",
      context: "",
    },
  },
};

/** Registro de perfiles publicables. Futuros perfiles se agregan aquí. */
export const CARD_PROFILES: Record<string, CardProfile> = {
  [CARD_305.id]: CARD_305,
  [CARD_CNBRANDINGS.id]: CARD_CNBRANDINGS,
  [CARD_MABEL.id]: CARD_MABEL,
};

/* ---------------- copy de la tarjeta (EN/ES, brief §25–26) ---------------- */

export const CARD_COPY = {
  en: {
    langLabel: "Language",
    hero: {
      eyebrow: "Miami-based technology partner",
      avail: "Miami · Available for projects",
      headline: "Technology that moves you forward.",
      sub: "Websites, custom software and connected experiences — built around your business.",
      proof: ["Real projects", "English & Spanish", "Direct support"],
      ctaPrimary: "Start a Project",
      ctaSave: "Save Contact",
      viewProject: "View Project",
      quick: { whatsapp: "WhatsApp", call: "Call", share: "Share" },
    },
    /** Conversion Panel: el panel derecho VENDE (no comparte). */
    convertPanel: {
      eyebrow: "Your next move",
      heading: "Let's build what your business needs next.",
      sub: "Tell us what you want to improve. We'll recommend a practical solution and a clear next step.",
      outcomes: [
        "Look more professional",
        "Turn more visitors into customers",
        "Operate with less manual work",
      ],
      trust: "English & Spanish · Direct communication · Clear project scope",
      price: "Professional websites from $499. Custom solutions quoted by scope.",
    },
    /** Mensaje precargado de WhatsApp (localizado). */
    waMessage: "Hi 305 Web Service, I'd like to discuss a project for my business.",
    more: "More",
    reviews: {
      heading: "Trusted by customers",
      basedOn: "Based on {count} Google reviews",
      read: "Read Google Reviews",
      leave: "Leave a Google Review",
      sortRelevance: "Reviews shown are ordered by relevance from Google Maps.",
      sortNewest: "Reviews shown are ordered newest first from Google Maps.",
      source: "Reviews from Google",
      viewOnGoogle: "View on Google Maps",
      translated: "Translated by Google",
      stars: "{rating} out of 5",
    },
    location: {
      heading: "Where we work",
      visit: "Visit us",
      serviceArea: "Service area",
      alsoServe: "We also serve",
      directions: "Get directions",
      call: "Call",
      hours: "Hours",
      appointment: "Appointment required",
      checkArea: "Check availability in your area",
      nearest: "Find nearest location",
      selectLocation: "Choose a location",
      basedIn: "Based in",
    },
    shareCopied: "Link copied",
    ribbon: ["Websites from $499", "Custom solutions", "Miami based", "Nationwide service"],
    concierge: {
      heading: "What are you ready to improve?",
      proofLabel: "Related project",
      cta: "Start a Project",
    },
    work: {
      heading: "Built for real businesses.",
      sub: "Selected custom projects by 305 Web Service.",
      note: "Features, scope and pricing vary by project.",
      visit: "Visit site",
      prev: "Previous project",
      next: "Next project",
    },
    convert: {
      heading: "Let's find the right solution for your business.",
      ctaPrimary: "Start a Project",
      ctaWhatsApp: "Chat on WhatsApp",
      note: "Professional websites start at $499. Custom solutions are quoted by scope.",
    },
    exchange: {
      cta: "Share Your Contact",
      explain: "Send your details securely so 305 can follow up.",
    },
    payments: {
      heading: "Payment",
      open: "Pay",
      sheetTitle: "How to pay",
      close: "Close",
      recipient: "Send only to",
      /** Lo único que impide que el dinero acabe en otra cuenta. */
      verify: "Before sending, confirm your bank shows the recipient name:",
      irreversible: "A transfer to an enrolled recipient usually cannot be cancelled. Only pay people and businesses you know.",
      copy: "Copy",
      copied: "Copied",
      saveContact: "Save contact",
      payWithZelle: "Find your bank on Zelle",
      /** Medido: la pagina de Zelle NO enseña el destinatario, solo lista bancos. */
      payWithZelleHelp: "Zelle's page only asks which bank you use — it won't fill in the number for you. Copy it first, then paste it in your bank's app.",
      showQr: "Show QR for another device",
      hideQr: "Hide QR",
      qrHelp: "Scan this with your bank app from a DIFFERENT phone and it fills in the recipient. On this phone, copy the number instead.",
      qrIssued: "QR issued by the recipient's bank.",
      openApp: "Open",
      zelleHow: "Zelle works inside your own bank's app.",
    },
    share: {
      heading: "Share this card",
      copy: "Copy link",
      native: "Share",
      qrText: "Scan to open this card",
      saveContact: "Save contact",
      links: [
        { label: "Website", href: "/" },
        { label: "Website Packages", href: "/website-packages" },
        { label: "Custom Software", href: "/custom-software" },
        { label: "NFC Solutions", href: "/nfc-business-solutions" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
    sheet: {
      titleProject: "Start a project",
      titleExchange: "Share your contact",
      step1: "Step 1 of 2",
      step2: "Step 2 of 2",
      name: "Name",
      method: "Preferred contact method",
      methods: { whatsapp: "WhatsApp", call: "Phone call", email: "Email" },
      need: "What do you need?",
      selectNeed: "Select an option",
      continue: "Continue",
      back: "Back",
      company: "Company",
      optional: "optional",
      email: "Email",
      phone: "Phone",
      message: "Short message",
      consent: "I agree to be contacted about my request. See our",
      privacy: "privacy policy",
      submit: "Send",
      sending: "Sending…",
      close: "Close",
      success: {
        title: "Thanks—your information was received.",
        text: "We'll follow up shortly. You can also continue right now:",
        whatsapp: "Continue on WhatsApp",
        back: "Back to the card",
      },
      errors: {
        required: "Please complete your name, contact method and what you need.",
        email: "Please enter a valid email address.",
        phone: "Please enter a phone number so we can reach you.",
        consent: "Please accept the consent checkbox so we can contact you.",
        server: "We could not send your information. Please try again or use WhatsApp.",
      },
    },
    barStart: "Start",
    barSave: "Save",
    footerNote: "Digital card by 305 Web Service — the same kind we build for businesses.",
  },
  es: {
    langLabel: "Idioma",
    hero: {
      eyebrow: "Tu socio tecnológico en Miami",
      avail: "Miami · Disponible para proyectos",
      headline: "Tecnología que te impulsa.",
      sub: "Sitios web, software a medida y experiencias conectadas — hechos para tu negocio.",
      proof: ["Proyectos reales", "Español e inglés", "Atención directa"],
      ctaPrimary: "Empezar un proyecto",
      ctaSave: "Guardar contacto",
      viewProject: "Ver proyecto",
      quick: { whatsapp: "WhatsApp", call: "Llamar", share: "Compartir" },
    },
    /** Conversion Panel: el panel derecho VENDE (no comparte). */
    convertPanel: {
      eyebrow: "Tu siguiente paso",
      heading: "Construyamos lo que tu negocio necesita ahora.",
      sub: "Cuéntanos qué quieres mejorar. Te recomendamos una solución práctica y un siguiente paso claro.",
      outcomes: [
        "Verte más profesional",
        "Convertir más visitas en clientes",
        "Operar con menos trabajo manual",
      ],
      trust: "Español e inglés · Comunicación directa · Alcance claro",
      price: "Páginas web profesionales desde $499. Soluciones a medida cotizadas por alcance.",
    },
    /** Mensaje precargado de WhatsApp (localizado). */
    waMessage: "Hola 305 Web Service, quisiera conversar sobre un proyecto para mi negocio.",
    more: "Más",
    reviews: {
      heading: "La confianza de nuestros clientes",
      basedOn: "Basado en {count} reseñas de Google",
      read: "Ver reseñas en Google",
      leave: "Dejar una reseña en Google",
      sortRelevance: "Las reseñas se muestran por relevancia desde Google Maps.",
      sortNewest: "Las reseñas se muestran de más recientes a más antiguas desde Google Maps.",
      source: "Reseñas de Google",
      viewOnGoogle: "Ver en Google Maps",
      translated: "Traducido por Google",
      stars: "{rating} de 5",
    },
    location: {
      heading: "Dónde trabajamos",
      visit: "Visítanos",
      serviceArea: "Zona de servicio",
      alsoServe: "También atendemos",
      directions: "Cómo llegar",
      call: "Llamar",
      hours: "Horario",
      appointment: "Con cita previa",
      checkArea: "Consultar disponibilidad en tu zona",
      nearest: "Encontrar la ubicación más cercana",
      selectLocation: "Elige una ubicación",
      basedIn: "Con base en",
    },
    shareCopied: "Enlace copiado",
    ribbon: ["Webs desde $499", "Soluciones a medida", "Base en Miami", "Servicio nacional"],
    concierge: {
      heading: "¿Qué estás listo para mejorar?",
      proofLabel: "Proyecto relacionado",
      cta: "Empezar un proyecto",
    },
    work: {
      heading: "Construido para negocios reales.",
      sub: "Proyectos personalizados seleccionados de 305 Web Service.",
      note: "Las funciones, el alcance y el precio varían según el proyecto.",
      visit: "Ver sitio",
      prev: "Proyecto anterior",
      next: "Proyecto siguiente",
    },
    convert: {
      heading: "Encontremos la solución correcta para tu negocio.",
      ctaPrimary: "Empezar un proyecto",
      ctaWhatsApp: "Chatear por WhatsApp",
      note: "Las páginas web profesionales empiezan en $499. Las soluciones a medida se cotizan por alcance.",
    },
    exchange: {
      cta: "Compartir mis datos",
      explain: "Envía tus datos de forma segura para que 305 te dé seguimiento.",
    },
    payments: {
      heading: "Pago",
      open: "Pagar",
      sheetTitle: "Cómo pagar",
      close: "Cerrar",
      recipient: "Envía solo a",
      verify: "Antes de enviar, confirma que tu banco muestra este nombre:",
      irreversible: "Una transferencia a un destinatario inscrito normalmente no se puede cancelar. Paga solo a personas y negocios que conozcas.",
      copy: "Copiar",
      copied: "Copiado",
      saveContact: "Guardar contacto",
      payWithZelle: "Busca tu banco en Zelle",
      payWithZelleHelp: "La página de Zelle solo pregunta qué banco usas — no rellena el número por ti. Cópialo antes y pégalo en la app de tu banco.",
      showQr: "Ver QR para otro dispositivo",
      hideQr: "Ocultar QR",
      qrHelp: "Escanéalo con la app de tu banco desde OTRO teléfono y rellena el destinatario. En este teléfono, copia el número.",
      qrIssued: "QR emitido por el banco del destinatario.",
      openApp: "Abrir",
      zelleHow: "Zelle funciona dentro de la app de tu propio banco.",
    },
    share: {
      heading: "Compartir esta tarjeta",
      copy: "Copiar enlace",
      native: "Compartir",
      qrText: "Escanea para abrir esta tarjeta",
      saveContact: "Guardar contacto",
      links: [
        { label: "Sitio web", href: "/es" },
        { label: "Paquetes web", href: "/es/paquetes-web" },
        { label: "Software a medida", href: "/es/software-a-medida" },
        { label: "Soluciones NFC", href: "/es/soluciones-nfc" },
        { label: "Privacidad", href: "/es/privacidad" },
      ],
    },
    sheet: {
      titleProject: "Empezar un proyecto",
      titleExchange: "Compartir mis datos",
      step1: "Paso 1 de 2",
      step2: "Paso 2 de 2",
      name: "Nombre",
      method: "¿Cómo prefieres que te contactemos?",
      methods: { whatsapp: "WhatsApp", call: "Llamada", email: "Correo" },
      need: "¿Qué necesitas?",
      selectNeed: "Elige una opción",
      continue: "Continuar",
      back: "Atrás",
      company: "Empresa",
      optional: "opcional",
      email: "Correo",
      phone: "Teléfono",
      message: "Mensaje corto",
      consent: "Acepto que me contacten sobre mi solicitud. Ver la",
      privacy: "política de privacidad",
      submit: "Enviar",
      sending: "Enviando…",
      close: "Cerrar",
      success: {
        title: "Gracias — recibimos tu información.",
        text: "Te contactamos pronto. También puedes continuar ahora:",
        whatsapp: "Continuar por WhatsApp",
        back: "Volver a la tarjeta",
      },
      errors: {
        required: "Completa tu nombre, cómo contactarte y qué necesitas.",
        email: "Escribe un correo válido.",
        phone: "Escribe un teléfono para poder contactarte.",
        consent: "Acepta el consentimiento para poder contactarte.",
        server: "No pudimos enviar tu información. Intenta de nuevo o usa WhatsApp.",
      },
    },
    barStart: "Empezar",
    barSave: "Guardar",
    footerNote: "Tarjeta digital de 305 Web Service — como las que construimos para negocios.",
  },
} as const;

/** Ruta ES equivalente para un href EN del sitio (para CTAs de la tarjeta). */
export const CARD_ES_ROUTES: Record<string, string> = {
  "/": "/es",
  "/contact": "/es/contacto",
  "/website-packages": "/es/paquetes-web",
  "/website-packages#online-store": "/es/paquetes-web#online-store",
  "/custom-software": "/es/software-a-medida",
  "/automation-integrations": "/es/automatizacion-integraciones",
  "/nfc-business-solutions": "/es/soluciones-nfc",
  "/it-infrastructure": "/es/infraestructura-it",
  "/privacy": "/es/privacidad",
};

export function cardHref(href: string, locale: CardLocale): string {
  return locale === "es" ? (CARD_ES_ROUTES[href] ?? href) : href;
}
