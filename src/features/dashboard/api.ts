/**
 * Este archivo contiene la api cliente del modulo dashboard, con las funciones para llamar al backend y los hooks de react-query.
 */
import { http } from '@/lib/http';
import type { DashboardSummary } from './types';

// Este objeto agrupa las llamadas al backend del modulo correspondiente.
export const dashboardApi = {
  summary: () => http.get<DashboardSummary>('/dashboard/summary').then(r => r.data)
};
