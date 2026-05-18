import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface AgendaItem {
  type: 'VACCINATION' | 'CALVING' | 'WEIGHING_OVERDUE' | 'TREATMENT_OPEN' | string;
  animalId: number | null;
  animalTag: string | null;
  lotId: number | null;
  lotName: string | null;
  dueDate: string | null;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PredictiveAlert {
  type: 'LONG_OPEN_DAYS' | 'MILK_DROP' | string;
  animalId: number;
  animalTag: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
}

export interface LactationStatus {
  animalId: number;
  lastCalving: string | null;
  daysInMilk: number | null;
  lastDryOff: string | null;
  dry: boolean;
  recentAvgLiters: number | null;
}

export function useAgendaToday() {
  return useQuery({
    queryKey: ['agenda', 'today'],
    queryFn: async () => (await http.get<AgendaItem[]>('/agenda/today')).data,
    staleTime: 1000 * 60
  });
}

export function usePredictiveAlerts() {
  return useQuery({
    queryKey: ['alerts', 'predictive'],
    queryFn: async () => (await http.get<PredictiveAlert[]>('/alerts/predictive')).data,
    staleTime: 1000 * 60 * 5
  });
}

export function useAnimalLactation(animalId: number | undefined) {
  return useQuery({
    queryKey: ['animal', animalId, 'lactation'],
    queryFn: async () => (await http.get<LactationStatus>(`/animals/${animalId}/lactation`)).data,
    enabled: !!animalId,
    staleTime: 1000 * 60 * 5
  });
}
