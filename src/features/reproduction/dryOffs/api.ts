/**
 * Este archivo contiene la api cliente del modulo reproduction/dryOffs, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { DryOff, DryOffCreate } from './types';

const QK = ['reproduction', 'dry-offs'] as const;

/** Lista de secados. */
export function useDryOffs() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<DryOff[]>('/reproduction/dry-offs')).data
  });
}

/** Secados historicos de un animal. */
export function useAnimalDryOffs(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'dry-offs'],
    queryFn: async () => (await http.get<DryOff[]>(`/animals/${animalId}/dry-offs`)).data,
    enabled: !!animalId
  });
}

/** Crea un secado. */
export function useCreateDryOff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: DryOffCreate) =>
      (await http.post<DryOff>('/reproduction/dry-offs', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
    }
  });
}

/** Actualiza un secado. */
export function useUpdateDryOff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<DryOffCreate> }) =>
      (await http.patch<DryOff>(`/reproduction/dry-offs/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un secado. */
export function useDeleteDryOff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/dry-offs/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
