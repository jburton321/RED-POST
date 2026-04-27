import { HERO_STRIP_LISTINGS_URL } from './api';
import { listRecordsFromPublicListingsJson } from './heroPublicListings';
import type { ListingRecord } from './listings';

/**
 * Hero sold strip only: `{ "listings": [ … ] }` in `public/hero-sold-listings.json`
 * (or `VITE_HERO_STRIP_LISTINGS_URL`). No MLS or Ruuster feed.
 */
export async function fetchHeroStripListings(): Promise<ListingRecord[]> {
  try {
    const res = await fetch(HERO_STRIP_LISTINGS_URL, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return listRecordsFromPublicListingsJson(json);
  } catch {
    return [];
  }
}
