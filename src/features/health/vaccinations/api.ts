import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Vaccination, VaccinationCreate, VaccinationBulkCreate } from './types';

const QK = ['health', 'vaccinations'] as const;

export interface VaccinationFilters {
  animalId?: number;
  lotId?: number;
  vaccineId?: number;
  from?: string;
  to?: string;
}

/** Lista vacunaciones con filtros opcionales. */
export function useVaccinations(filters: VaccinationFilters = {}) {
  return useQuery({
    queryKey: [...QK, filters],
    queryFn: async () =>
      (await http.get<Vaccination[]>('/health/vaccinations', { params: filters })).data
  });
}

/** Vacunaciones del historial de un animal. */
export function useAnimalVaccinations(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'vaccinations'],
    queryFn: async () =>
      (await http.get<Vaccination[]>(`/animals/${animalId}/vaccinations`)).data,
    enabled: !!animalId
  });
}

/** Crea vacunacion individual. */
export function useCreateVaccination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: VaccinationCreate) =>
      (await http.post<Vaccination>('/health/vaccinations', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
    }
  });
}

/**
 * Crea vacunacion masiva por lote. El backend expande a una fila por animal activo.
 * Devuelve el array de filas creadas.
 */
export function useCreateVaccinationBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: VaccinationBulkCreate) =>
      (await http.post<Vaccination[]>('/health/vaccinations/bulk', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
    }
  });
}

/** Actualiza una vacunacion. */
export function useUpdateVaccination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<VaccinationCreate> }) =>
      (await http.patch<Vaccination>(`/health/vaccinations/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra una vacunacion. */
export function useDeleteVaccination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/health/vaccinations/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
