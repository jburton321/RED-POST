import { useEffect } from 'react';
import { X } from 'lucide-react';
import HeroLeadForm from './HeroLeadForm';
import type { ListingRecord } from '../lib/listings';

interface LeadFormModalProps {
  open: boolean;
  leadSource: string;
  contextListing: ListingRecord | null;
  onClose: () => void;
}

export default function LeadFormModal({
  open,
  leadSource,
  contextListing,
  onClose,
}: LeadFormModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lead-form-modal-overlay" onClick={onClose}>
      <div
        className="lead-form-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Request Seacoast listing updates"
      >
        <button type="button" className="lead-form-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} strokeWidth={2.5} />
        </button>
        <div className="lead-form-modal-inner glow-card glow-card--hero-form">
          <HeroLeadForm leadSource={leadSource} contextListing={contextListing} />
        </div>
      </div>
    </div>
  );
}
