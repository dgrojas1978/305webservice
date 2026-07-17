/**
 * Todo el copy del sitio, en inglés (por defecto) y español.
 * Nunca mezclar idiomas dentro de una página: cada página lee
 * exclusivamente C[locale].
 */
import type { Locale } from "~/lib/i18n";

export interface ServiceItem {
  id: string;
  name: string;
  short: string;
  /** Página de servicios */
  problem: string;
  includes: string[];
  forWho: string;
  integrations: string;
}

export interface ProcessStep {
  no: string;
  name: string;
  text: string;
}

interface Dict {
  meta: Record<string, { title: string; description: string }>;
  nav: { services: string; process: string; about: string; contact: string; cta: string; menuOpen: string; menuClose: string; skip: string };
  hero: {
    eyebrow1: string; eyebrow2: string;
    lines: [string, string, string];
    text: string;
    ctaPrimary: string; ctaSecondary: string;
    scroll: string;
  };
  positioning: { eyebrow: string; title: string; text: string };
  services: {
    eyebrow: string;
    title1: string; title2: string;
    items: ServiceItem[];
    pageIntro: string;
    labels: { problem: string; includes: string; forWho: string; integrations: string; cta: string };
  };
  whatWeBuild: {
    eyebrow: string;
    titleLines: [string, string, string];
    text: string;
    panels: {
      no: string;
      category: string;
      titleLines: [string, string];
      text: string;
      caps: string[];
    }[];
    demos: {
      browser: { nav: string[]; head1: string; head2: string; cta: string };
      shop: { title: string; product: string; qty: string; total: string; checkout: string };
      dash: { nav: string[]; table: string; done: string; wip: string; item: string };
    };
    cta: { line1: string; line2: string; button: string };
  };
  process: { eyebrow: string; title1: string; title2: string; steps: ProcessStep[] };
  principles: { title1: string; title2: string; title3: string; items: string[] };
  miami: { line1: string; line2: string; text: string; micro: string };
  finalCta: { title1: string; title2: string; text: string; button: string };
  footer: { tagline: string; navTitle: string; servicesTitle: string; contactTitle: string; privacy: string; backToTop: string; rights: string };
  about: { eyebrow: string; title: string; text: string };
  contact: {
    title1: string; title2: string;
    intro: string;
    labels: {
      name: string; company: string; companyOpt: string; email: string; phone: string; phoneOpt: string;
      service: string; budget: string; budgetOpt: string; message: string;
      consent: string; privacyLink: string; submit: string; sending: string; required: string;
      selectService: string; selectBudget: string;
    };
    success: { title: string; text: string; back: string };
    errors: { required: string; email: string; consent: string; server: string };
    note: string;
  };
  formServices: { value: string; label: string }[];
  formBudgets: { value: string; label: string }[];
  notFound: { title: string; line1: string; line2: string; button: string };
  privacy: { title: string; updated: string };
  langSwitch: { label: string; toOther: string };
}

