/**
 * Este archivo contiene la api cliente del modulo reproduction/alerts, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface ReproductionAlertItem {
  type: string;
  animalId?: number;
  animalTag?: string;
  label: string;
  date: string;
  relatedId?: number;
}

export interface ReproductionAlerts {
  upcomingCalvings21d: ReproductionAlertItem[];
  dryOffDue: ReproductionAlertItem[];
  servedWithoutCheck: ReproductionAlertItem[];
  openTooLong: ReproductionAlertItem[];
}

/** Hook que consume /reproduction/alerts (cacheo corto). */
export function useReproductionAlerts() {
  return useQuery({
    queryKey: ['reproduction', 'alerts'],
    queryFn: async () => (await http.get<ReproductionAlerts>('/reproduction/alerts')).data,
    staleTime: 1000 * 60
  });
}
