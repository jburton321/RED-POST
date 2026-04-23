import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { X } from 'lucide-react';
import CommandButton from './CommandButton';

const locationPinMarker = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" fill="none">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z" fill="#d21920"/>
    <circle cx="16" cy="15" r="7" fill="#fff" opacity="0.9"/>
    <circle cx="16" cy="15" r="3.5" fill="#d21920"/>
  </svg>`,
  className: 'custom-marker-icon',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

const LOCATIONS = [
  {
    name: 'Portsmouth, NH',
    sector: 'SEC_01',
    coords: [43.0718, -70.7626] as [number, number],
    details: 'MARKET STATUS: Median price at $789,000 with a 3.3% yearly increase. Homes average 59 days on market with a 98.4% list-to-sale ratio. A balanced market remains, with the Downtown and West End sectors as primary targets.',
    image: '/images/Portsmouth.png',
  },
  {
    name: 'York, ME',
    sector: 'SEC_02',
    coords: [43.1617, -70.6484] as [number, number],
    details: 'MARKET STATUS: Median price at $875,000 with a 6.5% yearly increase. Inventory is rising as the market enters seasonal normalization. A seller\'s advantage persists for coastal estates and primary residences.',
    image: '/images/York.png',
  },
  {
    name: 'Kittery, ME',
    sector: 'SEC_03',
    coords: [43.0909, -70.7364] as [number, number],
    details: 'MARKET STATUS: Median price at $1.6M driven by high-value waterfront sales. Demand is critical with homes moving in under 20 days. This is currently the highest demand sector with frequent competitive bidding.',
    image: '/images/Kittery.png',
  },
  {
    name: 'Rye, NH',
    sector: 'SEC_04',
    coords: [43.0131, -70.7712] as [number, number],
    details: 'MARKET STATUS: Median price at $1,750,000 representing a 21% yearly increase. Inventory is scant with only 48 active listings. This remains an exclusive coastal enclave with high equity-lock characteristics.',
    image: '/images/Rye.png',
  },
  {
    name: 'Dover, NH',
    sector: 'SEC_05',
    coords: [43.1979, -70.8737] as [number, number],
    details: 'MARKET STATUS: Median price holds steady at $545,000. The market is balanced with a 2.4-month supply and homes going pending within 20\u201352 days. Ideal neutral territory for pragmatic buyers and commuters.',
    image: '/images/Dover.png',
  },
  {
    name: 'Newburyport, MA',
    sector: 'SEC_06',
    coords: [42.8126, -70.8773] as [number, number],
    details: 'MARKET STATUS: Median price at $914,000 with an 8.8% yearly increase. Inventory remains constrained with a rapid 25-day turnover. Approximately 30% of historic North Shore properties continue to sell above list price.',
    image: '/images/Newburyport.png',
  },
];

function MapAutoPositioner({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
    const bounds = L.latLngBounds(LOCATIONS.map(loc => loc.coords));
    const w = window.innerWidth;
    const padLeft = w < 768 ? 30 : w < 1024 ? 350 : 600;
    const padBottom = w < 768 ? 280 : 100;
    map.fitBounds(bounds, {
      paddingTopLeft: L.point(padLeft, w < 768 ? 30 : 100),
      paddingBottomRight: L.point(w < 768 ? 30 : 100, padBottom),
      animate: false,
    });
    map.invalidateSize();
  }, [map, mapRef]);

  return null;
}

function MapClickDismiss({ onDismiss }: { onDismiss: () => void }) {
  useMapEvents({
    click: () => onDismiss(),
  });
  return null;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

export default function MapDossier() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, lat: 43.07, lng: -70.76 });
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    const lat = 43.0718 + Math.random() * 0.001;
    const lng = -70.7626 + Math.random() * 0.001;
    setMousePos({ x, y, lat, lng });
  };

  const dismiss = useCallback(() => setSelectedIdx(null), []);

  useEffect(() => {
    if (!isMobile || selectedIdx === null || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setSelectedIdx(null); },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile, selectedIdx]);

  const selected = selectedIdx !== null ? LOCATIONS[selectedIdx] : null;
  const hovered = hoveredIdx !== null ? LOCATIONS[hoveredIdx] : null;

  const TOOLTIP_W = 320;
  const TOOLTIP_H = 280;
  const TOOLTIP_GAP = 12;

  let tooltipStyle: React.CSSProperties | null = null;
  if (hovered && mapRef.current && containerRef.current) {
    const point = mapRef.current.latLngToContainerPoint(hovered.coords);
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = rect.left + point.x;
    const rawY = rect.top + point.y;

    const fitsAbove = rawY - TOOLTIP_GAP - TOOLTIP_H > 0;
    const top = fitsAbove
      ? rawY - TOOLTIP_GAP
      : rawY + 42 + TOOLTIP_GAP;
    const transformY = fitsAbove ? '-100%' : '0%';

    const halfW = TOOLTIP_W / 2;
    const clampedX = Math.max(halfW + 8, Math.min(rawX, window.innerWidth - halfW - 8));

    tooltipStyle = {
      position: 'fixed',
      left: clampedX,
      top,
      transform: `translate(-50%, ${transformY})`,
      zIndex: 99999,
      pointerEvents: 'none' as const,
    };
  }

  return (
    <div
      ref={containerRef}
      className="dossier-map-container"
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#000', overflow: 'hidden', zIndex: 2, marginTop: '-100vh' }}
    >
      <div className="dossier-map-overlay">
        <div className="dossier-glass-panel">
          <div className="dossier-sat-tag">
            SATELLITE_FEED // {mousePos.lat.toFixed(4)}N {mousePos.lng.toFixed(4)}W
          </div>
          <h2 className="dossier-map-title">
            REGIONAL <span className="text-red">INTELLIGENCE</span>
          </h2>
          <p className="dossier-map-tagline">
            Target the Seacoast's Most exclusive properties before they hit the open market.
          </p>
          <p className="dossier-map-subtitle">
            Advanced spatial analysis of the Seacoast's most sought-after markets. Leveraging real-time property data and local development insights to provide our clients with a distinct competitive advantage in the Portsmouth, Kittery, and Newburyport corridors.
          </p>
          <div style={{ marginTop: '24px', pointerEvents: 'auto' as const }}>
            <CommandButton />
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <MapContainer
          center={[42.90, -70.35]}
          zoom={10}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          touchZoom={false}
          tap={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <MapAutoPositioner mapRef={mapRef} />
          {isMobile && <MapClickDismiss onDismiss={dismiss} />}

          {LOCATIONS.map((loc, idx) => (
            <Marker
              key={idx}
              position={loc.coords}
              icon={locationPinMarker}
              eventHandlers={isMobile ? {
                click: () => setSelectedIdx(prev => prev === idx ? null : idx),
              } : {
                mouseover: () => setHoveredIdx(idx),
                mouseout: () => setHoveredIdx(null),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {!isMobile && hovered && tooltipStyle && createPortal(
        <div style={tooltipStyle}>
          <div className="listing-tooltip-inner">
            <div
              className="listing-tooltip-img"
              style={{ backgroundImage: `url(${hovered.image})` }}
            />
            <div className="listing-tooltip-info">
              <span className="listing-tooltip-price">{hovered.name.toUpperCase()}</span>
              <span className="listing-tooltip-specs">{hovered.details}</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {isMobile && selected && createPortal(
        <div className="map-mobile-card">
          <button className="map-mobile-card-close" onClick={dismiss}>
            <X size={18} />
          </button>
          <div
            className="map-mobile-card-img"
            style={{ backgroundImage: `url(${selected.image})` }}
          />
          <div className="map-mobile-card-body">
            <span className="map-mobile-card-name">{selected.name.toUpperCase()}</span>
            <span className="map-mobile-card-details">{selected.details}</span>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .custom-marker-icon { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  );
}
