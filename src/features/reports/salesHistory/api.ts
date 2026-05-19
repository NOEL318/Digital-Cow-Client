/**
 * Este archivo contiene la api cliente del modulo reports/salesHistory, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export type SaleKind = 'ANIMAL_SALE' | 'MILK_SALE';

export interface SalesHistoryRow {
  kind: SaleKind;
  id: number;
  date: string;
  description?: string;
  amount: number;
  buyer?: string | null;
}

export interface SalesHistory {
  from: string;
  to: string;
  rows: SalesHistoryRow[];
}

/** Consume /reports/sales-history. */
export function useSalesHistory(from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'sales-history', from, to],
    queryFn: async () =>
      (await http.get<SalesHistory>('/reports/sales-history', { params: { from, to } })).data,
    enabled: !!from && !!to
  });
}
