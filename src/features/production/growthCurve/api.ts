import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface GrowthPoint {
  date: string;
  weightKg: number;
  adgSincePrevious?: number | null;
}

export interface GrowthCurve {
  animalId: number;
  points: GrowthPoint[];
}

/** Hook que consume /production/growth-curve/{animalId}. */
export function useGrowthCurve(animalId: number | undefined) {
  return useQuery({
    queryKey: ['production', 'growth-curve', animalId],
    queryFn: async () =>
      (await http.get<GrowthCurve>(`/production/growth-curve/${animalId}`)).data,
    enabled: !!animalId
  });
}
