/**
 * Este archivo contiene la api cliente del modulo production/bulkTank, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { BulkTankDelivery, BulkTankDeliveryCreate } from './types';

const QK = ['production', 'bulk-tank-deliveries'] as const;

/** Lista de entregas a tanque. */
export function useBulkTankDeliveries() {
  return useQuery({
    queryKey: QK,
    queryFn: async () =>
      (await http.get<BulkTankDelivery[]>('/production/bulk-tank-deliveries')).data
  });
}

/** Crea una entrega a tanque. */
export function useCreateBulkTankDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: BulkTankDeliveryCreate) =>
      (await http.post<BulkTankDelivery>('/production/bulk-tank-deliveries', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'production'] });
    }
  });
}

/** Actualiza una entrega a tanque. */
export function useUpdateBulkTankDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<BulkTankDeliveryCreate> }) =>
      (await http.patch<BulkTankDelivery>(`/production/bulk-tank-deliveries/${id}`, body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'production'] });
    }
  });
}

/** Borra una entrega a tanque. */
export function useDeleteBulkTankDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/production/bulk-tank-deliveries/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'production'] });
    }
  });
}
