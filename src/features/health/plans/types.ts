export type PlanPurpose = 'BEEF' | 'DAIRY' | 'DUAL' | 'ANY';
export type PlanSex = 'FEMALE' | 'MALE' | 'ANY';

export interface HealthPlan {
  id: number;
  accountId: number | null;
  name: string;
  description?: string | null;
  appliesToPurpose: PlanPurpose;
  appliesToSex: PlanSex;
  isGlobal?: boolean;
}

export interface HealthPlanStep {
  id: number;
  healthPlanId: number;
  stepOrder: number;
  name: string;
  vaccineId?: number | null;
  ageMonthsMin?: number | null;
  recurrenceMonths?: number | null;
  notes?: string | null;
}

export interface HealthPlanCreate {
  name: string;
  description?: string;
  appliesToPurpose: PlanPurpose;
  appliesToSex: PlanSex;
}

export interface HealthPlanStepCreate {
  stepOrder: number;
  name: string;
  vaccineId?: number;
  ageMonthsMin?: number;
  recurrenceMonths?: number;
  notes?: string;
}

export interface AnimalHealthPlan {
  id: number;
  healthPlanId: number;
  animalId?: number | null;
  lotId?: number | null;
  assignedAt: string;
}

export interface PlanAssignBody {
  animalIds?: number[];
  lotIds?: number[];
}
