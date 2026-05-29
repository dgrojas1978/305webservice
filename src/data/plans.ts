export type PlanId = "basico" | "profesional" | "restaurante" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  annualSavings: number | null;
  isPopular?: boolean;
  isCustom?: boolean;
  colorFrom: string;
  colorTo: string;
  accentColor: string;
  textColor: string;
  limits: {
    users: number | string;
    pos: number | string;
    locations: number | string;
    offlineDays: number;
  };
  features: string[];
  ideal: string[];
  cta: string;
  ctaStyle: "primary" | "dark" | "amber" | "purple";
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  period: "monthly" | "one-time";
  icon: string;
  category: "Capacidad" | "Módulos" | "Soporte";
}

export interface ComparisonFeature {
  name: string;
  tooltip?: string;
  basico: string | boolean;
  profesional: string | boolean;
  restaurante: string | boolean;
  enterprise: string | boolean;
}

export interface ComparisonCategory {
  category: string;
  features: ComparisonFeature[];
}

export const plans: Plan[] = [
  {
    id: "basico",
    name: "Básico",
    tagline: "Para negocios que están comenzando",
    monthlyPrice: 19,
    annualPrice: 190,
    annualSavings: 38,
    colorFrom: "#475569",
    colorTo: "#334155",
    accentColor: "#94A3B8",
    textColor: "#94A3B8",
    limits: { users: 1, pos: 1, locations: 1, offlineDays: 7 },
    features: [
      "1 usuario administrador",
      "1 caja / POS",
      "1 negocio / sede",
      "Ventas y cobros",
      "Inventario básico",
      "Registro de clientes",
      "Reportes simples",
      "Exportación PDF y Excel",
      "Modo offline hasta 7 días",
      "Soporte por email y WhatsApp",
    ],
    ideal: ["Bodegas", "Tiendas pequeñas", "Cafeterías simples", "Negocios familiares"],
    cta: "Comenzar gratis 14 días",
    ctaStyle: "dark",
  },
  {
    id: "profesional",
    name: "Profesional",
    tagline: "El más recomendado para negocios en crecimiento",
    monthlyPrice: 39,
    annualPrice: 390,
    annualSavings: 78,
    isPopular: true,
    colorFrom: "#1D4ED8",
    colorTo: "#0891B2",
    accentColor: "#3B82F6",
    textColor: "#60A5FA",
    limits: { users: 3, pos: 2, locations: 1, offlineDays: 15 },
    features: [
      "Hasta 3 usuarios",
      "Hasta 2 cajas / POS",
      "1 sucursal",
      "Todo lo del plan Básico",
      "Inventario avanzado",
      "Compras y proveedores",
      "Roles y permisos",
      "Descuentos y promociones",
      "Lector de código de barras",
      "Reportes avanzados",
      "Modo offline hasta 15 días",
      "Soporte prioritario en 24h",
    ],
    ideal: ["Tiendas medianas", "Ferreterías", "Farmacias", "Restaurantes pequeños"],
    cta: "Solicitar demo gratis",
    ctaStyle: "primary",
  },
  {
    id: "restaurante",
    name: "Restaurante / Bar",
    tagline: "Diseñado para la industria de alimentos y bebidas",
    monthlyPrice: 59,
    annualPrice: 590,
    annualSavings: 118,
    colorFrom: "#B45309",
    colorTo: "#92400E",
    accentColor: "#F59E0B",
    textColor: "#FCD34D",
    limits: { users: 5, pos: 3, locations: 1, offlineDays: 15 },
    features: [
      "Hasta 5 usuarios",
      "Hasta 3 cajas / POS",
      "1 sucursal",
      "Todo lo del plan Profesional",
      "Mesas y barra",
      "Comandas digitales",
      "Pantalla de cocina / barra",
      "Control de meseros",
      "Propinas y happy hour",
      "Control de botellas / bar",
      "Impresión automática en cocina",
      "Tablets para meseros",
      "Reportes por mesero y bartender",
      "Modo LAN offline completo",
    ],
    ideal: ["Restaurantes", "Bares", "Cafeterías grandes", "Food trucks"],
    cta: "Solicitar demo gratis",
    ctaStyle: "amber",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Para cadenas, grupos de negocios y empresas",
    monthlyPrice: null,
    annualPrice: null,
    annualSavings: null,
    isCustom: true,
    colorFrom: "#6D28D9",
    colorTo: "#4C1D95",
    accentColor: "#8B5CF6",
    textColor: "#A78BFA",
    limits: { users: "Ilimitado", pos: "Ilimitado", locations: "Múltiples", offlineDays: 30 },
    features: [
      "Usuarios ilimitados",
      "Cajas ilimitadas",
      "Múltiples sucursales",
      "Todo lo del plan Restaurante",
      "Cloud sync avanzado",
      "Auditoría avanzada",
      "Backups empresariales",
      "Reportes ejecutivos",
      "API REST incluida",
      "Módulo de nómina incluido",
      "Instalación y setup asistido",
      "Capacitación del equipo",
      "Soporte dedicado directo",
      "SLA garantizado",
    ],
    ideal: ["Cadenas", "Mercados", "Grupos de negocios", "Empresas medianas"],
    cta: "Hablar con ventas",
    ctaStyle: "purple",
  },
];

