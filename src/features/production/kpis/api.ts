import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface TopProducer {
  animalId: number;
  internalTag: string;
  liters: number;
}

export interface ProductionKpis {
  from: string;
  to: string;
  totalMilkLiters: number;
  avgDailyMilkLiters: number;
  avgAdgKgDay?: number | null;
  topProducers: TopProducer[];
}

/** Hook que consume /production/kpis?from=...&to=... */
export function useProductionKpis(from: string, to: string) {
  return useQuery({
    queryKey: ['production', 'kpis', from, to],
    queryFn: async () =>
      (await http.get<ProductionKpis>('/production/kpis', { params: { from, to } })).data,
    enabled: !!from && !!to,
    staleTime: 1000 * 60 * 5
  });
}
