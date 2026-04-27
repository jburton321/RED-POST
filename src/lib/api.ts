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
 * Hero sold strip: fetch this JSON. Default respects `import.meta.env.BASE_URL` (subpath deploys).
 */
export const HERO_STRIP_LISTINGS_URL = (() => {
  const fromEnv = (env.VITE_HERO_STRIP_LISTINGS_URL ?? '').trim();
  if (fromEnv) return fromEnv;
  const base = env.BASE_URL ?? '/';
  const p = '/hero-sold-listings.json';
  if (base === '/' || base === '') return p;
  return `${base.replace(/\/$/, '')}${p}`;
})();

/**
 * Optional query string appended to listings requests (local dev). Example: `limit=200&sort=updated_at`
 * Parameter names must match what your Ruuster/API expects—confirm with their docs.
 */
export const LISTINGS_CLIENT_QUERY = (env.VITE_LISTINGS_QUERY ?? '').trim();

/** E.164 or tel-safe href, e.g. +16035551234. Defaults when env unset. */
const DEFAULT_PHONE_TEL = '+16036050181';
const DEFAULT_PHONE_DISPLAY = '(603) 605-0181';

const telEnv = (env.VITE_PHONE_TEL ?? '').trim();
const displayEnv = (env.VITE_PHONE_DISPLAY ?? '').trim();

export const PHONE_TEL = telEnv || DEFAULT_PHONE_TEL;

/** Display label next to phone CTAs; falls back to tel env or default display */
export const PHONE_DISPLAY = displayEnv || telEnv || DEFAULT_PHONE_DISPLAY;

/** Optional live chat URL (Tidio, Intercom, etc.); if empty, chat FAB is hidden */
export const CHAT_URL = (env.VITE_CHAT_URL ?? '').trim();
