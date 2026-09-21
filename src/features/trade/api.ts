/**
 * API cliente y hooks para Comercio Agropecuario (Ventas de Ganado/Cosechas, Compras de Insumos y Almacén).
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { ServerlessTrade, ServerlessSupplyItem, ServerlessSupplyMovement } from '@/serverless/types';

export interface CreateTradePayload {
  ranchId: number;
  type: ServerlessTrade['type'];
  tradeDate: string;
  entityName: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount?: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  invoiceNumber?: string;
  weightScaleKg?: number;
  shrinkagePercentage?: number;
  notes?: string;
}

export interface CreateSupplyMovementPayload {
  supplyItemId: number;
  movementDate: string;
  type: ServerlessSupplyMovement['type'];
  quantity: number;
  unitCost: number;
  notes?: string;
}

export const tradeApi = {
  listTrades: (ranchId?: number, type?: string) => {
    const params = new URLSearchParams();
    if (ranchId) params.set('ranchId', String(ranchId));
    if (type) params.set('type', type);
    const q = params.toString() ? `?${params.toString()}` : '';
    return http.get<ServerlessTrade[]>(`/trades${q}`).then(r => r.data);
  },
  createTrade: (payload: CreateTradePayload) => http.post<ServerlessTrade>('/trades', payload).then(r => r.data),
  deleteTrade: (id: number) => http.delete(`/trades/${id}`),

  listSupplies: () => http.get<ServerlessSupplyItem[]>('/supplies').then(r => r.data),
  createSupplyMovement: (supplyId: number, payload: CreateSupplyMovementPayload) =>
    http.post<ServerlessSupplyMovement>(`/supplies/${supplyId}/movements`, payload).then(r => r.data),
  listSupplyMovements: () => http.get<ServerlessSupplyMovement[]>('/supplies/movements').then(r => r.data)
};

export function useTrades(ranchId?: number, type?: string) {
  return useQuery({ queryKey: ['trades', ranchId, type], queryFn: () => tradeApi.listTrades(ranchId, type) });
}

export function useSupplies() {
  return useQuery({ queryKey: ['supplies'], queryFn: tradeApi.listSupplies });
}

export function useSupplyMovements() {
  return useQuery({ queryKey: ['supplyMovements'], queryFn: tradeApi.listSupplyMovements });
}
