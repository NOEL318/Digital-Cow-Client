export interface Weaning {
  id: number;
  animalId: number;
  weanedAt: string;
  weightKg?: number | null;
  notes?: string | null;
  createdByUserId?: number | null;
}

export interface WeaningCreate {
  animalId: number;
  weanedAt: string;
  weightKg?: number;
  notes?: string;
}
