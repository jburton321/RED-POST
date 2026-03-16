import type { ListingRecord } from '../lib/listings';
import { formatPrice, formatUpdatedAt } from '../lib/listings';
import { handleImgError } from '../lib/imageFallback';

interface PropertyCardProps {
  listing: ListingRecord;
  onClick?: () => void;
}

export default function PropertyCard({ listing, onClick }: PropertyCardProps) {
  const updatedLabel = formatUpdatedAt(listing.labelUpdatedAt);

  return (
    <div className="inv-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}>
      <img src={listing.media[0]} alt={listing.firstAddress} className="inv-card-bg" loading="lazy" onError={handleImgError} />
      <div className="inv-card-blur" />
      <div className="inv-card-scanline" />
      <div className="inv-card-scrim" />

      <div className={`inv-card-badge ${listing.status === 'ComingSoon' ? 'inv-card-badge--soon' : ''}`}>
        {listing.label}
      </div>

      {updatedLabel && (
        <div className="inv-card-updated">{updatedLabel}</div>
      )}

      <div className="inv-card-overlay">
        <div className="inv-card-price">{formatPrice(listing.price)}</div>
        <div className="inv-card-address">{listing.firstAddress}</div>
        <div className="inv-card-city">{listing.secondAddress}</div>
        <div className="inv-card-specs">
          {listing.bedrooms} BD &nbsp;|&nbsp; {listing.bathrooms} BA &nbsp;|&nbsp; {listing.square.toLocaleString()} SQFT
        </div>
      </div>
    </div>
  );
}
