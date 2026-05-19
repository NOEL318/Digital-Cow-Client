/**
 * Este archivo contiene la api cliente del modulo finance/incomes, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import { toArray } from '@/lib/page';
import type { Income, IncomeCreate } from './types';

const QK = ['finance', 'incomes'] as const;

export interface IncomeFilters {
  from?: string;
  to?: string;
  categoryId?: number;
  ranchId?: number;
  lotId?: number;
  animalId?: number;
  size?: number;
  sort?: string;
}

/**
 * Lista ingresos con filtros. Backend devuelve Page<>; normalizamos a array
 * para que los consumidores tengan Income[] siempre.
 */
export function useIncomes(filters: IncomeFilters = {}) {
  return useQuery({
    queryKey: [...QK, filters],
    queryFn: async () =>
      (await http.get<unknown>('/finance/incomes', { params: filters })).data,
    select: (data) => toArray<Income>(data)
  });
}

/** Crea un ingreso. */
export function useCreateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: IncomeCreate) =>
      (await http.post<Income>('/finance/incomes', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'finance'] });
      qc.invalidateQueries({ queryKey: ['finance', 'pnl'] });
      qc.invalidateQueries({ queryKey: ['finance', 'cash-flow'] });
    }
  });
}

/** Actualiza un ingreso. */
export function useUpdateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<IncomeCreate> }) =>
      (await http.patch<Income>(`/finance/incomes/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un ingreso. */
export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/finance/incomes/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
