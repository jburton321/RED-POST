/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_LISTINGS_URL?: string;
  /** Listings poll interval in ms (min 10000). Default 45000. */
  readonly VITE_LISTINGS_POLL_MS?: string;
  /** Extra query string for /api/listings in dev, e.g. limit=200 (must match API). */
  readonly VITE_LISTINGS_QUERY?: string;
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
