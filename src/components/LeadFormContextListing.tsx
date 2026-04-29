import { Bath, Bed, LandPlot, Maximize } from 'lucide-react';
import type { ListingRecord } from '../lib/listings';
import {
  formatLotParcelPhrase,
  formatPrice,
  listingIsSold,
  listingIsVacantLandParcel,
} from '../lib/listings';
import { handleImgError } from '../lib/imageFallback';

interface LeadFormContextListingProps {
  listing: ListingRecord;
}

export default function LeadFormContextListing({ listing }: LeadFormContextListingProps) {
  const img = listing.media[0];
  const land = listingIsVacantLandParcel(listing);
  const sold = listingIsSold(listing);

  return (
    <div className={`lead-form-context-listing${sold ? ' lead-form-context-listing--sold' : ''}`}>
      <p className="lead-form-context-listing__eyebrow">
        {sold ? "I'm interested in similar homes" : "I'm interested in this home"}
      </p>
      <div className="lead-form-context-listing__row">
        <div className="lead-form-context-listing__img-wrap">
          <img
            src={img}
            alt={listing.firstAddress}
            className="lead-form-context-listing__img"
            loading="lazy"
            onError={handleImgError}
          />
          {sold ? (
            <div className="inv-list-sold-ribbon-graphic" aria-hidden>
              <span className="inv-list-sold-ribbon-graphic__band">
                <span className="inv-list-sold-ribbon-graphic__text">SOLD</span>
              </span>
            </div>
          ) : null}
        </div>
        <div className="lead-form-context-listing__body">
          <div className="lead-form-context-listing__price">{formatPrice(listing.price)}</div>
          <div className="lead-form-context-listing__addr">{listing.firstAddress}</div>
          <div className="lead-form-context-listing__city">{listing.secondAddress}</div>
          <div className="lead-form-context-listing__meta">
            {land ? (
              <span className="lead-form-context-listing__meta-item">
                <LandPlot size={12} strokeWidth={2} aria-hidden />
                {formatLotParcelPhrase(listing.lotSizeAcres!)}
              </span>
            ) : (
              <>
                <span className="lead-form-context-listing__meta-item">
                  <Bed size={12} strokeWidth={2} aria-hidden />
                  {listing.bedrooms} BD
                </span>
                <span className="lead-form-context-listing__meta-sep" aria-hidden>
                  |
                </span>
                <span className="lead-form-context-listing__meta-item">
                  <Bath size={12} strokeWidth={2} aria-hidden />
                  {listing.bathrooms} BA
                </span>
                <span className="lead-form-context-listing__meta-sep" aria-hidden>
                  |
                </span>
                <span className="lead-form-context-listing__meta-item">
                  <Maximize size={12} strokeWidth={2} aria-hidden />
                  {listing.square.toLocaleString()} SF
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
