/** A quote request captured by the contact form. */
export interface Lead {
  name: string;
  company?: string;
  phone: string;
  email: string;
  service: string;
  budget?: string;
  message: string;
  preferredContact: string;
  consent: boolean;
  createdAt: Date;
  source?: string;
}
