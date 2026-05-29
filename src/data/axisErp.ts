import type { Product } from "~/types";

// ─── Product object (imported into products.ts) ───────────────────────────────

export const axisErpProduct: Product = {
  id: "ventaro",
  slug: "ventaro",
  name: "Ventaro",
  tagline: "Control total de tu negocio, con o sin internet",
  shortDescription:
    "Sistema integral de punto de venta, inventario, restaurantes, facturación y gestión empresarial. Funciona offline, sincroniza en la nube y corre en tu red LAN.",
  fullDescription:
    "Ventaro es una plataforma ERP/POS completa diseñada específicamente para las MIPYMES de Cuba y Latinoamérica. Combina punto de venta táctil, gestión de inventario en tiempo real, módulo de restaurantes y bares, control multi-sucursal, facturación y analítica con IA — todo en un sistema que funciona aunque no haya internet.",
  problem:
    "Los ERP globales son demasiado caros, complejos y no están diseñados para la realidad de LATAM: cortes de internet frecuentes, múltiples monedas, restaurantes que venden por mesa y tiendas que venden a crédito. Los sistemas baratos no tienen lo que necesitas; los caros no están pensados para ti.",
  solution:
    "Ventaro nació en LATAM para LATAM. Funciona sin internet en tu red local, sincroniza en la nube cuando hay conexión, acepta múltiples monedas y métodos de pago, y tiene módulos específicos para restaurantes, bares, ferreterías, farmacias y tiendas de todo tipo.",
  category: "ERP / POS",
  tags: ["ERP", "POS", "Inventario", "Restaurante", "Bar", "Multi-sucursal", "Offline", "LATAM", "Cuba"],
  icon: "Cpu",
  colorFrom: "#3730A3",
  colorTo: "#0369A1",
  accentColor: "#818CF8",
  isHighlighted: true,
  status: "active",
  features: [
    {
      icon: "Monitor",
      title: "POS Táctil Rápido",
      description: "Registra ventas en segundos con interfaz táctil optimizada para pantallas y teclados. Compatible con impresoras térmicas, gavetas y lectores de código de barras.",
    },
    {
      icon: "Package",
      title: "Inventario Inteligente",
      description: "Control en tiempo real de existencias, alertas de stock bajo, variantes de producto, lotes, fechas de vencimiento y movimientos automáticos.",
    },
    {
      icon: "Plug",
      title: "Modo Offline + LAN",
      description: "Funciona sin internet en tu red local. Cuando vuelve la conexión, sincroniza todo automáticamente. Tu negocio no para nunca.",
    },
    {
      icon: "Building2",
      title: "Multi-sucursal",
      description: "Administra todas tus tiendas desde un panel central. Inventario por sucursal, transferencias entre tiendas y consolidado total en tiempo real.",
    },
    {
      icon: "Network",
      title: "Restaurantes y Bares",
      description: "Gestión de mesas, comandas por mozo, cocina en pantalla, control de tabs de bar, menú digital y cierres de turno automáticos.",
    },
    {
      icon: "BarChart3",
      title: "Reportes con IA",
      description: "Dashboards ejecutivos con ventas, márgenes, productos estrella, tendencias y proyecciones. Exporta a Excel, PDF o consulta desde cualquier dispositivo.",
    },
  ],
  modules: [
    { name: "POS / Caja",       description: "Ventas, cobros y recibos",              icon: "Monitor"     },
    { name: "Inventario",       description: "Stock, lotes y movimientos",             icon: "Package"     },
    { name: "Restaurante",      description: "Mesas, comandas y cocina",               icon: "Network"     },
    { name: "Bar",              description: "Tabs, bebidas y cierres de turno",       icon: "Zap"         },
    { name: "Clientes (CRM)",   description: "Historial, crédito y fidelización",      icon: "UserCircle"  },
    { name: "Empleados",        description: "Roles, turnos y comisiones",             icon: "Users"       },
    { name: "Compras",          description: "Proveedores y órdenes de compra",        icon: "Truck"       },
    { name: "Sucursales",       description: "Multi-tienda centralizado",              icon: "Building2"   },
    { name: "Reportes",         description: "Analytics y exportaciones",              icon: "BarChart3"   },
    { name: "Cloud Sync",       description: "Sincronización automática a la nube",    icon: "Globe"       },
    { name: "IA Analytics",     description: "Predicciones y recomendaciones",        icon: "Cpu"         },
    { name: "Configuración",    description: "Permisos, marca y personalización",     icon: "Settings"    },
  ],
  benefits: [
    { icon: "Zap",        title: "Ventas más rápidas",    description: "Procesa más clientes por hora con un POS ágil. Reduce los tiempos de espera y errores de cobro a cero.",              metric: "+30% velocidad" },
    { icon: "Eye",        title: "Visibilidad total",     description: "Ve cuánto vendiste, cuánto tienes y cuánto ganaste — en tiempo real, desde cualquier dispositivo.",                   metric: "Tiempo real" },
    { icon: "Shield",     title: "Menos pérdidas",        description: "Inventario con precisión matemática. Detecta diferencias antes de que sean un problema grave.",                       metric: "-80% error inventario" },
    { icon: "Clock",      title: "Ahorra tiempo",         description: "Elimina el cierre manual de caja, el conteo de inventario y los reportes en Excel. Todo automático.",                  metric: "5+ horas/semana" },
  ],
  useCases: [
    { title: "Tienda / Retail",    description: "Tallas, colores, temporadas y alertas de repedido automático.",                  industry: "Retail"      },
    { title: "Restaurante",        description: "Gestión de mesas, comandas por mozo y cocina en pantalla.",                     industry: "Food & Bev"  },
    { title: "Bar / Cafetería",    description: "Control de tabs, bebidas por consumo y cierres de turno automáticos.",          industry: "Food & Bev"  },
    { title: "Ferretería",         description: "Miles de SKUs, precios por volumen, crédito a contratistas y márgenes por cat.", industry: "Ferretería"  },
    { title: "Farmacia",           description: "Lotes, fechas de vencimiento, recetas y control por laboratorio.",              industry: "Salud"       },
    { title: "MIPYME General",     description: "Cualquier negocio que venda productos o servicios en LATAM.",                   industry: "General"     },
  ],
  screenshots: [
    { url: "/screenshots/ventaro-dashboard.png", alt: "Dashboard Ventaro",  caption: "Panel ejecutivo en tiempo real" },
    { url: "/screenshots/ventaro-pos.png",       alt: "POS Ventaro",        caption: "Interfaz de punto de venta táctil" },
    { url: "/screenshots/ventaro-inventory.png", alt: "Inventario Ventaro", caption: "Control de inventario por sucursal" },
  ],
  faq: [
    { question: "¿Funciona sin internet?",            answer: "Sí. Ventaro funciona en tu red local (LAN) aunque no haya internet. Cuando vuelve la conexión, sincroniza todo automáticamente." },
    { question: "¿Cuánto tiempo toma la instalación?", answer: "La mayoría de negocios están operando en 1-2 días. Incluimos migración de datos, configuración e instalación remota." },
    { question: "¿Incluye módulo de restaurante?",    answer: "Sí. El plan Restaurante & Bar incluye gestión de mesas, comandas, cocina en pantalla, menú digital y control de tabs." },
    { question: "¿Puedo usarlo en múltiples tiendas?", answer: "Desde el plan Profesional hacia arriba puedes administrar múltiples sucursales desde un solo panel central." },
    { question: "¿Cómo funciona la licencia?",        answer: "Licencia mensual o anual por instalación. Puedes ver el estado en tiempo real, renovar con un click y activar nuevos dispositivos sin llamar a nadie." },
    { question: "¿Qué métodos de pago aceptan?",      answer: "Zelle, Cash App, PayPal, transferencia bancaria, tarjeta de crédito/débito y efectivo. Si tienes una situación especial, hablamos." },
  ],
  pricing: {
    type: "subscription",
    plans: [],
    note: "Sin contratos. Cancela cuando quieras. 14 días gratis.",
  },
  downloadVersion: "2.1.0",
  downloads: [
    { label: "Instalar en Windows",        filename: "AxisERP-Setup.exe",       url: import.meta.env.VITE_ERP_WINDOWS_DOWNLOAD || "#", type: "exe", platform: "Windows 10/11 64-bit", size: "~95 MB" },
    { label: "Versión portátil (ZIP)",      filename: "AxisERP-Portable.zip",    url: import.meta.env.VITE_ERP_WINDOWS_DOWNLOAD || "#", type: "zip", platform: "Windows 10/11 64-bit", size: "~88 MB" },
  ],
};

