/**
 * API cliente y hooks para Terrenos, Parcelas, Potreros de Pastoreo y Corrales.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { ServerlessLand } from '@/serverless/types';

export interface CreateLandPayload {
  ranchId: number;
  name: string;
  type: ServerlessLand['type'];
  areaHectares: number;
  soilType?: ServerlessLand['soilType'];
  irrigationType?: ServerlessLand['irrigationType'];
  pastureGrassType?: string;
  carryingCapacityUGM?: number;
  currentAnimalCount?: number;
  currentCrop?: string;
  notes?: string;
}

export const landsApi = {
  list: (ranchId?: number, type?: string) => {
    const params = new URLSearchParams();
    if (ranchId) params.set('ranchId', String(ranchId));
    if (type) params.set('type', type);
    const q = params.toString() ? `?${params.toString()}` : '';
    return http.get<ServerlessLand[]>(`/lands${q}`).then(r => r.data);
  },
  get: (id: number) => http.get<ServerlessLand>(`/lands/${id}`).then(r => r.data),
  create: (payload: CreateLandPayload) => http.post<ServerlessLand>('/lands', payload).then(r => r.data),
  update: (id: number, payload: Partial<ServerlessLand>) => http.put<ServerlessLand>(`/lands/${id}`, payload).then(r => r.data),
  delete: (id: number) => http.delete(`/lands/${id}`),
  rotate: (id: number, animalCount?: number) => http.post<ServerlessLand>(`/lands/${id}/rotate`, { animalCount }).then(r => r.data)
};

export function useLands(ranchId?: number, type?: string) {
  return useQuery({ queryKey: ['lands', ranchId, type], queryFn: () => landsApi.list(ranchId, type) });
}
