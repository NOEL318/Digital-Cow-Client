/**
 * Este archivo contiene la api cliente del modulo health/treatments, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Treatment, TreatmentCreate } from './types';

const QK = ['health', 'treatments'] as const;

export interface TreatmentFilters {
  animalId?: number;
  medicationId?: number;
  active?: boolean;
  withdrawalActive?: boolean;
  from?: string;
  to?: string;
}

/** Lista tratamientos con filtros opcionales. */
export function useTreatments(filters: TreatmentFilters = {}) {
  return useQuery({
    queryKey: [...QK, filters],
    queryFn: async () =>
      (await http.get<Treatment[]>('/health/treatments', { params: filters })).data
  });
}

/** Tratamientos historicos de un animal. */
export function useAnimalTreatments(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'treatments'],
    queryFn: async () =>
      (await http.get<Treatment[]>(`/animals/${animalId}/treatments`)).data,
    enabled: !!animalId
  });
}

/** Crea un tratamiento. */
export function useCreateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: TreatmentCreate) =>
      (await http.post<Treatment>('/health/treatments', body)).data,
    onSuccess: (_data, body) => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
      if (body.animalId) {
        qc.invalidateQueries({ queryKey: ['animal', body.animalId] });
      }
    }
  });
}

/** Actualiza un tratamiento (puede cerrarlo). */
export function useUpdateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<TreatmentCreate> }) =>
      (await http.patch<Treatment>(`/health/treatments/${id}`, body)).data,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK });
      if (vars.body.animalId) {
        qc.invalidateQueries({ queryKey: ['animal', vars.body.animalId] });
      }
    }
  });
}

/** Borra un tratamiento. */
export function useDeleteTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/health/treatments/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animal'] });
    }
  });
}
