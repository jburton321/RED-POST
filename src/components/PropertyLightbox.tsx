import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { X, ChevronLeft, ChevronRight, Bed, Bath, LandPlot, Maximize, MapPin } from 'lucide-react';
import type { ListingRecord } from '../lib/listings';
import { formatLotParcelAcresDisplay, formatPrice, listingIsVacantLandParcel } from '../lib/listings';
import { handleImgError } from '../lib/imageFallback';
import CommandButton from './CommandButton';
import { LeadFormModalContext } from '../context/LeadFormModalContext';

interface PropertyLightboxProps {
  listing: ListingRecord | null;
  onClose: () => void;
}

export default function PropertyLightbox({ listing, onClose }: PropertyLightboxProps) {
  const leadFormModal = useContext(LeadFormModalContext);
  const [activeImg, setActiveImg] = useState(0);
  const [closing, setClosing] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const images = listing?.media ?? [];

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    if (!listing) return;
    setActiveImg(0);
    setClosing(false);
    setImgLoaded(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') setActiveImg((p) => Math.min(p + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setActiveImg((p) => Math.max(p - 1, 0));
    };

    document.body.style.overflow = 'hidden';
    const nav = document.querySelector('.site-nav') as HTMLElement;
    if (nav) nav.style.display = 'none';

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      if (nav) nav.style.display = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [listing, handleClose, images.length]);

  useEffect(() => {
    setImgLoaded(false);
  }, [activeImg]);

  if (!listing) return null;

  const prevImg = () => setActiveImg((p) => Math.max(p - 1, 0));
  const nextImg = () => setActiveImg((p) => Math.min(p + 1, images.length - 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) nextImg();
    else if (diff < -threshold) prevImg();
  };

  const onThumbMouseDown = (e: React.MouseEvent) => {
    const el = thumbsRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.pageX - el.offsetLeft;
    dragScrollLeft.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };

  const onThumbMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = thumbsRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    if (Math.abs(walk) > 4) hasDragged.current = true;
    el.scrollLeft = dragScrollLeft.current - walk;
  };

  const onThumbMouseUp = () => {
    isDragging.current = false;
    const el = thumbsRef.current;
    if (el) {
      el.style.cursor = '';
      el.style.userSelect = '';
    }
  };

  const onThumbClick = (i: number) => {
    if (!hasDragged.current) setActiveImg(i);
  };

  return (
    <div className={`lb-overlay ${closing ? 'lb-overlay--closing' : ''}`} onClick={handleClose}>
      <div className="lb-container" onClick={(e) => e.stopPropagation()}>
        <button className="lb-close" onClick={handleClose} aria-label="Close">
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="lb-gallery">
          <div
            className="lb-main-img-wrap"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {!imgLoaded && <div className="lb-img-skeleton" />}
            <img
              src={images[activeImg]}
              alt={listing.firstAddress}
              className={`lb-main-img ${imgLoaded ? 'lb-main-img--loaded' : ''}`}
              onLoad={() => setImgLoaded(true)}
              onError={handleImgError}
              draggable={false}
            />
            <div className="lb-badge-wrap">
              <span className={`lb-badge ${listing.status === 'ComingSoon' ? 'lb-badge--soon' : ''}`}>
                {listing.label}
              </span>
            </div>

            {images.length > 1 && (
              <>
                <button
                  className="lb-arrow lb-arrow--left"
                  onClick={prevImg}
                  disabled={activeImg === 0}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} strokeWidth={2.5} />
                </button>
                <button
                  className="lb-arrow lb-arrow--right"
                  onClick={nextImg}
                  disabled={activeImg === images.length - 1}
                  aria-label="Next image"
                >
                  <ChevronRight size={22} strokeWidth={2.5} />
                </button>
                <div className="lb-counter">
                  {activeImg + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div
              className="lb-thumbs"
              ref={thumbsRef}
              onMouseDown={onThumbMouseDown}
              onMouseMove={onThumbMouseMove}
              onMouseUp={onThumbMouseUp}
              onMouseLeave={onThumbMouseUp}
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`lb-thumb ${i === activeImg ? 'lb-thumb--active' : ''}`}
                  onClick={() => onThumbClick(i)}
                >
                  <img src={src} alt={`${listing.firstAddress} ${i + 1}`} onError={handleImgError} draggable={false} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lb-details">
          <div className="lb-attribution">
            <span className="lb-attribution-text">Listed by: Red Post Realty</span>
            <span className="lb-attribution-sep">|</span>
            <span className="lb-attribution-mls">via <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" className="lb-link">PrimeMLS</a></span>
          </div>

          <div className="lb-price">{formatPrice(listing.price)}</div>

          <div className="lb-address-group">
            <MapPin size={14} strokeWidth={2} className="lb-pin-icon" />
            <div>
              <div className="lb-address">{listing.firstAddress}</div>
              <div className="lb-city">{listing.secondAddress}</div>
            </div>
          </div>

          <div className="lb-divider" />

          <div className="lb-specs">
            {listingIsVacantLandParcel(listing) ? (
              <div className="lb-spec lb-spec--parcel">
                <LandPlot size={18} strokeWidth={2} />
                <div className="lb-spec-val">{formatLotParcelAcresDisplay(listing.lotSizeAcres!)}</div>
                <div className="lb-spec-label">Acre parcel</div>
              </div>
            ) : (
              <>
                <div className="lb-spec">
                  <Bed size={18} strokeWidth={2} />
                  <div className="lb-spec-val">{listing.bedrooms}</div>
                  <div className="lb-spec-label">Bedrooms</div>
                </div>
                <div className="lb-spec">
                  <Bath size={18} strokeWidth={2} />
                  <div className="lb-spec-val">{listing.bathrooms}</div>
                  <div className="lb-spec-label">Bathrooms</div>
                </div>
                <div className="lb-spec">
                  <Maximize size={18} strokeWidth={2} />
                  <div className="lb-spec-val">{listing.square.toLocaleString()}</div>
                  <div className="lb-spec-label">Sq Ft</div>
                </div>
              </>
            )}
          </div>

          <div className="lb-cta-wrap">
            <CommandButton
              onClick={() => {
                if (leadFormModal) {
                  leadFormModal.openLeadForm({ source: 'listing-lightbox' });
                  handleClose();
                  return;
                }
                handleClose();
                setTimeout(() => {
                  const el = document.getElementById('hero-form');
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              GET_STARTED
            </CommandButton>
          </div>

          <div className="lb-compliance-footer">
            <div className="lb-compliance-logo">
              <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer">
                <img src="/images/prime.png" alt="PrimeMLS" className="lb-prime-logo" />
              </a>
            </div>
            <p className="lb-disclaimer">
              Information deemed reliable but not guaranteed. Data provided by
              <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" className="lb-link"> PrimeMLS</a>. For personal, non-commercial use only. Copyright
              {' '}{new Date().getFullYear()} <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" className="lb-link">PrimeMLS, Inc.</a> All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
