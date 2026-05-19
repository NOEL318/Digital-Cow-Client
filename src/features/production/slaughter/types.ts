/**
 * Este archivo define los tipos typescript del modulo production/slaughter compartidos por la api, los formularios y los componentes.
 */
export interface SlaughterResult {
  id: number;
  animalId: number;
  slaughteredAt: string;
  liveWeightKg?: number | null;
  carcassWeightKg?: number | null;
  yieldPct?: number | null;
  grade?: string | null;
  buyer?: string | null;
  notes?: string | null;
  createdByUserId?: number | null;
}

export interface SlaughterResultCreate {
  animalId: number;
  slaughteredAt: string;
  liveWeightKg?: number;
  carcassWeightKg?: number;
  yieldPct?: number;
  grade?: string;
  buyer?: string;
  notes?: string;
}
