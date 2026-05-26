/**
 * Este archivo contiene la api cliente del modulo production/weighings, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Weighing, WeighingCreate } from './types';

const QK = ['production', 'weighings'] as const;

/** Lista de pesajes. */
export function useWeighings() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<Weighing[]>('/production/weighings')).data
  });
}

/** Pesajes historicos de un animal. */
export function useAnimalWeighings(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'weighings'],
    queryFn: async () => (await http.get<Weighing[]>(`/animals/${animalId}/weighings`)).data,
    enabled: !!animalId
  });
}

/** Crea un pesaje. */
export function useCreateWeighing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: WeighingCreate) =>
      (await http.post<Weighing>('/production/weighings', body)).data,
    onSuccess: (_data, body) => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'production'] });
      qc.invalidateQueries({ queryKey: ['production', 'growth-curve'] });
      if (body.animalId) {
        qc.invalidateQueries({ queryKey: ['animal', body.animalId] });
      }
    }
  });
}

/** Actualiza un pesaje. */
export function useUpdateWeighing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<WeighingCreate> }) =>
      (await http.patch<Weighing>(`/production/weighings/${id}`, body)).data,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['production', 'growth-curve'] });
      if (vars.body.animalId) {
        qc.invalidateQueries({ queryKey: ['animal', vars.body.animalId] });
      }
    }
  });
}

/** Importacion masiva de pesajes desde CSV. */
export function useBulkCreateWeighings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: WeighingCreate[]) =>
      (await http.post<Weighing[]>('/production/weighings/bulk', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'production'] });
      qc.invalidateQueries({ queryKey: ['animal'] });
    }
  });
}

/** Borra un pesaje. */
export function useDeleteWeighing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/production/weighings/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'production'] });
      qc.invalidateQueries({ queryKey: ['production', 'growth-curve'] });
      qc.invalidateQueries({ queryKey: ['animal'] });
    }
  });
}
