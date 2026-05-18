import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface DashboardProduction {
  todayMilkLiters: number;
  mtdMilkLiters: number;
  avgAdgKgDayThisMonth?: number | null;
  activeMilkingCows: number;
}

/** Hook que consume /dashboard/production. */
export function useDashboardProduction() {
  return useQuery({
    queryKey: ['dashboard', 'production'],
    queryFn: async () => (await http.get<DashboardProduction>('/dashboard/production')).data,
    staleTime: 1000 * 60
  });
}
