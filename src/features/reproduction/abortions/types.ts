/**
 * Este archivo define los tipos typescript del modulo reproduction/abortions compartidos por la api, los formularios y los componentes.
 */
export interface Abortion {
  id: number;
  animalId: number;
  abortedAt: string;
  estimatedGestationDays?: number | null;
  cause?: string | null;
  pregnancyCheckId?: number | null;
  notes?: string | null;
  createdByUserId?: number | null;
}

export interface AbortionCreate {
  animalId: number;
  abortedAt: string;
  estimatedGestationDays?: number;
  cause?: string;
  pregnancyCheckId?: number;
  notes?: string;
}
