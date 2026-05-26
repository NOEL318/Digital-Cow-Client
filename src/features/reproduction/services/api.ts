/**
 * Este archivo contiene la api cliente del modulo reproduction/services, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { ServiceEvent, ServiceEventCreate } from './types';

const QK = ['reproduction', 'services'] as const;

/** Lista de servicios reproductivos. */
export function useServiceEvents() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<ServiceEvent[]>('/reproduction/services')).data
  });
}

/** Servicios historicos de un animal. */
export function useAnimalServiceEvents(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'services'],
    queryFn: async () => (await http.get<ServiceEvent[]>(`/animals/${animalId}/services`)).data,
    enabled: !!animalId
  });
}

/** Crea un servicio reproductivo. */
export function useCreateServiceEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ServiceEventCreate) =>
      (await http.post<ServiceEvent>('/reproduction/services', body)).data,
    onSuccess: (_data, body) => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['reproduction', 'semen-straws'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'reproduction'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'kpis'] });
      const aid = (body as { animalId?: number }).animalId;
      if (aid) qc.invalidateQueries({ queryKey: ['animal', aid] });
    }
  });
}

/** Actualiza un servicio. */
export function useUpdateServiceEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<ServiceEventCreate> }) =>
      (await http.patch<ServiceEvent>(`/reproduction/services/${id}`, body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animal'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'reproduction'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'kpis'] });
    }
  });
}

/** Borra un servicio. */
export function useDeleteServiceEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/services/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animal'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'reproduction'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'kpis'] });
    }
  });
}
