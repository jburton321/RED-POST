import { Bed, Bath, LandPlot, Maximize } from 'lucide-react';
import type { ListingRecord } from '../lib/listings';
import {
  formatLotParcelPhrase,
  formatPrice,
  formatUpdatedAt,
  listingIsSold,
  listingIsVacantLandParcel,
} from '../lib/listings';
import { handleImgError } from '../lib/imageFallback';

interface PropertyListItemProps {
  listing: ListingRecord;
  onClick?: () => void;
  /** Hero strip: CSS corner ribbon, no Active/New badge or “Updated” pill */
  presentation?: 'default' | 'heroSold';
}

export default function PropertyListItem({
  listing,
  onClick,
  presentation = 'default',
}: PropertyListItemProps) {
  const updatedLabel = formatUpdatedAt(listing.labelUpdatedAt);
  const sold = listingIsSold(listing);
  const heroSold = presentation === 'heroSold';
  const heroSoldLandParcel = heroSold && listingIsVacantLandParcel(listing);

  return (
    <div
      className="inv-list-item"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.();
      }}
    >
      <div className="inv-list-img-wrap">
        <img
          src={listing.media[0]}
          alt={listing.firstAddress}
          loading={heroSold ? 'eager' : 'lazy'}
          onError={handleImgError}
        />
        <div className="inv-list-blur" />
        <div className="inv-list-scanline" />
        {heroSold ? (
          <div className="inv-list-sold-ribbon-graphic" aria-hidden>
            <span className="inv-list-sold-ribbon-graphic__band">
              <span className="inv-list-sold-ribbon-graphic__text">SOLD</span>
            </span>
          </div>
        ) : (
          <>
            {sold && <div className="inv-card-sold-ribbon inv-card-sold-ribbon--list" aria-hidden>SOLD</div>}
            <div
              className={`inv-list-badge ${listing.status === 'ComingSoon' ? 'inv-card-badge--soon' : ''} ${sold ? 'inv-card-badge--sold' : ''}`}
            >
              {sold ? 'SOLD' : listing.label}
            </div>
            {updatedLabel && <div className="inv-list-updated">{updatedLabel}</div>}
          </>
        )}
      </div>

      <div className="inv-list-body">
        <div className="inv-list-top">
          <div className="inv-list-price">{formatPrice(listing.price)}</div>
          <div className="inv-list-address">{listing.firstAddress}</div>
          <div className="inv-list-city">{listing.secondAddress}</div>
        </div>

        <div className="inv-list-meta">
          {heroSoldLandParcel ? (
            <span className="inv-list-meta-item">
              <LandPlot size={14} strokeWidth={2} />
              {formatLotParcelPhrase(listing.lotSizeAcres!)}
            </span>
          ) : (
            <>
              <span className="inv-list-meta-item">
                <Bed size={14} strokeWidth={2} />
                {listing.bedrooms} BD
              </span>
              <span className="inv-list-meta-sep" />
              <span className="inv-list-meta-item">
                <Bath size={14} strokeWidth={2} />
                {listing.bathrooms} BA
              </span>
              <span className="inv-list-meta-sep" />
              <span className="inv-list-meta-item">
                <Maximize size={14} strokeWidth={2} />
                {listing.square.toLocaleString()} SQFT
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
