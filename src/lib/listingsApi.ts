/**
 * Listings API - fetches from configured endpoint.
 * Handles Ruuster-style and RESO/MLS-shaped JSON. Falls back via fetchLiveListings when API fails.
 */

import type { ListingRecord } from './listings';
import { LISTINGS_URL, LISTINGS_CLIENT_QUERY } from './api';

type ListingRow = Record<string, unknown>;

function getStr(row: ListingRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v != null && typeof v === 'string' && v.trim() !== '') return v.trim();
  }
  return '';
}

function getNum(row: ListingRow, ...keys: string[]): number {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (typeof v === 'string') {
      const n = Number(v.replace(/[^0-9.-]/g, ''));
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

function mediaFromArray(arr: unknown[]): string[] {
  const out: string[] = [];
  for (const item of arr) {
    if (typeof item === 'string' && item.trim() !== '') {
      out.push(item.trim());
      continue;
    }
    if (item && typeof item === 'object') {
      const o = item as ListingRow;
      const u = getStr(o, 'MediaURL', 'media_url', 'url', 'Url', 'PhotoUrl', 'image_url', 'src');
      if (u) out.push(u);
    }
  }
  return out;
}

function getMedia(row: ListingRow): string[] {
  const keys = ['media', 'images', 'photos', 'photo_urls', 'image_urls', 'Photo', 'Media'];
  for (const k of keys) {
    const v = row[k];
    if (Array.isArray(v)) {
      const arr = mediaFromArray(v);
      if (arr.length > 0) return arr;
    }
  }
  return [];
}

function buildAddresses(row: ListingRow): { first: string; second: string } {
  const unparsed = getStr(row, 'UnparsedAddress', 'unparsed_address', 'unparsedAddress');
  if (unparsed) {
    const idx = unparsed.indexOf(',');
    if (idx > 0) {
      return {
        first: unparsed.slice(0, idx).trim(),
        second: unparsed.slice(idx + 1).trim(),
      };
    }
    return { first: unparsed, second: '' };
  }

  const streetBuilt = [getStr(row, 'StreetNumber', 'street_number'), getStr(row, 'StreetName', 'street_name')]
    .filter(Boolean)
    .join(' ')
    .trim();

  const first =
    getStr(row, 'first_address', 'firstAddress', 'address1', 'street', 'street_address', 'address_line1') ||
    streetBuilt;

  const city = getStr(row, 'City', 'city');
  const state = getStr(row, 'StateOrProvince', 'state', 'state_or_province');
  const zip = getStr(row, 'PostalCode', 'postal_code', 'zip');
  const secondParts = [city, [state, zip].filter(Boolean).join(' ')].filter(Boolean);
  const second = secondParts.length ? secondParts.join(', ') : getStr(row, 'second_address', 'secondAddress', 'address2', 'city_state_zip', 'city_state', 'locality');

  return { first, second };
}

function toListingRecord(row: ListingRow): ListingRecord {
  const { first: firstAddress, second: secondAddress } = buildAddresses(row);
  const price = getNum(row, 'price', 'list_price', 'listing_price', 'ListPrice', 'listPrice');
  const oldPrice = getNum(row, 'old_price', 'oldPrice', 'previous_price', 'PreviousListPrice', 'previous_list_price');
  return {
    id:
      typeof row.id === 'string'
        ? row.id
        : getStr(row, 'ListingKey', 'listing_key', 'ListingId', 'listing_id', 'mls_number') || undefined,
    label:
      getStr(row, 'label', 'status_label', 'MlsStatus', 'mls_status', 'StandardStatus', 'standard_status') ||
      'Active',
    labelUpdatedAt: getDate(
      row,
      'label_updated_at',
      'labelUpdatedAt',
      'ModificationTimestamp',
      'modification_timestamp',
      'updated_at',
      'updatedAt',
      'modified_at',
      'last_updated',
      'OnMarketTimestamp',
      'on_market_timestamp'
    ),
    status: getStr(row, 'status', 'listing_status', 'StandardStatus', 'standard_status', 'MlsStatus') || 'Active',
    price,
    oldPrice: oldPrice > 0 && oldPrice !== price ? oldPrice : undefined,
    firstAddress,
    secondAddress,
    bedrooms: getNum(row, 'bedrooms', 'beds', 'bed', 'BedroomsTotal', 'bedrooms_total'),
    bathrooms: getNum(row, 'bathrooms', 'baths', 'bath', 'BathroomsTotalInteger', 'bathrooms_total'),
    square: getNum(row, 'square', 'sqft', 'square_feet', 'living_area', 'LivingArea', 'living_area_sf'),
    lotSizeAcres: getNum(row, 'lot_size_acres', 'lotSizeAcres', 'lot_acres', 'LotSizeAcres') || undefined,
    newConstruction: Boolean(row.new_construction ?? row.newConstruction ?? row.NewConstruction),
    media: getMedia(row),
  };
}

function extractRows(json: unknown): ListingRow[] {
  if (Array.isArray(json)) return json as ListingRow[];
  if (json && typeof json === 'object') {
    const obj = json as Record<string, unknown>;
    const arr = obj.data ?? obj.records ?? obj.listings ?? obj.items ?? obj.results ?? obj.properties ?? obj.hits ?? obj.value;
    if (Array.isArray(arr)) return arr as ListingRow[];
    if (obj.response && typeof obj.response === 'object') {
      const inner = (obj.response as Record<string, unknown>).data ?? (obj.response as Record<string, unknown>).listings;
      if (Array.isArray(inner)) return inner as ListingRow[];
    }
  }
  return [];
}

function buildListingsUrl(): string {
  if (!LISTINGS_CLIENT_QUERY) return LISTINGS_URL;
  try {
    const u = new URL(LISTINGS_URL, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    new URLSearchParams(LISTINGS_CLIENT_QUERY).forEach((value, key) => {
      if (value !== '') u.searchParams.set(key, value);
    });
    return `${u.pathname}${u.search}`;
  } catch {
    return LISTINGS_URL;
  }
}

function rowHasUsefulData(r: ListingRow): boolean {
  const price = getNum(r, 'price', 'list_price', 'ListPrice', 'listPrice');
  const addr =
    getStr(r, 'first_address', 'firstAddress', 'UnparsedAddress', 'StreetName', 'address1').length > 0 ||
    buildAddresses(r).first.length > 0;
  return price > 0 || addr;
}

export async function fetchListingsFromApi(): Promise<ListingRecord[]> {
  const url = buildListingsUrl();
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
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
    .filter((r) => r && typeof r === 'object' && rowHasUsefulData(r as ListingRow))
    .map((r) => toListingRecord(r as ListingRow))
    .sort((a, b) => new Date(b.labelUpdatedAt).getTime() - new Date(a.labelUpdatedAt).getTime());
}
