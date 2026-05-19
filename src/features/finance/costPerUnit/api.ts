/**
 * Este archivo contiene la api cliente del modulo finance/costPerUnit, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export type CostPurpose = 'BEEF' | 'DAIRY';

export interface CostPerUnit {
  from: string;
  to: string;
  purpose: CostPurpose;
  totalCost: number;
  totalUnits: number;
  costPerUnit: number | null;
}

/** Consume /finance/cost-per-unit. */
export function useCostPerUnit(from: string, to: string, purpose: CostPurpose) {
  return useQuery({
    queryKey: ['finance', 'cost-per-unit', from, to, purpose],
    queryFn: async () =>
      (await http.get<CostPerUnit>('/finance/cost-per-unit', {
        params: { from, to, purpose }
      })).data,
    enabled: !!from && !!to
  });
}
