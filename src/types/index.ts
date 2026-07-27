export interface Lead {
  name: string;
  company?: string;
  email: string;
  phone?: string;
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