const servicesEn: ServiceItem[] = [
  {
    id: "web", name: "Website design & development",
    short: "Fast, responsive websites built to represent your business professionally.",
    problem: "Your business is judged by its website before anyone calls. An outdated or slow site loses opportunities silently.",
    includes: ["Custom design", "Responsive development", "Basic on-page SEO", "Contact forms", "Domain & SSL setup"],
    forWho: "Businesses that need a professional online presence that builds trust from the first visit.",
    integrations: "WhatsApp, Google Maps, analytics, social media and the tools your business already uses.",
  },
  {
    id: "ecommerce", name: "E-commerce websites",
    short: "Clear, secure shopping experiences that are easy to manage.",
    problem: "Selling online fails when the store is confusing, slow or hard to update.",
    includes: ["Product catalog", "Secure checkout", "Order management", "Shipping & tax configuration", "Admin training"],
    forWho: "Retailers and brands that want to sell online without fighting their own platform.",
    integrations: "Payment processors, inventory tools, email marketing and shipping providers.",
  },
  {
    id: "apps", name: "Custom applications",
    short: "Digital tools adapted to your processes and goals.",
    problem: "Off-the-shelf software forces your team to work around it. Custom tools work the way your business works.",
    includes: ["Process analysis", "Web application development", "User roles & permissions", "Reports & dashboards", "Ongoing iteration"],
    forWho: "Companies with workflows that spreadsheets and generic software no longer cover.",
    integrations: "Your existing systems, databases, forms and third-party services.",
  },
  {
    id: "seo", name: "SEO & optimization",
    short: "Technical and structural improvements that help customers find you.",
    problem: "A good website that nobody finds doesn't generate business.",
    includes: ["Technical SEO audit", "Performance optimization", "Metadata & structured data", "Local search presence", "Measurement setup"],
    forWho: "Businesses that depend on being found by local customers searching online.",
    integrations: "Google Business Profile, Search Console and analytics tools.",
  },
  {
    id: "automation", name: "Business automation",
    short: "Connections and workflows that reduce manual, repetitive work.",
    problem: "Hours lost copying data between tools, answering the same messages and chasing approvals.",
    includes: ["Workflow mapping", "Tool integrations", "Smart forms & notifications", "Document generation", "WhatsApp automation"],
    forWho: "Teams drowning in repetitive tasks that software should be doing for them.",
    integrations: "CRMs, email, WhatsApp, spreadsheets, invoicing and scheduling tools.",
  },
  {
    id: "hosting", name: "Hosting & business email",
    short: "Reliable infrastructure to keep your business connected.",
    problem: "Downtime, lost emails and generic addresses undermine credibility and operations.",
    includes: ["Managed hosting", "Business email on your domain", "DNS management", "Backups", "Security monitoring"],
    forWho: "Businesses that want their web presence and email handled professionally.",
    integrations: "Your domain, website and the email clients your team already uses.",
  },
  {
    id: "support", name: "Maintenance & support",
    short: "Monitoring, updates and technical help when you need it.",
    problem: "Websites and systems degrade without attention — updates pile up and small issues become outages.",
    includes: ["Regular updates", "Uptime monitoring", "Content changes", "Security patches", "Direct technical support"],
    forWho: "Businesses that want their technology cared for without hiring IT staff.",
    integrations: "Any website or system we build, and many we didn't.",
  },
  {
    id: "payments", name: "Payments, forms & bookings",
    short: "Integrations that simplify how customers interact with your business.",
    problem: "Every extra step between a customer and a payment or appointment costs you business.",
    includes: ["Online payment integration", "Smart intake forms", "Appointment booking", "Automatic confirmations", "Calendar sync"],
    forWho: "Service businesses, clinics, restaurants and professionals who book and charge clients.",
    integrations: "Payment processors, calendars, WhatsApp and email notifications.",
  },
];

