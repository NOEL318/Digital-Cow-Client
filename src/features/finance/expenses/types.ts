/**
 * Este archivo define los tipos typescript del modulo finance/expenses compartidos por la api, los formularios y los componentes.
 */
export interface Expense {
  id: number;
  expenseCategoryId: number;
  expenseCategoryCode?: string;
  expenseCategoryNameEs?: string;
  expenseCategoryNameEn?: string;
  incurredAt: string;
  amount: number;
  currency: string;
  ranchId?: number | null;
  lotId?: number | null;
  animalId?: number | null;
  description?: string | null;
  vendor?: string | null;
  invoiceNumber?: string | null;
  createdByUserId?: number | null;
  createdAt?: string;
}

export interface ExpenseCreate {
  expenseCategoryId: number;
  incurredAt: string;
  amount: number;
  currency?: string;
  ranchId?: number;
  lotId?: number;
  animalId?: number;
  description?: string;
  vendor?: string;
  invoiceNumber?: string;
}
