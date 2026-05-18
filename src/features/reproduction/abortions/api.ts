import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Abortion, AbortionCreate } from './types';

const QK = ['reproduction', 'abortions'] as const;

/** Lista de abortos. */
export function useAbortions() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<Abortion[]>('/reproduction/abortions')).data
  });
}

/** Abortos historicos de un animal. */
export function useAnimalAbortions(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'abortions'],
    queryFn: async () => (await http.get<Abortion[]>(`/animals/${animalId}/abortions`)).data,
    enabled: !!animalId
  });
}

/** Crea un aborto. */
export function useCreateAbortion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: AbortionCreate) =>
      (await http.post<Abortion>('/reproduction/abortions', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
    }
  });
}

/** Actualiza un aborto. */
export function useUpdateAbortion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<AbortionCreate> }) =>
      (await http.patch<Abortion>(`/reproduction/abortions/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un aborto. */
export function useDeleteAbortion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/abortions/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
