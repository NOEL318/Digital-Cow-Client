/**
 * Este archivo contiene la api cliente del modulo reproduction/weanings, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Weaning, WeaningCreate } from './types';

const QK = ['reproduction', 'weanings'] as const;

/** Lista de destetes. */
export function useWeanings() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<Weaning[]>('/reproduction/weanings')).data
  });
}

/** Destetes historicos de un animal. */
export function useAnimalWeanings(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'weanings'],
    queryFn: async () => (await http.get<Weaning[]>(`/animals/${animalId}/weanings`)).data,
    enabled: !!animalId
  });
}

/** Crea un destete. */
export function useCreateWeaning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: WeaningCreate) =>
      (await http.post<Weaning>('/reproduction/weanings', body)).data,
    onSuccess: (_data, body) => {
      qc.invalidateQueries({ queryKey: QK });
      if ((body as { animalId?: number }).animalId) {
        qc.invalidateQueries({ queryKey: ['animal', (body as { animalId?: number }).animalId] });
      }
    }
  });
}

/** Actualiza un destete. */
export function useUpdateWeaning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<WeaningCreate> }) =>
      (await http.patch<Weaning>(`/reproduction/weanings/${id}`, body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animal'] });
    }
  });
}

/** Borra un destete. */
export function useDeleteWeaning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/weanings/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animal'] });
    }
  });
}
