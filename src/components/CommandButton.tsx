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
  const telHref = `tel:${PHONE_TEL.replace(/^tel:/i, '')}`;

  return (
    <div className="command-btn-wrapper">
      <button
        type="button"
        onClick={onClick ?? scrollToForm}
        className={`command-btn ${className}`}
      >
        {children}
      </button>
      {showPhone && (
        <a
          href={telHref}
          className="command-btn-phone"
          aria-label={`Call ${PHONE_DISPLAY}`}
        >
          <span className="command-btn-phone__text">
            Want answers now? Call us directly. {PHONE_DISPLAY}
          </span>
          <Phone size={16} strokeWidth={2} className="command-btn-phone__icon" />
        </a>
      )}
    </div>
  );
}
