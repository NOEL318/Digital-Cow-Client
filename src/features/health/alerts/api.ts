import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface AlertItem {
  type: string;
  animalId?: number;
  animalTag?: string;
  label: string;
  date: string;
  relatedId?: number;
}

export interface HealthAlerts {
  upcomingVaccinations7d: AlertItem[];
  upcomingVaccinations30d: AlertItem[];
  withdrawalActiveMilk: AlertItem[];
  withdrawalActiveMeat: AlertItem[];
  activeDiagnosesWithoutTreatment: AlertItem[];
}

/** Hook que consume /health/alerts (cacheo corto). */
export function useHealthAlerts() {
  return useQuery({
    queryKey: ['health', 'alerts'],
    queryFn: async () => (await http.get<HealthAlerts>('/health/alerts')).data,
    staleTime: 1000 * 60
  });
}
