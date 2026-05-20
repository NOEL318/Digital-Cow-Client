/**
 * Este archivo contiene la api cliente del modulo reproduction/calvings, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Calving, CalvingCreate } from './types';

const QK = ['reproduction', 'calvings'] as const;

/** Lista de partos. */
export function useCalvings() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<Calving[]>('/reproduction/calvings')).data
  });
}

/** Partos historicos de un animal. */
export function useAnimalCalvings(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'calvings'],
    queryFn: async () => (await http.get<Calving[]>(`/animals/${animalId}/calvings`)).data,
    enabled: !!animalId
  });
}

/** Crea un parto. Puede registrar al becerro como nuevo animal. */
export function useCreateCalving() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CalvingCreate) =>
      (await http.post<Calving>('/reproduction/calvings', body)).data,
    onSuccess: (_data, body) => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animals'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      if (body.animalId) {
        qc.invalidateQueries({ queryKey: ['animal', body.animalId] });
      }
    }
  });
}

/** Actualiza un parto. */
export function useUpdateCalving() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<CalvingCreate> }) =>
      (await http.patch<Calving>(`/reproduction/calvings/${id}`, body)).data,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK });
      if (vars.body.animalId) {
        qc.invalidateQueries({ queryKey: ['animal', vars.body.animalId] });
      }
    }
  });
}

/** Borra un parto. */
export function useDeleteCalving() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/calvings/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animal'] });
    }
  });
}
