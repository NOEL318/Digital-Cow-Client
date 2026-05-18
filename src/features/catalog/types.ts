/**
 * Tipos del catalogo sanitario, alineados con DTOs del backend.
 */
export type VaccineRoute = 'IM' | 'SC' | 'ORAL' | 'INTRANASAL' | 'TOPICAL';

export interface Vaccine {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  targetDiseases?: string | null;
  defaultDoseMl?: number | null;
  route?: VaccineRoute | null;
  recommendedAgeMonths?: number | null;
  recommendedFrequencyMonths?: number | null;
}

export type DiseaseCategory =
  | 'BACTERIAL'
  | 'VIRAL'
  | 'PARASITIC'
  | 'METABOLIC'
  | 'NUTRITIONAL'
  | 'MECHANICAL'
  | 'OTHER';
export type DiseaseSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Disease {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  category: DiseaseCategory;
  zoonotic: boolean;
  severity: DiseaseSeverity;
  defaultSymptoms?: string | null;
}

export type MedicationRoute = 'IM' | 'SC' | 'IV' | 'ORAL' | 'TOPICAL' | 'INTRAMAMMARY';

export type MedicationCategory =
  | 'VACCINE'
  | 'ANTIBIOTIC'
  | 'ANTIPARASITIC'
  | 'HORMONE'
  | 'VITAMIN'
  | 'ANTIINFLAMMATORY'
  | 'OTHER';

export interface Medication {
  id: number;
  accountId?: number | null;
  code: string;
  nameEs: string;
  nameEn: string;
  activeIngredient?: string | null;
  manufacturer?: string | null;
  presentation?: string | null;
  barcode?: string | null;
  expiresAt?: string | null;
  category: MedicationCategory;
  defaultDose?: string | null;
  defaultRoute?: MedicationRoute | null;
  withdrawalMilkDays: number;
  withdrawalMeatDays: number;
  notes?: string | null;
}

export interface MedicationUpsertRequest {
  code?: string;
  nameEs: string;
  nameEn?: string;
  activeIngredient?: string | null;
  manufacturer?: string | null;
  presentation?: string | null;
  barcode?: string | null;
  expiresAt?: string | null;
  category?: MedicationCategory;
  defaultDose?: string | null;
  defaultRoute?: MedicationRoute | null;
  withdrawalMilkDays?: number | null;
  withdrawalMeatDays?: number | null;
  notes?: string | null;
}

export type PestType = 'TICK' | 'FLY' | 'WORM' | 'LICE' | 'MITE' | 'OTHER';
export type PestRegion = 'TROPICAL' | 'TEMPERATE' | 'ANY';

export interface Pest {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  scientificName?: string | null;
  type: PestType;
  region: PestRegion;
  notes?: string | null;
}
