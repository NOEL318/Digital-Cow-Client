export type PregnancyMethod = 'PALPATION' | 'ULTRASOUND' | 'BLOOD_TEST' | 'MILK_TEST';
export type PregnancyResult = 'POSITIVE' | 'NEGATIVE' | 'DOUBTFUL';

export interface PregnancyCheck {
  id: number;
  animalId: number;
  serviceId?: number | null;
  checkedAt: string;
  method?: PregnancyMethod | null;
  result: PregnancyResult;
  estimatedGestationDays?: number | null;
  estimatedCalvingDate?: string | null;
  vetVisitId?: number | null;
  checkedByUserId?: number | null;
  notes?: string | null;
}

export interface PregnancyCheckCreate {
  animalId: number;
  serviceId?: number;
  checkedAt: string;
  method?: PregnancyMethod;
  result: PregnancyResult;
  estimatedGestationDays?: number;
  vetVisitId?: number;
  notes?: string;
}
