import type { Service, Industry, Testimonial } from "~/types";

export const services: Service[] = [
  {
    id: "desarrollo-medida",
    name: "Desarrollo de Software a Medida",
    shortDescription: "Sistemas únicos diseñados exactamente para tu proceso de negocio.",
    description:
      "Construimos el software que tu negocio necesita y que no existe en el mercado. Desde sistemas internos hasta plataformas completas. Código limpio, escalable y tuyo.",
    icon: "Code2",
    category: "Desarrollo",
    features: [
      "Análisis de requerimientos detallado",
      "Diseño UX/UI profesional",
      "Desarrollo full-stack moderno",
      "Pruebas y control de calidad",
      "Despliegue y puesta en producción",
      "Documentación técnica incluida",
    ],
  },
  {
    id: "paginas-web",
    name: "Páginas Web Profesionales",
    shortDescription: "Presencia online que convierte visitantes en clientes.",
    description:
      "Diseñamos y desarrollamos sitios web modernos, rápidos y orientados a conversión. Desde landing pages hasta portales corporativos. SEO optimizado desde el día uno.",
    icon: "Globe",
    category: "Web",
    features: [
      "Diseño mobile-first",
      "SEO técnico incluido",
      "Performance optimizada (Core Web Vitals)",
      "Integración con Google Analytics",
      "CMS para gestionar contenido",
      "Formularios de contacto y leads",
    ],
  },
  {
    id: "sistemas-internos",
    name: "Sistemas Internos para Negocios",
    shortDescription: "Automatiza tus procesos internos y opera con más eficiencia.",
    description:
      "Desarrollamos ERPs, CRMs, paneles de administración y herramientas internas que reemplazan Excel y procesos manuales. Tu equipo trabaja más rápido y con menos errores.",
    icon: "Settings2",
    category: "Sistemas",
    features: [
      "Panel de administración a medida",
      "Gestión de usuarios y roles",
      "Flujos de aprobación y workflow",
      "Reportes y dashboards",
      "Integración con sistemas existentes",
      "Acceso desde cualquier dispositivo",
    ],
  },
  {
    id: "automatizaciones",
    name: "Automatización de Procesos",
    shortDescription: "Elimina tareas repetitivas y libera tiempo para lo que importa.",
    description:
      "Automatizamos los procesos manuales de tu negocio: emails, notificaciones, sincronización de datos, generación de reportes y flujos de trabajo completos.",
    icon: "Zap",
    category: "Automatización",
    features: [
      "Automatización de emails y notificaciones",
      "Sincronización entre sistemas",
      "Generación automática de reportes",
      "Bots y chatbots básicos",
      "Flujos de aprobación automatizados",
      "Integración con Zapier y Make",
    ],
  },
  {
    id: "integraciones",
    name: "Integraciones y APIs",
    shortDescription: "Conecta tus sistemas para que trabajen juntos sin fricción.",
    description:
      "Integramos tus herramientas existentes entre sí — CRM, ERP, tienda online, pasarelas de pago, WhatsApp, Google Workspace y más. Un ecosistema conectado.",
    icon: "Plug",
    category: "Integraciones",
    features: [
      "APIs REST y WebHooks",
      "Integración con pagos (Stripe, PayPal, MercadoPago)",
      "WhatsApp Business API",
      "Google Workspace",
      "Redes sociales y marketplaces",
      "Sincronización bidireccional de datos",
    ],
  },
  {
    id: "consultoria",
    name: "Consultoría Tecnológica",
    shortDescription: "Toma decisiones tecnológicas correctas para tu negocio.",
    description:
      "Te ayudamos a definir la estrategia tecnológica de tu empresa: qué herramientas usar, cómo migrar sistemas obsoletos, cómo estructurar tu equipo tech y cómo escalar.",
    icon: "Lightbulb",
    category: "Consultoría",
    features: [
      "Auditoría de sistemas actuales",
      "Propuesta de arquitectura tecnológica",
      "Selección de herramientas y proveedores",
      "Plan de migración sin interrupciones",
      "Capacitación del equipo",
      "Roadmap tecnológico a 12 meses",
    ],
  },
  {
    id: "soporte",
    name: "Soporte y Mantenimiento",
    shortDescription: "Tu tecnología siempre funcionando. Problemas resueltos rápido.",
    description:
      "Ofrecemos planes de soporte técnico para mantener tus sistemas operativos, actualizados y seguros. Respuesta rápida, comunicación directa con el equipo técnico.",
    icon: "Headphones",
    category: "Soporte",
    features: [
      "Soporte por WhatsApp, email y videollamada",
      "Tiempos de respuesta garantizados",
      "Actualizaciones de seguridad",
      "Monitoreo de disponibilidad",
      "Backups automáticos",
      "Informes mensuales de estado",
    ],
  },
  {
    id: "redes-infraestructura",
    name: "Redes LAN e Infraestructura",
    shortDescription: "Infraestructura de red confiable para tu negocio.",
    description:
      "Diseñamos e implementamos redes LAN empresariales, WiFi corporativo, VPNs y optimización de infraestructura para que tu equipo trabaje sin interrupciones.",
    icon: "Network",
    category: "Infraestructura",
    features: [
      "Diseño y cableado estructurado",
      "WiFi empresarial con múltiples zonas",
      "VPN para trabajo remoto seguro",
      "Segmentación de redes",
      "Firewall y seguridad perimetral",
      "Optimización de ancho de banda",
    ],
  },
];

export const industries: Industry[] = [
  { name: "Restaurantes & Cafeterías", icon: "UtensilsCrossed", description: "POS, pedidos online, gestión de mesas y reportes de ventas" },
  { name: "Retail & Tiendas", icon: "ShoppingBag", description: "Inventario, e-commerce y punto de venta integrados" },
  { name: "Salud & Belleza", icon: "Heart", description: "Agendas, fichas de clientes y recordatorios automáticos" },
  { name: "Servicios Profesionales", icon: "Briefcase", description: "CRM, facturación y gestión de proyectos" },
  { name: "Educación", icon: "GraduationCap", description: "Portales de alumnos, pagos y comunicación institucional" },
  { name: "Bienes Raíces", icon: "Home", description: "CRM, portales de propiedades y automatización de seguimiento" },
];

export const testimonials: Testimonial[] = [
  {
    name: "María González",
    role: "Propietaria",
    company: "Boutique Élite",
    content: "Ventaro transformó completamente nuestra tienda. Antes perdíamos horas en el inventario, ahora todo está en tiempo real. Lo mejor fue lo rápido que nos implementaron.",
    rating: 5,
    product: "Ventaro",
  },
  {
    name: "Dr. Roberto Méndez",
    role: "Director Médico",
    company: "Clínica MedPlus",
    content: "Axis ERP nos centralizó las tres sucursales en una sola pantalla. El modo offline fue clave — nunca perdemos una venta aunque falle la conexión.",
    rating: 5,
    product: "Axis ERP",
  },
  {
    name: "Carolina Vásquez",
    role: "CEO",
    company: "Distribuidora Nacional",
    content: "Necesitábamos un sistema a medida para nuestra operación. El equipo de 305 Web Service entendió exactamente lo que necesitábamos y lo entregaron en tiempo y forma.",
    rating: 5,
  },
];
