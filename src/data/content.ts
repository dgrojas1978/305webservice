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
  /** Los 4 servicios que vendemos, con nombre concreto y enlace a su página. */
  capabilities: {
    heading: string;
    linkLabel: string;
    groups: { name: string; text: string; href: string }[];
  };
  /** Cuatro pasos. Sustituye al proceso de cinco. */
  approach: {
    heading: string;
    steps: { name: string; text: string }[];
    cta: string;
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
  /** La tarjeta 305 real, mostrada en la página NFC como prueba tangible. */
  nfcShowcase: { eyebrow: string; heading: string; text: string; frontLabel: string; backLabel: string };
}

const en: Dict = {
  meta: {
    home: {
      title: "305 Web Service | Websites, NFC Cards & Digital Marketing in Miami",
      description: "Websites from $499, NFC business cards, digital marketing and custom software for small businesses in Miami and across the U.S. — in English and Spanish.",
    },
    services: { title: "Services | 305 Web Service", description: "Websites, online stores, custom software, automation, IT infrastructure and NFC business solutions — packaged around clear business outcomes." },
    websitePackages: { title: "Website Packages from $499 | 305 Web Service", description: "Professional websites for Miami small businesses. Website Starter from $499, Business Website and Online Store — mobile-first and built to convert." },
    customSoftware: { title: "Custom Software Development in Miami | 305 Web Service", description: "Custom web apps, portals, dashboards and internal tools built around your workflow. Replace spreadsheets and disconnected tools with software that fits." },
    automation: { title: "Digital Marketing & Automation in Miami | 305 Web Service", description: "Campaign landing pages, Meta & Google ads, review funnels, WhatsApp and email workflows — more leads with less manual work, for Miami businesses." },
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
    eyebrow: "Websites · NFC Cards · Marketing · Custom Software",
    h1: "Websites that bring you customers.",
    sub: "Professional websites, NFC business cards, digital marketing and custom software — for businesses in Miami and across the U.S.",
    priceLine: "",
    ctaPrimary: "Get a Free Quote",
    ctaSecondary: "View our work",
    trust: ["Real projects", "English & Spanish", "You own your site & domain"],
  },
  capabilities: {
    heading: "What we do.",
    linkLabel: "See details",
    groups: [
      { name: "Websites",
        text: "Professional sites and online stores — mobile-first, bilingual and built to turn visitors into calls.",
        href: "/website-packages" },
      { name: "Digital marketing",
        text: "SEO-ready pages, review funnels, WhatsApp lead capture and campaigns that make your phone ring.",
        href: "/automation-integrations" },
      { name: "NFC business cards",
        text: "Tap-to-share cards, team cards and review kits — one tap and your client has your contact.",
        href: "/nfc-business-solutions" },
      { name: "Custom solutions",
        text: "Software, automation and integrations shaped around how your business actually works.",
        href: "/custom-software" },
    ],
  },
  approach: {
    heading: "Built around the business — not around a template.",
    steps: [
      { name: "Understand", text: "Clarify the business, audience and objective." },
      { name: "Design", text: "Define the experience, message and system." },
      { name: "Build", text: "Develop, integrate and test the solution." },
      { name: "Evolve", text: "Support improvements as the business changes." },
    ],
    cta: "Get a Free Quote",
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
    heading: "Let's build what your business needs next.",
    text: "Tell us what you want to improve. We'll recommend a practical direction and a clear next step.",
    ctaPrimary: "Start a project", ctaSecondary: "Chat on WhatsApp",
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
    { value: "automation", label: "Digital Marketing & Automation" },
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
      { h: "Information you give us", p: "When you submit our quote form we collect what you provide: name, company (optional), email, phone (optional), the service you're interested in, an estimated budget (optional) and your message. If you use a contact-exchange form on a digital card, we collect what you type there." },
      { h: "Information collected automatically when you tap or scan a card", p: "Tapping an NFC card, scanning its QR code or opening one of our short links records: your IP address; an approximate location derived from that IP — country, region, city, time zone and approximate coordinates; your device and browser as reported by your browser; the page that referred you, if any; campaign parameters in the link (UTM); which card was tapped and when. This happens automatically, without asking you first." },
      { h: "Approximate location, not GPS", p: "The location comes from looking up your IP address. It is accurate to a city at best and often points to your internet provider rather than to you. We never ask for or use your device's precise location." },
      { h: "Anonymous browser identifier", p: "We store a random number in a cookie named 305_v for 12 months. It contains no personal information. It exists so we can tell 100 taps apart from 68 devices, and so a tap can be connected to what happened next on the card. You can delete it or block cookies in your browser; the card still works." },
      { h: "Card activity", p: "On our digital cards we record actions such as opening the card, viewing a project, changing language, copying the link, saving the contact and clicking to call, message or email. We record that the action happened, tied to the anonymous identifier — not who you are." },
      { h: "How we use it, and who sees it", p: "We use this to operate the cards and to measure how they perform. We may share performance reports with the business that owns a given card — figures such as number of taps, unique devices, cities, device types, times of day and contact actions. Those reports never include IP addresses." },
      { h: "What we don't do", p: "We do not sell or rent your information. We do not share it with advertising networks. We do not use it to build profiles about you as an individual, and we do not attempt to identify you from it." },
      { h: "How long we keep it", p: "Tap and card-activity records are deleted automatically 12 months after they are recorded. This is enforced by the database itself, not by a manual process." },
      { h: "Where it's stored", p: "Everything is stored in a private database accessible only to the 305 Web Service team. Our site is hosted on Vercel, which processes requests on our behalf. The card map is drawn with map tiles served by OpenStreetMap, and is only used inside our private admin panel." },
      { h: "Your choices", p: "You can delete the 305_v cookie or block cookies at any time. You can ask us what we hold about you, or ask us to delete it, by writing to 305webservice@gmail.com." },
    ],
  },
  langSwitch: { toOther: "Ver en español" },
  nfcShowcase: {
    eyebrow: "Our own card",
    heading: "This is a real card — ours.",
    text: "The exact NFC card we hand out in Miami. Tap it or scan the QR and it opens our site. Yours works the same way — your brand, your destination, updatable without reprinting when the setup supports it.",
    frontLabel: "Front",
    backLabel: "Back",
  },
  nfcCompliance: {
    heading: "Honest by design",
    items: [
      "NFC doesn't work on every device — every solution ships with a visible QR fallback.",
      "We tell you exactly what opens after a tap.",
      "A tap records the visitor's IP, an approximate city from that IP and an anonymous browser identifier — our privacy policy says so plainly instead of claiming we collect nothing.",
      "We make it easier to reach your legitimate review page — we never gate, filter or incentivize reviews, and promise no rating or outcome.",
      "We only advertise updates, analytics or hosting that the chosen setup actually supports.",
    ],
  },
};

