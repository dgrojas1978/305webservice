/**
 * Las 7 ofertas productizadas de 305 Web Service, en inglés (default) y español.
 * Cada oferta = problema reconocible + cliente objetivo + resultado + entregables
 * + estado de precio + un solo próximo paso.
 *
 * Reglas duras: sin marcas de producto propietarias, sin proof/estadísticas
 * inventadas, sin precios inventados (NFC = Custom Quote hasta verificar).
 */
import type { Locale } from "~/lib/i18n";

export type OfferId =
  | "website-starter"
  | "business-website"
  | "online-store"
  | "custom-software"
  | "automation"
  | "it-infrastructure"
  | "nfc";

export interface OfferDetail {
  /** Problemas que resuelve (situaciones reconocibles). */
  problems: string[];
  /** Para quién es. */
  whoFor: string;
  /** Entregables completos. */
  deliverables: string[];
  /** Casos de uso de ejemplo. */
  useCases: string[];
  /** Cómo se cotiza. */
  pricingMethod: string;
  /** FAQ específico. */
  faq: { q: string; a: string }[];
}

export interface Offer {
  id: OfferId;
  /** Ruta de la página de detalle (o sección). */
  detailPath: string;
  name: string;
  priceState: string;
  bestFor: string;
  outcome: string;
  /** 3–5 inclusiones clave para la tarjeta. */
  inclusions: string[];
  ctaLabel: string;
  featured?: boolean;
  detail: OfferDetail;
}

