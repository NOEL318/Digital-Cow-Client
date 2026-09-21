/**
 * API cliente y hooks para el módulo de Agricultura (Siembras, Cosechas y Cultivos).
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { ServerlessCrop, ServerlessPlanting, ServerlessHarvest } from '@/serverless/types';

export interface CreatePlantingPayload {
  ranchId: number;
  landId: number;
  cropId: number;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  areaHectares: number;
  seedingRateKgHa: number;
  seedCost: number;
  fertilizerCost: number;
  agrochemicalCost: number;
  laborCost: number;
  machineryCost: number;
  notes?: string;
}

export interface CreateHarvestPayload {
  ranchId: number;
  plantingId?: number;
  landId: number;
  cropName: string;
  harvestDate: string;
  areaHectares: number;
  totalYieldTons: number;
  moisturePercentage?: number;
  grainQuality: 'PREMIUM' | 'STANDARD' | 'FEED_GRADE' | 'DAMAGED';
  destination: 'SILO' | 'DIRECT_SALE' | 'FEEDLOT' | 'BALES';
  salePricePerTon?: number;
  netProfit?: number;
  notes?: string;
}

export const agricultureApi = {
  listCrops: () => http.get<ServerlessCrop[]>('/crops').then(r => r.data),
  listPlantings: (ranchId?: number) => {
    const q = ranchId ? `?ranchId=${ranchId}` : '';
    return http.get<ServerlessPlanting[]>(`/plantings${q}`).then(r => r.data);
  },
  createPlanting: (payload: CreatePlantingPayload) => http.post<ServerlessPlanting>('/plantings', payload).then(r => r.data),
  updatePlanting: (id: number, payload: Partial<ServerlessPlanting>) => http.put<ServerlessPlanting>(`/plantings/${id}`, payload).then(r => r.data),
  deletePlanting: (id: number) => http.delete(`/plantings/${id}`),

  listHarvests: (ranchId?: number) => {
    const q = ranchId ? `?ranchId=${ranchId}` : '';
    return http.get<ServerlessHarvest[]>(`/harvests${q}`).then(r => r.data);
  },
  createHarvest: (payload: CreateHarvestPayload) => http.post<ServerlessHarvest>('/harvests', payload).then(r => r.data),
  deleteHarvest: (id: number) => http.delete(`/harvests/${id}`),

  getAgronomyKpis: () => http.get<{
    activeCropsHectares: number;
    totalTonsHarvested: number;
    totalCropRevenue: number;
    totalLivestockSales: number;
    totalPastureHectares: number;
    machineryCount: number;
    operationalMachinery: number;
    maintenancePendingCount: number;
  }>('/agronomy/kpis').then(r => r.data)
};

export function useCrops() {
  return useQuery({ queryKey: ['crops'], queryFn: agricultureApi.listCrops });
}

export function usePlantings(ranchId?: number) {
  return useQuery({ queryKey: ['plantings', ranchId], queryFn: () => agricultureApi.listPlantings(ranchId) });
}

export function useHarvests(ranchId?: number) {
  return useQuery({ queryKey: ['harvests', ranchId], queryFn: () => agricultureApi.listHarvests(ranchId) });
}

export function useAgronomyKpis() {
  return useQuery({ queryKey: ['agronomyKpis'], queryFn: agricultureApi.getAgronomyKpis });
}