// ─── Business types ───────────────────────────────────────────────────────────

export interface BusinessType {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  headline: string;
  description: string;
  features: string[];
  demoUser?: string;
  demoPass?: string;
}

export const erpBusinessTypes: BusinessType[] = [
  {
    id: "tienda",
    name: "Tienda / Retail",
    icon: "ShoppingCart",
    emoji: "🛍️",
    headline: "Vende más, pierde menos",
    description: "Control total de inventario, ventas por categoría, descuentos, crédito a clientes y cierre de caja automático.",
    features: ["POS táctil + código de barras", "Inventario por variante (talla/color)", "Crédito y cuentas por cobrar", "Reportes de márgenes por categoría", "Alertas de stock bajo"],
  },
  {
    id: "restaurante",
    name: "Restaurante",
    icon: "Network",
    emoji: "🍽️",
    headline: "De la mesa a la cocina, sin papel",
    description: "Gestión de mesas en plano visual, comandas por mozo en tablet, pantalla de cocina y cierres de turno.",
    features: ["Plano de mesas interactivo", "Comandas digitales para mozos", "Pantalla de cocina (KDS)", "Menú digital con fotos", "Cierre de turno y liquidación"],
  },
  {
    id: "bar",
    name: "Bar / Cantina",
    icon: "Zap",
    emoji: "🍺",
    headline: "Controla cada trago y cada tab",
    description: "Abre y cierra tabs por cliente, controla bebidas por consumo, gestiona tragos combinados y cierres rápidos.",
    features: ["Tabs por cliente o mesa", "Inventario de bebidas por botella", "Combinados y recetas", "Cierre rápido de bar", "Reportes de bebidas más vendidas"],
  },
  {
    id: "cafeteria",
    name: "Cafetería",
    icon: "Monitor",
    emoji: "☕",
    headline: "Pedidos rápidos, cola cero",
    description: "POS optimizado para pedidos rápidos, pantalla de cliente, modificadores de producto y pagos combinados.",
    features: ["POS para pedidos rápidos", "Pantalla de cliente (display)", "Modificadores (sin azúcar, doble shot)", "Cola de pedidos en pantalla", "Integración con cocina"],
  },
  {
    id: "ferreteria",
    name: "Ferretería",
    icon: "Package",
    emoji: "🔧",
    headline: "Miles de productos, control total",
    description: "Miles de SKUs, precios por volumen, crédito a contratistas, órdenes de compra y control de depósito.",
    features: ["Catálogo de miles de SKUs", "Precios por cantidad/volumen", "Crédito a contratistas", "Órdenes de compra a proveedores", "Control de depósito y bodega"],
  },
  {
    id: "farmacia",
    name: "Farmacia",
    icon: "Shield",
    emoji: "💊",
    headline: "Seguro, preciso y regulado",
    description: "Control de lotes, fechas de vencimiento, recetas médicas, alertas de caducidad y registro por laboratorio.",
    features: ["Control de lotes y vencimientos", "Alertas de caducidad automáticas", "Registro de recetas médicas", "Clasificación por laboratorio", "Informes regulatorios"],
  },
];

