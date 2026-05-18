import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface TopExpenseCategory {
  categoryCode: string;
  nameEs: string;
  nameEn: string;
  total: number;
}

export interface DashboardFinance {
  mtdIncome: number;
  mtdExpense: number;
  mtdMargin: number;
  ytdMargin: number;
  topExpenseCategoriesMonth: TopExpenseCategory[];
}

/** Consume /dashboard/finance. */
export function useDashboardFinance() {
  return useQuery({
    queryKey: ['dashboard', 'finance'],
    queryFn: async () => (await http.get<DashboardFinance>('/dashboard/finance')).data,
    staleTime: 1000 * 60 * 5
  });
}
