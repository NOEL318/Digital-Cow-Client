/**
 * Este archivo contiene la api cliente del modulo animals/comparison, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface ComparisonPoint {
  yearMonth: string;
  weightKg: number | null;
  feedKg: number | null;
  expense: number | null;
  income: number | null;
}

export interface ComparisonResponse {
  animalId: number;
  from: string;
  to: string;
  points: ComparisonPoint[];
}

interface Params {
  animalId: number;
  from?: string;
  to?: string;
}

/**
 * Carga la serie comparativa por animal con peso, alimento del lote,
 * gasto e ingreso por mes. Sin parametros usa los ultimos 12 meses.
 */
export function useAnimalComparison({ animalId, from, to }: Params) {
  return useQuery({
    queryKey: ['animal-comparison', animalId, from, to],
    queryFn: async () => {
      const { data } = await http.get<ComparisonResponse>(`/animals/${animalId}/comparison`, {
        params: { from, to }
      });
      return data;
    },
    enabled: Number.isFinite(animalId),
    staleTime: 1000 * 60
  });
}