export const addOns: AddOn[] = [
  { id: "extra-user", name: "Usuario adicional", description: "Agrega un operador extra a tu plan actual.", price: 8, period: "monthly", icon: "UserPlus", category: "Capacidad" },
  { id: "extra-pos", name: "Caja / POS adicional", description: "Terminal de venta extra para tu negocio.", price: 12, period: "monthly", icon: "Monitor", category: "Capacidad" },
  { id: "extra-location", name: "Sucursal adicional", description: "Nueva sede con inventario y reportes independientes.", price: 20, period: "monthly", icon: "Building2", category: "Capacidad" },
  { id: "nomina", name: "Módulo Nómina", description: "Empleados, asistencia, salarios y control de pagos.", price: 15, period: "monthly", icon: "DollarSign", category: "Módulos" },
  { id: "contabilidad", name: "Módulo Contabilidad", description: "Balance general, cuentas por cobrar/pagar, mayor.", price: 20, period: "monthly", icon: "Calculator", category: "Módulos" },
  { id: "delivery", name: "Módulo Delivery", description: "Pedidos a domicilio, zonas de reparto y seguimiento.", price: 19, period: "monthly", icon: "Truck", category: "Módulos" },
  { id: "fidelizacion", name: "Módulo Fidelización", description: "Puntos, tarjetas VIP y promociones automáticas.", price: 15, period: "monthly", icon: "Star", category: "Módulos" },
  { id: "whatsapp", name: "Módulo WhatsApp", description: "Recibos y notificaciones automáticas por WhatsApp.", price: 12, period: "monthly", icon: "MessageCircle", category: "Módulos" },
  { id: "soporte-premium", name: "Soporte Premium", description: "Atención telefónica directa, respuesta en <1 hora.", price: 29, period: "monthly", icon: "Headphones", category: "Soporte" },
  { id: "instalacion", name: "Instalación remota", description: "Setup completo vía videollamada con tu equipo.", price: 79, period: "one-time", icon: "Settings", category: "Soporte" },
  { id: "capacitacion", name: "Capacitación (2h)", description: "Sesión práctica en vivo para dominar el sistema.", price: 49, period: "one-time", icon: "GraduationCap", category: "Soporte" },
];

