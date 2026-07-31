/**
 * Métodos de cobro de la tarjeta digital.
 *
 * El problema que resuelve: el cliente acaba escribiendo a mano un número de
 * Zelle dictado en una acera. Un dígito mal y el dinero se va a un desconocido,
 * y una transferencia a un destinatario inscrito normalmente no se puede
 * cancelar.
 *
 * Reglas duras (mismas que el resto de módulos, ver CARD-SYSTEM.md):
 *  - Un método sin datos reales NO se renderiza. Nunca un número de ejemplo.
 *  - Aquí NO se cobra nada. Esta capa solo muestra a quién pagar y por dónde.
 *    Procesar pagos con tarjeta convierte a 305 en intermediario de dinero, con
 *    disputas, contracargos y verificación de identidad: es otro producto.
 *  - Siempre se enseña el nombre exacto del destinatario y se pide al cliente
 *    que lo compruebe en su banco ANTES de enviar.
 */

/**
 * Zelle es el caso raro: vive dentro de la app de cada banco y NO existe un
 * enlace universal que abra el banco del cliente con el destinatario puesto.
 * Por eso su experiencia es copiar / guardar contacto / QR, y no un botón.
 *
 * Los otros tres SÍ tienen enlace universal, así que ahí sí hay un toque de
 * verdad. Tratarlos igual que a Zelle sería rebajar tres experiencias buenas
 * al nivel de la única mala.
 */
export type PaymentProvider = "zelle" | "venmo" | "cashapp" | "paypal";

export interface ZellePayment {
  enabled: boolean;
  /** Nombre EXACTO como aparece inscrito en Zelle. Es lo que el cliente coteja. */
  recipientName?: string;
  /** Teléfono inscrito, tal cual se marca. Uno de los dos es obligatorio. */
  phone?: string;
  /** Correo inscrito. Alternativa al teléfono. */
  email?: string;
  /**
   * Ruta a la imagen del QR que el banco del dueño generó.
   *
   * NO se genera aquí: un QR de Zelle válido lo emite el banco y lleva datos
   * suyos dentro. Inventarlo produciría un código que no cobra nada.
   */
  qrImage?: string;
  /** Nota del negocio: "cobro al terminar el servicio", etc. */
  note?: string;
  noteEs?: string;
}

export interface HandlePayment {
  enabled: boolean;
  /** Usuario/etiqueta sin @ ni $: se normaliza al construir el enlace. */
  handle?: string;
  /** Nombre que el cliente debería ver al abrir la app. */
  recipientName?: string;
}

export interface CardPaymentsConfig {
  enabled: boolean;
  zelle?: ZellePayment;
  venmo?: HandlePayment;
  cashapp?: HandlePayment;
  paypal?: HandlePayment;
}

function clean(v?: string): string {
  return (v ?? "").trim();
}

/** Quita @ y $ iniciales: la gente los escribe y los enlaces no los llevan. */
function normalizeHandle(v?: string): string {
  return clean(v).replace(/^[@$]+/, "");
}

/**
 * Enlaces universales reales. Abren la app con el destinatario ya seleccionado
 * cuando está instalada, y su web si no.
 *
 * Deliberadamente SIN importe: fijar la cantidad desde una tarjeta pública
 * invita a que alguien manipule el enlace, y el precio de un servicio lo pone
 * quien lo presta, no la tarjeta.
 */
export function paymentLink(provider: Exclude<PaymentProvider, "zelle">, handle?: string): string | null {
  const h = normalizeHandle(handle);
  if (!h) return null;
  const safe = encodeURIComponent(h);
  switch (provider) {
    case "venmo": return `https://venmo.com/u/${safe}`;
    case "cashapp": return `https://cash.app/$${safe}`;
    case "paypal": return `https://paypal.me/${safe}`;
  }
}

/** Zelle solo es utilizable si hay nombre Y una forma de contacto inscrita. */
export function zelleRenderable(z?: ZellePayment): boolean {
  if (!z?.enabled) return false;
  return Boolean(clean(z.recipientName)) && Boolean(clean(z.phone) || clean(z.email));
}

export function handleRenderable(h?: HandlePayment): boolean {
  return Boolean(h?.enabled && normalizeHandle(h.handle));
}

/** ¿Hay algo real que enseñar? Si no, el bloque de pago no existe. */
export function paymentsRenderable(c?: CardPaymentsConfig): boolean {
  if (!c?.enabled) return false;
  return zelleRenderable(c.zelle)
    || handleRenderable(c.venmo)
    || handleRenderable(c.cashapp)
    || handleRenderable(c.paypal);
}

export interface ModuleIssue {
  level: "error" | "warning";
  message: string;
}

/**
 * Comprueba la configuración para que un fallo se vea al construir y no como un
 * bloque a medias delante de un cliente que va a pagar.
 */
export function validatePayments(c?: CardPaymentsConfig): ModuleIssue[] {
  const issues: ModuleIssue[] = [];
  if (!c?.enabled) return issues;

  const z = c.zelle;
  if (z?.enabled) {
    if (!clean(z.recipientName)) {
      issues.push({ level: "error", message: "Zelle activo sin nombre del destinatario: es lo que el cliente debe cotejar en su banco antes de enviar." });
    }
    if (!clean(z.phone) && !clean(z.email)) {
      issues.push({ level: "error", message: "Zelle activo sin teléfono ni correo inscrito: no hay a dónde pagar." });
    }
    if (!clean(z.qrImage)) {
      issues.push({ level: "warning", message: "Zelle sin imagen de QR. Es opcional, pero el QR lo genera el banco del dueño y evita que el cliente teclee el número." });
    }
  }

  for (const [name, h] of [["Venmo", c.venmo], ["Cash App", c.cashapp], ["PayPal", c.paypal]] as const) {
    if (h?.enabled && !normalizeHandle(h.handle)) {
      issues.push({ level: "error", message: `${name} activo sin usuario: no se puede construir el enlace.` });
    }
  }

  if (!paymentsRenderable(c)) {
    issues.push({ level: "warning", message: "Pagos activados pero ningún método tiene datos reales: el bloque no se renderiza." });
  }
  return issues;
}
