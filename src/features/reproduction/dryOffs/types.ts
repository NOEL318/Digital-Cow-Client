/**
 * Este archivo define los tipos typescript del modulo reproduction/dryOffs compartidos por la api, los formularios y los componentes.
 */
export interface DryOff {
  id: number;
  animalId: number;
  driedOffAt: string;
  lactationDays?: number | null;
  notes?: string | null;
  createdByUserId?: number | null;
}

export interface DryOffCreate {
  animalId: number;
  driedOffAt: string;
  lactationDays?: number;
  notes?: string;
}
