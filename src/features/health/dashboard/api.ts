import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface TopDisease {
  diseaseCode: string;
  name: string;
  count: number;
}

export interface DashboardHealth {
  upcomingVaccinations7d: number;
  upcomingVaccinations30d: number;
  activeDiagnoses: number;
  treatmentsActiveCount: number;
  monthVetSpend: number;
  topDiseasesQuarter: TopDisease[];
}

/** Hook que consume /dashboard/health. */
export function useDashboardHealth() {
  return useQuery({
    queryKey: ['dashboard', 'health'],
    queryFn: async () => (await http.get<DashboardHealth>('/dashboard/health')).data,
    staleTime: 1000 * 60
  });
}