const es: Dict = {
  meta: {
    home: {
      title: "305 Web Service | Páginas web, tarjetas NFC y marketing digital en Miami",
      description: "Webs desde $499, tarjetas NFC, marketing digital y software a medida para pequeños negocios en Miami y todo EE. UU. — en español e inglés.",
    },
    services: { title: "Servicios | 305 Web Service", description: "Webs, tiendas en línea, software a medida, automatización, infraestructura IT y soluciones NFC — empaquetadas alrededor de resultados de negocio claros." },
    websitePackages: { title: "Paquetes web desde $499 | 305 Web Service", description: "Webs profesionales para pequeños negocios de Miami. Web Starter desde $499, Web Empresarial y Tienda en Línea — mobile-first y hechas para convertir." },
    customSoftware: { title: "Software a medida en Miami | 305 Web Service", description: "Apps web, portales, paneles y herramientas internas a medida, construidas alrededor de tu flujo de trabajo. Reemplaza hojas de cálculo y herramientas desconectadas." },
    automation: { title: "Marketing digital y automatización en Miami | 305 Web Service", description: "Landing pages de campaña, Meta y Google Ads, rutas de reseñas, flujos de WhatsApp y correo — más clientes con menos trabajo manual, para negocios de Miami." },
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
    eyebrow: "Páginas Web · Tarjetas NFC · Marketing · Software a Medida",
    h1: "Webs que te traen clientes.",
    sub: "Webs profesionales, tarjetas NFC, marketing digital y software a medida — para negocios en Miami y todo Estados Unidos.",
    priceLine: "",
    ctaPrimary: "Cotización gratis",
    ctaSecondary: "Ver nuestro trabajo",
    trust: ["Proyectos reales", "Español e inglés", "Eres dueño de tu sitio y dominio"],
  },
  capabilities: {
    heading: "Lo que hacemos.",
    linkLabel: "Ver detalles",
    groups: [
      { name: "Páginas web",
        text: "Sitios profesionales y tiendas en línea — mobile-first, bilingües y hechos para convertir visitas en llamadas.",
        href: "/es/paquetes-web" },
      { name: "Marketing digital",
        text: "Páginas listas para Google, rutas de reseñas, captación por WhatsApp y campañas que hacen sonar el teléfono.",
        href: "/es/automatizacion-integraciones" },
      { name: "Tarjetas NFC",
        text: "Tarjetas tap-to-share, tarjetas de equipo y kits de reseñas — un toque y tu cliente tiene tu contacto.",
        href: "/es/soluciones-nfc" },
      { name: "Soluciones a medida",
        text: "Software, automatización e integraciones construidas alrededor de cómo trabaja realmente tu negocio.",
        href: "/es/software-a-medida" },
    ],
  },
  approach: {
    heading: "Construido alrededor del negocio, no de una plantilla.",
    steps: [
      { name: "Entender", text: "Aclarar el negocio, la audiencia y el objetivo." },
      { name: "Diseñar", text: "Definir la experiencia, el mensaje y el sistema." },
      { name: "Construir", text: "Desarrollar, integrar y probar la solución." },
      { name: "Evolucionar", text: "Acompañar mejoras a medida que el negocio cambia." },
    ],
    cta: "Cotización gratis",
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
    heading: "Construyamos lo que tu negocio necesita ahora.",
    text: "Cuéntanos qué quieres mejorar. Te recomendamos una dirección práctica y un próximo paso claro.",
    ctaPrimary: "Empezar un proyecto", ctaSecondary: "Chatear por WhatsApp",
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
    { value: "automation", label: "Marketing Digital y Automatización" },
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
      { h: "Información que nos das", p: "Cuando envías nuestro formulario de cotización recopilamos lo que escribes: nombre, empresa (opcional), correo, teléfono (opcional), el servicio que te interesa, un presupuesto estimado (opcional) y tu mensaje. Si usas un formulario de intercambio de contacto en una tarjeta digital, recopilamos lo que escribas ahí." },
      { h: "Información que se recoge sola al tocar o escanear una tarjeta", p: "Acercar una tarjeta NFC, escanear su código QR o abrir uno de nuestros enlaces cortos registra: tu dirección IP; una ubicación aproximada derivada de esa IP — país, región, ciudad, zona horaria y coordenadas aproximadas; tu dispositivo y navegador tal como los declara tu navegador; la página desde la que llegaste, si la hay; los parámetros de campaña del enlace (UTM); y qué tarjeta se tocó y cuándo. Ocurre automáticamente, sin preguntarte antes." },
      { h: "Ubicación aproximada, no GPS", p: "La ubicación sale de consultar tu dirección IP. Como mucho acierta la ciudad, y a menudo señala a tu proveedor de internet y no a ti. Nunca pedimos ni usamos la ubicación precisa de tu dispositivo." },
      { h: "Identificador anónimo de navegador", p: "Guardamos un número aleatorio en una cookie llamada 305_v durante 12 meses. No contiene ningún dato personal. Existe para poder distinguir 100 toques de 68 dispositivos, y para unir un toque con lo que pasó después en la tarjeta. Puedes borrarla o bloquear las cookies en tu navegador; la tarjeta sigue funcionando igual." },
      { h: "Actividad en la tarjeta", p: "En nuestras tarjetas digitales registramos acciones como abrir la tarjeta, ver un proyecto, cambiar de idioma, copiar el enlace, guardar el contacto y pulsar para llamar, escribir o mandar correo. Registramos que la acción ocurrió, asociada al identificador anónimo — no quién eres." },
      { h: "Para qué la usamos y quién la ve", p: "La usamos para operar las tarjetas y medir cómo funcionan. Podemos compartir informes de rendimiento con el negocio dueño de cada tarjeta: cifras como número de toques, dispositivos únicos, ciudades, tipos de dispositivo, horas del día y acciones de contacto. Esos informes nunca incluyen direcciones IP." },
      { h: "Lo que no hacemos", p: "No vendemos ni alquilamos tu información. No la compartimos con redes publicitarias. No la usamos para crear perfiles sobre ti como persona, ni intentamos identificarte a partir de ella." },
      { h: "Cuánto tiempo la guardamos", p: "Los registros de toques y de actividad en la tarjeta se borran automáticamente a los 12 meses. Lo aplica la propia base de datos, no un proceso manual." },
      { h: "Dónde se guarda", p: "Todo se almacena en una base de datos privada a la que solo accede el equipo de 305 Web Service. Nuestro sitio está alojado en Vercel, que procesa las peticiones por nuestra cuenta. El mapa de toques se dibuja con mosaicos de OpenStreetMap y solo se usa dentro de nuestro panel privado." },
      { h: "Tus opciones", p: "Puedes borrar la cookie 305_v o bloquear las cookies cuando quieras. Puedes pedirnos qué guardamos sobre ti, o pedir que lo borremos, escribiendo a 305webservice@gmail.com." },
    ],
  },
  langSwitch: { toOther: "View in English" },
  nfcShowcase: {
    eyebrow: "Nuestra propia tarjeta",
    heading: "Esta es una tarjeta real — la nuestra.",
    text: "La misma tarjeta NFC que entregamos en Miami. Al tocarla o escanear el QR se abre nuestro sitio. La tuya funciona igual — tu marca, tu destino, y actualizable sin reimprimir cuando la configuración lo permite.",
    frontLabel: "Frente",
    backLabel: "Reverso",
  },
  nfcCompliance: {
    heading: "Honesto por diseño",
    items: [
      "El NFC no funciona en todos los dispositivos — cada solución incluye un respaldo QR visible.",
      "Te decimos exactamente qué abre después de un toque.",
      "Un toque registra la IP del visitante, una ciudad aproximada sacada de esa IP y un identificador anónimo de navegador — nuestra política lo dice con todas las letras en vez de afirmar que no recogemos nada.",
      "Facilitamos llegar a tu página de reseñas legítima — nunca filtramos, condicionamos ni incentivamos reseñas, y no prometemos ninguna calificación ni resultado.",
      "Solo anunciamos actualizaciones, analítica u hosting que la configuración elegida realmente soporte.",
    ],
  },
};

export const C: Record<Locale, Dict> = { en, es };
