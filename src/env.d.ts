/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_CONTACT_EMAIL: string;
  // FORTALEZA
  readonly VITE_FORTALEZA_DOWNLOAD_EXE: string;
  readonly VITE_FORTALEZA_DOWNLOAD_ZIP: string;
  // Axis ERP
  readonly VITE_ERP_VERSION: string;
  readonly VITE_ERP_DEMO_URL: string;
  readonly VITE_ERP_DEMO_USER: string;
  readonly VITE_ERP_DEMO_PASS: string;
  readonly VITE_ERP_WINDOWS_DOWNLOAD: string;
  readonly VITE_ERP_ANDROID_DOWNLOAD: string;
  readonly VITE_ERP_SERVER_DOWNLOAD: string;
  readonly VITE_ERP_DOCS_URL: string;
  readonly VITE_ERP_VIDEO_URL: string;
  readonly VITE_ERP_MANUAL_URL: string;
  readonly VITE_ERP_CHANGELOG_URL: string;
  readonly VITE_ERP_BOOK_DEMO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
