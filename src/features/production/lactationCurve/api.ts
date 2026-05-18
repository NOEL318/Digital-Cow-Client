import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface LactationPoint {
  dayOfLactation: number;
  date: string;
  totalLiters: number;
}

export interface LactationCurve {
  animalId: number;
  lactationStart: string;
  points: LactationPoint[];
}

/** Hook que consume /production/lactation-curve/{animalId}?lactationStartDate=... */
export function useLactationCurve(animalId: number | undefined, lactationStartDate?: string) {
  return useQuery({
    queryKey: ['production', 'lactation-curve', animalId, lactationStartDate],
    queryFn: async () =>
      (await http.get<LactationCurve>(`/production/lactation-curve/${animalId}`, {
        params: lactationStartDate ? { lactationStartDate } : undefined
      })).data,
    enabled: !!animalId
  });
}
