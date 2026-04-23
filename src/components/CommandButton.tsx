import { Phone } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/api';

interface CommandButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  showPhone?: boolean;
}

function scrollToForm() {
  const el = document.getElementById('hero-form');
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

export default function CommandButton({
  onClick,
  children = 'GET_STARTED',
  className = '',
  showPhone = true,
}: CommandButtonProps) {
  return (
    <div className="command-btn-wrapper">
      <button
        type="button"
        onClick={onClick ?? scrollToForm}
        className={`command-btn ${className}`}
      >
        {children}
      </button>
      {showPhone && PHONE_TEL && (
        <a
          href={`tel:${PHONE_TEL}`}
          className="command-btn-phone"
          aria-label={PHONE_DISPLAY ? `Call ${PHONE_DISPLAY}` : 'Call Red Post Realty'}
        >
          <span className="command-btn-phone__text">Want answers now? Call us directly.</span>
          <Phone size={16} strokeWidth={2} className="command-btn-phone__icon" />
        </a>
      )}
    </div>
  );
}
