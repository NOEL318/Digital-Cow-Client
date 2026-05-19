/**
 * Este archivo define los tipos typescript del modulo finance/incomes compartidos por la api, los formularios y los componentes.
 */
export type IncomeSourceType = 'MANUAL' | 'ANIMAL_SALE' | 'MILK_SALE' | 'BULK_TANK' | 'OTHER';

export interface Income {
  id: number;
  incomeCategoryId: number;
  incomeCategoryCode?: string;
  incomeCategoryNameEs?: string;
  incomeCategoryNameEn?: string;
  receivedAt: string;
  amount: number;
  currency: string;
  ranchId?: number | null;
  lotId?: number | null;
  animalId?: number | null;
  description?: string | null;
  payer?: string | null;
  invoiceNumber?: string | null;
  sourceType: IncomeSourceType;
  sourceId?: number | null;
  createdByUserId?: number | null;
  createdAt?: string;
}

export interface IncomeCreate {
  incomeCategoryId: number;
  receivedAt: string;
  amount: number;
  currency?: string;
  ranchId?: number;
  lotId?: number;
  animalId?: number;
  description?: string;
  payer?: string;
  invoiceNumber?: string;
}