// ─── Benefits ─────────────────────────────────────────────────────────────────

export interface ErpBenefit {
  icon: string;
  emoji: string;
  title: string;
  description: string;
}

export const erpBenefits: ErpBenefit[] = [
  { icon: "Zap",         emoji: "⚡", title: "Ventas rápidas",         description: "POS táctil que procesa una venta completa en menos de 10 segundos." },
  { icon: "Package",     emoji: "📦", title: "Inventario inteligente",  description: "Stock en tiempo real con alertas, variantes y movimientos automáticos." },
  { icon: "Plug",        emoji: "🔌", title: "Modo Offline",            description: "Funciona en tu LAN sin internet. Tu negocio no para nunca." },
  { icon: "Building2",   emoji: "🏢", title: "Multi-sucursal",          description: "Todas tus tiendas en un solo panel. Inventario consolidado." },
  { icon: "Network",     emoji: "🍽️", title: "Restaurantes y Bares",    description: "Mesas, comandas, cocina y tabs. Módulo completo incluido." },
  { icon: "BarChart3",   emoji: "📊", title: "Reportes ejecutivos",     description: "Dashboards con ventas, márgenes y tendencias en tiempo real." },
  { icon: "Globe",       emoji: "☁️", title: "Cloud Sync",              description: "Sincronización automática. Accede a tus datos desde cualquier lugar." },
  { icon: "Monitor",     emoji: "📱", title: "Mobile First",            description: "Funciona en PC, tablet y celular. Diseñado para pantallas táctiles." },
  { icon: "Cpu",         emoji: "🤖", title: "IA Integrada",            description: "Predicciones de demanda, alertas inteligentes y reportes automáticos." },
  { icon: "Network",     emoji: "🌐", title: "LAN Local",               description: "Red local sin internet. Velocidad máxima para negocios con cortes frecuentes." },
];

