/**
 * Este archivo contiene la api cliente del modulo animals, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { AnimalListItem, AnimalResponse, Page } from './types';
import type { AnimalValues } from './schemas';

export interface AnimalFilters {
  search?: string; ranchId?: number; lotId?: number; breedId?: number;
  sex?: 'FEMALE' | 'MALE'; purpose?: 'BEEF' | 'DAIRY' | 'DUAL'; status?: string;
  page?: number; size?: number;
}

// Este objeto agrupa las llamadas al backend del modulo correspondiente.
export const animalsApi = {
  list: (filters: AnimalFilters) =>
    http.get<Page<AnimalListItem>>('/animals', { params: filters }).then(r => r.data),
  get: (id: number) => http.get<AnimalResponse>(`/animals/${id}`).then(r => r.data),
  create: (v: AnimalValues) => http.post<AnimalResponse>('/animals', v).then(r => r.data),
  update: (id: number, v: Partial<AnimalValues>) => http.patch<AnimalResponse>(`/animals/${id}`, v).then(r => r.data),
  remove: (id: number) => http.delete(`/animals/${id}`)
};

/** Hook TanStack Query: lista paginada de animales con filtros. */
export function useAnimals(filters: AnimalFilters = {}) {
  return useQuery({
    queryKey: ['animals', filters],
    queryFn: () => animalsApi.list(filters)
  });
}

