import { FALLBACK_LISTINGS } from './listingData';
import { fetchListingsFromApi } from './listingsApi';

export interface ListingRecord {
  id?: string;
  label: string;
  labelUpdatedAt: string;
  status: string;
  price: number;
  oldPrice?: number;
  firstAddress: string;
  secondAddress: string;
  bedrooms: number;
  bathrooms: number;
  square: number;
  lotSizeAcres?: number;
  newConstruction?: boolean;
  media: string[];
}

export interface ListingsResponse {
  records: ListingRecord[];
  totalCount: number;
}

export async function fetchLiveListings(): Promise<ListingsResponse> {
  try {
    const records = await fetchListingsFromApi();
    if (!records || records.length === 0) {
      console.warn(
        '[Listings] API returned no records — using static fallback. For live data: set RUUSTER_LISTINGS_EXTRA_PARAMS (e.g. slug=…) on Vercel, and the same in .env for npm run dev (proxy reads it).'
      );
      return { records: FALLBACK_LISTINGS, totalCount: FALLBACK_LISTINGS.length };
    }
    return { records, totalCount: records.length };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      '[Listings] API failed — using static fallback.',
      msg,
      'Ruuster requires slug=… in the upstream URL; confirm /api/listings returns 200 (try vercel dev or production).'
    );
    return { records: FALLBACK_LISTINGS, totalCount: FALLBACK_LISTINGS.length };
  }
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

export function formatUpdatedAt(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Updated just now';
  if (diffMins < 60) return `Updated ${diffMins}m ago`;
  if (diffHours < 24) return `Updated ${diffHours}h ago`;
  if (diffDays < 7) return `Updated ${diffDays}d ago`;
  return `Updated ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}
