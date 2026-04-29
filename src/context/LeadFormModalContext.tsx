import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import LeadFormModal from '../components/LeadFormModal';
import type { ListingRecord } from '../lib/listings';

export type OpenLeadFormOptions = { source?: string; listing?: ListingRecord | null };

type LeadFormModalContextValue = {
  openLeadForm: (opts?: OpenLeadFormOptions) => void;
  closeLeadForm: () => void;
};

export const LeadFormModalContext = createContext<LeadFormModalContextValue | null>(null);

export function LeadFormModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [leadSource, setLeadSource] = useState('hero-find-home');
  const [contextListing, setContextListing] = useState<ListingRecord | null>(null);

  const openLeadForm = useCallback((opts?: OpenLeadFormOptions) => {
    setLeadSource(opts?.source ?? 'hero-find-home');
    setContextListing(opts?.listing ?? null);
    setOpen(true);
  }, []);

  const closeLeadForm = useCallback(() => {
    setOpen(false);
    setContextListing(null);
  }, []);

  const value = useMemo(
    () => ({ openLeadForm, closeLeadForm }),
    [openLeadForm, closeLeadForm]
  );

  return (
    <LeadFormModalContext.Provider value={value}>
      {children}
      <LeadFormModal
        open={open}
        leadSource={leadSource}
        contextListing={contextListing}
        onClose={closeLeadForm}
      />
    </LeadFormModalContext.Provider>
  );
}
