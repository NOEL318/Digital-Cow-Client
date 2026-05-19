/**
 * Este archivo contiene la api cliente del modulo feeding/items, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { FeedItem, FeedItemCreate } from './types';

const QK = ['feeding', 'items'] as const;

/** Lista de insumos (cuenta + globales). */
export function useFeedItems() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<FeedItem[]>('/feeding/items')).data
  });
}

/** Crea un insumo de la cuenta. */
export function useCreateFeedItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: FeedItemCreate) =>
      (await http.post<FeedItem>('/feeding/items', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Actualiza un insumo (no globales). */
export function useUpdateFeedItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<FeedItemCreate> }) =>
      (await http.patch<FeedItem>(`/feeding/items/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un insumo (no globales). */
export function useDeleteFeedItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/feeding/items/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
