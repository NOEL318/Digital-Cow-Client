/**
 * Este archivo define los tipos typescript del modulo health/vaccinations compartidos por la api, los formularios y los componentes.
 */
import type { VaccineRoute } from '@/features/catalog/types';

export interface Vaccination {
  id: number;
  animalId?: number | null;
  lotId?: number | null;
  vaccineId: number;
  vaccineCode?: string;
  vaccineNameEs?: string;
  vaccineNameEn?: string;
  batchNumber?: string | null;
  appliedAt: string;
  doseMl?: number | null;
  route?: VaccineRoute | null;
  nextDoseDue?: string | null;
  cost?: number | null;
  vetVisitId?: number | null;
  notes?: string | null;
}

export interface VaccinationCreate {
  animalId: number;
  vaccineId: number;
  batchNumber?: string;
  appliedAt: string;
  doseMl?: number;
  route?: VaccineRoute;
  cost?: number;
  vetVisitId?: number;
  notes?: string;
}

export interface VaccinationBulkCreate {
  lotId: number;
  vaccineId: number;
  batchNumber?: string;
  appliedAt: string;
  doseMl?: number;
  route?: VaccineRoute;
  cost?: number;
  vetVisitId?: number;
  notes?: string;
}
