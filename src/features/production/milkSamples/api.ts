/**
 * Este archivo contiene la api cliente del modulo production/milkSamples, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { MilkSample, MilkSampleCreate } from './types';

const QK = ['production', 'milk-samples'] as const;

/** Lista de muestras de leche. */
export function useMilkSamples() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<MilkSample[]>('/production/milk-samples')).data
  });
}

/** Muestras historicas de un animal. */
export function useAnimalMilkSamples(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'milk-samples'],
    queryFn: async () => (await http.get<MilkSample[]>(`/animals/${animalId}/milk-samples`)).data,
    enabled: !!animalId
  });
}

/** Crea una muestra de leche. */
export function useCreateMilkSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: MilkSampleCreate) =>
      (await http.post<MilkSample>('/production/milk-samples', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Actualiza una muestra. */
export function useUpdateMilkSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<MilkSampleCreate> }) =>
      (await http.patch<MilkSample>(`/production/milk-samples/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra una muestra. */
export function useDeleteMilkSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/production/milk-samples/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
