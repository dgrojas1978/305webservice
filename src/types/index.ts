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
  createdAt: Date;
  source?: string;
}
