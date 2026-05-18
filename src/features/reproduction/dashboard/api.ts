import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface DashboardReproduction {
  pregnantConfirmed: number;
  upcomingCalvings21d: number;
  openCows: number;
  avgDaysOpen?: number | null;
}

/** Hook que consume /dashboard/reproduction. */
export function useDashboardReproduction() {
  return useQuery({
    queryKey: ['dashboard', 'reproduction'],
    queryFn: async () => (await http.get<DashboardReproduction>('/dashboard/reproduction')).data,
    staleTime: 1000 * 60
  });
}
