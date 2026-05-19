/**
 * Este archivo define los tipos typescript del modulo health/treatments compartidos por la api, los formularios y los componentes.
 */
import type { MedicationRoute } from '@/features/catalog/types';

export interface Treatment {
  id: number;
  animalId: number;
  diagnosisId?: number | null;
  medicationId: number;
  medicationCode?: string;
  medicationNameEs?: string;
  medicationNameEn?: string;
  startedAt: string;
  endedAt?: string | null;
  dose?: string | null;
  dosesCount?: number | null;
  route?: MedicationRoute | null;
  withdrawalMilkUntil?: string | null;
  withdrawalMeatUntil?: string | null;
  cost?: number | null;
  prescribedBy?: string | null;
  vetVisitId?: number | null;
  notes?: string | null;
}

export interface TreatmentCreate {
  animalId: number;
  diagnosisId?: number;
  medicationId: number;
  startedAt: string;
  endedAt?: string;
  dose?: string;
  dosesCount?: number;
  route?: MedicationRoute;
  cost?: number;
  prescribedBy?: string;
  vetVisitId?: number;
  notes?: string;
}
