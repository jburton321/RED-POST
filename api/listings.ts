/**
 * Vercel serverless function: proxies listings from Ruuster API.
 * Set RUUSTER_API_URL and optionally RUUSTER_API_KEY in Vercel env.
 */

const RUUSTER_BASE = process.env.RUUSTER_API_URL ?? 'https://redpostrealty.ruuster.com/api';
const RUUSTER_API_KEY = process.env.RUUSTER_API_KEY ?? '';

export const config = {
  runtime: 'edge',
};

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

  const url = new URL(`${RUUSTER_BASE}/listings`);
  url.searchParams.set('status', 'Active');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (RUUSTER_API_KEY) {
    headers['Authorization'] = `Bearer ${RUUSTER_API_KEY}`;
    headers['X-API-Key'] = RUUSTER_API_KEY;
  }

  try {
    const res = await fetch(url.toString(), { headers });
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
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
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