/* ----------------------------------------------------------------- inglés */
const en: Offer[] = [
  {
    id: "website-starter",
    detailPath: "/website-packages",
    name: "Website Starter",
    priceState: "Starting at $499",
    bestFor: "Independent professionals and small businesses that need a credible online presence quickly.",
    outcome: "A polished, mobile-first website that explains your business clearly and turns visitors into calls, messages and quote requests.",
    inclusions: [
      "One-page website or focused landing page",
      "Responsive, conversion-oriented design",
      "Contact form + WhatsApp integration",
      "Domain, SSL & basic on-page SEO",
      "One revision round",
    ],
    ctaLabel: "Start My Website",
    featured: true,
    detail: {
      whoFor: "Independent professionals, contractors and small businesses that need to look credible online and start getting inquiries without a long project.",
      problems: [
        "You don't have a website yet, or the one you have looks outdated.",
        "People find you on their phone and leave because the site is slow or unclear.",
        "You rely only on social media and have no place to send serious leads.",
      ],
      deliverables: [
        "One-page website or focused landing page",
        "Conversion-oriented page structure",
        "Responsive design for phone, tablet and desktop",
        "Services section",
        "Contact form",
        "WhatsApp integration",
        "Social links",
        "Domain and SSL configuration",
        "Basic on-page SEO",
        "Basic analytics setup when a platform is available",
        "One revision round",
      ],
      useCases: [
        "A contractor who needs a professional page to share and to run ads to.",
        "A consultant replacing a one-page bio site with something that generates calls.",
        "A local service business that wants to be found on Google and reached on WhatsApp.",
      ],
      pricingMethod: "Fixed starting price of $499. Final price depends on content, pages and integrations, and is confirmed in your quote before any work begins.",
      faq: [
        { q: "What exactly is included in the $499 website?", a: "A one-page or landing-page website with a conversion-focused structure, responsive design, a contact form, WhatsApp integration, social links, domain and SSL setup, basic on-page SEO and one revision round." },
        { q: "Are hosting and domain fees included in the $499?", a: "No. The $499 covers design and build. Domain registration, hosting and ongoing maintenance are quoted separately and clearly listed before you approve anything." },
        { q: "How long does a starter website take?", a: "It depends on how quickly content and photos are ready. We confirm a realistic timeline in your scope before starting." },
      ],
    },
  },
  {
    id: "business-website",
    detailPath: "/website-packages",
    name: "Business Website",
    priceState: "Custom Quote",
    bestFor: "Established businesses that need stronger positioning, multiple service pages and a more complete lead-generation system.",
    outcome: "A scalable company website built to improve credibility, search visibility and qualified inquiries.",
    inclusions: [
      "Up to five core pages",
      "Custom UX/UI + conversion copy",
      "Local SEO foundations",
      "Analytics & conversion events",
      "Training & launch support",
    ],
    ctaLabel: "Request a Website Quote",
    detail: {
      whoFor: "Established businesses with several services or locations that need a website to compete on credibility and search — not just exist.",
      problems: [
        "Your current site doesn't reflect how good your business actually is.",
        "You need more than one page, but not an enterprise project.",
        "You want to show up in local search and capture qualified leads.",
      ],
      deliverables: [
        "Up to five core pages unless scope requires otherwise",
        "Custom UX/UI",
        "Conversion copy structure",
        "Advanced forms",
        "Local SEO foundations",
        "Google Maps and business integrations",
        "Analytics and conversion events",
        "Blog or resource capability when needed",
        "Training and launch support",
      ],
      useCases: [
        "A multi-service company that needs a page per service to rank and convert.",
        "A firm that wants local SEO foundations and measurable lead tracking.",
        "A business replacing a template site with a system built to grow.",
      ],
      pricingMethod: "Custom quote based on pages, content, integrations and functionality. You get a clear scope and price before work begins.",
      faq: [
        { q: "How is a Business Website priced?", a: "By scope: number of pages, custom design, integrations and functionality. We map it in discovery and give you a fixed quote." },
        { q: "Can you improve our existing website instead of rebuilding?", a: "Often yes. We review what you have and recommend whether to improve it or rebuild — whichever gives the better result for the budget." },
      ],
    },
  },
  {
    id: "online-store",
    detailPath: "/website-packages",
    name: "Online Store",
    priceState: "Custom Quote",
    bestFor: "Retailers, restaurants, service providers and brands that need to accept orders or payments online.",
    outcome: "A streamlined commerce experience that makes products or services easy to discover, buy and manage.",
    inclusions: [
      "Store architecture & catalog",
      "Mobile checkout",
      "Payment gateway integration",
      "Order notifications",
      "Analytics & training",
    ],
    ctaLabel: "Plan My Online Store",
    detail: {
      whoFor: "Retailers, restaurants and service businesses that need to sell, take orders or collect payments online without fighting their platform.",
      problems: [
        "You want to sell online but the setup feels overwhelming.",
        "Your current store is confusing or hard to update.",
        "Customers ask to pay or order online and you have no clean way to do it.",
      ],
      deliverables: [
        "Store architecture",
        "Product or service catalog",
        "Mobile checkout",
        "Payment gateway integration",
        "Basic shipping, pickup or booking configuration",
        "Order notifications",
        "Analytics and conversion tracking",
        "Training",
      ],
      useCases: [
        "A retailer moving from in-person only to online orders.",
        "A restaurant adding pickup and payment online.",
        "A service business selling packages or deposits online.",
      ],
      pricingMethod: "Custom quote based on catalog size, payment and shipping needs and integrations. Scope and price are confirmed up front.",
      faq: [
        { q: "Which payment methods can you set up?", a: "We integrate the payment gateway that fits your business and region. We confirm options and fees in your quote." },
      ],
    },
  },
  {
    id: "custom-software",
    detailPath: "/custom-software",
    name: "Custom Business Software",
    priceState: "Scoped Proposal",
    bestFor: "Businesses relying on spreadsheets, disconnected tools, repetitive data entry or processes no off-the-shelf system fits.",
    outcome: "A secure web application, portal, dashboard or internal tool designed around your company's actual workflow.",
    inclusions: [
      "Process analysis",
      "Web app, portal or dashboard",
      "User roles & permissions",
      "Reports & dashboards",
      "Ongoing iteration",
    ],
    ctaLabel: "Discuss My Software Idea",
    detail: {
      whoFor: "Companies whose workflow has outgrown spreadsheets and generic tools, and who need software built around how they actually work.",
      problems: [
        "Your spreadsheet has become the system your business depends on.",
        "Your team enters the same information in multiple tools.",
        "Customers keep calling for information they should be able to access online.",
        "Your current software forces your business to work the wrong way.",
      ],
      deliverables: [
        "Process and workflow analysis",
        "Web application development",
        "User roles and permissions",
        "Reports and dashboards",
        "Secure data handling",
        "Ongoing iteration after launch",
      ],
      useCases: [
        "Customer or employee portals",
        "Job and project tracking",
        "Intake and approval workflows",
        "Inventory and operations dashboards",
        "Reservations and memberships",
        "Reporting systems",
        "Web and mobile applications",
      ],
      pricingMethod: "Scoped proposal after a short discovery. We define the problem, the smallest useful first version and a fixed scope — no open-ended billing.",
      faq: [
        { q: "How is custom software priced?", a: "With a scoped proposal. After a short discovery we define deliverables and a fixed scope, usually starting with the smallest version that delivers real value." },
        { q: "Can you integrate with the tools we already use?", a: "Usually yes — CRMs, spreadsheets, email, WhatsApp, payment and scheduling tools. We confirm feasibility in discovery." },
      ],
    },
  },
  {
    id: "automation",
    detailPath: "/automation-integrations",
    name: "Digital Marketing & Automation",
    priceState: "Scoped Proposal",
    bestFor: "Businesses that want more leads from Google, ads and reviews — and less time lost to manual follow-up.",
    outcome: "More leads coming in and less manual work: campaigns, review funnels and follow-ups that run on their own.",
    inclusions: [
      "Campaign landing pages",
      "Meta & Google ad campaign setup",
      "Google Business Profile & review funnels",
      "Email & WhatsApp workflows",
      "CRM & tool integrations",
      "Reporting & conversion tracking",
    ],
    ctaLabel: "Get More Leads",
    detail: {
      whoFor: "Businesses that want the phone to ring — through ads, reviews and follow-up that work by themselves — and teams tired of copying data between tools that should be talking to each other.",
      problems: [
        "You're hard to find on Google and reviews come in slowly.",
        "You run ads (or want to) but there's no landing page or tracking behind them.",
        "Leads and messages slip through because follow-up is manual.",
        "Reports take hours to assemble by hand.",
      ],
      deliverables: [
        "Campaign landing pages built to convert",
        "Meta & Google ad campaign setup and tracking",
        "Google Business Profile setup and review funnels",
        "Email campaigns and newsletters",
        "Smart intake forms",
        "Email and WhatsApp workflows",
        "CRM integrations, notifications and reminders",
        "Reporting automation",
        "AI-assisted internal workflows where appropriate",
      ],
      useCases: [
        "A campaign landing page with ads, tracking and WhatsApp follow-up.",
        "A tap-or-scan review funnel that grows your Google reviews.",
        "New leads captured and routed automatically with instant reminders.",
        "Reports assembled automatically instead of by hand.",
      ],
      pricingMethod: "Scoped proposal. We map your goals and workflow, identify the highest-value campaigns and automations first and quote a fixed scope.",
      faq: [
        { q: "Do you run the ad campaigns or just set them up?", a: "Both are available. We can set up campaigns, landing pages and tracking for your team to run, or manage them for you as an ongoing engagement." },
        { q: "Do we have to replace our current tools?", a: "No. We connect and automate the tools you already use whenever possible, and only recommend changes when they clearly help." },
      ],
    },
  },
  {
    id: "it-infrastructure",
    detailPath: "/it-infrastructure",
    name: "IT Infrastructure & Support",
    priceState: "Assessment Required",
    bestFor: "Miami businesses that need reliable networks, cloud services, servers, backups, security or ongoing technical support.",
    outcome: "Technology that stays connected, protected and easier to manage.",
    inclusions: [
      "Business Wi-Fi, routers & cabling",
      "Microsoft 365 / Google Workspace",
      "Servers, files & permissions",
      "Backups & recovery planning",
      "Monitoring & support",
    ],
    ctaLabel: "Request an IT Assessment",
    detail: {
      whoFor: "Miami businesses that need their network, cloud tools, servers and backups to be reliable — with someone to call when something breaks.",
      problems: [
        "Your Wi-Fi, network or backups are unreliable.",
        "Nobody clearly owns your business technology.",
        "You're not sure your data is actually protected.",
      ],
      deliverables: [
        "Business Wi-Fi",
        "Routers, switches and cabling",
        "Microsoft 365 or Google Workspace",
        "Windows Server and Linux",
        "File services and permissions",
        "Cloud migrations",
        "Backups and recovery planning",
        "Secure remote access",
        "Monitoring and maintenance",
        "Remote and on-site support",
      ],
      useCases: [
        "An office that needs reliable Wi-Fi, email and file access.",
        "A business moving files and email to the cloud safely.",
        "A company that wants backups and someone to call for support.",
      ],
      pricingMethod: "We start with an assessment of your current setup, then recommend and quote only what your business actually needs.",
      faq: [
        { q: "Do you work on-site in Miami?", a: "Yes — remote and on-site support in the Miami area, plus remote support for clients elsewhere in the United States." },
      ],
    },
  },
  {
    id: "nfc",
    detailPath: "/nfc-business-solutions",
    name: "NFC Business Solutions",
    priceState: "Custom Quote",
    bestFor: "Professionals, teams, restaurants, retail stores, service businesses and events that want to share information, capture leads or make it easier to request reviews with a simple tap.",
    outcome: "Turn a physical NFC card, sign, sticker, stand or tag into a measurable digital business touchpoint.",
    inclusions: [
      "NFC card, tag or display setup",
      "Branded mobile landing experience",
      "Tap-to-contact / WhatsApp / review actions",
      "QR fallback for every device",
      "Website / CRM integration",
    ],
    ctaLabel: "Explore NFC Solutions",
    detail: {
      whoFor: "Professionals, teams, restaurants, retailers, service businesses and events that want a physical tap to open a real digital action — share contact details, capture a lead, open a menu or reach their review page.",
      problems: [
        "You hand out paper cards that get lost and can't be updated.",
        "You want an easier way for happy customers to reach your review page.",
        "You want to capture leads at events, counters or on the job with one tap.",
      ],
      deliverables: [
        "NFC card, tag, sticker, stand or display configuration",
        "Branded mobile landing experience",
        "Contact details and vCard download",
        "Configurable CTA destinations",
        "QR fallback for devices or situations where NFC is unavailable",
        "Basic tap analytics when technically and legally available",
        "Profile or destination updates without replacing the physical item when supported by the chosen setup",
        "Team profile setup when included",
        "Integration with your website, WhatsApp, booking system, review page, form or CRM",
        "Testing on compatible iOS and Android devices",
        "Usage instructions for you and your staff",
      ],
      useCases: [
        "NFC digital business cards for an individual professional.",
        "Team business cards with centrally managed profiles.",
        "Tap-to-review cards and displays that open your Google review page.",
        "Tap-to-contact and lead-capture experiences.",
        "Tap-to-WhatsApp, call, email or booking actions.",
        "Contactless restaurant menus.",
        "Product, service or property information tags.",
        "Event networking and check-in experiences.",
        "Smart signs, counters, displays and promotional materials.",
        "Custom NFC workflows connected to forms, CRM or automation.",
      ],
      pricingMethod: "Custom quote per solution. Pricing depends on the physical items, the landing experience and any integrations — all confirmed before you approve. We never add hidden material, printing, shipping or subscription fees.",
      faq: [
        { q: "Does NFC work on every phone?", a: "Most modern iPhones and Android phones support NFC, but not all. That's why every NFC solution ships with a visible QR code fallback so anyone can access it." },
        { q: "What happens when someone taps the card?", a: "It opens a branded mobile page you control — your contact details, a booking link, your review page or another action you choose. We tell you exactly what opens, and nothing is collected without the visitor's consent." },
        { q: "Can I update the card later without reprinting it?", a: "With the right setup, yes — the destination can be updated without replacing the physical item. We confirm which setup supports this in your quote." },
        { q: "Can this help with Google reviews?", a: "We make it easier for your customers to reach your legitimate review page with a tap. We do not gate, filter or incentivize reviews, and we don't promise any rating or outcome." },
      ],
    },
  },
];

