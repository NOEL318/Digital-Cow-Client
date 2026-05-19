/**
 * Este archivo define los tipos typescript del modulo reproduction/bulls compartidos por la api, los formularios y los componentes.
 */
export type BullSource = 'OWN' | 'EXTERNAL';

export interface Bull {
  id: number;
  internalCode: string;
  name: string;
  breedId?: number | null;
  source: BullSource;
  animalId?: number | null;
  registryNumber?: string | null;
  notes?: string | null;
}

export interface BullCreate {
  internalCode: string;
  name: string;
  breedId?: number;
  source: BullSource;
  animalId?: number;
  registryNumber?: string;
  notes?: string;
}
