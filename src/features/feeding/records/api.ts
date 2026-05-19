/**
 * Este archivo contiene la api cliente del modulo feeding/records, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { FeedingRecord, FeedingRecordCreate } from './types';

const QK = ['feeding', 'records'] as const;

/** Lista de registros de consumo de alimento. */
export function useFeedingRecords() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<FeedingRecord[]>('/feeding/records')).data
  });
}

/** Crea un registro de consumo. */
export function useCreateFeedingRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: FeedingRecordCreate) =>
      (await http.post<FeedingRecord>('/feeding/records', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['feeding', 'cost-summary'] });
    }
  });
}

/** Actualiza un registro de consumo. */
export function useUpdateFeedingRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<FeedingRecordCreate> }) =>
      (await http.patch<FeedingRecord>(`/feeding/records/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un registro de consumo. */
export function useDeleteFeedingRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/feeding/records/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
