/**
 * Este archivo define los tipos typescript del modulo reproduction/weanings compartidos por la api, los formularios y los componentes.
 */
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