// ─── Pricing plans ────────────────────────────────────────────────────────────

export interface ErpPlan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  description: string;
  isPopular?: boolean;
  isCustom?: boolean;
  colorFrom: string;
  colorTo: string;
  limits: { pos: string; branches: string; users: string };
  features: string[];
  idealFor: string;
  cta: string;
}

export const erpPlans: ErpPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 19,
    annualPrice: 190,
    description: "Para el negocio que está comenzando",
    colorFrom: "#64748B", colorTo: "#475569",
    limits: { pos: "1 POS", branches: "1 sucursal", users: "2 usuarios" },
    features: [
      "POS táctil completo",
      "Inventario ilimitado de productos",
      "Reportes básicos",
      "Modo offline + LAN",
      "Cierre de caja automático",
      "Soporte por WhatsApp",
    ],
    idealFor: "Tienda pequeña, kiosco, emprendedor",
    cta: "Comenzar gratis 14 días",
  },
  {
    id: "professional",
    name: "Profesional",
    monthlyPrice: 39,
    annualPrice: 390,
    description: "Para negocios en crecimiento",
    isPopular: true,
    colorFrom: "#3730A3", colorTo: "#0369A1",
    limits: { pos: "3 POS", branches: "2 sucursales", users: "5 usuarios" },
    features: [
      "Todo lo de Starter",
      "2 sucursales + transferencias",
      "CRM de clientes + crédito",
      "Módulo de compras y proveedores",
      "Reportes avanzados + Excel/PDF",
      "Cloud sync incluido",
      "Soporte prioritario",
    ],
    idealFor: "Tienda mediana, minimarket, ferretería",
    cta: "Solicitar demo gratis",
  },
  {
    id: "restaurant",
    name: "Restaurante & Bar",
    monthlyPrice: 59,
    annualPrice: 590,
    description: "Módulo completo para food & beverage",
    colorFrom: "#B45309", colorTo: "#D97706",
    limits: { pos: "5 POS", branches: "3 sucursales", users: "10 usuarios" },
    features: [
      "Todo lo de Profesional",
      "Plano de mesas interactivo",
      "Comandas digitales para mozos",
      "Pantalla de cocina (KDS)",
      "Gestión de tabs de bar",
      "Menú digital con fotos",
      "IA de demanda (qué vender más)",
    ],
    idealFor: "Restaurante, bar, cafetería, cantina",
    cta: "Solicitar demo gratis",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "Para cadenas y franquicias",
    isCustom: true,
    colorFrom: "#6D28D9", colorTo: "#4F46E5",
    limits: { pos: "Ilimitado", branches: "Ilimitado", users: "Ilimitado" },
    features: [
      "Todo lo de Restaurante & Bar",
      "Sucursales y usuarios ilimitados",
      "API REST completa",
      "Integraciones a medida",
      "Panel de franquicia / holding",
      "SLA garantizado",
      "Gerente de cuenta dedicado",
    ],
    idealFor: "Cadenas, franquicias, grupos empresariales",
    cta: "Hablar con ventas",
  },
];

// ─── Feature comparison ───────────────────────────────────────────────────────

export interface ComparisonFeature {
  name: string;
  starter: boolean | string;
  professional: boolean | string;
  restaurant: boolean | string;
  enterprise: boolean | string;
  tooltip?: string;
}

export interface ComparisonGroup {
  category: string;
  features: ComparisonFeature[];
}

