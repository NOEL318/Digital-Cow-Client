import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Pnl, PnlGroupBy } from '@/features/finance/pnl/api';

/** Consume /reports/pnl?from=&to=. Reusa el DTO Pnl. */
export function usePnlReport(from: string, to: string, groupBy: PnlGroupBy = 'month') {
  return useQuery({
    queryKey: ['reports', 'pnl', from, to, groupBy],
    queryFn: async () =>
      (await http.get<Pnl>('/reports/pnl', { params: { from, to, groupBy } })).data,
    enabled: !!from && !!to
  });
}
