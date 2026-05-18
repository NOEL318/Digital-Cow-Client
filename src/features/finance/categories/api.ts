import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type {
  ExpenseCategory, ExpenseCategoryCreate,
  IncomeCategory, IncomeCategoryCreate
} from './types';

const QK_EXP = ['finance', 'expense-categories'] as const;
const QK_INC = ['finance', 'income-categories'] as const;

/** Lista de categorias de egreso (cuenta + globales). */
export function useExpenseCategories() {
  return useQuery({
    queryKey: QK_EXP,
    queryFn: async () => (await http.get<ExpenseCategory[]>('/finance/expense-categories')).data
  });
}

/** Crea una categoria de egreso. */
export function useCreateExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ExpenseCategoryCreate) =>
      (await http.post<ExpenseCategory>('/finance/expense-categories', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK_EXP })
  });
}

/** Actualiza categoria de egreso (no globales). */
export function useUpdateExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<ExpenseCategoryCreate> }) =>
      (await http.patch<ExpenseCategory>(`/finance/expense-categories/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK_EXP })
  });
}

/** Borra categoria de egreso (no globales). */
export function useDeleteExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/finance/expense-categories/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK_EXP })
  });
}

/** Lista de categorias de ingreso. */
export function useIncomeCategories() {
  return useQuery({
    queryKey: QK_INC,
    queryFn: async () => (await http.get<IncomeCategory[]>('/finance/income-categories')).data
  });
}

/** Crea categoria de ingreso. */
export function useCreateIncomeCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: IncomeCategoryCreate) =>
      (await http.post<IncomeCategory>('/finance/income-categories', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK_INC })
  });
}

/** Actualiza categoria de ingreso. */
export function useUpdateIncomeCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<IncomeCategoryCreate> }) =>
      (await http.patch<IncomeCategory>(`/finance/income-categories/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK_INC })
  });
}

/** Borra categoria de ingreso. */
export function useDeleteIncomeCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/finance/income-categories/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK_INC })
  });
}
