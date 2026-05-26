/**
 * Este archivo contiene la api cliente del modulo reproduction/heats, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Heat, HeatCreate } from './types';

const QK = ['reproduction', 'heats'] as const;

/** Lista de celos detectados. */
export function useHeats() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<Heat[]>('/reproduction/heats')).data
  });
}

/** Celos historicos de un animal. */
export function useAnimalHeats(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'heats'],
    queryFn: async () => (await http.get<Heat[]>(`/animals/${animalId}/heats`)).data,
    enabled: !!animalId
  });
}

/** Crea un celo. */
export function useCreateHeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: HeatCreate) =>
      (await http.post<Heat>('/reproduction/heats', body)).data,
    onSuccess: (_data, body) => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'reproduction'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'kpis'] });
      if (body.animalId) qc.invalidateQueries({ queryKey: ['animal', body.animalId] });
    }
  });
}

/** Actualiza un celo. */
export function useUpdateHeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<HeatCreate> }) =>
      (await http.patch<Heat>(`/reproduction/heats/${id}`, body)).data,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'reproduction'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'kpis'] });
      if (vars.body.animalId) qc.invalidateQueries({ queryKey: ['animal', vars.body.animalId] });
    }
  });
}

/** Borra un celo. */
export function useDeleteHeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/heats/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animal'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'reproduction'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'kpis'] });
    }
  });
}
