/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_LISTINGS_URL?: string;
  readonly VITE_API_PROXY?: string;
  readonly VITE_FORMSPREE_ID?: string;
  readonly VITE_LEADS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  rupiIntegration?: {
    init: () => void;
  };
}
