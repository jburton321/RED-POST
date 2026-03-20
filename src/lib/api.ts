/**
 * API configuration - single source of truth for all endpoints.
 * Set env vars in .env (see .env.example).
 */

const env = import.meta.env;

/** Full URL to listings API. If set, used directly. Otherwise uses /api/listings (proxy). */
export const LISTINGS_URL =
  env.VITE_LISTINGS_URL || (env.VITE_API_BASE ? `${env.VITE_API_BASE}/api/listings` : '/api/listings');

/** Formspree form ID for leads (https://formspree.io) */
export const FORMSPREE_ID = env.VITE_FORMSPREE_ID || '';

/** Custom leads endpoint. If set, POST JSON here instead of Formspree. */
export const LEADS_ENDPOINT = env.VITE_LEADS_ENDPOINT || '';
