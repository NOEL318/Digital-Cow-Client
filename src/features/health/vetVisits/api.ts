/**
 * Este archivo contiene la api cliente del modulo health/vetVisits, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { VetVisit, VetVisitCreate } from './types';

const QK = ['health', 'vet-visits'] as const;

/** Lista visitas veterinarias. */
export function useVetVisits() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<VetVisit[]>('/health/vet-visits')).data
  });
}

/** Crea una visita veterinaria. */
export function useCreateVetVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: VetVisitCreate) =>
      (await http.post<VetVisit>('/health/vet-visits', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Actualiza una visita. */
export function useUpdateVetVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<VetVisitCreate> }) =>
      (await http.patch<VetVisit>(`/health/vet-visits/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra una visita. */
export function useDeleteVetVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await http.delete(`/health/vet-visits/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
