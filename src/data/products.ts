import type { Product } from "~/types";

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "13051234567";

export const products: Product[] = [
  {
    id: "venta",
    slug: "venta-pos",
    name: "Venta POS",
    tagline: "Control total de tu negocio en un solo lugar",
    shortDescription:
      "Sistema integral de punto de venta y gestión empresarial para pequeñas y medianas empresas que quieren operar con precisión.",
    fullDescription:
      "Venta POS es una plataforma SaaS multi-tenant que centraliza ventas, inventario, reportes y gestión de empleados en una sola herramienta. Diseñada para crecer con tu negocio: desde una caja hasta múltiples sucursales.",
    problem:
      "¿Tu negocio sigue usando hojas de cálculo, registros en papel o sistemas que no se sincronizan? Cada error en inventario, cada venta no registrada y cada reporte manual que tardas horas en armar es dinero que pierdes. La falta de visibilidad en tiempo real te impide tomar decisiones rápidas.",
    solution:
      "Venta POS centraliza todo en una plataforma moderna y fácil de usar. Desde el primer día, tienes visibilidad completa de ventas, inventario, empleados y finanzas — en tiempo real, desde cualquier dispositivo.",
    category: "POS / ERP",
    tags: ["POS", "Inventario", "Reportes", "Multi-sucursal", "SaaS", "Retail"],
    icon: "ShoppingCart",
    colorFrom: "#1D4ED8",
    colorTo: "#0891B2",
    accentColor: "#3B82F6",
    isHighlighted: true,
    status: "active",
    features: [
      {
        icon: "Monitor",
        title: "Punto de Venta (POS)",
        description: "Interfaz rápida y táctil para registrar ventas, cobros y recibos en segundos. Compatible con impresoras térmicas y lectores de código de barras.",
      },
      {
        icon: "Package",
        title: "Gestión de Inventario",
        description: "Control en tiempo real de existencias, alertas de stock bajo, categorías, variantes y movimientos de mercancía.",
      },
      {
        icon: "BarChart3",
        title: "Reportes y Analytics",
        description: "Dashboards con ventas por período, productos más vendidos, margen de ganancia, y exportación a Excel/PDF.",
      },
      {
        icon: "Users",
        title: "Gestión de Empleados",
        description: "Roles y permisos por usuario, control de turnos, comisiones y desempeño individual por vendedor.",
      },
      {
        icon: "Building2",
        title: "Multi-sucursal",
        description: "Administra todas tus tiendas desde un panel central. Inventario por sucursal, transferencias y consolidado total.",
      },
      {
        icon: "CreditCard",
        title: "Múltiples Métodos de Pago",
        description: "Efectivo, tarjeta, transferencia, crédito cliente y pagos combinados. Cierre de caja automático.",
      },
    ],
    modules: [
      { name: "Caja / POS", description: "Registro de ventas y cobros en tiempo real", icon: "Monitor" },
      { name: "Inventario", description: "Control de productos, stock y movimientos", icon: "Package" },
      { name: "Clientes", description: "CRM básico, historial y crédito", icon: "UserCircle" },
      { name: "Empleados", description: "Usuarios, roles y comisiones", icon: "Users" },
      { name: "Reportes", description: "Analytics y exportaciones", icon: "BarChart3" },
      { name: "Sucursales", description: "Gestión multi-tienda centralizada", icon: "Building2" },
      { name: "Compras", description: "Órdenes a proveedores y recepciones", icon: "Truck" },
      { name: "Configuración", description: "Personalización completa del sistema", icon: "Settings" },
    ],
    benefits: [
      {
        icon: "TrendingUp",
        title: "Aumenta tus ventas",
        description: "Procesa más clientes por hora con un POS ágil y reduce errores de cobro a cero.",
        metric: "+25% en velocidad de atención",
      },
      {
        icon: "Eye",
        title: "Visibilidad total",
        description: "Sabe exactamente cuánto tienes, cuánto vendiste y cuánto ganaste en tiempo real.",
        metric: "Reportes en tiempo real",
      },
      {
        icon: "Shield",
        title: "Reduce pérdidas",
        description: "Controla el inventario con precisión y detecta diferencias antes de que sean un problema.",
        metric: "-80% en pérdidas por error",
      },
      {
        icon: "Clock",
        title: "Ahorra tiempo",
        description: "Elimina el cierre manual de caja, el conteo de inventario manual y los reportes en Excel.",
        metric: "4 horas/semana liberadas",
      },
    ],
    useCases: [
      { title: "Tienda de Ropa", description: "Control de tallas, colores y temporadas con alertas de repedido automático.", industry: "Retail" },
      { title: "Minimarket / Abarrotería", description: "Inventario de cientos de SKUs, códigos de barra y control de fechas de vencimiento.", industry: "Alimentación" },
      { title: "Ferretería", description: "Precios por volumen, crédito a contratistas y reportes de márgenes por categoría.", industry: "Ferretería" },
      { title: "Farmacia", description: "Control de lotes, fechas de vencimiento, recetas y gestión de laboratorios.", industry: "Salud" },
    ],
    screenshots: [
      { url: "/screenshots/venta-dashboard.png", alt: "Dashboard de Venta POS", caption: "Panel principal con métricas en tiempo real" },
      { url: "/screenshots/venta-pos.png", alt: "Pantalla de caja", caption: "Interfaz POS rápida y táctil" },
      { url: "/screenshots/venta-inventory.png", alt: "Gestión de inventario", caption: "Control de stock por producto y sucursal" },
    ],
    faq: [
      {
        question: "¿Necesito instalar algo en mi computadora?",
        answer: "No. Venta POS es 100% web. Funciona en cualquier navegador moderno — PC, tablet o celular. Solo necesitas internet.",
      },
      {
        question: "¿Funciona sin internet?",
        answer: "El modo offline básico permite continuar vendiendo sin conexión. Cuando vuelve el internet, todo se sincroniza automáticamente.",
      },
      {
        question: "¿Cuánto tiempo toma la implementación?",
        answer: "La mayoría de negocios están operando en 1-3 días. Te ayudamos a cargar tu inventario y configurar el sistema desde el primer día.",
      },
      {
        question: "¿Puedo usar mi impresora térmica actual?",
        answer: "Sí. Venta POS es compatible con las principales impresoras térmicas del mercado (Epson, Star, Bixolon, genéricas USB/LAN).",
      },
      {
        question: "¿Puedo personalizar el recibo con mi logo?",
        answer: "Sí. Puedes agregar tu logo, datos fiscales, mensaje de pie de página y colores de marca.",
      },
      {
        question: "¿Los datos son míos?",
        answer: "Absolutamente. Puedes exportar toda tu información en cualquier momento en formatos estándar (Excel, CSV, PDF).",
      },
    ],
    pricing: {
      type: "subscription",
      plans: [
        {
          name: "Básico",
          price: 49,
          period: "monthly",
          description: "Para negocios que están comenzando",
          features: [
            "1 sucursal",
            "2 usuarios",
            "Inventario ilimitado",
            "POS táctil",
            "Reportes básicos",
            "Soporte por email",
          ],
          cta: "Comenzar gratis 14 días",
        },
        {
          name: "Profesional",
          price: 99,
          period: "monthly",
          description: "Para negocios en crecimiento",
          features: [
            "3 sucursales",
            "10 usuarios",
            "Inventario ilimitado",
            "POS + Módulo de compras",
            "Reportes avanzados + Export",
            "CRM de clientes",
            "Soporte prioritario",
          ],
          isPopular: true,
          cta: "Solicitar demo",
        },
        {
          name: "Enterprise",
          price: null,
          period: "monthly",
          description: "Para cadenas y franquicias",
          features: [
            "Sucursales ilimitadas",
            "Usuarios ilimitados",
            "API REST incluida",
            "Personalización avanzada",
            "Integraciones a medida",
            "Soporte dedicado 24/7",
            "SLA garantizado",
          ],
          cta: "Contactar ventas",
        },
      ],
      note: "Todos los planes incluyen actualizaciones automáticas, backups diarios y soporte técnico.",
    },
  },

  {
    id: "calentico",
    slug: "calentico",
    name: "Calentico",
    tagline: "Tu agenda siempre organizada. Tus clientes siempre atendidos.",
    shortDescription:
      "Sistema de gestión de citas y reservaciones online para negocios que viven de su tiempo.",
    fullDescription:
      "Calentico es una plataforma de reservaciones que pone tu agenda en piloto automático. Tus clientes reservan 24/7 desde cualquier dispositivo, reciben recordatorios automáticos y tú controlas todo desde un panel intuitivo.",
    problem:
      "¿Pierdes clientes porque no pueden reservar fuera de tu horario de atención? ¿Tu equipo pierde horas coordinando citas por WhatsApp o teléfono? Cada cita olvidada, cada no-show y cada conflicto de agenda te cuesta dinero.",
    solution:
      "Calentico automatiza todo el ciclo de la cita: el cliente reserva online, recibe confirmación y recordatorio automático, y tú ves tu agenda completa en tiempo real. Sin llamadas, sin WhatsApps, sin citas perdidas.",
    category: "Gestión de Citas",
    tags: ["Citas", "Reservaciones", "Calendario", "Recordatorios", "Automatización"],
    icon: "Calendar",
    colorFrom: "#7C3AED",
    colorTo: "#EC4899",
    accentColor: "#8B5CF6",
    isHighlighted: true,
    status: "active",
    features: [
      {
        icon: "Globe",
        title: "Reservaciones Online 24/7",
        description: "Tu página de reservaciones siempre disponible. Los clientes eligen fecha, hora y servicio en segundos desde cualquier dispositivo.",
      },
      {
        icon: "BellRing",
        title: "Recordatorios Automáticos",
        description: "SMS y email automáticos 24h y 1h antes de cada cita. Reduce los no-shows hasta un 70%.",
      },
      {
        icon: "CalendarDays",
        title: "Calendario Inteligente",
        description: "Vista diaria, semanal y mensual. Gestión de disponibilidad, días libres y horarios especiales.",
      },
      {
        icon: "Users",
        title: "Multi-staff",
        description: "Cada miembro del equipo tiene su propia agenda. Los clientes eligen con quién quieren ser atendidos.",
      },
      {
        icon: "Layers",
        title: "Múltiples Servicios",
        description: "Define duración, precio y capacidad para cada servicio. Citas individuales o grupales.",
      },
      {
        icon: "BarChart2",
        title: "Reportes de Productividad",
        description: "Tasa de ocupación, ingresos proyectados, historial de clientes y análisis de no-shows.",
      },
    ],
    modules: [
      { name: "Booking Page", description: "Página pública de reservaciones personalizada", icon: "Globe" },
      { name: "Calendario", description: "Vista y gestión de la agenda del equipo", icon: "CalendarDays" },
      { name: "Clientes", description: "Historial, notas y preferencias", icon: "UserCircle" },
      { name: "Servicios", description: "Catálogo de servicios con precios y duración", icon: "Layers" },
      { name: "Notificaciones", description: "Recordatorios automáticos por SMS y email", icon: "BellRing" },
      { name: "Reportes", description: "Analytics de ocupación e ingresos", icon: "BarChart2" },
    ],
    benefits: [
      {
        icon: "TrendingDown",
        title: "Elimina los no-shows",
        description: "Los recordatorios automáticos por SMS y email reducen las ausencias drásticamente.",
        metric: "-70% en no-shows",
      },
      {
        icon: "Clock",
        title: "Ahorra tiempo",
        description: "Tu equipo deja de coordinar citas por WhatsApp. El sistema trabaja por ti.",
        metric: "3+ horas/semana",
      },
      {
        icon: "DollarSign",
        title: "Más reservaciones",
        description: "Con reservaciones 24/7, capturas clientes que antes perdías fuera de tu horario.",
        metric: "+35% en reservaciones",
      },
      {
        icon: "Star",
        title: "Mejor experiencia",
        description: "Tus clientes reservan en segundos, sin llamadas y con confirmación inmediata.",
        metric: "4.9/5 satisfacción",
      },
    ],
    useCases: [
      { title: "Salón de Belleza", description: "Agenda por estilista, servicios múltiples y recordatorios que eliminan no-shows.", industry: "Belleza" },
      { title: "Consultorio Médico", description: "Citas por doctor, confirmación automática y historial de pacientes.", industry: "Salud" },
      { title: "Estudio de Fitness", description: "Clases grupales con cupo, reservaciones en app y lista de espera automática.", industry: "Fitness" },
      { title: "Consultoría Profesional", description: "Reuniones por videollamada o presencial, con recordatorios y confirmaciones.", industry: "Servicios" },
    ],
    screenshots: [
      { url: "/screenshots/calentico-booking.png", alt: "Página de reservaciones Calentico", caption: "Página de booking para tus clientes" },
      { url: "/screenshots/calentico-calendar.png", alt: "Calendario de Calentico", caption: "Vista del calendario del equipo" },
      { url: "/screenshots/calentico-dashboard.png", alt: "Dashboard de Calentico", caption: "Panel de control y métricas" },
    ],
    faq: [
      {
        question: "¿Los clientes necesitan crear una cuenta para reservar?",
        answer: "No. Tus clientes reservan con solo su nombre, email y teléfono. Sin apps que descargar ni cuentas que crear.",
      },
      {
        question: "¿Puedo personalizar la página de reservaciones con mi marca?",
        answer: "Sí. Puedes agregar tu logo, colores, descripción y fotos de tus servicios para que la página se vea completamente como tu negocio.",
      },
      {
        question: "¿Cómo funcionan los recordatorios?",
        answer: "Calentico envía automáticamente un email de confirmación al reservar y recordatorios por email/SMS 24 horas y 1 hora antes de la cita.",
      },
      {
        question: "¿Puedo bloquear días y horarios no disponibles?",
        answer: "Sí. Configura tu horario de trabajo, días de descanso y bloquea fechas específicas en cualquier momento.",
      },
      {
        question: "¿Puedo tener varios empleados con agendas separadas?",
        answer: "Sí. Cada miembro del equipo tiene su propia agenda con disponibilidad independiente.",
      },
      {
        question: "¿Funciona para citas grupales o clases?",
        answer: "Sí. Puedes definir cupo máximo por servicio, activar listas de espera y gestionar clases con múltiples participantes.",
      },
    ],
    pricing: {
      type: "subscription",
      plans: [
        {
          name: "Starter",
          price: 29,
          period: "monthly",
          description: "Para emprendedores y freelancers",
          features: [
            "1 staff/profesional",
            "Reservaciones ilimitadas",
            "Página de booking personalizada",
            "Recordatorios por email",
            "10 servicios",
            "Soporte por email",
          ],
          cta: "Comenzar gratis 14 días",
        },
        {
          name: "Negocio",
          price: 69,
          period: "monthly",
          description: "Para equipos y pequeñas empresas",
          features: [
            "5 staff/profesionales",
            "Reservaciones ilimitadas",
            "Recordatorios SMS + Email",
            "Servicios ilimitados",
            "Reportes de productividad",
            "Integración Google Calendar",
            "Soporte prioritario",
          ],
          isPopular: true,
          cta: "Solicitar demo",
        },
        {
          name: "Pro",
          price: null,
          period: "monthly",
          description: "Para clínicas, spas y cadenas",
          features: [
            "Staff ilimitado",
            "Múltiples sedes",
            "API REST",
            "Personalización avanzada",
            "Pagos online integrados",
            "Soporte dedicado",
          ],
          cta: "Contactar ventas",
        },
      ],
      note: "Sin contratos de permanencia. Cancela cuando quieras.",
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
