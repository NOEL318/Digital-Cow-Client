import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export type PnlGroupBy = 'month' | 'category';

export interface PnlBucket {
  key: string;
  label: string;
  income: number;
  expense: number;
  margin: number;
}

export interface PnlBreakdown {
  treatments: number;
  vaccinations: number;
  pestControls: number;
  vetVisits: number;
  feedingRecords: number;
  services: number;
}

export interface Pnl {
  from: string;
  to: string;
  groupBy: PnlGroupBy;
  totalIncome: number;
  totalExpense: number;
  margin: number;
  buckets: PnlBucket[];
  importedCosts: PnlBreakdown;
}

/** Consume /finance/pnl con filtros. */
export function usePnl(from: string, to: string, groupBy: PnlGroupBy) {
  return useQuery({
    queryKey: ['finance', 'pnl', from, to, groupBy],
    queryFn: async () =>
      (await http.get<Pnl>('/finance/pnl', { params: { from, to, groupBy } })).data,
    enabled: !!from && !!to,
    staleTime: 1000 * 60 * 5
  });
}
