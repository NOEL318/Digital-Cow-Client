/**
 * Este archivo contiene la api cliente del modulo production/slaughter, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { SlaughterResult, SlaughterResultCreate } from './types';

const QK = ['production', 'slaughter-results'] as const;

/** Lista de resultados de sacrificio. */
export function useSlaughterResults() {
  return useQuery({
    queryKey: QK,
    queryFn: async () =>
      (await http.get<SlaughterResult[]>('/production/slaughter-results')).data
  });
}

/**
 * Resultado de sacrificio del animal (suele haber maximo uno). Filtra
 * client-side la lista global porque el helper por animal no esta expuesto.
 */
export function useAnimalSlaughterResults(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'slaughter-results'],
    queryFn: async () => {
      const all = (await http.get<SlaughterResult[]>('/production/slaughter-results')).data;
      return all.filter(s => s.animalId === animalId);
    },
    enabled: !!animalId
  });
}

/** Crea un resultado de sacrificio. */
export function useCreateSlaughterResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: SlaughterResultCreate) =>
      (await http.post<SlaughterResult>('/production/slaughter-results', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Actualiza un resultado de sacrificio. */
export function useUpdateSlaughterResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<SlaughterResultCreate> }) =>
      (await http.patch<SlaughterResult>(`/production/slaughter-results/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un resultado de sacrificio. */
export function useDeleteSlaughterResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/production/slaughter-results/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
