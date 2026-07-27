/**
 * Copy site-wide de 305 Web Service, inglés (default) + español completo.
 * Las 7 ofertas viven en offers.ts. Nunca se mezclan idiomas en una página.
 */
import type { Locale } from "~/lib/i18n";

interface Dict {
  meta: Record<string, { title: string; description: string }>;
  nav: {
    services: string; websitePackages: string; customSoftware: string;
    nfc: string; industries: string; process: string; about: string; contact: string;
    cta: string; menuOpen: string; menuClose: string; skip: string; whatsapp: string;
  };
  hero: {
    eyebrow: string; h1: string; sub: string; priceLine: string;
    ctaPrimary: string; ctaSecondary: string; trust: string[];
  };
  problems: { heading: string; items: string[]; cta: string };
  selector: { eyebrow: string; heading: string; sub: string; bestForLabel: string; includesLabel: string };
  whyCustom: { heading: string; sub: string; beforeLabel: string; before: string[]; afterLabel: string; after: string[] };
  industries: {
    eyebrow: string; heading: string; note: string;
    items: { name: string; problem: string; solutions: string }[];
  };
  process: { eyebrow: string; heading: string; steps: { no: string; name: string; text: string }[]; emphasis: string[] };
  proof: { eyebrow: string; heading: string; sub: string; items: string[] };
  engagement: { heading: string; options: { name: string; text: string }[] };
  faq: { eyebrow: string; heading: string; items: { q: string; a: string }[] };
  finalCta: { heading: string; text: string; ctaPrimary: string; ctaSecondary: string; note: string };
  footer: { tagline: string; servicesTitle: string; companyTitle: string; contactTitle: string; privacy: string; backToTop: string; rights: string };
  about: { eyebrow: string; heading: string; body: string[]; positioningHeading: string; positioning: string };
  servicePage: {
    problemsLabel: string; whoForLabel: string; deliverablesLabel: string;
    useCasesLabel: string; pricingLabel: string; faqLabel: string; relatedLabel: string;
  };
  contact: {
    eyebrow: string; title: string; intro: string;
    labels: {
      name: string; company: string; companyOpt: string; email: string; phone: string; phoneOpt: string;
      service: string; budget: string; budgetOpt: string; message: string;
      consent: string; privacyLink: string; submit: string; sending: string; required: string;
      selectService: string; selectBudget: string;
    };
    success: { title: string; text: string; back: string; whatsapp: string };
    errors: { required: string; email: string; consent: string; server: string };
    note: string;
    channelsTitle: string; whatsappLabel: string; whatsappSub: string; emailLabel: string;
  };
  formServices: { value: string; label: string }[];
  formBudgets: { value: string; label: string }[];
  notFound: { title: string; line1: string; line2: string; button: string };
  privacy: { title: string; updated: string; sections: { h: string; p: string }[] };
  langSwitch: { toOther: string };
  nfcCompliance: { heading: string; items: string[] };
}

