import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { PestControl, PestControlCreate } from './types';

const QK = ['health', 'pest-controls'] as const;

export interface PestControlFilters {
  ranchId?: number;
  lotId?: number;
  pestId?: number;
  from?: string;
  to?: string;
}

/** Lista controles de plagas con filtros opcionales. */
export function usePestControls(filters: PestControlFilters = {}) {
  return useQuery({
    queryKey: [...QK, filters],
    queryFn: async () =>
      (await http.get<PestControl[]>('/health/pest-controls', { params: filters })).data
  });
}

/** Crea un control de plagas. */
export function useCreatePestControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: PestControlCreate) =>
      (await http.post<PestControl>('/health/pest-controls', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
    }
  });
}

/** Actualiza un control de plagas. */
export function useUpdatePestControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<PestControlCreate> }) =>
      (await http.patch<PestControl>(`/health/pest-controls/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un control de plagas. */
export function useDeletePestControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/health/pest-controls/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
