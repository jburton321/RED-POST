import { useContext } from 'react';
import { Phone } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/api';
import { LeadFormModalContext } from '../context/LeadFormModalContext';

interface CommandButtonProps {
  onClick?: () => void;
  /** Runs immediately before opening the lead form modal (e.g. close mobile nav). */
  beforeLeadForm?: () => void;
  /** Lead `source` field when opening the modal (default: site-cta). */
  leadSource?: string;
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
  beforeLeadForm,
  leadSource = 'site-cta',
  children = 'GET_STARTED',
  className = '',
  showPhone = true,
}: CommandButtonProps) {
  const leadFormModal = useContext(LeadFormModalContext);
  const telHref = `tel:${PHONE_TEL.replace(/^tel:/i, '')}`;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    beforeLeadForm?.();
    if (leadFormModal) {
      leadFormModal.openLeadForm({ source: leadSource });
      return;
    }
    scrollToForm();
  };

  return (
    <div className="command-btn-wrapper">
      <button type="button" onClick={handleClick} className={`command-btn ${className}`}>
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
