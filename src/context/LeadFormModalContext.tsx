import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import LeadFormModal from '../components/LeadFormModal';

export type OpenLeadFormOptions = { source?: string };

type LeadFormModalContextValue = {
  openLeadForm: (opts?: OpenLeadFormOptions) => void;
  closeLeadForm: () => void;
};

export const LeadFormModalContext = createContext<LeadFormModalContextValue | null>(null);

export function LeadFormModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [leadSource, setLeadSource] = useState('hero-find-home');

  const openLeadForm = useCallback((opts?: OpenLeadFormOptions) => {
    setLeadSource(opts?.source ?? 'hero-find-home');
    setOpen(true);
  }, []);

  const closeLeadForm = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openLeadForm, closeLeadForm }),
    [openLeadForm, closeLeadForm]
  );

  return (
    <LeadFormModalContext.Provider value={value}>
      {children}
      <LeadFormModal open={open} leadSource={leadSource} onClose={closeLeadForm} />
    </LeadFormModalContext.Provider>
  );
}
