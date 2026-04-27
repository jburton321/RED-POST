import { useState, useRef, useEffect, useMemo } from 'react';
import PropertyListItem from './PropertyListItem';
import PropertyLightbox from './PropertyLightbox';
import { fetchHeroStripListings } from '../lib/heroStripListings';
import type { ListingRecord } from '../lib/listings';

const STRIP_MAX = 28;
/** Target speed in px/s; converted using frame delta so motion is visible even with integer scrollLeft */
const SCROLL_SPEED_PX_PER_SEC = 42;

export default function HeroListingStrip() {
  const [heroSold, setHeroSold] = useState<ListingRecord[] | undefined>(undefined);
  const [selectedListing, setSelectedListing] = useState<ListingRecord | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef(0);
  const carryRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchHeroStripListings().then((rows) => {
      if (cancelled) return;
      setHeroSold(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => (heroSold ? heroSold.slice(0, STRIP_MAX) : []), [heroSold]);

  const loopItems = items.length > 0 ? [...items, ...items] : [];

  useEffect(() => {
    if (items.length === 0) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let cancelled = false;

    const step = (ts: number) => {
      if (cancelled) return;

      const el = scrollerRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const last = lastTsRef.current;
      lastTsRef.current = ts;
      const dt = last == null ? 16 : Math.min(64, ts - last);

      if (!pausedRef.current) {
        const half = el.scrollWidth / 2;
        const canScroll = half > el.clientWidth + 1;

        if (canScroll) {
          carryRef.current += (SCROLL_SPEED_PX_PER_SEC * dt) / 1000;
          const delta = Math.floor(carryRef.current);
          if (delta >= 1) {
            el.scrollLeft += delta;
            carryRef.current -= delta;
          }
          if (el.scrollLeft >= half) {
            el.scrollLeft -= half;
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    carryRef.current = 0;
    lastTsRef.current = null;
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [items.length]);

  if (heroSold === undefined) return null;
  if (items.length === 0) return null;

  return (
    <>
      <div className="hero-strip" aria-label="Recently sold homes">
        <div className="hero-strip-accent-row" aria-hidden>
          <img
            src="/images/hero-strip-accent.png"
            alt=""
            className="hero-strip-accent-row__img"
            loading="lazy"
            draggable={false}
          />
        </div>
        <div
          ref={scrollerRef}
          className="hero-strip-scroll"
          dir="ltr"
          onPointerEnter={() => {
            pausedRef.current = true;
          }}
          onPointerLeave={() => {
            pausedRef.current = false;
          }}
        >
          {loopItems.map((listing, i) => (
            <div key={`${listing.id || 'listing'}-${i}`} className="hero-strip-card-wrap">
              <PropertyListItem
                listing={listing}
                presentation="heroSold"
                onClick={() => setSelectedListing(listing)}
              />
            </div>
          ))}
        </div>
      </div>
      <PropertyLightbox listing={selectedListing} onClose={() => setSelectedListing(null)} />
    </>
  );
}
