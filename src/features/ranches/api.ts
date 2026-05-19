/**
 * Este archivo contiene la api cliente del modulo ranches, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Ranch, Lot } from './types';
import type { RanchValues, LotValues } from './schemas';

// Este objeto agrupa las llamadas al backend del modulo correspondiente.
export const ranchApi = {
  list: () => http.get<Ranch[]>('/ranches').then(r => r.data),
  get: (id: number) => http.get<Ranch>(`/ranches/${id}`).then(r => r.data),
  create: (v: RanchValues) => http.post<Ranch>('/ranches', v).then(r => r.data),
  update: (id: number, v: RanchValues) => http.patch<Ranch>(`/ranches/${id}`, v).then(r => r.data),
  remove: (id: number) => http.delete(`/ranches/${id}`),
  listLots: (ranchId: number) => http.get<Lot[]>(`/ranches/${ranchId}/lots`).then(r => r.data),
  createLot: (ranchId: number, v: LotValues) => http.post<Lot>(`/ranches/${ranchId}/lots`, v).then(r => r.data),
  updateLot: (id: number, v: LotValues) => http.patch<Lot>(`/lots/${id}`, v).then(r => r.data),
  removeLot: (id: number) => http.delete(`/lots/${id}`)
};

/** Hook TanStack Query: lista de ranchos de la cuenta. */
export function useRanches() {
  return useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });
}

/** Hook TanStack Query: lista de lotes de un rancho. */
export function useLots(ranchId: number | undefined) {
  return useQuery({
    queryKey: ['ranches', ranchId, 'lots'],
    queryFn: () => ranchApi.listLots(ranchId as number),
    enabled: !!ranchId
  });
}

