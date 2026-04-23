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

/** How often to refetch listings while the home page is open and the tab is visible (ms). Default 45s. */
export const LISTINGS_POLL_MS = Math.max(10_000, Number(env.VITE_LISTINGS_POLL_MS) || 45_000);

/**
 * Optional query string appended to listings requests (local dev). Example: `limit=200&sort=updated_at`
 * Parameter names must match what your Ruuster/API expects—confirm with their docs.
 */
export const LISTINGS_CLIENT_QUERY = (env.VITE_LISTINGS_QUERY ?? '').trim();

/** E.164 or tel-safe href, e.g. +16035551234 */
export const PHONE_TEL = (env.VITE_PHONE_TEL ?? '').trim();

/** Display label next to phone CTAs; falls back to PHONE_TEL */
export const PHONE_DISPLAY = (env.VITE_PHONE_DISPLAY ?? env.VITE_PHONE_TEL ?? '').trim();

/** Optional live chat URL (Tidio, Intercom, etc.); if empty, chat FAB is hidden */
export const CHAT_URL = (env.VITE_CHAT_URL ?? '').trim();
