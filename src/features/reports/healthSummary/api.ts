/**
 * Este archivo contiene la api cliente del modulo reports/healthSummary, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface HealthSummaryMonth {
  month: string;
  vaccinations: number;
  diagnosesMild: number;
  diagnosesModerate: number;
  diagnosesSevere: number;
  treatments: number;
  totalCost: number;
}

export interface HealthSummary {
  from: string;
  to: string;
  months: HealthSummaryMonth[];
}

/** Consume /reports/health-summary. */
export function useHealthSummary(from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'health-summary', from, to],
    queryFn: async () =>
      (await http.get<HealthSummary>('/reports/health-summary', { params: { from, to } })).data,
    enabled: !!from && !!to
  });
}
