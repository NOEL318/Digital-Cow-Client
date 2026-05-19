/**
 * Este archivo contiene la api cliente del modulo finance/animalRoi, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface AnimalRoiBreakdown {
  treatments: number;
  vaccinationsIndividual: number;
  vaccinationsProportionalLot: number;
  services: number;
  manualExpenses: number;
  feedingProportional: number;
}

export interface AnimalRoi {
  animalId: number;
  totalIncome: number;
  totalCost: number;
  roi: number;
  costs: AnimalRoiBreakdown;
}

/** Consume /finance/animal-roi/{id}. */
export function useAnimalRoi(animalId: number | undefined) {
  return useQuery({
    queryKey: ['finance', 'animal-roi', animalId],
    queryFn: async () =>
      (await http.get<AnimalRoi>(`/finance/animal-roi/${animalId}`)).data,
    enabled: !!animalId
  });
}
