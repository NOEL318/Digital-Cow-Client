/**
 * Este archivo contiene la api cliente del modulo health/vaccinations, con las funciones para llamar al backend y los hooks de react-query.
 */
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
    onSuccess: (_data, body) => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
      if (body.animalId) {
        qc.invalidateQueries({ queryKey: ['animal', body.animalId] });
      }
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
      qc.invalidateQueries({ queryKey: ['animal'] });
    }
  });
}

/** Actualiza una vacunacion. */
export function useUpdateVaccination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<VaccinationCreate> }) =>
      (await http.patch<Vaccination>(`/health/vaccinations/${id}`, body)).data,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK });
      if (vars.body.animalId) {
        qc.invalidateQueries({ queryKey: ['animal', vars.body.animalId] });
      }
    }
  });
}

/** Borra una vacunacion. */
export function useDeleteVaccination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/health/vaccinations/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animal'] });
    }
  });
}