const servicesEs: ServiceItem[] = [
  {
    id: "web", name: "Diseño y desarrollo web",
    short: "Sitios rápidos, adaptables y construidos para representar profesionalmente tu negocio.",
    problem: "Tu negocio es juzgado por su página antes de que alguien llame. Un sitio lento o desactualizado pierde oportunidades en silencio.",
    includes: ["Diseño a medida", "Desarrollo responsive", "SEO básico on-page", "Formularios de contacto", "Configuración de dominio y SSL"],
    forWho: "Negocios que necesitan una presencia profesional que genere confianza desde la primera visita.",
    integrations: "WhatsApp, Google Maps, analítica, redes sociales y las herramientas que tu negocio ya usa.",
  },
  {
    id: "ecommerce", name: "Tiendas en línea",
    short: "Experiencias de compra claras, seguras y fáciles de administrar.",
    problem: "Vender online fracasa cuando la tienda es confusa, lenta o difícil de actualizar.",
    includes: ["Catálogo de productos", "Pago seguro", "Gestión de pedidos", "Configuración de envíos e impuestos", "Capacitación del administrador"],
    forWho: "Comercios y marcas que quieren vender online sin pelear con su propia plataforma.",
    integrations: "Procesadores de pago, inventario, email marketing y proveedores de envío.",
  },
  {
    id: "apps", name: "Aplicaciones personalizadas",
    short: "Herramientas digitales adaptadas a tus procesos y objetivos.",
    problem: "El software genérico obliga a tu equipo a trabajar alrededor de él. Las herramientas a medida trabajan como trabaja tu negocio.",
    includes: ["Análisis de procesos", "Desarrollo de aplicación web", "Roles y permisos", "Reportes y paneles", "Iteración continua"],
    forWho: "Empresas con flujos que las hojas de cálculo y el software genérico ya no cubren.",
    integrations: "Tus sistemas existentes, bases de datos, formularios y servicios de terceros.",
  },
  {
    id: "seo", name: "SEO y optimización",
    short: "Mejoras técnicas y estructurales para facilitar que tus clientes te encuentren.",
    problem: "Una buena página que nadie encuentra no genera negocio.",
    includes: ["Auditoría técnica de SEO", "Optimización de rendimiento", "Metadatos y datos estructurados", "Presencia en búsqueda local", "Configuración de medición"],
    forWho: "Negocios que dependen de ser encontrados por clientes locales que buscan online.",
    integrations: "Google Business Profile, Search Console y herramientas de analítica.",
  },
  {
    id: "automation", name: "Automatización de procesos",
    short: "Conexiones y flujos que reducen trabajo manual y tareas repetitivas.",
    problem: "Horas perdidas copiando datos entre herramientas, respondiendo los mismos mensajes y persiguiendo aprobaciones.",
    includes: ["Mapeo de flujos", "Integración de herramientas", "Formularios inteligentes y notificaciones", "Generación de documentos", "Automatización de WhatsApp"],
    forWho: "Equipos ahogados en tareas repetitivas que el software debería hacer por ellos.",
    integrations: "CRMs, correo, WhatsApp, hojas de cálculo, facturación y agendas.",
  },
  {
    id: "hosting", name: "Hosting y correo empresarial",
    short: "Infraestructura confiable para mantener tu negocio conectado.",
    problem: "Caídas, correos perdidos y direcciones genéricas restan credibilidad y complican la operación.",
    includes: ["Hosting administrado", "Correo empresarial en tu dominio", "Gestión de DNS", "Copias de seguridad", "Monitoreo de seguridad"],
    forWho: "Negocios que quieren su presencia web y su correo manejados profesionalmente.",
    integrations: "Tu dominio, tu sitio y los clientes de correo que tu equipo ya usa.",
  },
  {
    id: "support", name: "Mantenimiento y soporte",
    short: "Supervisión, actualizaciones y ayuda técnica cuando la necesites.",
    problem: "Los sitios y sistemas se degradan sin atención: las actualizaciones se acumulan y los problemas pequeños se vuelven caídas.",
    includes: ["Actualizaciones regulares", "Monitoreo de disponibilidad", "Cambios de contenido", "Parches de seguridad", "Soporte técnico directo"],
    forWho: "Negocios que quieren su tecnología cuidada sin contratar personal de IT.",
    integrations: "Cualquier sitio o sistema que construyamos, y muchos que no.",
  },
  {
    id: "payments", name: "Pagos, formularios y reservas",
    short: "Integraciones que simplifican la interacción entre tu negocio y tus clientes.",
    problem: "Cada paso extra entre un cliente y un pago o una cita te cuesta negocio.",
    includes: ["Integración de pagos online", "Formularios de captación inteligentes", "Reserva de citas", "Confirmaciones automáticas", "Sincronización de calendarios"],
    forWho: "Negocios de servicios, clínicas, restaurantes y profesionales que agendan y cobran a clientes.",
    integrations: "Procesadores de pago, calendarios, WhatsApp y notificaciones por correo.",
  },
];

