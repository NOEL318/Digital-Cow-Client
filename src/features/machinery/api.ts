/**
 * API cliente y hooks para el módulo de Maquinaria, Equipos y Mantenimiento.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { ServerlessMachinery, ServerlessMachineryMaintenance, ServerlessFuelLog } from '@/serverless/types';

export interface CreateMachineryPayload {
  ranchId: number;
  name: string;
  type: ServerlessMachinery['type'];
  brand: string;
  model: string;
  year: number;
  serialNumber?: string;
  currentHoursMeter: number;
  nextServiceHours: number;
  fuelType: 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'NONE';
  fuelEfficiencyLitersPerHour?: number;
  assignedOperator?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
}

export interface CreateMaintenancePayload {
  machineryId: number;
  maintenanceDate: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'OVERHAUL';
  hoursMeter: number;
  description: string;
  cost: number;
  performedBy: string;
  partsReplaced?: string;
  notes?: string;
}

export interface CreateFuelLogPayload {
  machineryId: number;
  loggedAt: string;
  liters: number;
  costPerLiter: number;
  hoursMeter: number;
  notes?: string;
}

export const machineryApi = {
  list: (ranchId?: number) => {
    const q = ranchId ? `?ranchId=${ranchId}` : '';
    return http.get<ServerlessMachinery[]>(`/machinery${q}`).then(r => r.data);
  },
  get: (id: number) => http.get<ServerlessMachinery>(`/machinery/${id}`).then(r => r.data),
  create: (payload: CreateMachineryPayload) => http.post<ServerlessMachinery>('/machinery', payload).then(r => r.data),
  update: (id: number, payload: Partial<ServerlessMachinery>) => http.put<ServerlessMachinery>(`/machinery/${id}`, payload).then(r => r.data),
  delete: (id: number) => http.delete(`/machinery/${id}`),

  listMaintenances: (machineryId?: number) => {
    const url = machineryId ? `/machinery/${machineryId}/maintenances` : '/machinery/maintenances';
    return http.get<ServerlessMachineryMaintenance[]>(url).then(r => r.data);
  },
  createMaintenance: (machineryId: number, payload: CreateMaintenancePayload) =>
    http.post<ServerlessMachineryMaintenance>(`/machinery/${machineryId}/maintenances`, payload).then(r => r.data),

  listFuelLogs: (machineryId?: number) => {
    const url = machineryId ? `/machinery/${machineryId}/fuel` : '/machinery/fuel';
    return http.get<ServerlessFuelLog[]>(url).then(r => r.data);
  },
  createFuelLog: (machineryId: number, payload: CreateFuelLogPayload) =>
    http.post<ServerlessFuelLog>(`/machinery/${machineryId}/fuel`, payload).then(r => r.data)
};

export function useMachineryList(ranchId?: number) {
  return useQuery({ queryKey: ['machinery', ranchId], queryFn: () => machineryApi.list(ranchId) });
}

export function useMachineryMaintenances(machineryId?: number) {
  return useQuery({ queryKey: ['machineryMaintenances', machineryId], queryFn: () => machineryApi.listMaintenances(machineryId) });
}

export function useFuelLogs(machineryId?: number) {
  return useQuery({ queryKey: ['fuelLogs', machineryId], queryFn: () => machineryApi.listFuelLogs(machineryId) });
}
