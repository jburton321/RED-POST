import { Bed, Bath, Maximize } from 'lucide-react';
import type { ListingRecord } from '../lib/listings';
import { formatPrice, formatUpdatedAt } from '../lib/listings';
import { handleImgError } from '../lib/imageFallback';

interface PropertyListItemProps {
  listing: ListingRecord;
  onClick?: () => void;
}

export default function PropertyListItem({ listing, onClick }: PropertyListItemProps) {
  const updatedLabel = formatUpdatedAt(listing.labelUpdatedAt);

  return (
    <div className="inv-list-item" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}>
      <div className="inv-list-img-wrap">
        <img src={listing.media[0]} alt={listing.firstAddress} loading="lazy" onError={handleImgError} />
        <div className="inv-list-blur" />
        <div className="inv-list-scanline" />
        <div className={`inv-list-badge ${listing.status === 'ComingSoon' ? 'inv-card-badge--soon' : ''}`}>
          {listing.label}
        </div>
        {updatedLabel && (
          <div className="inv-list-updated">{updatedLabel}</div>
        )}
      </div>

      <div className="inv-list-body">
        <div className="inv-list-top">
          <div className="inv-list-price">{formatPrice(listing.price)}</div>
          <div className="inv-list-address">{listing.firstAddress}</div>
          <div className="inv-list-city">{listing.secondAddress}</div>
        </div>

        <div className="inv-list-meta">
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
        </div>
      </div>
    </div>
  );
}
