/**
 * Este archivo define los tipos typescript del modulo production/milkings compartidos por la api, los formularios y los componentes.
 */
export type MilkingSession = 'TOTAL' | 'AM' | 'PM';

export interface Milking {
  id: number;
  animalId: number;
  milkingDate: string;
  session: MilkingSession;
  liters: number;
  recordedByUserId?: number | null;
  notes?: string | null;
}

export interface MilkingCreate {
  animalId: number;
  milkingDate: string;
  session: MilkingSession;
  liters: number;
  notes?: string;
}

export interface MilkingBulkAnimal {
  animalId: number;
  liters: number;
}

export interface MilkingBulkCreate {
  milkingDate: string;
  session: MilkingSession;
  animals: MilkingBulkAnimal[];
}
