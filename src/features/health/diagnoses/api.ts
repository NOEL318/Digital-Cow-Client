import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Diagnosis, DiagnosisCreate } from './types';

const QK = ['health', 'diagnoses'] as const;

export interface DiagnosisFilters {
  animalId?: number;
  diseaseId?: number;
  status?: string;
  from?: string;
  to?: string;
}

/** Lista diagnosticos con filtros opcionales. */
export function useDiagnoses(filters: DiagnosisFilters = {}) {
  return useQuery({
    queryKey: [...QK, filters],
    queryFn: async () =>
      (await http.get<Diagnosis[]>('/health/diagnoses', { params: filters })).data
  });
}

/** Diagnosticos historicos de un animal. */
export function useAnimalDiagnoses(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'diagnoses'],
    queryFn: async () =>
      (await http.get<Diagnosis[]>(`/animals/${animalId}/diagnoses`)).data,
    enabled: !!animalId
  });
}

/** Crea un diagnostico. */
export function useCreateDiagnosis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: DiagnosisCreate) =>
      (await http.post<Diagnosis>('/health/diagnoses', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
    }
  });
}

/** Actualiza un diagnostico (puede cerrar con status). */
export function useUpdateDiagnosis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<DiagnosisCreate> & { resolvedAt?: string } }) =>
      (await http.patch<Diagnosis>(`/health/diagnoses/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un diagnostico. */
export function useDeleteDiagnosis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/health/diagnoses/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
