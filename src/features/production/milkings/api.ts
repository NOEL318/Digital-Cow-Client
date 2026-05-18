import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Milking, MilkingCreate, MilkingBulkCreate } from './types';

const QK = ['production', 'milkings'] as const;

/** Lista de ordeños. */
export function useMilkings() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<Milking[]>('/production/milkings')).data
  });
}

/** Ordeños historicos de un animal. */
export function useAnimalMilkings(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'milkings'],
    queryFn: async () => (await http.get<Milking[]>(`/animals/${animalId}/milkings`)).data,
    enabled: !!animalId
  });
}

/** Crea un ordeño individual. */
export function useCreateMilking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: MilkingCreate) =>
      (await http.post<Milking>('/production/milkings', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'production'] });
      qc.invalidateQueries({ queryKey: ['production', 'lactation-curve'] });
    }
  });
}

/** Crea N ordeños en lote para un dia/sesion. */
export function useCreateMilkingBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: MilkingBulkCreate) =>
      (await http.post<Milking[]>('/production/milkings/bulk', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'production'] });
      qc.invalidateQueries({ queryKey: ['production', 'lactation-curve'] });
    }
  });
}

/** Actualiza un ordeño. */
export function useUpdateMilking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<MilkingCreate> }) =>
      (await http.patch<Milking>(`/production/milkings/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un ordeño. */
export function useDeleteMilking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/production/milkings/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
