/**
 * Este archivo define los tipos typescript del modulo feeding/records compartidos por la api, los formularios y los componentes.
 */
export interface FeedingRecord {
  id: number;
  lotId: number;
  feedItemId: number;
  consumedAt: string;
  totalKg: number;
  cost?: number | null;
  recordedByUserId?: number | null;
  notes?: string | null;
}

export interface FeedingRecordCreate {
  lotId: number;
  feedItemId: number;
  consumedAt: string;
  totalKg: number;
  cost?: number;
  notes?: string;
}
