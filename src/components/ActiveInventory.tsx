import { useEffect, useMemo, useRef, useState } from 'react';
import CommandButton from './CommandButton';
import PropertyCard from './PropertyCard';
import PropertyListItem from './PropertyListItem';
import PropertyMapView from './PropertyMapView';
import PropertyLightbox from './PropertyLightbox';
import ViewToggle from './ViewToggle';
import type { ViewMode } from './ViewToggle';
import { useListings } from '../context/ListingsContext';
import type { ListingRecord } from '../lib/listings';

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 10;

type PriceBand = 'all' | '400-500' | '3m-5m';

function matchesPriceBand(price: number, band: PriceBand): boolean {
  if (band === 'all') return true;
  if (band === '400-500') return price >= 400_000 && price <= 500_000;
  if (band === '3m-5m') return price >= 3_000_000 && price <= 5_000_000;
  return true;
}

export default function ActiveInventory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const { records: listings, totalCount, refreshGeneration, initialLoading } = useListings();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [priceBand, setPriceBand] = useState<PriceBand>('all');
  const [selectedListing, setSelectedListing] = useState<ListingRecord | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [refreshGeneration, priceBand]);

  const filteredListings = useMemo(
    () => listings.filter((l) => matchesPriceBand(l.price, priceBand)),
    [listings, priceBand]
  );

  const feedLastUpdated = useMemo(() => {
    if (listings.length === 0) return null;
    return new Date(listings[0].labelUpdatedAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [listings]);

  const showPagination = viewMode !== 'map';
  const visibleListings = showPagination
    ? filteredListings.slice(0, visibleCount)
    : filteredListings;
  const hasMore = visibleCount < filteredListings.length;
  const filteredCount = filteredListings.length;

  return (
    <section id="inventory" ref={sectionRef} className="inv-section">
      <div className="inv-dot-grid" />
      <div className="inv-scanline" />

      <div className={`inv-inner ${visible ? 'inv-inner--visible' : ''}`}>
        <div className="inv-header-top">
          <div className="inv-status">
            <span className="inv-pulse" />
            <span className="inv-status-text">LIVE FEED</span>
          </div>
          <span className="inv-tag">
            {priceBand === 'all' && totalCount > 0
              ? `${totalCount} ACTIVE LISTINGS`
              : priceBand === 'all'
                ? 'ACTIVE LISTINGS'
                : `${filteredCount} IN RANGE`}
          </span>
        </div>

        <div className="inv-rule" />

        <div className="section-header-row">
          <div className="inv-header-left">
            <span className="inv-label">INVENTORY_FEED // SEACOAST MLS</span>
            <h2 className="inv-title">
              Active <span className="inv-title-accent">Inventory</span>
            </h2>
            <div className="inv-view-bar">
              <ViewToggle active={viewMode} onChange={setViewMode} />
            </div>
            <div className="inv-price-filters" role="group" aria-label="Filter by price">
              {(
                [
                  ['all', 'All active'],
                  ['400-500', '$400k – $500k'],
                  ['3m-5m', '$3M – $5M'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`inv-price-filter${priceBand === value ? ' inv-price-filter--active' : ''}`}
                  onClick={() => setPriceBand(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <CommandButton leadSource="active-inventory" />
        </div>

        {initialLoading && listings.length === 0 && (
          <div className="inv-empty-feed" role="status">
            <p className="inv-empty-feed-title">Loading live listings…</p>
          </div>
        )}

        {!initialLoading && listings.length === 0 && (
          <div className="inv-empty-feed">
            <p className="inv-empty-feed-title">No listings available</p>
            <p className="inv-empty-feed-body">Fallback inventory failed to load. Check the console and network requests.</p>
          </div>
        )}

        {!initialLoading && listings.length > 0 && filteredCount === 0 && (
          <div className="inv-empty-feed inv-empty-feed--dark">
            <p className="inv-empty-feed-title inv-empty-feed-title--dark">No listings in this price range</p>
            <p className="inv-empty-feed-body inv-empty-feed-body--dark">Try another filter or view all active listings.</p>
          </div>
        )}

        {filteredCount > 0 && viewMode === 'card' && (
          <div className="inv-card-grid">
            {visibleListings.map((listing, i) => (
              <PropertyCard key={listing.id || `${listing.firstAddress}-${i}`} listing={listing} onClick={() => setSelectedListing(listing)} />
            ))}
          </div>
        )}

        {filteredCount > 0 && viewMode === 'list' && (
          <div className="inv-list-grid">
            {visibleListings.map((listing, i) => (
              <PropertyListItem key={listing.id || `${listing.firstAddress}-${i}`} listing={listing} onClick={() => setSelectedListing(listing)} />
            ))}
          </div>
        )}

        {filteredCount > 0 && viewMode === 'map' && (
          <PropertyMapView listings={filteredListings} onSelectListing={setSelectedListing} />
        )}

        {showPagination && hasMore && (
          <div className="inv-cta-container">
            <button
              type="button"
              className="inv-load-more-btn"
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            >
              Load More Listings
            </button>
          </div>
        )}

        <div className="inv-cta-container">
          <p className="inv-copyright">
            © 2026. The multiple listing data appearing on this website is owned and copyrighted by <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" className="inv-link">PrimeMLS (NEREN)</a> and is protected by all applicable copyright laws. Information provided is for the consumer's personal, non-commercial use and may not be used for any purpose other than to identify prospective properties the consumer may be interested in purchasing.
            <br />
            <br />
            Last updated: {feedLastUpdated ?? '—'}.
          </p>
        </div>

        <div className="inv-rule inv-rule--bottom" />

        <div className="inv-bottom">
          <span className="inv-bottom-text">
            [ INTEL: PRE-MLS PIPELINE LOCKED // COMPLETE PROFILE TO DECRYPT ]
          </span>
        </div>
      </div>

      <PropertyLightbox listing={selectedListing} onClose={() => setSelectedListing(null)} />
    </section>
  );
}
