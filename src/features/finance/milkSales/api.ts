/**
 * Este archivo contiene la api cliente del modulo finance/milkSales, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import { toArray } from '@/lib/page';
import type { MilkSale, MilkSaleCreate } from './types';

const QK = ['finance', 'milk-sales'] as const;

/**
 * Lista ventas de leche. Backend devuelve Page<>; normalizamos a array
 * para que los consumidores reciban siempre MilkSale[].
 */
export function useMilkSales() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<unknown>('/finance/milk-sales')).data,
    select: (data) => toArray<MilkSale>(data)
  });
}

/** Crea una venta de leche (crea income auto). */
export function useCreateMilkSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: MilkSaleCreate) =>
      (await http.post<MilkSale>('/finance/milk-sales', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['finance', 'incomes'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'finance'] });
      qc.invalidateQueries({ queryKey: ['finance', 'pnl'] });
      qc.invalidateQueries({ queryKey: ['finance', 'cash-flow'] });
    }
  });
}

/** Actualiza una venta de leche. */
export function useUpdateMilkSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<MilkSaleCreate> }) =>
      (await http.patch<MilkSale>(`/finance/milk-sales/${id}`, body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['finance', 'incomes'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'finance'] });
      qc.invalidateQueries({ queryKey: ['finance', 'pnl'] });
      qc.invalidateQueries({ queryKey: ['finance', 'cash-flow'] });
    }
  });
}

/** Borra una venta de leche (revierte income). */
export function useDeleteMilkSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/finance/milk-sales/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['finance', 'incomes'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'finance'] });
      qc.invalidateQueries({ queryKey: ['finance', 'pnl'] });
      qc.invalidateQueries({ queryKey: ['finance', 'cash-flow'] });
    }
  });
}
