import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, effectiveDate, children }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-page-inner">
        <Link to="/" className="legal-back-link">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="legal-header">
          <img src="/images/Logo-Dark-8.png" alt="Red Post Realty" className="legal-logo" />
          <h1 className="legal-title">{title}</h1>
          <p className="legal-date">Effective Date: {effectiveDate}</p>
        </div>

        <div className="legal-body">
          {children}
        </div>

        <div className="legal-footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span className="legal-sep">|</span>
          <Link to="/terms-of-service">Terms of Service</Link>
          <span className="legal-sep">|</span>
          <Link to="/dmca-notice">DMCA Notice</Link>
          <span className="legal-sep">|</span>
          <Link to="/">Home</Link>
        </div>
      </div>
    </div>
  );
}