export const erpComparisonData: ComparisonGroup[] = [
  {
    category: "Punto de venta",
    features: [
      { name: "Terminales POS",          starter: "1",         professional: "3",         restaurant: "5",         enterprise: "Ilimitados" },
      { name: "Sucursales",              starter: "1",         professional: "2",         restaurant: "3",         enterprise: "Ilimitadas" },
      { name: "Usuarios",                starter: "2",         professional: "5",         restaurant: "10",        enterprise: "Ilimitados" },
      { name: "Ventas sin internet (LAN)", starter: true,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Impresora térmica",       starter: true,        professional: true,        restaurant: true,        enterprise: true },
      { name: "Lector código de barras", starter: true,        professional: true,        restaurant: true,        enterprise: true },
      { name: "Múltiples métodos de pago", starter: true,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Descuentos y cupones",    starter: true,        professional: true,        restaurant: true,        enterprise: true },
    ],
  },
  {
    category: "Inventario",
    features: [
      { name: "Productos ilimitados",     starter: true,       professional: true,        restaurant: true,        enterprise: true },
      { name: "Variantes (talla/color)",  starter: true,       professional: true,        restaurant: true,        enterprise: true },
      { name: "Control de lotes",         starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Fechas de vencimiento",    starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Alertas de stock bajo",    starter: true,       professional: true,        restaurant: true,        enterprise: true },
      { name: "Órdenes de compra",        starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Transferencias entre suc.", starter: false,     professional: true,        restaurant: true,        enterprise: true },
    ],
  },
  {
    category: "Restaurante y Bar",
    features: [
      { name: "Plano de mesas",           starter: false,      professional: false,       restaurant: true,        enterprise: true },
      { name: "Comandas digitales",       starter: false,      professional: false,       restaurant: true,        enterprise: true },
      { name: "Pantalla de cocina (KDS)", starter: false,      professional: false,       restaurant: true,        enterprise: true },
      { name: "Tabs de bar",              starter: false,      professional: false,       restaurant: true,        enterprise: true },
      { name: "Menú digital con fotos",   starter: false,      professional: false,       restaurant: true,        enterprise: true },
      { name: "Menú por turno/hora",      starter: false,      professional: false,       restaurant: true,        enterprise: true },
    ],
  },
  {
    category: "Clientes y ventas",
    features: [
      { name: "CRM de clientes",          starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Crédito y cuentas cobrar", starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Programa de puntos",       starter: false,      professional: false,       restaurant: true,        enterprise: true },
      { name: "Historial de compras",     starter: true,       professional: true,        restaurant: true,        enterprise: true },
    ],
  },
  {
    category: "Reportes e IA",
    features: [
      { name: "Reportes básicos",         starter: true,       professional: true,        restaurant: true,        enterprise: true },
      { name: "Reportes avanzados",       starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Exportar Excel / PDF",     starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Cloud sync",               starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "IA de demanda",            starter: false,      professional: false,       restaurant: true,        enterprise: true },
      { name: "API REST",                 starter: false,      professional: false,       restaurant: false,       enterprise: true },
      { name: "Integraciones a medida",   starter: false,      professional: false,       restaurant: false,       enterprise: true },
    ],
  },
  {
    category: "Soporte",
    features: [
      { name: "Soporte WhatsApp",         starter: true,       professional: true,        restaurant: true,        enterprise: true },
      { name: "Soporte prioritario",      starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Instalación incluida",     starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Capacitación remota",      starter: false,      professional: true,        restaurant: true,        enterprise: true },
      { name: "Gerente de cuenta",        starter: false,      professional: false,       restaurant: false,       enterprise: true },
      { name: "SLA garantizado",          starter: false,      professional: false,       restaurant: false,       enterprise: true },
    ],
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const erpFAQ = [
  {
    question: "¿Ventaro funciona sin internet?",
    answer: "Sí. Ventaro corre en tu red local (LAN) sin necesidad de internet. Cuando la conexión vuelve, sincroniza todo en la nube automáticamente. Tu negocio no para nunca.",
  },
  {
    question: "¿Cuánto tiempo toma instalar el sistema?",
    answer: "La mayoría de negocios están operando en 1 a 2 días. Incluimos instalación remota, configuración inicial, carga de inventario y capacitación básica del equipo.",
  },
  {
    question: "¿Puedo probar el sistema antes de pagar?",
    answer: "Sí. Ofrecemos 14 días de prueba gratuita sin tarjeta de crédito. También puedes acceder a la demo online en vivo para ver el sistema funcionando con datos reales.",
  },
  {
    question: "¿El módulo de restaurante está incluido en todos los planes?",
    answer: "El módulo completo de restaurante (mesas, comandas, cocina, bar) está incluido en el plan Restaurante & Bar y Enterprise. Los planes Starter y Profesional incluyen POS básico para food service.",
  },
  {
    question: "¿Qué pasa si se vence mi licencia?",
    answer: "Tienes 7 días de gracia para renovar sin perder datos ni acceso. Si no hay internet para activar la renovación, te enviamos un código de activación por WhatsApp.",
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer: "Sí. Puedes subir o bajar de plan en cualquier momento. El cambio aplica en el próximo ciclo de facturación y nunca pierdes datos al migrar.",
  },
  {
    question: "¿Cómo funciona la activación offline?",
    answer: "Si no tienes internet para activar tu licencia, escríbenos por WhatsApp con tu ID de instalación y te enviamos un código de activación en menos de 2 horas.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos Zelle, Cash App, PayPal, transferencia bancaria, tarjeta de crédito/débito y efectivo. Si tienes una situación especial de pago, hablamos y encontramos solución.",
  },
];
