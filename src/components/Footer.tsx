import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { records, initialLoading } = useListings();

  const syncDate = useMemo(() => {
    if (initialLoading && records.length === 0) return 'Loading…';
    if (records.length === 0) return '—';
    return new Date(records[0].labelUpdatedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [records, initialLoading]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const setSpacing = () => {
      const cta = document.querySelector('.final-monolith') as HTMLElement;
      if (cta) {
        cta.style.marginBottom = `${footer.offsetHeight}px`;
      }
    };

    setSpacing();
    window.addEventListener('resize', setSpacing);
    return () => window.removeEventListener('resize', setSpacing);
  }, []);

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="footer-inner">
        <div className="footer-center">
          <img
            src="/images/Logo-stack.png"
            alt="Logo"
            className="footer-logo"
          />
          <p className="footer-tagline">
            Intelligence-driven real estate across<br />
            New Hampshire, Maine & Massachusetts.
          </p>
        </div>

        <div className="footer-divider" />

        <div className="footer-glass-section">
          <div className="footer-glass-inner">
            <div className="footer-disclaimer-content">
              <p className="footer-disclaimer-text">
                Red Post Realty is an authorized participant in the <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" className="footer-link">PrimeMLS (NEREN)</a> Internet Data Exchange (IDX) program. We are licensed to provide this property intelligence exclusively for your personal, non-commercial use to identify prospective properties for purchase. This data stream, containing listings from various participating brokerages, was last synchronized with the PrimeMLS server on <strong>{syncDate}</strong>.
              </p>
            </div>

            <div className="footer-glass-divider" />

            <p className="footer-compliance-copy">
              All information is deemed reliable but is not guaranteed. Data is provided "as is" and should be independently verified. All properties are subject to prior sale, change, or withdrawal.
            </p>

            <div className="footer-compliance-logos">
              <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer">
                <img src="/images/prime.png" alt="PrimeMLS" className="footer-compliance-logo" />
              </a>
              <img src="/images/compliance.png" alt="Equal Housing Opportunity and REALTOR" className="footer-compliance-logo" />
            </div>

            <div className="footer-glass-divider" />

            <div className="footer-data-row">
              <span>Real-time market data provided by <a href="https://primemls.com/" target="_blank" rel="noopener noreferrer" className="footer-link">PrimeMLS (NEREN)</a>. Last synced: {syncDate}.</span>
            </div>

            <div className="footer-identity-row">
              <span>&copy; {new Date().getFullYear()} Red Post Realty</span>
              <span className="footer-row-sep">|</span>
              <span>1 Wall St, Portsmouth, NH 03801</span>
              <span className="footer-row-sep">|</span>
              <span>(603) 605-0181</span>
            </div>

            <div className="footer-legal-row">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <span className="footer-row-sep">|</span>
              <Link to="/terms-of-service">Terms of Service</Link>
              <span className="footer-row-sep">|</span>
              <Link to="/dmca-notice">DMCA Notice</Link>
              <span className="footer-row-sep">|</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