const en: Dict = {
  meta: {
    home: {
      title: "305 Web Service | Web Design & Digital Solutions in Miami",
      description: "Web design and development, online stores, automation, SEO and digital support for businesses in Miami.",
    },
    services: {
      title: "Services | 305 Web Service",
      description: "Website design, e-commerce, custom applications, SEO, automation, hosting, maintenance and integrations for growing businesses.",
    },
    process: {
      title: "Process | 305 Web Service",
      description: "From idea to launch: how we discover, define, design, build, launch and support every project.",
    },
    about: {
      title: "About | 305 Web Service",
      description: "A Miami digital studio building the digital side of growing businesses with strategy, design and technology.",
    },
    contact: {
      title: "Contact | 305 Web Service",
      description: "Let's talk about your next project. Tell us about your business, your idea or the process you want to improve.",
    },
    privacy: {
      title: "Privacy Policy | 305 Web Service",
      description: "How 305 Web Service collects, uses and protects the information you share with us.",
    },
    notFound: {
      title: "Page not found | 305 Web Service",
      description: "This page isn't here.",
    },
  },
  nav: {
    services: "Services", process: "Process", about: "About",
    contact: "Contact", cta: "Let's talk", menuOpen: "Open menu", menuClose: "Close menu",
    skip: "Skip to content",
  },
  hero: {
    eyebrow1: "Miami · Florida", eyebrow2: "Digital Studio",
    lines: ["We build digital", "experiences that", "grow your business."],
    text: "We design websites, online stores and digital solutions built around the real needs of each business.",
    ctaPrimary: "Start a project", ctaSecondary: "View services",
    scroll: "Scroll to explore",
  },
  positioning: {
    eyebrow: "We don't just build pages",
    title: "We build the digital side of your business.",
    text: "Every project combines strategy, design and technology to create an experience that is clear, fast and ready to grow.",
  },
  services: {
    eyebrow: "Services",
    title1: "Solutions designed", title2: "around your business.",
    items: servicesEn,
    pageIntro: "Eight ways we help businesses work better online — each one built around your processes, not a template.",
    labels: {
      problem: "The problem it solves", includes: "What it includes", forWho: "Who it's for",
      integrations: "Integrations", cta: "Discuss this service",
    },
  },
  whatWeBuild: {
    eyebrow: "What we build",
    titleLines: ["Digital products", "built around", "real business needs."],
    text: "From customer-facing websites to internal systems, we design and build digital experiences that are clear, useful, and ready to grow.",
    panels: [
      {
        no: "01",
        category: "Web design & development",
        titleLines: ["Your business,", "clearly presented."],
        text: "Fast, responsive websites designed to communicate your value and turn attention into meaningful action.",
        caps: ["Strategy", "UX/UI", "Development", "SEO"],
      },
      {
        no: "02",
        category: "E-commerce",
        titleLines: ["From discovery", "to checkout."],
        text: "Online stores that make products easy to explore, purchase, and manage.",
        caps: ["Catalog", "Payments", "Inventory", "Automation"],
      },
      {
        no: "03",
        category: "Custom applications",
        titleLines: ["Less manual work.", "Better operations."],
        text: "Custom tools that organize information, connect processes, and help teams work more efficiently.",
        caps: ["Dashboards", "Workflows", "Integrations", "Reporting"],
      },
    ],
    demos: {
      browser: { nav: ["Home", "Services", "Contact"], head1: "Your", head2: "brand.", cta: "Get in touch" },
      shop: { title: "Catalog", product: "Product", qty: "Qty", total: "Total", checkout: "Checkout" },
      dash: { nav: ["Overview", "Requests", "Clients", "Reports"], table: "Recent activity", done: "Done", wip: "In progress", item: "Item" },
    },
    cta: {
      line1: "Have something different in mind?",
      line2: "Let's build it.",
      button: "Start a project",
    },
  },
  process: {
    eyebrow: "How we work",
    title1: "From idea", title2: "to launch.",
    steps: [
      { no: "01", name: "Discover", text: "We understand your business, your customers and the problem we need to solve." },
      { no: "02", name: "Define", text: "We organize the content, the features and the experience the project needs." },
      { no: "03", name: "Design", text: "We create a clear, coherent and adaptable visual system." },
      { no: "04", name: "Build", text: "We turn the design into a fast, functional experience." },
      { no: "05", name: "Launch", text: "We test, optimize and prepare everything for release." },
      { no: "06", name: "Support", text: "We provide maintenance, support and continuous improvements." },
    ],
  },
  principles: {
    title1: "Less noise.", title2: "More clarity.", title3: "Better experiences.",
    items: [
      "Strategy before design",
      "Design made for people",
      "Technology chosen with purpose",
      "Support after launch",
    ],
  },
  miami: {
    line1: "Built in Miami.", line2: "Made for growth.",
    text: "We work with businesses that want to use technology in a clearer, more useful and more professional way.",
    micro: "Miami · Florida",
  },
  finalCta: {
    title1: "Ready to build", title2: "something better?",
    text: "Tell us about your business, your idea or the process you want to improve.",
    button: "Let's talk about your project",
  },
  footer: {
    tagline: "Digital solutions for growing businesses",
    navTitle: "Navigation", servicesTitle: "Services", contactTitle: "Contact",
    privacy: "Privacy Policy", backToTop: "Back to top",
    rights: "All rights reserved.",
  },
  about: {
    eyebrow: "About us",
    title: "Technology with a human approach.",
    text: "305 Web Service is a Miami digital studio. We help small and medium-sized businesses modernize how they work — with websites, online stores, automation and digital tools built around each company's reality. We first understand the problem; then we build the solution that fits.",
  },
  contact: {
    title1: "Let's talk about", title2: "your next project.",
    intro: "Tell us what you need — we'll review it and get back to you with a clear next step. Service in English and Spanish.",
    labels: {
      name: "Name", company: "Company", companyOpt: "optional",
      email: "Email", phone: "Phone", phoneOpt: "optional",
      service: "Service of interest", budget: "Approximate budget", budgetOpt: "optional",
      message: "Message", submit: "Send message", sending: "Sending…",
      consent: "I agree to be contacted by 305 Web Service about this request.",
      privacyLink: "Privacy Policy", required: "Required fields are marked with",
      selectService: "Select a service…", selectBudget: "Select a range…",
    },
    success: {
      title: "Message received.",
      text: "Thank you for reaching out. We'll review your project and get back to you soon.",
      back: "Back to home",
    },
    errors: {
      required: "Please complete all required fields.",
      email: "Please enter a valid email address.",
      consent: "Please confirm that we may contact you about your request.",
      server: "Something went wrong sending your message. Your information was not lost — please try again, or reach us by WhatsApp or email.",
    },
    note: "No-obligation initial response.",
  },
  formServices: [
    { value: "website", label: "Website" },
    { value: "ecommerce", label: "Online store" },
    { value: "custom-app", label: "Custom application" },
    { value: "automation", label: "Automation" },
    { value: "seo", label: "SEO" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" },
  ],
  formBudgets: [
    { value: "500-1500", label: "$500 – $1,500" },
    { value: "1500-5000", label: "$1,500 – $5,000" },
    { value: "5000-15000", label: "$5,000 – $15,000" },
    { value: "15000+", label: "More than $15,000" },
    { value: "not-sure", label: "Not sure yet" },
  ],
  notFound: {
    title: "404", line1: "This page", line2: "isn't here.", button: "Back to home",
  },
  privacy: { title: "Privacy Policy", updated: "Last updated" },
  langSwitch: { label: "Language", toOther: "Ver en español" },
};

const es: Dict = {
  meta: {
    home: {
      title: "305 Web Service | Diseño web y soluciones digitales en Miami",
      description: "Diseño y desarrollo web, tiendas en línea, automatización, SEO y soporte digital para negocios en Miami.",
    },
    services: {
      title: "Servicios | 305 Web Service",
      description: "Diseño web, tiendas en línea, aplicaciones personalizadas, SEO, automatización, hosting, mantenimiento e integraciones para negocios en crecimiento.",
    },
    process: {
      title: "Proceso | 305 Web Service",
      description: "De la idea al lanzamiento: cómo descubrimos, definimos, diseñamos, construimos, lanzamos y acompañamos cada proyecto.",
    },
    about: {
      title: "Nosotros | 305 Web Service",
      description: "Un estudio digital de Miami que construye la parte digital de negocios en crecimiento con estrategia, diseño y tecnología.",
    },
    contact: {
      title: "Contacto | 305 Web Service",
      description: "Hablemos de tu próximo proyecto. Cuéntanos sobre tu negocio, tu idea o el proceso que quieres mejorar.",
    },
    privacy: {
      title: "Política de privacidad | 305 Web Service",
      description: "Cómo 305 Web Service recopila, usa y protege la información que compartes con nosotros.",
    },
    notFound: {
      title: "Página no encontrada | 305 Web Service",
      description: "Esta página no está aquí.",
    },
  },
  nav: {
    services: "Servicios", process: "Proceso", about: "Nosotros",
    contact: "Contacto", cta: "Hablemos", menuOpen: "Abrir menú", menuClose: "Cerrar menú",
    skip: "Saltar al contenido",
  },
  hero: {
    eyebrow1: "Miami · Florida", eyebrow2: "Digital Studio",
    lines: ["Creamos experiencias", "digitales que hacen", "crecer tu negocio."],
    text: "Diseñamos páginas web, tiendas en línea y soluciones digitales creadas alrededor de las necesidades reales de cada negocio.",
    ctaPrimary: "Comenzar un proyecto", ctaSecondary: "Ver servicios",
    scroll: "Scroll to explore",
  },
  positioning: {
    eyebrow: "No creamos solo páginas",
    title: "Construimos la parte digital de tu negocio.",
    text: "Cada proyecto combina estrategia, diseño y tecnología para crear una experiencia clara, rápida y preparada para crecer.",
  },
  services: {
    eyebrow: "Servicios",
    title1: "Soluciones diseñadas", title2: "alrededor de tu negocio.",
    items: servicesEs,
    pageIntro: "Ocho formas de ayudar a tu negocio a funcionar mejor online — cada una construida alrededor de tus procesos, no de una plantilla.",
    labels: {
      problem: "El problema que resuelve", includes: "Qué incluye", forWho: "Para quién es",
      integrations: "Integraciones", cta: "Hablar de este servicio",
    },
  },
  whatWeBuild: {
    eyebrow: "Qué construimos",
    titleLines: ["Productos digitales", "creados alrededor", "de necesidades reales."],
    text: "Desde sitios orientados a clientes hasta sistemas internos, diseñamos y desarrollamos experiencias digitales claras, útiles y preparadas para crecer.",
    panels: [
      {
        no: "01",
        category: "Diseño y desarrollo web",
        titleLines: ["Tu negocio,", "presentado con claridad."],
        text: "Sitios rápidos y adaptables, diseñados para comunicar tu valor y convertir la atención en acciones significativas.",
        caps: ["Estrategia", "UX/UI", "Desarrollo", "SEO"],
      },
      {
        no: "02",
        category: "E-commerce",
        titleLines: ["Del descubrimiento", "al pago."],
        text: "Tiendas en línea que hacen que los productos sean fáciles de explorar, comprar y administrar.",
        caps: ["Catálogo", "Pagos", "Inventario", "Automatización"],
      },
      {
        no: "03",
        category: "Aplicaciones personalizadas",
        titleLines: ["Menos trabajo manual.", "Mejores operaciones."],
        text: "Herramientas personalizadas que organizan información, conectan procesos y ayudan a los equipos a trabajar con mayor eficiencia.",
        caps: ["Paneles", "Flujos", "Integraciones", "Reportes"],
      },
    ],
    demos: {
      browser: { nav: ["Inicio", "Servicios", "Contacto"], head1: "Tu", head2: "marca.", cta: "Contáctanos" },
      shop: { title: "Catálogo", product: "Producto", qty: "Cant.", total: "Total", checkout: "Pagar" },
      dash: { nav: ["Resumen", "Solicitudes", "Clientes", "Reportes"], table: "Actividad reciente", done: "Listo", wip: "En curso", item: "Elemento" },
    },
    cta: {
      line1: "¿Tienes algo diferente en mente?",
      line2: "Construyámoslo.",
      button: "Comenzar un proyecto",
    },
  },
  process: {
    eyebrow: "Cómo trabajamos",
    title1: "De la idea", title2: "al lanzamiento.",
    steps: [
      { no: "01", name: "Descubrir", text: "Entendemos tu negocio, tus clientes y el problema que debemos resolver." },
      { no: "02", name: "Definir", text: "Organizamos el contenido, las funciones y la experiencia necesaria." },
      { no: "03", name: "Diseñar", text: "Creamos un sistema visual claro, coherente y adaptable." },
      { no: "04", name: "Construir", text: "Convertimos el diseño en una experiencia rápida y funcional." },
      { no: "05", name: "Lanzar", text: "Probamos, optimizamos y preparamos todo para publicación." },
      { no: "06", name: "Acompañar", text: "Ofrecemos mantenimiento, soporte y mejoras continuas." },
    ],
  },
  principles: {
    title1: "Menos ruido.", title2: "Más claridad.", title3: "Mejores experiencias.",
    items: [
      "Estrategia antes del diseño",
      "Diseño pensado para personas",
      "Tecnología elegida con propósito",
      "Soporte después del lanzamiento",
    ],
  },
  miami: {
    line1: "Built in Miami.", line2: "Made for growth.",
    text: "Trabajamos con negocios que buscan utilizar la tecnología de una forma más clara, útil y profesional.",
    micro: "Miami · Florida",
  },
  finalCta: {
    title1: "¿Listo para construir", title2: "algo mejor?",
    text: "Cuéntanos sobre tu negocio, tu idea o el proceso que quieres mejorar.",
    button: "Hablemos de tu proyecto",
  },
  footer: {
    tagline: "Digital solutions for growing businesses",
    navTitle: "Navegación", servicesTitle: "Servicios", contactTitle: "Contacto",
    privacy: "Política de privacidad", backToTop: "Volver arriba",
    rights: "Todos los derechos reservados.",
  },
  about: {
    eyebrow: "Nosotros",
    title: "Tecnología con un enfoque humano.",
    text: "305 Web Service es un estudio digital de Miami. Ayudamos a pequeños y medianos negocios a modernizar su forma de trabajar — con páginas web, tiendas en línea, automatización y herramientas digitales construidas alrededor de la realidad de cada empresa. Primero entendemos el problema; después construimos la solución que encaja.",
  },
  contact: {
    title1: "Hablemos de", title2: "tu próximo proyecto.",
    intro: "Cuéntanos qué necesitas — lo revisamos y te respondemos con un próximo paso claro. Atención en español e inglés.",
    labels: {
      name: "Nombre", company: "Empresa", companyOpt: "opcional",
      email: "Correo electrónico", phone: "Teléfono", phoneOpt: "opcional",
      service: "Servicio de interés", budget: "Presupuesto aproximado", budgetOpt: "opcional",
      message: "Mensaje", submit: "Enviar mensaje", sending: "Enviando…",
      consent: "Acepto que 305 Web Service me contacte sobre esta solicitud.",
      privacyLink: "Política de privacidad", required: "Los campos obligatorios están marcados con",
      selectService: "Selecciona un servicio…", selectBudget: "Selecciona un rango…",
    },
    success: {
      title: "Mensaje recibido.",
      text: "Gracias por escribirnos. Revisaremos tu proyecto y te responderemos pronto.",
      back: "Volver al inicio",
    },
    errors: {
      required: "Por favor completa todos los campos obligatorios.",
      email: "Por favor escribe un correo electrónico válido.",
      consent: "Por favor confirma que podemos contactarte sobre tu solicitud.",
      server: "Algo salió mal al enviar tu mensaje. Tu información no se perdió — inténtalo de nuevo, o escríbenos por WhatsApp o correo.",
    },
    note: "Respuesta inicial sin compromiso.",
  },
  formServices: [
    { value: "website", label: "Página web" },
    { value: "ecommerce", label: "Tienda en línea" },
    { value: "custom-app", label: "Aplicación personalizada" },
    { value: "automation", label: "Automatización" },
    { value: "seo", label: "SEO" },
    { value: "maintenance", label: "Mantenimiento" },
    { value: "other", label: "Otro" },
  ],
  formBudgets: [
    { value: "500-1500", label: "$500 – $1,500" },
    { value: "1500-5000", label: "$1,500 – $5,000" },
    { value: "5000-15000", label: "$5,000 – $15,000" },
    { value: "15000+", label: "Más de $15,000" },
    { value: "not-sure", label: "Aún no lo sé" },
  ],
  notFound: {
    title: "404", line1: "Esta página", line2: "no está aquí.", button: "Volver al inicio",
  },
  privacy: { title: "Política de privacidad", updated: "Última actualización" },
  langSwitch: { label: "Idioma", toOther: "View in English" },
};

export const C: Record<Locale, Dict> = { en, es };
