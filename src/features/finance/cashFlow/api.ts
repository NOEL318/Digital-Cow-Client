/**
 * Este archivo contiene la api cliente del modulo finance/cashFlow, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface MonthFlow {
  month: number;
  income: number;
  expense: number;
  net: number;
}

export interface CashFlow {
  year: number;
  months: MonthFlow[];
}

/** Consume /finance/cash-flow?year=YYYY. */
export function useCashFlow(year: number) {
  return useQuery({
    queryKey: ['finance', 'cash-flow', year],
    queryFn: async () =>
      (await http.get<CashFlow>('/finance/cash-flow', { params: { year } })).data,
    enabled: !!year,
    staleTime: 1000 * 60 * 5
  });
}