const en: Dict = {
  meta: {
    home: {
      title: "305 Web Service | Web Design, Custom Software & IT Solutions in Miami",
      description: "Professional websites starting at $499, custom software, automation and IT solutions for small businesses in Miami and across the United States.",
    },
    services: { title: "Services | 305 Web Service", description: "Websites, online stores, custom software, automation, IT infrastructure and NFC business solutions — packaged around clear business outcomes." },
    websitePackages: { title: "Website Packages from $499 | 305 Web Service", description: "Professional websites for Miami small businesses. Website Starter from $499, Business Website and Online Store — mobile-first and built to convert." },
    customSoftware: { title: "Custom Software Development in Miami | 305 Web Service", description: "Custom web apps, portals, dashboards and internal tools built around your workflow. Replace spreadsheets and disconnected tools with software that fits." },
    automation: { title: "Business Automation & Integrations in Miami | 305 Web Service", description: "Automate repetitive work and connect the tools you already use — CRM, forms, email, WhatsApp and reporting. Fewer manual steps, faster responses." },
    itInfrastructure: { title: "IT Support & Infrastructure for Small Business Miami | 305 Web Service", description: "Business networks, Wi-Fi, cloud, servers, backups, security and support for Miami businesses. Reliable technology with someone to call." },
    nfc: { title: "NFC Business Cards & Contactless Solutions Miami | 305 Web Service", description: "NFC digital business cards, team cards, tap-to-review kits and contactless menus for Miami businesses — with QR fallback and honest compatibility." },
    industries: { title: "Solutions by Industry | 305 Web Service", description: "Practical websites, software, automation, IT and NFC solutions for contractors, professional services, healthcare, restaurants, retail and local businesses." },
    process: { title: "Our Process | 305 Web Service", description: "A clear path from problem to working solution: discovery, scope, design, build & test, launch & support — with transparent scope and no surprises." },
    about: { title: "About | 305 Web Service", description: "A Miami technology partner for small and growing businesses — websites, custom software, automation, IT and NFC, without enterprise-agency complexity." },
    contact: { title: "Request a Quote | 305 Web Service", description: "Tell us what you're trying to improve. We'll review the need and recommend the most practical next step. Service in English and Spanish." },
    privacy: { title: "Privacy Policy | 305 Web Service", description: "How 305 Web Service collects, uses and protects the information you share." },
    notFound: { title: "Page not found | 305 Web Service", description: "This page isn't here." },
  },
  nav: {
    services: "Services", websitePackages: "Website Packages", customSoftware: "Custom Software",
    nfc: "NFC Solutions", industries: "Industries", process: "Process", about: "About", contact: "Contact",
    cta: "Request a Quote", menuOpen: "Open menu", menuClose: "Close menu", skip: "Skip to content", whatsapp: "Chat on WhatsApp",
  },
  hero: {
    eyebrow: "Websites, Custom Software, NFC & IT Solutions",
    h1: "Technology that helps your business sell, operate and grow.",
    sub: "We build professional websites, custom business software, smart NFC experiences and practical IT solutions for small and growing companies in Miami and across the United States.",
    priceLine: "Professional websites starting at $499",
    ctaPrimary: "Request a Quote",
    ctaSecondary: "Explore Service Packages",
    trust: ["Based in Miami", "English & Spanish service", "Local & remote support", "Clear scope before work begins", "Direct communication"],
  },
  problems: {
    heading: "Technology should remove friction — not create more of it.",
    items: [
      "Your website looks outdated or doesn't generate inquiries.",
      "Your team depends on spreadsheets and manual follow-ups.",
      "Your systems don't communicate with each other.",
      "Your network, cloud tools or backups are unreliable.",
    ],
    cta: "Tell Us What's Slowing You Down",
  },
  selector: {
    eyebrow: "Service packages",
    heading: "Choose the outcome your business needs",
    sub: "Clear packages built around a real business result — not a list of technologies. Every one carries your selection straight into the quote form.",
    bestForLabel: "Best for", includesLabel: "Includes",
  },
  whyCustom: {
    heading: "Built around the way your business actually works",
    sub: "Off-the-shelf tools force your business into their shape. Custom software and automation fit your workflow instead.",
    beforeLabel: "Before",
    before: ["Spreadsheets as the system", "Duplicate data entry", "Manual follow-up", "Limited visibility"],
    afterLabel: "After",
    after: ["One connected workflow", "Automation", "Shared information", "Clear reporting"],
  },
  industries: {
    eyebrow: "Industries",
    heading: "Practical solutions for real businesses",
    note: "These are the businesses our services are designed to support. We connect an industry problem to the right package — including where NFC fits.",
    items: [
      { name: "Contractors & construction", problem: "You need a credible page and a fast way to capture leads on the job.", solutions: "Website + NFC digital business cards and lead capture." },
      { name: "Professional services", problem: "You want stronger positioning and an easy way to share contact details.", solutions: "Business Website + NFC contact cards and lead capture." },
      { name: "Healthcare & wellness", problem: "You need approved information pages and simple booking.", solutions: "Website + NFC contact cards and booking links." },
      { name: "Accounting, tax & insurance", problem: "Your team needs consistent contact cards and appointment links.", solutions: "Website + NFC team cards and appointment links." },
      { name: "Restaurants, retail & hospitality", problem: "You want contactless menus, reservations and easier review access.", solutions: "Online Store / menu + NFC menus and review access." },
      { name: "Local service businesses", problem: "You want more calls, bookings and reviews with less effort.", solutions: "Website + Automation + NFC WhatsApp, booking and review cards." },
    ],
  },
  process: {
    eyebrow: "How we work",
    heading: "A clear path from problem to working solution",
    steps: [
      { no: "01", name: "Discovery", text: "We understand the business, the users, the problem and the result you want." },
      { no: "02", name: "Scope", text: "We define deliverables, responsibilities, price and timeline in writing." },
      { no: "03", name: "Design", text: "We map the experience and approve the direction before full development." },
      { no: "04", name: "Build & Test", text: "We develop, review and test the solution together." },
      { no: "05", name: "Launch & Support", text: "We deploy, train your team and keep improving after launch." },
    ],
    emphasis: ["Clear scope", "Transparent communication", "Client review points", "No surprise additions"],
  },
  proof: {
    eyebrow: "What to expect",
    heading: "What you can expect when you work with us",
    sub: "We show verified proof as it becomes available. In the meantime, here's what every engagement includes.",
    items: ["Clear recommendations", "Defined deliverables", "Secure implementation", "Responsive communication", "Post-launch support options"],
  },
  engagement: {
    heading: "Start with the level of help you need",
    options: [
      { name: "Fixed-scope website package", text: "A defined package with a clear deliverable and price — the fastest way to launch." },
      { name: "Scoped custom project", text: "Software, automation or a store, scoped in discovery with a fixed proposal." },
      { name: "Ongoing support & maintenance", text: "Keep your website, systems or IT cared for after launch." },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Answers before you ask",
    items: [
      { q: "What's included in the $499 website?", a: "A one-page or landing-page website with a conversion-focused structure, responsive design, a contact form, WhatsApp integration, social links, domain and SSL setup, basic on-page SEO and one revision round." },
      { q: "Are hosting and domain fees included?", a: "No. The $499 covers design and build. Domain, hosting and maintenance are quoted separately and listed clearly before you approve." },
      { q: "How long does a website take?", a: "It depends on scope and how quickly content is ready. We confirm a realistic timeline in your scope before starting — we don't promise a universal turnaround." },
      { q: "How is custom software priced?", a: "With a scoped proposal after a short discovery, usually starting with the smallest version that delivers real value." },
      { q: "Can you improve an existing system?", a: "Often yes. We review what you have and recommend improving or replacing it based on what serves the business best." },
      { q: "Can you integrate with our current tools?", a: "Usually — CRMs, forms, email, WhatsApp, payment and scheduling tools. We confirm feasibility in discovery." },
      { q: "Do you provide support after launch?", a: "Yes. Ongoing support and maintenance are available as a separate engagement." },
      { q: "Do you work on-site in Miami?", a: "Yes — remote and on-site support in the Miami area." },
      { q: "Do you serve clients outside Florida?", a: "Yes. We serve clients remotely across the United States." },
      { q: "Can we work in Spanish?", a: "Yes. We work in English and Spanish." },
    ],
  },
  finalCta: {
    heading: "Let's turn your technology problem into a clear next step.",
    text: "Tell us what you're trying to improve. We'll review the need and recommend the most practical way forward.",
    ctaPrimary: "Request a Quote", ctaSecondary: "Chat on WhatsApp",
    note: "No-obligation initial response.",
  },
  footer: {
    tagline: "The practical technology partner for small and growing businesses in Miami and across the U.S.",
    servicesTitle: "Services", companyTitle: "Company", contactTitle: "Contact",
    privacy: "Privacy Policy", backToTop: "Back to top", rights: "All rights reserved.",
  },
  about: {
    eyebrow: "About us",
    heading: "The practical technology partner for growing businesses.",
    body: [
      "305 Web Service helps small and growing businesses use technology to sell, operate and grow — without the complexity or price tag of an enterprise agency.",
      "We package our work around clear business outcomes: professional websites, custom software, automation, IT infrastructure and NFC business solutions. First we understand the problem; then we recommend the most practical way forward and put the scope in writing.",
      "We're based in Miami and serve clients on-site locally and remotely across the United States, in English and Spanish.",
    ],
    positioningHeading: "More capable than a freelancer. More accessible than a big agency.",
    positioning: "You get the technical range to connect websites, software, IT and contactless NFC — with direct communication and a clear scope before any work begins.",
  },
  servicePage: {
    problemsLabel: "The problem it solves", whoForLabel: "Who it's for", deliverablesLabel: "What you get",
    useCasesLabel: "Example use cases", pricingLabel: "How it's priced", faqLabel: "Questions", relatedLabel: "Explore other packages",
  },
  contact: {
    eyebrow: "Contact",
    title: "Request a quote",
    intro: "Tell us what you're trying to improve. We'll review the need and recommend the most practical next step — in English or Spanish.",
    labels: {
      name: "Name", company: "Company", companyOpt: "optional", email: "Email", phone: "Phone", phoneOpt: "optional",
      service: "Service needed", budget: "Estimated budget", budgetOpt: "optional", message: "Project description",
      consent: "I agree to be contacted by 305 Web Service about this request.", privacyLink: "Privacy Policy",
      submit: "Request a Quote", sending: "Sending…", required: "Required fields are marked with",
      selectService: "Select a service…", selectBudget: "Select a range…",
    },
    success: { title: "Request received.", text: "Thanks for reaching out. We'll review your project and get back to you using your preferred contact method.", back: "Back to home", whatsapp: "Chat on WhatsApp" },
    errors: {
      required: "Please complete all required fields.", email: "Please enter a valid email address.",
      consent: "Please confirm that we may contact you about your request.",
      server: "Something went wrong sending your request. Your information wasn't lost — please try again, or reach us by WhatsApp or email.",
    },
    note: "No-obligation initial response.",
    channelsTitle: "Prefer to talk now?", whatsappLabel: "Chat on WhatsApp", whatsappSub: "Fastest way to reach us", emailLabel: "Email",
  },
  formServices: [
    { value: "website-starter", label: "Website Starter ($499)" },
    { value: "business-website", label: "Business Website" },
    { value: "online-store", label: "Online Store" },
    { value: "custom-software", label: "Custom Business Software" },
    { value: "automation", label: "Automation & Integrations" },
    { value: "it-infrastructure", label: "IT Infrastructure & Support" },
    { value: "nfc", label: "NFC Business Solutions" },
    { value: "other", label: "Other / Not sure yet" },
  ],
  formBudgets: [
    { value: "500-1500", label: "$500 – $1,500" },
    { value: "1500-5000", label: "$1,500 – $5,000" },
    { value: "5000-15000", label: "$5,000 – $15,000" },
    { value: "15000+", label: "More than $15,000" },
    { value: "not-sure", label: "Not sure yet" },
  ],
  notFound: { title: "404", line1: "This page", line2: "isn't here.", button: "Back to home" },
  privacy: {
    title: "Privacy Policy", updated: "Last updated: July 2026",
    sections: [
      { h: "Information we collect", p: "When you submit our quote form we collect the information you provide: name, company (optional), email, phone (optional), the service you're interested in, an estimated budget (optional) and your message. With your consent and where analytics is enabled, we may also record referral and campaign parameters (UTM)." },
      { h: "How we use it", p: "We use this information only to review your request and contact you about it. We do not sell, rent or share your information with third parties for marketing." },
      { h: "Analytics", p: "If analytics is enabled, we measure aggregate site usage and events such as CTA clicks and form submissions. We do not send personal information to analytics." },
      { h: "Where it's stored", p: "Form submissions are stored in a private database accessible only to the 305 Web Service team." },
      { h: "Your choices", p: "You can ask us to correct or delete your information at any time by writing to 305webservice@gmail.com." },
    ],
  },
  langSwitch: { toOther: "Ver en español" },
  nfcCompliance: {
    heading: "Honest by design",
    items: [
      "NFC doesn't work on every device — every solution ships with a visible QR fallback.",
      "We tell you exactly what opens after a tap.",
      "Nothing personal is collected without the visitor's consent.",
      "We make it easier to reach your legitimate review page — we never gate, filter or incentivize reviews, and promise no rating or outcome.",
      "We only advertise updates, analytics or hosting that the chosen setup actually supports.",
    ],
  },
};

const es: Dict = {
  meta: {
    home: {
      title: "305 Web Service | Diseño web, software a medida y soluciones IT en Miami",
      description: "Webs profesionales desde $499, software a medida, automatización y soluciones IT para pequeños negocios en Miami y en todo Estados Unidos.",
    },
    services: { title: "Servicios | 305 Web Service", description: "Webs, tiendas en línea, software a medida, automatización, infraestructura IT y soluciones NFC — empaquetadas alrededor de resultados de negocio claros." },
    websitePackages: { title: "Paquetes web desde $499 | 305 Web Service", description: "Webs profesionales para pequeños negocios de Miami. Web Starter desde $499, Web Empresarial y Tienda en Línea — mobile-first y hechas para convertir." },
    customSoftware: { title: "Software a medida en Miami | 305 Web Service", description: "Apps web, portales, paneles y herramientas internas a medida, construidas alrededor de tu flujo de trabajo. Reemplaza hojas de cálculo y herramientas desconectadas." },
    automation: { title: "Automatización e integraciones en Miami | 305 Web Service", description: "Automatiza el trabajo repetitivo y conecta las herramientas que ya usas — CRM, formularios, correo, WhatsApp y reportes. Menos pasos manuales, respuestas más rápidas." },
    itInfrastructure: { title: "Soporte e infraestructura IT para pymes en Miami | 305 Web Service", description: "Redes, Wi-Fi, nube, servidores, respaldos, seguridad y soporte para negocios de Miami. Tecnología confiable con alguien a quién llamar." },
    nfc: { title: "Tarjetas NFC y soluciones sin contacto en Miami | 305 Web Service", description: "Tarjetas NFC digitales, tarjetas de equipo, kits tap-to-reseña y menús sin contacto para negocios de Miami — con respaldo QR y compatibilidad honesta." },
    industries: { title: "Soluciones por industria | 305 Web Service", description: "Webs, software, automatización, IT y NFC prácticos para contratistas, servicios profesionales, salud, restaurantes, retail y negocios locales." },
    process: { title: "Nuestro proceso | 305 Web Service", description: "Un camino claro del problema a la solución: descubrimiento, alcance, diseño, construcción y pruebas, lanzamiento y soporte — con alcance transparente y sin sorpresas." },
    about: { title: "Nosotros | 305 Web Service", description: "Un socio tecnológico de Miami para pequeños negocios en crecimiento — webs, software a medida, automatización, IT y NFC, sin la complejidad de una agencia grande." },
    contact: { title: "Solicitar cotización | 305 Web Service", description: "Cuéntanos qué quieres mejorar. Revisamos la necesidad y recomendamos el próximo paso más práctico. Atención en español e inglés." },
    privacy: { title: "Política de privacidad | 305 Web Service", description: "Cómo 305 Web Service recopila, usa y protege la información que compartes." },
    notFound: { title: "Página no encontrada | 305 Web Service", description: "Esta página no está aquí." },
  },
  nav: {
    services: "Servicios", websitePackages: "Paquetes web", customSoftware: "Software a medida",
    nfc: "Soluciones NFC", industries: "Industrias", process: "Proceso", about: "Nosotros", contact: "Contacto",
    cta: "Solicitar cotización", menuOpen: "Abrir menú", menuClose: "Cerrar menú", skip: "Saltar al contenido", whatsapp: "Chatear por WhatsApp",
  },
  hero: {
    eyebrow: "Webs, software a medida, NFC y soluciones IT",
    h1: "Tecnología que ayuda a tu negocio a vender, operar y crecer.",
    sub: "Creamos webs profesionales, software de negocio a medida, experiencias NFC inteligentes y soluciones IT prácticas para pequeñas y medianas empresas en Miami y en todo Estados Unidos.",
    priceLine: "Webs profesionales desde $499",
    ctaPrimary: "Solicitar cotización",
    ctaSecondary: "Ver paquetes de servicio",
    trust: ["Con base en Miami", "Atención en español e inglés", "Soporte local y remoto", "Alcance claro antes de empezar", "Comunicación directa"],
  },
  problems: {
    heading: "La tecnología debería quitar fricción — no crear más.",
    items: [
      "Tu web se ve desactualizada o no genera consultas.",
      "Tu equipo depende de hojas de cálculo y seguimientos manuales.",
      "Tus sistemas no se comunican entre sí.",
      "Tu red, tus herramientas en la nube o tus respaldos no son confiables.",
    ],
    cta: "Cuéntanos qué te está frenando",
  },
  selector: {
    eyebrow: "Paquetes de servicio",
    heading: "Elige el resultado que tu negocio necesita",
    sub: "Paquetes claros construidos alrededor de un resultado de negocio real — no una lista de tecnologías. Cada uno lleva tu selección directo al formulario de cotización.",
    bestForLabel: "Ideal para", includesLabel: "Incluye",
  },
  whyCustom: {
    heading: "Construido alrededor de cómo realmente trabaja tu negocio",
    sub: "Las herramientas genéricas obligan a tu negocio a su forma. El software a medida y la automatización se adaptan a tu flujo.",
    beforeLabel: "Antes",
    before: ["Hojas de cálculo como el sistema", "Captura de datos duplicada", "Seguimiento manual", "Visibilidad limitada"],
    afterLabel: "Después",
    after: ["Un flujo conectado", "Automatización", "Información compartida", "Reportes claros"],
  },
  industries: {
    eyebrow: "Industrias",
    heading: "Soluciones prácticas para negocios reales",
    note: "Estos son los negocios para los que están diseñados nuestros servicios. Conectamos un problema de industria con el paquete correcto — incluyendo dónde encaja el NFC.",
    items: [
      { name: "Contratistas y construcción", problem: "Necesitas una página creíble y una forma rápida de captar leads en obra.", solutions: "Web + tarjetas NFC digitales y captación de leads." },
      { name: "Servicios profesionales", problem: "Quieres mejor posicionamiento y una forma fácil de compartir tu contacto.", solutions: "Web Empresarial + tarjetas NFC de contacto y captación." },
      { name: "Salud y bienestar", problem: "Necesitas páginas de información aprobadas y reservas simples.", solutions: "Web + tarjetas NFC de contacto y enlaces de reserva." },
      { name: "Contabilidad, impuestos y seguros", problem: "Tu equipo necesita tarjetas de contacto consistentes y enlaces de cita.", solutions: "Web + tarjetas NFC de equipo y enlaces de cita." },
      { name: "Restaurantes, retail y hospitalidad", problem: "Quieres menús sin contacto, reservas y acceso más fácil a reseñas.", solutions: "Tienda / menú + menús NFC y acceso a reseñas." },
      { name: "Negocios de servicios locales", problem: "Quieres más llamadas, reservas y reseñas con menos esfuerzo.", solutions: "Web + Automatización + tarjetas NFC de WhatsApp, reserva y reseña." },
    ],
  },
  process: {
    eyebrow: "Cómo trabajamos",
    heading: "Un camino claro del problema a la solución que funciona",
    steps: [
      { no: "01", name: "Descubrimiento", text: "Entendemos el negocio, los usuarios, el problema y el resultado que quieres." },
      { no: "02", name: "Alcance", text: "Definimos entregables, responsabilidades, precio y plazo por escrito." },
      { no: "03", name: "Diseño", text: "Mapeamos la experiencia y aprobamos la dirección antes del desarrollo completo." },
      { no: "04", name: "Construcción y pruebas", text: "Desarrollamos, revisamos y probamos la solución juntos." },
      { no: "05", name: "Lanzamiento y soporte", text: "Publicamos, capacitamos a tu equipo y seguimos mejorando tras el lanzamiento." },
    ],
    emphasis: ["Alcance claro", "Comunicación transparente", "Puntos de revisión con el cliente", "Sin agregados sorpresa"],
  },
  proof: {
    eyebrow: "Qué esperar",
    heading: "Lo que puedes esperar al trabajar con nosotros",
    sub: "Mostramos pruebas verificadas a medida que estén disponibles. Mientras tanto, esto es lo que incluye cada proyecto.",
    items: ["Recomendaciones claras", "Entregables definidos", "Implementación segura", "Comunicación responsiva", "Opciones de soporte post-lanzamiento"],
  },
  engagement: {
    heading: "Empieza con el nivel de ayuda que necesitas",
    options: [
      { name: "Paquete web de alcance fijo", text: "Un paquete definido con entregable y precio claros — la forma más rápida de lanzar." },
      { name: "Proyecto a medida con alcance", text: "Software, automatización o tienda, con alcance definido en el descubrimiento y propuesta fija." },
      { name: "Soporte y mantenimiento continuo", text: "Mantén tu web, tus sistemas o tu IT cuidados después del lanzamiento." },
    ],
  },
  faq: {
    eyebrow: "Preguntas",
    heading: "Respuestas antes de preguntar",
    items: [
      { q: "¿Qué incluye la web de $499?", a: "Una web de una página o landing con estructura orientada a conversión, diseño responsive, formulario de contacto, integración con WhatsApp, enlaces sociales, configuración de dominio y SSL, SEO básico y una ronda de revisión." },
      { q: "¿El hosting y el dominio están incluidos?", a: "No. Los $499 cubren diseño y desarrollo. Dominio, hosting y mantenimiento se cotizan aparte y se listan con claridad antes de aprobar." },
      { q: "¿Cuánto tarda una web?", a: "Depende del alcance y de qué tan rápido esté el contenido. Confirmamos un plazo realista en tu alcance antes de empezar — no prometemos un tiempo universal." },
      { q: "¿Cómo se cotiza el software a medida?", a: "Con una propuesta con alcance tras un descubrimiento corto, normalmente empezando por la versión más pequeña que entrega valor real." },
      { q: "¿Pueden mejorar un sistema existente?", a: "A menudo sí. Revisamos lo que tienes y recomendamos mejorarlo o reemplazarlo según lo que convenga al negocio." },
      { q: "¿Pueden integrarse con nuestras herramientas actuales?", a: "Normalmente — CRMs, formularios, correo, WhatsApp, pagos y agendas. Confirmamos la viabilidad en el descubrimiento." },
      { q: "¿Dan soporte después del lanzamiento?", a: "Sí. El soporte y mantenimiento continuo están disponibles como servicio aparte." },
      { q: "¿Trabajan presencialmente en Miami?", a: "Sí — soporte remoto y presencial en el área de Miami." },
      { q: "¿Atienden clientes fuera de Florida?", a: "Sí. Atendemos clientes de forma remota en todo Estados Unidos." },
      { q: "¿Podemos trabajar en español?", a: "Sí. Trabajamos en español e inglés." },
    ],
  },
  finalCta: {
    heading: "Convirtamos tu problema tecnológico en un próximo paso claro.",
    text: "Cuéntanos qué quieres mejorar. Revisamos la necesidad y recomendamos la forma más práctica de avanzar.",
    ctaPrimary: "Solicitar cotización", ctaSecondary: "Chatear por WhatsApp",
    note: "Respuesta inicial sin compromiso.",
  },
  footer: {
    tagline: "El socio tecnológico práctico para pequeños negocios en crecimiento en Miami y todo EE. UU.",
    servicesTitle: "Servicios", companyTitle: "Empresa", contactTitle: "Contacto",
    privacy: "Política de privacidad", backToTop: "Volver arriba", rights: "Todos los derechos reservados.",
  },
  about: {
    eyebrow: "Nosotros",
    heading: "El socio tecnológico práctico para negocios en crecimiento.",
    body: [
      "305 Web Service ayuda a pequeños negocios en crecimiento a usar la tecnología para vender, operar y crecer — sin la complejidad ni el precio de una agencia grande.",
      "Empaquetamos nuestro trabajo alrededor de resultados de negocio claros: webs profesionales, software a medida, automatización, infraestructura IT y soluciones NFC. Primero entendemos el problema; después recomendamos la forma más práctica de avanzar y ponemos el alcance por escrito.",
      "Estamos en Miami y atendemos clientes presencialmente en el área local y de forma remota en todo Estados Unidos, en español e inglés.",
    ],
    positioningHeading: "Más capaz que un freelancer. Más accesible que una agencia grande.",
    positioning: "Obtienes el rango técnico para conectar webs, software, IT y NFC sin contacto — con comunicación directa y un alcance claro antes de empezar.",
  },
  servicePage: {
    problemsLabel: "El problema que resuelve", whoForLabel: "Para quién es", deliverablesLabel: "Qué recibes",
    useCasesLabel: "Casos de uso", pricingLabel: "Cómo se cotiza", faqLabel: "Preguntas", relatedLabel: "Ver otros paquetes",
  },
  contact: {
    eyebrow: "Contacto",
    title: "Solicitar cotización",
    intro: "Cuéntanos qué quieres mejorar. Revisamos la necesidad y recomendamos el próximo paso más práctico — en español o inglés.",
    labels: {
      name: "Nombre", company: "Empresa", companyOpt: "opcional", email: "Correo electrónico", phone: "Teléfono", phoneOpt: "opcional",
      service: "Servicio de interés", budget: "Presupuesto estimado", budgetOpt: "opcional", message: "Descripción del proyecto",
      consent: "Acepto que 305 Web Service me contacte sobre esta solicitud.", privacyLink: "Política de privacidad",
      submit: "Solicitar cotización", sending: "Enviando…", required: "Los campos obligatorios están marcados con",
      selectService: "Selecciona un servicio…", selectBudget: "Selecciona un rango…",
    },
    success: { title: "Solicitud recibida.", text: "Gracias por escribirnos. Revisaremos tu proyecto y te responderemos por tu método de contacto preferido.", back: "Volver al inicio", whatsapp: "Chatear por WhatsApp" },
    errors: {
      required: "Por favor completa todos los campos obligatorios.", email: "Por favor escribe un correo electrónico válido.",
      consent: "Por favor confirma que podemos contactarte sobre tu solicitud.",
      server: "Algo salió mal al enviar tu solicitud. Tu información no se perdió — inténtalo de nuevo, o escríbenos por WhatsApp o correo.",
    },
    note: "Respuesta inicial sin compromiso.",
    channelsTitle: "¿Prefieres hablar ahora?", whatsappLabel: "Chatear por WhatsApp", whatsappSub: "La forma más rápida de contactarnos", emailLabel: "Correo",
  },
  formServices: [
    { value: "website-starter", label: "Web Starter ($499)" },
    { value: "business-website", label: "Web Empresarial" },
    { value: "online-store", label: "Tienda en Línea" },
    { value: "custom-software", label: "Software a Medida" },
    { value: "automation", label: "Automatización e Integraciones" },
    { value: "it-infrastructure", label: "Infraestructura IT y Soporte" },
    { value: "nfc", label: "Soluciones NFC" },
    { value: "other", label: "Otro / Aún no lo sé" },
  ],
  formBudgets: [
    { value: "500-1500", label: "$500 – $1,500" },
    { value: "1500-5000", label: "$1,500 – $5,000" },
    { value: "5000-15000", label: "$5,000 – $15,000" },
    { value: "15000+", label: "Más de $15,000" },
    { value: "not-sure", label: "Aún no lo sé" },
  ],
  notFound: { title: "404", line1: "Esta página", line2: "no está aquí.", button: "Volver al inicio" },
  privacy: {
    title: "Política de privacidad", updated: "Última actualización: julio 2026",
    sections: [
      { h: "Información que recopilamos", p: "Cuando envías nuestro formulario de cotización recopilamos la información que das: nombre, empresa (opcional), correo, teléfono (opcional), el servicio que te interesa, un presupuesto estimado (opcional) y tu mensaje. Con tu consentimiento y donde la analítica esté activa, podemos registrar parámetros de referencia y campaña (UTM)." },
      { h: "Cómo la usamos", p: "Usamos esta información únicamente para revisar tu solicitud y contactarte. No vendemos, alquilamos ni compartimos tu información con terceros con fines de marketing." },
      { h: "Analítica", p: "Si la analítica está activa, medimos el uso agregado del sitio y eventos como clics en CTA y envíos de formulario. No enviamos información personal a la analítica." },
      { h: "Dónde se guarda", p: "Los envíos del formulario se almacenan en una base de datos privada a la que solo accede el equipo de 305 Web Service." },
      { h: "Tus opciones", p: "Puedes pedirnos corregir o eliminar tu información en cualquier momento escribiendo a 305webservice@gmail.com." },
    ],
  },
  langSwitch: { toOther: "View in English" },
  nfcCompliance: {
    heading: "Honesto por diseño",
    items: [
      "El NFC no funciona en todos los dispositivos — cada solución incluye un respaldo QR visible.",
      "Te decimos exactamente qué abre después de un toque.",
      "Nada personal se recopila sin el consentimiento del visitante.",
      "Facilitamos llegar a tu página de reseñas legítima — nunca filtramos, condicionamos ni incentivamos reseñas, y no prometemos ninguna calificación ni resultado.",
      "Solo anunciamos actualizaciones, analítica u hosting que la configuración elegida realmente soporte.",
    ],
  },
};

export const C: Record<Locale, Dict> = { en, es };
