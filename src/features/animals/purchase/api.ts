/**
 * Este archivo contiene la api cliente del modulo animals/purchase, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { AnimalResponse } from '../types';

export interface AnimalPurchaseRequest {
  animal: {
    ranchId: number;
    lotId?: number | null;
    internalTag: string;
    officialTag?: string | null;
    rfid?: string | null;
    name?: string | null;
    sex: 'FEMALE' | 'MALE';
    birthDate?: string | null;
    birthDateEstimated?: boolean;
    breedId: number;
    purpose: 'BEEF' | 'DAIRY' | 'DUAL';
    notes?: string | null;
  };
  purchasedAt?: string;
  purchasePrice?: number;
  purchaseCurrency?: string;
  seller?: string;
  expenseCategoryId?: number | null;
  notes?: string;
}

export interface AnimalPurchaseResponse {
  animal: AnimalResponse;
  expense: {
    id: number;
    amount: number;
    incurredAt: string;
  } | null;
}

/**
 * Hook que llama al endpoint atomico POST /api/v1/animals/with-purchase.
 * Crea el animal y, si purchasePrice viene presente, registra el gasto
 * en la misma transaccion del backend.
 */
export function useCreateAnimalWithPurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: AnimalPurchaseRequest) => {
      const { data } = await http.post<AnimalPurchaseResponse>('/animals/with-purchase', body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['animals'] });
      qc.invalidateQueries({ queryKey: ['finance', 'expenses'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
}
