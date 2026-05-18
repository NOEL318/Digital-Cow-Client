import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Bull, BullCreate } from './types';

const QK = ['reproduction', 'bulls'] as const;

/** Lista de toros del catalogo. */
export function useBulls() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<Bull[]>('/reproduction/bulls')).data
  });
}

/** Crea un nuevo toro. */
export function useCreateBull() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: BullCreate) =>
      (await http.post<Bull>('/reproduction/bulls', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Actualiza un toro. */
export function useUpdateBull() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<BullCreate> }) =>
      (await http.patch<Bull>(`/reproduction/bulls/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un toro (si no tiene pajillas asociadas). */
export function useDeleteBull() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/bulls/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
