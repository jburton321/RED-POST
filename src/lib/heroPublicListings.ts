import type { ListingRecord } from './listings';

/** Local only — hero sold strip is independent of MLS / Ruuster. */
const DEFAULT_IMAGE = '/images/hero-sold-placeholder.svg';

/** Root-relative paths from JSON work on Vercel and with Vite `base`. */
function publicAssetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:)/i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = import.meta.env.BASE_URL ?? '/';
  if (base === '/' || base === '') return normalized;
  return `${base.replace(/\/$/, '')}${normalized}`;
}

function parsePrice(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v.replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

type PublicRow = Record<string, unknown>;

function toRecord(row: PublicRow): ListingRecord | null {
  const firstAddress = String(row.firstAddress ?? row.address1 ?? row.line1 ?? '').trim();
  const secondAddress = String(row.secondAddress ?? row.address2 ?? row.line2 ?? row.cityLine ?? '').trim();
  if (!firstAddress || !secondAddress) return null;

  const price =
    row.price != null
      ? parsePrice(row.price)
      : parsePrice(row.priceText ?? row.listPrice ?? 0);

  const bedrooms = Number(row.bedrooms ?? row.beds ?? 0) || 0;
  const bathrooms = Number(row.bathrooms ?? row.baths ?? 0) || 0;
  const square = Number(row.square ?? row.sqft ?? 0) || 0;

  let media: string[] = [];
  if (Array.isArray(row.media) && row.media.length > 0) {
    media = row.media
      .filter((x): x is string => typeof x === 'string' && x.trim() !== '')
      .map((p) => publicAssetUrl(p.trim()));
  } else if (typeof row.image === 'string' && row.image.trim() !== '') {
    media = [publicAssetUrl(row.image.trim())];
  }
  if (media.length === 0) {
    media = [publicAssetUrl(DEFAULT_IMAGE)];
  }

  const labelUpdatedAt =
    typeof row.labelUpdatedAt === 'string' && row.labelUpdatedAt.trim() !== ''
      ? new Date(row.labelUpdatedAt).toISOString()
      : new Date().toISOString();

  return {
    id: row.id != null ? String(row.id) : undefined,
    label: 'Sold',
    labelUpdatedAt,
    status: 'Closed',
    price,
    firstAddress,
    secondAddress,
    bedrooms,
    bathrooms,
    square,
    media,
  };
}

/**
 * Public copy–only format: `{ "listings": [ { firstAddress, secondAddress, price|priceText, ... } ] }`
 * (optional key `sold` instead of `listings`). Maps to `ListingRecord` for the existing hero strip (no new UI).
 */
export function listRecordsFromPublicListingsJson(json: unknown): ListingRecord[] {
  if (!json || typeof json !== 'object') return [];
  const obj = json as Record<string, unknown>;
  const raw = obj.listings ?? obj.sold;
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const out: ListingRecord[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const r = toRecord(item as PublicRow);
    if (r) out.push(r);
  }
  return out;
}
