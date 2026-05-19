/**
 * Este archivo contiene la api cliente del modulo reproduction/kpis, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface ReproductionKpis {
  from: string;
  to: string;
  daysOpenMedian?: number | null;
  daysOpenP75?: number | null;
  daysOpenMax?: number | null;
  iepDays?: number | null;
  firstCalvingAgeDays?: number | null;
  firstServiceConceptionRate?: number | null;
  servicesPerConception?: number | null;
  pregnancyRate?: number | null;
}

/** Hook que consume /reproduction/kpis?from=...&to=...  */
export function useReproductionKpis(from: string, to: string) {
  return useQuery({
    queryKey: ['reproduction', 'kpis', from, to],
    queryFn: async () =>
      (await http.get<ReproductionKpis>('/reproduction/kpis', { params: { from, to } })).data,
    enabled: !!from && !!to,
    staleTime: 1000 * 60 * 5
  });
}