/* ---------------------------------------------------------------- español */
const es: Offer[] = [
  {
    id: "website-starter",
    detailPath: "/es/paquetes-web",
    name: "Web Starter",
    priceState: "Desde $499",
    bestFor: "Profesionales independientes y pequeños negocios que necesitan una presencia online creíble, rápido.",
    outcome: "Una web pulida y mobile-first que explica tu negocio con claridad y convierte visitas en llamadas, mensajes y solicitudes de cotización.",
    inclusions: [
      "Web de una página o landing enfocada",
      "Diseño responsive orientado a conversión",
      "Formulario de contacto + WhatsApp",
      "Dominio, SSL y SEO básico",
      "Una ronda de revisión",
    ],
    ctaLabel: "Empezar mi web",
    featured: true,
    detail: {
      whoFor: "Profesionales independientes, contratistas y pequeños negocios que necesitan verse creíbles online y empezar a recibir consultas sin un proyecto largo.",
      problems: [
        "No tienes web todavía, o la que tienes se ve desactualizada.",
        "Te encuentran en el celular y se van porque el sitio es lento o poco claro.",
        "Dependes solo de redes sociales y no tienes dónde enviar clientes serios.",
      ],
      deliverables: [
        "Web de una página o landing enfocada",
        "Estructura orientada a conversión",
        "Diseño responsive para celular, tablet y escritorio",
        "Sección de servicios",
        "Formulario de contacto",
        "Integración con WhatsApp",
        "Enlaces a redes sociales",
        "Configuración de dominio y SSL",
        "SEO básico on-page",
        "Configuración básica de analítica cuando haya plataforma disponible",
        "Una ronda de revisión",
      ],
      useCases: [
        "Un contratista que necesita una página profesional para compartir y para anuncios.",
        "Un consultor que reemplaza una bio de una página por algo que genera llamadas.",
        "Un negocio local que quiere aparecer en Google y ser contactado por WhatsApp.",
      ],
      pricingMethod: "Precio inicial fijo de $499. El precio final depende del contenido, las páginas y las integraciones, y se confirma en tu cotización antes de empezar.",
      faq: [
        { q: "¿Qué incluye exactamente la web de $499?", a: "Una web de una página o landing con estructura orientada a conversión, diseño responsive, formulario de contacto, integración con WhatsApp, enlaces sociales, configuración de dominio y SSL, SEO básico y una ronda de revisión." },
        { q: "¿El hosting y el dominio están incluidos en los $499?", a: "No. Los $499 cubren diseño y desarrollo. El registro del dominio, el hosting y el mantenimiento se cotizan aparte y se listan con claridad antes de que apruebes." },
        { q: "¿Cuánto tarda una web starter?", a: "Depende de qué tan rápido estén el contenido y las fotos. Confirmamos un plazo realista en tu alcance antes de empezar." },
      ],
    },
  },
  {
    id: "business-website",
    detailPath: "/es/paquetes-web",
    name: "Web Empresarial",
    priceState: "Cotización a medida",
    bestFor: "Negocios establecidos que necesitan mejor posicionamiento, varias páginas de servicio y un sistema de captación más completo.",
    outcome: "Una web de empresa escalable, diseñada para mejorar credibilidad, visibilidad en buscadores y consultas calificadas.",
    inclusions: [
      "Hasta cinco páginas principales",
      "UX/UI a medida + copy de conversión",
      "Bases de SEO local",
      "Analítica y eventos de conversión",
      "Capacitación y soporte de lanzamiento",
    ],
    ctaLabel: "Cotizar mi web empresarial",
    detail: {
      whoFor: "Negocios establecidos con varios servicios o sedes que necesitan una web para competir en credibilidad y búsqueda — no solo para existir.",
      problems: [
        "Tu sitio actual no refleja lo bueno que es tu negocio.",
        "Necesitas más de una página, pero no un proyecto de empresa grande.",
        "Quieres aparecer en la búsqueda local y captar leads calificados.",
      ],
      deliverables: [
        "Hasta cinco páginas principales salvo que el alcance requiera más",
        "UX/UI a medida",
        "Estructura de copy de conversión",
        "Formularios avanzados",
        "Bases de SEO local",
        "Google Maps e integraciones de negocio",
        "Analítica y eventos de conversión",
        "Blog o recursos cuando se necesite",
        "Capacitación y soporte de lanzamiento",
      ],
      useCases: [
        "Una empresa multi-servicio que necesita una página por servicio para rankear y convertir.",
        "Una firma que quiere bases de SEO local y seguimiento medible de leads.",
        "Un negocio que reemplaza una web de plantilla por un sistema hecho para crecer.",
      ],
      pricingMethod: "Cotización a medida según páginas, contenido, integraciones y funcionalidad. Recibes un alcance y precio claros antes de empezar.",
      faq: [
        { q: "¿Cómo se cotiza una Web Empresarial?", a: "Por alcance: número de páginas, diseño a medida, integraciones y funcionalidad. Lo mapeamos en el descubrimiento y te damos una cotización fija." },
        { q: "¿Pueden mejorar nuestra web actual en vez de rehacerla?", a: "A menudo sí. Revisamos lo que tienes y recomendamos mejorarla o rehacerla — lo que dé mejor resultado para el presupuesto." },
      ],
    },
  },
  {
    id: "online-store",
    detailPath: "/es/paquetes-web",
    name: "Tienda en Línea",
    priceState: "Cotización a medida",
    bestFor: "Comercios, restaurantes, proveedores de servicios y marcas que necesitan aceptar pedidos o pagos online.",
    outcome: "Una experiencia de compra clara que hace tus productos o servicios fáciles de descubrir, comprar y administrar.",
    inclusions: [
      "Arquitectura de tienda y catálogo",
      "Checkout móvil",
      "Integración de pasarela de pago",
      "Notificaciones de pedidos",
      "Analítica y capacitación",
    ],
    ctaLabel: "Planear mi tienda online",
    detail: {
      whoFor: "Comercios, restaurantes y negocios de servicios que necesitan vender, tomar pedidos o cobrar online sin pelear con su plataforma.",
      problems: [
        "Quieres vender online pero la configuración te abruma.",
        "Tu tienda actual es confusa o difícil de actualizar.",
        "Tus clientes piden pagar o pedir online y no tienes forma limpia de hacerlo.",
      ],
      deliverables: [
        "Arquitectura de tienda",
        "Catálogo de productos o servicios",
        "Checkout móvil",
        "Integración de pasarela de pago",
        "Configuración básica de envío, recogida o reserva",
        "Notificaciones de pedidos",
        "Analítica y seguimiento de conversión",
        "Capacitación",
      ],
      useCases: [
        "Un comercio que pasa de solo presencial a pedidos online.",
        "Un restaurante que agrega recogida y pago online.",
        "Un negocio de servicios que vende paquetes o depósitos online.",
      ],
      pricingMethod: "Cotización a medida según tamaño del catálogo, necesidades de pago y envío e integraciones. El alcance y precio se confirman por adelantado.",
      faq: [
        { q: "¿Qué métodos de pago pueden configurar?", a: "Integramos la pasarela de pago que encaje con tu negocio y región. Confirmamos opciones y comisiones en tu cotización." },
      ],
    },
  },
  {
    id: "custom-software",
    detailPath: "/es/software-a-medida",
    name: "Software a Medida",
    priceState: "Propuesta con alcance",
    bestFor: "Negocios que dependen de hojas de cálculo, herramientas desconectadas, captura manual de datos o procesos que ningún sistema genérico cubre.",
    outcome: "Una aplicación web, portal, panel o herramienta interna segura, diseñada alrededor del flujo real de tu empresa.",
    inclusions: [
      "Análisis de procesos",
      "App web, portal o panel",
      "Roles y permisos",
      "Reportes y paneles",
      "Iteración continua",
    ],
    ctaLabel: "Hablar de mi idea de software",
    detail: {
      whoFor: "Empresas cuyo flujo de trabajo superó las hojas de cálculo y las herramientas genéricas, y que necesitan software construido alrededor de cómo realmente trabajan.",
      problems: [
        "Tu hoja de cálculo se volvió el sistema del que depende tu negocio.",
        "Tu equipo captura la misma información en varias herramientas.",
        "Los clientes llaman por información que deberían poder ver online.",
        "Tu software actual obliga a tu negocio a trabajar de la forma equivocada.",
      ],
      deliverables: [
        "Análisis de procesos y flujo de trabajo",
        "Desarrollo de aplicación web",
        "Roles y permisos de usuario",
        "Reportes y paneles",
        "Manejo seguro de datos",
        "Iteración continua tras el lanzamiento",
      ],
      useCases: [
        "Portales de clientes o empleados",
        "Seguimiento de trabajos y proyectos",
        "Flujos de captación y aprobación",
        "Paneles de inventario y operaciones",
        "Reservas y membresías",
        "Sistemas de reportes",
        "Aplicaciones web y móviles",
      ],
      pricingMethod: "Propuesta con alcance tras un descubrimiento corto. Definimos el problema, la primera versión útil más pequeña y un alcance fijo — sin facturación abierta.",
      faq: [
        { q: "¿Cómo se cotiza el software a medida?", a: "Con una propuesta con alcance. Tras un descubrimiento corto definimos entregables y un alcance fijo, normalmente empezando por la versión más pequeña que entrega valor real." },
        { q: "¿Pueden integrarse con las herramientas que ya usamos?", a: "Normalmente sí — CRMs, hojas de cálculo, correo, WhatsApp, pagos y agendas. Confirmamos la viabilidad en el descubrimiento." },
      ],
    },
  },
  {
    id: "automation",
    detailPath: "/es/automatizacion-integraciones",
    name: "Marketing Digital y Automatización",
    priceState: "Propuesta con alcance",
    bestFor: "Negocios que quieren más clientes desde Google, anuncios y reseñas — y menos tiempo perdido en seguimientos manuales.",
    outcome: "Más clientes entrando y menos trabajo manual: campañas, rutas de reseñas y seguimientos que corren solos.",
    inclusions: [
      "Landing pages de campaña",
      "Campañas de Meta y Google Ads",
      "Perfil de Google y rutas de reseñas",
      "Flujos de correo y WhatsApp",
      "Integraciones de CRM y herramientas",
      "Reportes y medición de conversión",
    ],
    ctaLabel: "Quiero más clientes",
    detail: {
      whoFor: "Negocios que quieren que suene el teléfono — con anuncios, reseñas y seguimiento que trabajan solos — y equipos cansados de copiar datos entre herramientas que deberían hablarse.",
      problems: [
        "Cuesta encontrarte en Google y las reseñas llegan lento.",
        "Pones anuncios (o quieres ponerlos) pero no hay landing ni medición detrás.",
        "Se escapan leads y mensajes porque el seguimiento es manual.",
        "Los reportes toman horas de armar a mano.",
      ],
      deliverables: [
        "Landing pages de campaña hechas para convertir",
        "Campañas de Meta y Google Ads con medición",
        "Perfil de Google Business y rutas de reseñas",
        "Campañas de correo y newsletters",
        "Formularios de captación inteligentes",
        "Flujos de correo y WhatsApp",
        "Integraciones de CRM, notificaciones y recordatorios",
        "Automatización de reportes",
        "Flujos internos asistidos por IA cuando corresponda",
      ],
      useCases: [
        "Una landing de campaña con anuncios, medición y seguimiento por WhatsApp.",
        "Una ruta de reseñas por toque o escaneo que hace crecer tus reseñas de Google.",
        "Leads captados y ruteados automáticamente con recordatorios instantáneos.",
        "Reportes armados automáticamente en vez de a mano.",
      ],
      pricingMethod: "Propuesta con alcance. Mapeamos tus objetivos y tu flujo, identificamos primero las campañas y automatizaciones de mayor valor y cotizamos un alcance fijo.",
      faq: [
        { q: "¿Ustedes manejan las campañas o solo las configuran?", a: "Las dos opciones están disponibles. Podemos dejar campañas, landings y medición listas para tu equipo, o manejarlas por ti como servicio continuo." },
        { q: "¿Tenemos que reemplazar nuestras herramientas actuales?", a: "No. Conectamos y automatizamos las herramientas que ya usas siempre que se pueda, y solo recomendamos cambios cuando ayudan claramente." },
      ],
    },
  },
  {
    id: "it-infrastructure",
    detailPath: "/es/infraestructura-it",
    name: "Infraestructura IT y Soporte",
    priceState: "Requiere evaluación",
    bestFor: "Negocios de Miami que necesitan redes confiables, nube, servidores, respaldos, seguridad o soporte técnico continuo.",
    outcome: "Tecnología que se mantiene conectada, protegida y más fácil de administrar.",
    inclusions: [
      "Wi-Fi empresarial, routers y cableado",
      "Microsoft 365 / Google Workspace",
      "Servidores, archivos y permisos",
      "Respaldos y plan de recuperación",
      "Monitoreo y soporte",
    ],
    ctaLabel: "Solicitar evaluación IT",
    detail: {
      whoFor: "Negocios de Miami que necesitan que su red, nube, servidores y respaldos sean confiables — con alguien a quién llamar cuando algo falla.",
      problems: [
        "Tu Wi-Fi, red o respaldos no son confiables.",
        "Nadie es dueño claro de la tecnología de tu negocio.",
        "No estás seguro de que tus datos estén realmente protegidos.",
      ],
      deliverables: [
        "Wi-Fi empresarial",
        "Routers, switches y cableado",
        "Microsoft 365 o Google Workspace",
        "Windows Server y Linux",
        "Servicios de archivos y permisos",
        "Migraciones a la nube",
        "Respaldos y plan de recuperación",
        "Acceso remoto seguro",
        "Monitoreo y mantenimiento",
        "Soporte remoto y presencial",
      ],
      useCases: [
        "Una oficina que necesita Wi-Fi, correo y acceso a archivos confiables.",
        "Un negocio que mueve archivos y correo a la nube con seguridad.",
        "Una empresa que quiere respaldos y alguien a quién llamar para soporte.",
      ],
      pricingMethod: "Empezamos con una evaluación de tu configuración actual, y luego recomendamos y cotizamos solo lo que tu negocio realmente necesita.",
      faq: [
        { q: "¿Trabajan presencialmente en Miami?", a: "Sí — soporte remoto y presencial en el área de Miami, más soporte remoto para clientes en otras partes de Estados Unidos." },
      ],
    },
  },
  {
    id: "nfc",
    detailPath: "/es/soluciones-nfc",
    name: "Soluciones NFC",
    priceState: "Cotización a medida",
    bestFor: "Profesionales, equipos, restaurantes, tiendas, negocios de servicios y eventos que quieren compartir información, captar leads o facilitar reseñas con un simple toque.",
    outcome: "Convierte una tarjeta, letrero, sticker, stand o etiqueta NFC física en un punto de contacto digital medible.",
    inclusions: [
      "Configuración de tarjeta, etiqueta o display NFC",
      "Página móvil con tu marca",
      "Acciones tap-to-contacto / WhatsApp / reseña",
      "Respaldo QR para cualquier dispositivo",
      "Integración con web / CRM",
    ],
    ctaLabel: "Explorar soluciones NFC",
    detail: {
      whoFor: "Profesionales, equipos, restaurantes, comercios, negocios de servicios y eventos que quieren que un toque físico abra una acción digital real — compartir contacto, captar un lead, abrir un menú o llegar a su página de reseñas.",
      problems: [
        "Repartes tarjetas de papel que se pierden y no se pueden actualizar.",
        "Quieres una forma más fácil de que tus clientes lleguen a tu página de reseñas.",
        "Quieres captar leads en eventos, mostradores o en obra con un toque.",
      ],
      deliverables: [
        "Configuración de tarjeta, etiqueta, sticker, stand o display NFC",
        "Página móvil con tu marca",
        "Datos de contacto y descarga de vCard",
        "Destinos de CTA configurables",
        "Respaldo QR para dispositivos o situaciones donde el NFC no está disponible",
        "Analítica básica de toques cuando sea técnica y legalmente posible",
        "Actualización del perfil o destino sin reemplazar el objeto físico cuando la configuración elegida lo permita",
        "Configuración de perfiles de equipo cuando se incluya",
        "Integración con tu web, WhatsApp, sistema de reservas, página de reseñas, formulario o CRM",
        "Pruebas en dispositivos iOS y Android compatibles",
        "Instrucciones de uso para ti y tu personal",
      ],
      useCases: [
        "Tarjetas de presentación NFC para un profesional individual.",
        "Tarjetas de equipo con perfiles gestionados centralmente.",
        "Tarjetas y displays tap-to-reseña que abren tu página de reseñas de Google.",
        "Experiencias de tap-to-contacto y captación de leads.",
        "Acciones tap-to-WhatsApp, llamada, correo o reserva.",
        "Menús de restaurante sin contacto.",
        "Etiquetas de información de producto, servicio o propiedad.",
        "Networking y check-in en eventos.",
        "Letreros, mostradores, displays y material promocional inteligente.",
        "Flujos NFC a medida conectados a formularios, CRM o automatización.",
      ],
      pricingMethod: "Cotización a medida por solución. El precio depende de los objetos físicos, la página de destino y las integraciones — todo confirmado antes de que apruebes. Nunca agregamos costos ocultos de material, impresión, envío o suscripción.",
      faq: [
        { q: "¿El NFC funciona en todos los celulares?", a: "La mayoría de iPhones y Android modernos soportan NFC, pero no todos. Por eso cada solución NFC incluye un respaldo QR visible para que cualquiera pueda acceder." },
        { q: "¿Qué pasa cuando alguien toca la tarjeta?", a: "Abre una página móvil con tu marca que tú controlas — tus datos de contacto, un enlace de reserva, tu página de reseñas u otra acción que elijas. Te decimos exactamente qué abre, y nada se recopila sin el consentimiento del visitante." },
        { q: "¿Puedo actualizar la tarjeta después sin reimprimirla?", a: "Con la configuración adecuada, sí — el destino se puede actualizar sin reemplazar el objeto físico. Confirmamos qué configuración lo permite en tu cotización." },
        { q: "¿Esto ayuda con las reseñas de Google?", a: "Facilitamos que tus clientes lleguen a tu página de reseñas legítima con un toque. No filtramos, condicionamos ni incentivamos reseñas, y no prometemos ninguna calificación ni resultado." },
      ],
    },
  },
];

export const OFFERS: Record<Locale, Offer[]> = { en, es };

export function getOffer(locale: Locale, id: OfferId): Offer {
  return OFFERS[locale].find((o) => o.id === id)!;
}
