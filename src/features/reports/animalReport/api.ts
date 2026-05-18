import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface AnimalReport {
  animal: {
    id: number;
    internalTag: string;
    officialTag?: string | null;
    name?: string | null;
    breedId: number;
    breedNameEs?: string;
    breedNameEn?: string;
    sex: string;
    status: string;
    purpose: string;
    birthDate?: string | null;
    ranchId: number;
    ranchName?: string;
    lotId?: number | null;
    lotName?: string | null;
  };
  vaccinations: Array<{ id: number; appliedAt: string; vaccineNameEs?: string; vaccineNameEn?: string; cost?: number | null }>;
  diagnoses: Array<{ id: number; diagnosedAt: string; diseaseNameEs?: string; diseaseNameEn?: string; severity?: string; status?: string }>;
  treatments: Array<{ id: number; startedAt: string; medicationNameEs?: string; medicationNameEn?: string; cost?: number | null }>;
  weighings: Array<{ id: number; weighedAt: string; weightKg: number }>;
  milkings: Array<{ id: number; milkedAt: string; liters: number }>;
  calvings: Array<{ id: number; calvingDate: string; outcome?: string }>;
  sale?: { id: number; soldAt: string; totalPrice: number; buyer?: string | null } | null;
}

/** Consume /reports/animal/{id}. */
export function useAnimalReport(animalId: number | undefined) {
  return useQuery({
    queryKey: ['reports', 'animal', animalId],
    queryFn: async () =>
      (await http.get<AnimalReport>(`/reports/animal/${animalId}`)).data,
    enabled: !!animalId
  });
}
