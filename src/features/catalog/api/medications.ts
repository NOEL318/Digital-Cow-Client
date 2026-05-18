import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Medication, MedicationUpsertRequest } from '../types';

const KEY = ['catalog', 'medications'] as const;

/** Lista visible para el tenant actual (seeds globales + propias). */
export function useMedications() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data } = await http.get<Medication[]>('/catalog/medications');
      return data;
    },
    staleTime: 1000 * 60 * 5
  });
}

/** Lookup por codigo de barras. Devuelve null si no existe. */
export async function findMedicationByBarcode(barcode: string): Promise<Medication | null> {
  try {
    const { data } = await http.get<Medication>(`/catalog/medications/by-barcode/${encodeURIComponent(barcode)}`);
    return data;
  } catch (e) {
    const err = e as { response?: { status?: number } };
    if (err?.response?.status === 404) return null;
    throw e;
  }
}

/** Crea un medicamento propio del tenant. */
export function useCreateMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: MedicationUpsertRequest) => {
      const { data } = await http.post<Medication>('/catalog/medications', req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY })
  });
}

/** Actualiza un medicamento propio del tenant. */
export function useUpdateMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...req }: MedicationUpsertRequest & { id: number }) => {
      const { data } = await http.put<Medication>(`/catalog/medications/${id}`, req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY })
  });
}

/** Elimina un medicamento propio del tenant. */
export function useDeleteMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await http.delete(`/catalog/medications/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY })
  });
}
