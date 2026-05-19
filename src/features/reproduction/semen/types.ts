/**
 * Este archivo define los tipos typescript del modulo reproduction/semen compartidos por la api, los formularios y los componentes.
 */
export interface SemenStraw {
  id: number;
  bullId: number;
  provider?: string | null;
  batchNumber?: string | null;
  totalQuantity: number;
  availableQuantity: number;
  receivedAt?: string | null;
  expiresAt?: string | null;
  costPerStraw?: number | null;
  storageLocation?: string | null;
  notes?: string | null;
}

export interface SemenStrawCreate {
  bullId: number;
  provider?: string;
  batchNumber?: string;
  totalQuantity: number;
  availableQuantity: number;
  receivedAt?: string;
  expiresAt?: string;
  costPerStraw?: number;
  storageLocation?: string;
  notes?: string;
}
