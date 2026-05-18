import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { SemenStraw, SemenStrawCreate } from './types';

const QK = ['reproduction', 'semen-straws'] as const;

/** Lista de pajillas de semen. */
export function useSemenStraws() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<SemenStraw[]>('/reproduction/semen-straws')).data
  });
}

/** Crea una nueva pajilla. */
export function useCreateSemenStraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: SemenStrawCreate) =>
      (await http.post<SemenStraw>('/reproduction/semen-straws', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Actualiza una pajilla. */
export function useUpdateSemenStraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<SemenStrawCreate> }) =>
      (await http.patch<SemenStraw>(`/reproduction/semen-straws/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra una pajilla. */
export function useDeleteSemenStraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/semen-straws/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
