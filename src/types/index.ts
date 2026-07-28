export interface Lead {
  name: string;
  company?: string;
  /** Requerido en el formulario web; la tarjeta digital permite solo teléfono
      cuando el método preferido es WhatsApp o llamada. */
  email?: string;
  phone?: string;
  /** Método de contacto preferido (tarjeta digital): whatsapp | call | email. */
  contactMethod?: string;
  service: string;
  budget?: string;
  message: string;
  consent: boolean;
  locale?: "en" | "es";
  /** Atribución (UTM/referrer) capturada con consentimiento del envío. */
  attribution?: Record<string, string>;
  createdAt: Date;
  source?: string;
}