export const comparisonData: ComparisonCategory[] = [
  {
    category: "Capacidad",
    features: [
      { name: "Usuarios", basico: "1", profesional: "3", restaurante: "5", enterprise: "Ilimitado" },
      { name: "Cajas / POS", basico: "1", profesional: "2", restaurante: "3", enterprise: "Ilimitado" },
      { name: "Sucursales", basico: "1", profesional: "1", restaurante: "1", enterprise: "Múltiples" },
      { name: "Modo offline", basico: "7 días", profesional: "15 días", restaurante: "15 días", enterprise: "30 días" },
    ],
  },
  {
    category: "Ventas e Inventario",
    features: [
      { name: "Punto de venta (POS)", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Inventario básico", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Inventario avanzado", basico: false, profesional: true, restaurante: true, enterprise: true },
      { name: "Compras y proveedores", basico: false, profesional: true, restaurante: true, enterprise: true },
      { name: "Descuentos y promociones", basico: false, profesional: true, restaurante: true, enterprise: true },
      { name: "Lector código de barras", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Gestión de clientes (CRM)", basico: true, profesional: true, restaurante: true, enterprise: true },
    ],
  },
  {
    category: "Restaurante / Bar",
    features: [
      { name: "Mesas y barra", basico: false, profesional: false, restaurante: true, enterprise: true },
      { name: "Comandas digitales", basico: false, profesional: false, restaurante: true, enterprise: true },
      { name: "Pantalla de cocina / barra", basico: false, profesional: false, restaurante: true, enterprise: true },
      { name: "Control de meseros", basico: false, profesional: false, restaurante: true, enterprise: true },
      { name: "Propinas y happy hour", basico: false, profesional: false, restaurante: true, enterprise: true },
      { name: "Control de bar / botellas", basico: false, profesional: false, restaurante: true, enterprise: true },
    ],
  },
  {
    category: "Reportes y Análisis",
    features: [
      { name: "Reportes básicos", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Reportes avanzados", basico: false, profesional: true, restaurante: true, enterprise: true },
      { name: "Exportación PDF / Excel", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Dashboard ejecutivo", basico: false, profesional: false, restaurante: false, enterprise: true },
      { name: "API REST", basico: false, profesional: false, restaurante: false, enterprise: true },
    ],
  },
  {
    category: "Conectividad",
    features: [
      { name: "Cloud (online)", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Modo LAN / offline", basico: "Básico", profesional: "Completo", restaurante: "Completo", enterprise: "Completo" },
      { name: "Sincronización automática", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Multi-dispositivo simultáneo", basico: false, profesional: true, restaurante: true, enterprise: true },
    ],
  },
  {
    category: "Soporte y Seguridad",
    features: [
      { name: "Soporte WhatsApp y Email", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Soporte prioritario (<24h)", basico: false, profesional: true, restaurante: true, enterprise: true },
      { name: "Soporte dedicado directo", basico: false, profesional: false, restaurante: false, enterprise: true },
      { name: "Backups automáticos diarios", basico: true, profesional: true, restaurante: true, enterprise: true },
      { name: "Backups empresariales", basico: false, profesional: false, restaurante: false, enterprise: true },
      { name: "Roles y permisos", basico: false, profesional: true, restaurante: true, enterprise: true },
      { name: "Auditoría avanzada", basico: false, profesional: false, restaurante: false, enterprise: true },
      { name: "SLA garantizado", basico: false, profesional: false, restaurante: false, enterprise: true },
    ],
  },
];

export const pricingFAQ = [
  {
    question: "¿Puedo empezar gratis sin tarjeta de crédito?",
    answer: "Sí. Tienes 14 días de prueba completa sin necesidad de tarjeta ni compromiso. Al terminar la prueba, eliges tu plan o continúas sin costo hasta que decidas.",
  },
  {
    question: "¿Cómo funciona si no tengo internet estable?",
    answer: "Axis ERP está diseñado para funcionar en red local (LAN) sin internet. Cuando vuelve la conexión, todo se sincroniza solo. Según tu plan, puedes trabajar offline por 7, 15 o 30 días consecutivos.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos Zelle, Cash App, PayPal, transferencia bancaria, tarjeta de crédito/débito y efectivo. Si estás en Cuba o un país con restricciones de pago, escríbenos por WhatsApp y encontramos la solución.",
  },
  {
    question: "¿Qué pasa cuando se vence mi licencia?",
    answer: "El sistema entra en modo lectura: puedes ver todo pero no registrar nuevas ventas. Tienes 7 días adicionales de gracia para renovar. Nunca pierdes tus datos, jamás.",
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer: "Sí. Mejorar tu plan es inmediato. Si necesitas reducir, el cambio aplica al inicio del siguiente período de facturación.",
  },
  {
    question: "¿Cuánto tiempo tarda la implementación?",
    answer: "La mayoría de negocios están operando en 24 a 72 horas. Si contratas la instalación asistida, lo hacemos juntos en una videollamada de 2-3 horas.",
  },
  {
    question: "¿Mis datos son solo míos?",
    answer: "Absolutamente. Tus datos te pertenecen. Los almacenamos cifrados, con backups automáticos. Además, como el sistema funciona en red local, tus datos viven también en tu propia red. Puedes exportar todo en cualquier momento.",
  },
  {
    question: "¿Funciona en tablets y celulares?",
    answer: "Sí. La interfaz es responsive y funciona desde cualquier navegador moderno — PC, tablet o celular. Los meseros pueden usar tablets para tomar comandas directamente en la mesa.",
  },
];
