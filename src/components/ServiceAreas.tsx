import { useState } from 'react';
import CommandButton from './CommandButton';

const AREAS = [
  {
    stateCode: 'NH',
    name: 'New Hampshire Seacoast',
    counties: 'Rockingham & Strafford Counties',
    cities: 'Portsmouth, Rye, New Castle, Dover, Durham, Exeter, Newington, Hampton.',
    insightLabel: 'THE NH ADVANTAGE',
    insight: 'No income tax. Top schools. Ocean access. The primary choice for high-net-worth relocation.',
    mapImage: '/images/Portsmouth.png',
  },
  {
    stateCode: 'ME',
    name: 'Southern Maine',
    counties: 'York County',
    cities: 'Kittery, York, Eliot, South Berwick, Ogunquit, Wells, Kennebunk.',
    insightLabel: 'LIFESTYLE FRONTIER',
    insight: 'The ultimate blend of ocean living and small-town charm. Deep-water access and coastal prestige.',
    mapImage: '/images/York.png',
  },
  {
    stateCode: 'MA',
    name: 'North Shore Mass',
    counties: 'Essex County',
    cities: 'Newburyport, Amesbury, Salisbury, Merrimac, West Newbury, Newbury.',
    insightLabel: 'COMMUTER PRESTIGE',
    insight: 'Commuter-friendly. Direct Boston access. Historic North Shore architecture and urban sophistication.',
    mapImage: '/images/Newburyport.png',
  },
];

export default function ServiceAreas() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="service-areas" className="service-areas">
      <div className="sa-container">
        <div className="section-header-row">
          <div className="sa-header-center">
            <span className="access-label access-label--dark">MARKET_COVERAGE // TRI-STATE</span>
            <h2 className="sa-headline">
              Service <span className="sa-red-text">Areas</span>
            </h2>
          </div>
          <CommandButton />
        </div>

        <div className="sa-advantage-grid">
          {AREAS.map((area, i) => (
            <div
              key={area.stateCode}
              className="sa-area-card"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={area.mapImage}
                alt={`${area.name} map`}
                className="sa-map-hover"
                style={{
                  opacity: hoveredIndex === i ? 1 : 0,
                  transform: hoveredIndex === i ? 'scale(1)' : 'scale(0.95)',
                }}
              />
              <div
                className="sa-map-overlay"
                style={{
                  opacity: hoveredIndex === i ? 1 : 0,
                }}
              />
              <div className="sa-card-top">
                <span
                  className="sa-state-code"
                  style={{
                    color: hoveredIndex === i ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                    transition: 'color 0.3s',
                  }}
                >
                  {area.stateCode}
                </span>
                <h3>{area.name}</h3>
                <p className="sa-counties">{area.counties}</p>
              </div>
              <div className="sa-city-list">{area.cities}</div>
              <div className="sa-insight-box">
                <span className="sa-insight-label">{area.insightLabel}</span>
                <p>{area.insight}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
