import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bell } from 'lucide-react';
import CommandButton from './CommandButton';
import PropertyLightbox from './PropertyLightbox';
import { useListings } from '../context/ListingsContext';
import { formatPrice, formatUpdatedAt } from '../lib/listings';
import type { ListingRecord } from '../lib/listings';
import { geocodeLocal } from '../lib/geocode';

interface SignalListing extends ListingRecord {
  coords: [number, number];
  signalType: string;
}

const SIGNAL_LIMIT = 3;

function resolveSignalType(label: string): string {
  const l = (label || '').toLowerCase();
  if (l.includes('new')) return 'NEW LISTING';
  if (l.includes('price')) return 'PRICE CHANGE';
  if (l.includes('back')) return 'BACK ON MARKET';
  if (l.includes('pending')) return 'PENDING';
  if (l.includes('sold')) return 'SOLD';
  if (l.includes('coming')) return 'COMING SOON';
  return 'NEW LISTING';
}

function createSignalIcon() {
  return L.divIcon({
    html: `<div class="tcc-signal-dot">
      <div class="tcc-signal-ring"></div>
      <div class="tcc-signal-ring tcc-signal-ring--delayed"></div>
    </div>`,
    className: 'tcc-marker-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function SignalMapFitter({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length === 0) return;
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: L.point(60, 60), animate: false });
    map.invalidateSize();
  }, [map, coords]);
  return null;
}

export default function TrustCommandCenter() {
  const { records, initialLoading } = useListings();
  const signals = useMemo(() => {
    const geocoded: SignalListing[] = [];
    for (const r of records) {
      if (geocoded.length >= SIGNAL_LIMIT) break;
      const coords = geocodeLocal(r.firstAddress, r.secondAddress);
      if (coords) {
        geocoded.push({ ...r, coords, signalType: resolveSignalType(r.label) });
      }
    }
    return geocoded;
  }, [records]);
  const [selectedListing, setSelectedListing] = useState<ListingRecord | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="trust-command-center">
      <div className="tcc-inner">
        <div className="section-header-row">
          <div className="tcc-header">
            <span className="tcc-badge">SYSTEM_STATUS // NETWORK_STRENGTH</span>
            <h2 className="tcc-title">
              Trusted by <span className="tcc-red-weight">Thousands</span> Across NH, ME & MA
            </h2>
            <p className="tcc-stats">2,500+ SUCCESSFUL TRANSACTIONS // $780M CLOSED VOLUME</p>
          </div>
          <CommandButton leadSource="trust-command-center" />
        </div>
      </div>

      <div className="tcc-split">
        <div className="tcc-split-map">
          <MapContainer
            center={[43.10, -70.80]}
            zoom={11}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            touchZoom={false}
            tap={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            {signals.length > 0 && (
              <SignalMapFitter coords={signals.map((s) => s.coords)} />
            )}
            {signals.map((signal, idx) => (
              <Marker
                key={`${signal.firstAddress}-${idx}`}
                position={signal.coords}
                icon={createSignalIcon()}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    setSelectedListing(signal);
                  },
                  mouseover: () => {
                    setHoveredIdx(idx);
                    if (cardRefs.current[idx]) {
                      cardRefs.current[idx]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                      });
                    }
                  },
                  mouseout: () => setHoveredIdx(null),
                }}
              />
            ))}
          </MapContainer>

          <div className="tcc-signal-legend">
            <span className="tcc-signal-legend-dot" />
            <span>LIVE SIGNAL</span>
          </div>
        </div>

        <div className="tcc-split-detail">
          <div className="tcc-detail-header">
            <div className="tcc-detail-title-row">
              <div className="tcc-notif-icon">
                <Bell size={24} />
                <span className="tcc-notif-badge tcc-notif-pulse">{signals.length}</span>
              </div>
              <div className="tcc-detail-titles">
                <span className="tcc-detail-alert">RED ALERT</span>
                <span className="tcc-detail-subtitle">INCOMING SIGNALS</span>
              </div>
            </div>
          </div>

          <div className="tcc-feed-scroll" ref={feedRef}>
            {initialLoading && signals.length === 0 && (
              <p className="tcc-feed-empty">Loading signals…</p>
            )}
            {!initialLoading && signals.length === 0 && (
              <p className="tcc-feed-empty">No live signals (listings unavailable or not geocoded).</p>
            )}
            {signals.map((signal, idx) => (
              <div
                key={`${signal.firstAddress}-${idx}`}
                ref={(el) => (cardRefs.current[idx] = el)}
                data-idx={idx}
                className={`tcc-alert-card ${hoveredIdx === idx ? 'tcc-alert-card--hovered' : ''}`}
                onClick={() => setSelectedListing(signal)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="tcc-alert-top">
                  <span className="tcc-alert-signal">{signal.signalType}</span>
                  <span className="tcc-alert-time">
                    {formatUpdatedAt(signal.labelUpdatedAt)}
                  </span>
                </div>

                <div className="tcc-alert-body">
                  {signal.media?.[0] && (
                    <div
                      className="tcc-alert-thumb"
                      style={{ backgroundImage: `url(${signal.media[0]})` }}
                    />
                  )}
                  <div className="tcc-alert-details">
                    <span className="tcc-alert-address">{signal.firstAddress}</span>
                    <span className="tcc-alert-city">{signal.secondAddress}</span>
                    <span className="tcc-alert-price">{formatPrice(signal.price)}</span>
                    <span className="tcc-alert-specs">
                      {signal.bedrooms} BD / {signal.bathrooms} BA / {signal.square.toLocaleString()} SF
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .tcc-split-map .leaflet-container { background: #000 !important; }
        .tcc-marker-icon { background: transparent !important; border: none !important; }
        .tcc-split-map .leaflet-popup-pane { display: none !important; }
        .tcc-split-map .leaflet-marker-icon { pointer-events: all !important; }
      `}</style>

      <PropertyLightbox listing={selectedListing} onClose={() => setSelectedListing(null)} />
    </section>
  );
}
