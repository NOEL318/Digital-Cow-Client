import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { PregnancyCheck, PregnancyCheckCreate } from './types';

const QK = ['reproduction', 'pregnancy-checks'] as const;

/** Lista de diagnosticos de gestacion. */
export function usePregnancyChecks() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<PregnancyCheck[]>('/reproduction/pregnancy-checks')).data
  });
}

/** Diagnosticos historicos de un animal. */
export function useAnimalPregnancyChecks(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'pregnancy-checks'],
    queryFn: async () => (await http.get<PregnancyCheck[]>(`/animals/${animalId}/pregnancy-checks`)).data,
    enabled: !!animalId
  });
}

/** Crea un diagnostico de gestacion. */
export function useCreatePregnancyCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: PregnancyCheckCreate) =>
      (await http.post<PregnancyCheck>('/reproduction/pregnancy-checks', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
    }
  });
}

/** Actualiza un diagnostico. */
export function useUpdatePregnancyCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<PregnancyCheckCreate> }) =>
      (await http.patch<PregnancyCheck>(`/reproduction/pregnancy-checks/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un diagnostico. */
export function useDeletePregnancyCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/reproduction/pregnancy-checks/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
