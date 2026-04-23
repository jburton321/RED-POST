import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { fetchLiveListings } from '../lib/listings';
import type { ListingRecord } from '../lib/listings';
import { LISTINGS_POLL_MS } from '../lib/api';

type ListingsContextValue = {
  records: ListingRecord[];
  totalCount: number;
  /** True only until the first fetch finishes (polls do not flip this back). */
  initialLoading: boolean;
  /** Incremented after each successful fetch (including polls). */
  refreshGeneration: number;
  refresh: () => void;
};

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<ListingRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshGeneration, setRefreshGeneration] = useState(0);
  const fetchSeq = useRef(0);

  const runFetch = useCallback(() => {
    const seq = ++fetchSeq.current;
    void fetchLiveListings().then((res) => {
      if (seq !== fetchSeq.current) return;
      setRecords(res.records);
      setTotalCount(res.totalCount);
      setInitialLoading(false);
      setRefreshGeneration((g) => g + 1);
    });
  }, []);

  useEffect(() => {
    runFetch();
  }, [runFetch]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      runFetch();
    };

    const id = window.setInterval(tick, LISTINGS_POLL_MS);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [runFetch]);

  const value = useMemo(
    () => ({
      records,
      totalCount,
      initialLoading,
      refreshGeneration,
      refresh: runFetch,
    }),
    [records, totalCount, initialLoading, refreshGeneration, runFetch]
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

/** @see ListingsProvider */
// eslint-disable-next-line react-refresh/only-export-components -- hook tied to provider
export function useListings(): ListingsContextValue {
  const ctx = useContext(ListingsContext);
  if (!ctx) {
    throw new Error('useListings must be used within ListingsProvider');
  }
  return ctx;
}
