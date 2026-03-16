import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Images } from 'lucide-react';
import type { ListingRecord } from '../lib/listings';
import { formatPrice } from '../lib/listings';
import { geocodeBatch } from '../lib/geocode';
import { handleImgError } from '../lib/imageFallback';

const DEFAULT_CENTER: [number, number] = [43.0718, -70.7626];

const pinIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 32 42" fill="none">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z" fill="#d21920"/>
    <circle cx="16" cy="15" r="7" fill="#fff" opacity="0.9"/>
    <circle cx="16" cy="15" r="3.5" fill="#d21920"/>
  </svg>`,
  className: 'inv-map-pin',
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -40],
});

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length === 0) return;
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
  }, [map, coords]);
  return null;
}

interface GeoListing {
  listing: ListingRecord;
  coords: [number, number];
}

interface PropertyMapViewProps {
  listings: ListingRecord[];
  onSelectListing?: (listing: ListingRecord) => void;
}

export default function PropertyMapView({ listings, onSelectListing }: PropertyMapViewProps) {
  const [geoListings, setGeoListings] = useState<GeoListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (listings.length === 0) return;

    let cancelled = false;
    setLoading(true);

    geocodeBatch(listings).then((results) => {
      if (cancelled) return;

      const resolved: GeoListing[] = [];
      listings.forEach((listing) => {
        const key = `${listing.firstAddress}, ${listing.secondAddress}`;
        const coords = results.get(key);
        if (coords) {
          resolved.push({ listing, coords });
        }
      });

      setGeoListings(resolved);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [listings]);

  const allCoords = geoListings.map((g) => g.coords);

  return (
    <div className="inv-map-wrap">
      {loading && (
        <div className="inv-map-loading">
          <div className="inv-map-loading-inner">
            <span className="inv-pulse" />
            <span className="inv-map-loading-text">
              LOADING MAP
            </span>
          </div>
        </div>
      )}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={11}
        scrollWheelZoom={true}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        {allCoords.length > 0 && <FitBounds coords={allCoords} />}

        {geoListings.map(({ listing, coords }, idx) => (
          <Marker key={idx} position={coords} icon={pinIcon}>
            <Popup className="inv-map-popup" maxWidth={280} minWidth={240}>
              <div className="inv-map-popup-inner">
                <div className="inv-map-popup-img-wrap">
                  <img src={listing.media[0]} alt={listing.firstAddress} className="inv-map-popup-img" onError={handleImgError} />
                  <div className="inv-map-blur" />
                  <div className="inv-map-scanline" />
                  {onSelectListing && (
                    <button
                      className="inv-map-popup-gallery"
                      onClick={(e) => { e.stopPropagation(); onSelectListing(listing); }}
                      aria-label="View gallery"
                    >
                      <Images size={14} strokeWidth={2.5} />
                      <span>{listing.media.length}</span>
                    </button>
                  )}
                </div>
                <div className="inv-map-popup-body">
                  <div className="inv-map-popup-price">{formatPrice(listing.price)}</div>
                  <div className="inv-map-popup-addr">{listing.firstAddress}</div>
                  <div className="inv-map-popup-city">{listing.secondAddress}</div>
                  <div className="inv-map-popup-specs">
                    {listing.bedrooms} BD &nbsp;|&nbsp; {listing.bathrooms} BA &nbsp;|&nbsp; {listing.square.toLocaleString()} SQFT
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
