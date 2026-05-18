import { http } from '@/lib/http';
import type { DashboardSummary } from './types';

export const dashboardApi = {
  summary: () => http.get<DashboardSummary>('/dashboard/summary').then(r => r.data)
};
