export type WeighingMethod = 'SCALE' | 'TAPE' | 'VISUAL_ESTIMATE';

export interface Weighing {
  id: number;
  animalId: number;
  weighedAt: string;
  weightKg: number;
  method?: WeighingMethod | null;
  bodyConditionScore?: number | null;
  weighedByUserId?: number | null;
  notes?: string | null;
}

export interface WeighingCreate {
  animalId: number;
  weighedAt: string;
  weightKg: number;
  method?: WeighingMethod;
  bodyConditionScore?: number;
  notes?: string;
}
