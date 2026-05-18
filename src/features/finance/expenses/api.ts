import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import { toArray } from '@/lib/page';
import type { Expense, ExpenseCreate } from './types';

const QK = ['finance', 'expenses'] as const;

export interface ExpenseFilters {
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
 * Lista egresos con filtros. Backend devuelve Page<>; normalizamos a array
 * para que los consumidores tengan Expense[] siempre.
 */
export function useExpenses(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: [...QK, filters],
    queryFn: async () =>
      (await http.get<unknown>('/finance/expenses', { params: filters })).data,
    select: (data) => toArray<Expense>(data)
  });
}

/** Crea un egreso. */
export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ExpenseCreate) =>
      (await http.post<Expense>('/finance/expenses', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['dashboard', 'finance'] });
      qc.invalidateQueries({ queryKey: ['finance', 'pnl'] });
      qc.invalidateQueries({ queryKey: ['finance', 'cash-flow'] });
    }
  });
}

/** Actualiza un egreso. */
export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<ExpenseCreate> }) =>
      (await http.patch<Expense>(`/finance/expenses/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un egreso. */
export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/finance/expenses/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}
