/**
 * Listings API - fetches from configured endpoint.
 * Handles multiple response formats. Falls back to static data when API fails.
 */

import type { ListingRecord } from './listings';
import { LISTINGS_URL } from './api';

type ListingRow = Record<string, unknown>;

function getStr(row: ListingRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v != null && typeof v === 'string') return v;
  }
  return '';
}

function getNum(row: ListingRow, ...keys: string[]): number {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (typeof v === 'string') {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
}

function getDate(row: ListingRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v == null) continue;
    const d = typeof v === 'string' ? new Date(v) : v instanceof Date ? v : null;
    if (d && !Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function getMedia(row: ListingRow): string[] {
  const keys = ['media', 'images', 'photos', 'photo_urls', 'image_urls'];
  for (const k of keys) {
    const v = row[k];
    if (Array.isArray(v)) {
      const arr = v.filter((x): x is string => typeof x === 'string');
      if (arr.length > 0) return arr;
    }
  }
  return [];
}

function toListingRecord(row: ListingRow): ListingRecord {
  const firstAddress = getStr(row, 'first_address', 'firstAddress', 'address1', 'street', 'street_address', 'address_line1');
  const secondAddress = getStr(row, 'second_address', 'secondAddress', 'address2', 'city_state_zip', 'city_state', 'locality');
  return {
    id: typeof row.id === 'string' ? row.id : undefined,
    label: getStr(row, 'label', 'status_label', 'listing_status') || 'Active',
    labelUpdatedAt: getDate(row, 'label_updated_at', 'labelUpdatedAt', 'updated_at', 'updatedAt', 'modified_at', 'last_updated'),
    status: getStr(row, 'status', 'listing_status') || 'Active',
    price: getNum(row, 'price', 'list_price', 'listing_price'),
    oldPrice: getNum(row, 'old_price', 'oldPrice', 'previous_price') || undefined,
    firstAddress,
    secondAddress,
    bedrooms: getNum(row, 'bedrooms', 'beds', 'bed'),
    bathrooms: getNum(row, 'bathrooms', 'baths', 'bath'),
    square: getNum(row, 'square', 'sqft', 'square_feet', 'living_area'),
    lotSizeAcres: getNum(row, 'lot_size_acres', 'lotSizeAcres', 'lot_acres') || undefined,
    newConstruction: Boolean(row.new_construction ?? row.newConstruction),
    media: getMedia(row),
  };
}

function extractRows(json: unknown): ListingRow[] {
  if (Array.isArray(json)) return json as ListingRow[];
  if (json && typeof json === 'object') {
    const obj = json as Record<string, unknown>;
    const arr = obj.data ?? obj.records ?? obj.listings ?? obj.items ?? obj.results ?? obj.properties ?? obj.hits;
    if (Array.isArray(arr)) return arr as ListingRow[];
    if (obj.response && typeof obj.response === 'object') {
      const inner = (obj.response as Record<string, unknown>).data ?? (obj.response as Record<string, unknown>).listings;
      if (Array.isArray(inner)) return inner as ListingRow[];
    }
  }
  return [];
}

export async function fetchListingsFromApi(): Promise<ListingRecord[]> {
  const url = LISTINGS_URL || `${API_BASE}/api/listings`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Listings API error: ${res.status}`);
  }

  const json = await res.json();
  const rows = extractRows(json);

  if (rows.length === 0) {
    throw new Error('No listings in response');
  }

  return rows
    .filter((r) => r && typeof r === 'object' && (getNum(r, 'price', 'list_price') > 0 || getStr(r, 'first_address', 'firstAddress').length > 0))
    .map(toListingRecord)
    .sort((a, b) => new Date(b.labelUpdatedAt).getTime() - new Date(a.labelUpdatedAt).getTime());
}
