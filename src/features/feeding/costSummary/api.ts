/**
 * Este archivo contiene la api cliente del modulo feeding/costSummary, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export type CostGroupBy = 'lot' | 'ranch' | 'month';

export interface CostBucket {
  key: string;
  label: string;
  totalCost: number;
  totalKg: number;
}

export interface FeedingCostSummary {
  from: string;
  to: string;
  groupBy: CostGroupBy;
  buckets: CostBucket[];
}

/** Hook que consume /feeding/cost-summary?from=...&to=...&groupBy=... */
export function useFeedingCostSummary(from: string, to: string, groupBy: CostGroupBy) {
  return useQuery({
    queryKey: ['feeding', 'cost-summary', from, to, groupBy],
    queryFn: async () =>
      (await http.get<FeedingCostSummary>('/feeding/cost-summary', {
        params: { from, to, groupBy }
      })).data,
    enabled: !!from && !!to,
    staleTime: 1000 * 60 * 5
  });
}
