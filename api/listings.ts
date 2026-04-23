/**
 * Vercel serverless function: proxies listings from Ruuster API.
 * Set RUUSTER_API_URL, RUUSTER_API_KEY, and optional RUUSTER_LISTINGS_EXTRA_PARAMS in Vercel env.
 */

const RUUSTER_BASE = process.env.RUUSTER_API_URL ?? 'https://redpostrealty.ruuster.com/api';
const RUUSTER_API_KEY = process.env.RUUSTER_API_KEY ?? '';

/** Optional extra query string forwarded to Ruuster, e.g. "limit=200&sort=updated_at" (confirm names with Ruuster). */
const RUUSTER_LISTINGS_EXTRA_PARAMS = process.env.RUUSTER_LISTINGS_EXTRA_PARAMS ?? '';

export const config = {
  runtime: 'edge',
};

/** Query keys allowed from the browser request onto the upstream URL (avoid leaking arbitrary params). */
const FORWARD_QUERY_KEYS = [
  'sort',
  'order',
  'sortBy',
  'limit',
  'per_page',
  'page',
  'offset',
  'updated_since',
];

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const base = RUUSTER_BASE.replace(/\/$/, '');
  const url = new URL(`${base}/listings`);
  url.searchParams.set('status', 'Active');

  if (RUUSTER_LISTINGS_EXTRA_PARAMS) {
    const parsed = new URLSearchParams(RUUSTER_LISTINGS_EXTRA_PARAMS);
    parsed.forEach((value, key) => {
      if (value !== '') url.searchParams.set(key, value);
    });
  }

  try {
    const reqUrl = new URL(req.url);
    for (const key of FORWARD_QUERY_KEYS) {
      const v = reqUrl.searchParams.get(key);
      if (v != null && v !== '') url.searchParams.set(key, v);
    }
  } catch {
    /* ignore malformed req.url */
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  };
  if (RUUSTER_API_KEY) {
    headers['Authorization'] = `Bearer ${RUUSTER_API_KEY}`;
    headers['X-API-Key'] = RUUSTER_API_KEY;
  }

  try {
    const res = await fetch(url.toString(), {
      headers,
      cache: 'no-store',
    });
    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: 'Upstream API error', status: res.status }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
