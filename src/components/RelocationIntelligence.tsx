import { useState } from 'react';
import CommandButton from './CommandButton';

const PANELS = [
  {
    title: 'Moving from MA',
    desc: 'Real tax savings and commute trade-offs.',
    bg: '/images/MA.png',
  },
  {
    title: 'Seacoast Second Homes',
    desc: 'STR-friendly zones and investment spots.',
    bg: '/images/Seacoast.png',
  },
  {
    title: 'California to NH',
    desc: 'Navigating the culture shift and tax benefits.',
    bg: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=2070',
  },
  {
    title: 'Texas to NH',
    desc: 'Comparing two no-income-tax lifestyles.',
    bg: '/images/texas.png',
  },
];

export default function RelocationIntelligence() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="relocation" className="ri-section">
      <div className="ri-container">
        <div className="section-header-row">
          <div className="ri-header">
            <span className="ri-label">RELOCATION_INTEL // 2026 GUIDES</span>
            <h2 className="ri-headline">
              Relocation <span className="ri-red">Guides</span>
            </h2>
            <div className="ri-h-line" />
          </div>
          <CommandButton />
        </div>

      </div>

      <div className="relocation-slider">
        {PANELS.map((panel, i) => (
          <div
            key={panel.title}
            className={`rs-panel${activeIndex === i ? ' rs-active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.88)), url('${panel.bg}')`,
            }}
            onMouseEnter={() => setActiveIndex(i)}
            onTouchStart={() => setActiveIndex(i)}
          >
            <div className="rs-panel-inner">
              <div className="rs-vertical-label">{panel.title}</div>
              <div className="rs-content">
                <h3 className="rs-content-title">{panel.title}</h3>
                <p className="rs-content-desc">{panel.desc}</p>
                <CommandButton className="rs-command-btn">
                  GET STARTED
                </CommandButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
