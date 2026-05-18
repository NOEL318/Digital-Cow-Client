import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface InventoryRow {
  id: number;
  internalTag: string;
  breed?: string;
  sex: string;
  purpose: string;
  ageDays?: number | null;
  currentLot?: string | null;
  currentRanch?: string | null;
  lastWeightKg?: number | null;
}

export interface InventoryReport {
  generatedAt: string;
  totalAnimals: number;
  rows: InventoryRow[];
}

/** Consume /reports/inventory. */
export function useInventoryReport() {
  return useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: async () => (await http.get<InventoryReport>('/reports/inventory')).data
  });
}
