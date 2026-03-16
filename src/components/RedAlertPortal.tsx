import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

export default function RedAlertPortal() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="rap-section">
      <div className={`rap-grid${visible ? ' rap-visible' : ''}`}>
        <div className="rap-branding">
          <div className="rap-line-accent" />
          <span className="access-label access-label--dark">AHEAD_OF_MARKET // MOBILE</span>
          <h2 className="rap-title-red">
            <span className="rap-bell-icon">
              <Bell size={40} strokeWidth={2.2} />
              <span className="rap-bell-badge tcc-notif-pulse">3</span>
            </span>
            RED ALERT
          </h2>
          <h3 className="rap-title-white">DOWNLOAD OUR APP</h3>
        </div>

        <div className="rap-visual">
          <div className="rap-glow" />
          <img
            src="/images/Animated_Mockup.gif"
            alt="Red Alert App"
            className="rap-phone"
            loading="lazy"
          />
        </div>

        <div className="rap-intel">
          <span className="rap-intel-label">STAY AHEAD 24/7</span>
          <p className="rap-intel-desc">
            The <strong>Red Post Realty</strong> mobile app provides the
            Seacoast's most thorough home search functionality and latest
            inventory directly from the MLS. Get real-time updates on off-market
            assets and upcoming open houses.
          </p>
          <div className="rap-badges">
            <a
              href="https://apps.apple.com/us/app/red-post-realty/id6479816941?l=es-MX"
              target="_blank"
              rel="noopener noreferrer"
              className="rap-badge-link"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.ruuster.android.redpostrealty.app&hl=en_US"
              target="_blank"
              rel="noopener noreferrer"
              className="rap-badge-link"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
