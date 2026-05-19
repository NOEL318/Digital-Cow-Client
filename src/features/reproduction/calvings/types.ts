/**
 * Este archivo define los tipos typescript del modulo reproduction/calvings compartidos por la api, los formularios y los componentes.
 */
export type CalvingEase = 'FREE' | 'EASY' | 'ASSISTED' | 'DIFFICULT' | 'SURGERY';
export type CalvingOutcome = 'LIVE' | 'STILLBORN' | 'TWIN_LIVE' | 'TWIN_MIXED' | 'TWIN_STILLBORN';
export type CalfSex = 'FEMALE' | 'MALE';
export type CalfPurpose = 'BEEF' | 'DAIRY' | 'DUAL';

export interface Calving {
  id: number;
  animalId: number;
  calvedAt: string;
  ease: CalvingEase;
  outcome: CalvingOutcome;
  calfAnimalId?: number | null;
  calfSex?: CalfSex | null;
  calfBirthWeightKg?: number | null;
  pregnancyCheckId?: number | null;
  notes?: string | null;
  createdByUserId?: number | null;
}

export interface CalvingCreate {
  animalId: number;
  calvedAt: string;
  ease?: CalvingEase;
  outcome?: CalvingOutcome;
  calfSex?: CalfSex;
  calfBirthWeightKg?: number;
  pregnancyCheckId?: number;
  notes?: string;
  createCalfAnimal?: boolean;
  calfInternalTag?: string;
  calfRanchId?: number;
  calfLotId?: number;
  calfBreedId?: number;
  calfPurpose?: CalfPurpose;
}
