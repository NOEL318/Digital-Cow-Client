/**
 * Este archivo define los tipos typescript del modulo finance/categories compartidos por la api, los formularios y los componentes.
 */
export type ExpenseKind =
  | 'FEED'
  | 'HEALTH'
  | 'LABOR'
  | 'INFRASTRUCTURE'
  | 'TRANSPORT'
  | 'REPRODUCTION'
  | 'OTHER';

export type IncomeKind =
  | 'ANIMAL_SALE'
  | 'MILK_SALE'
  | 'BYPRODUCT'
  | 'SERVICE'
  | 'OTHER';

export interface ExpenseCategory {
  id: number;
  accountId: number | null;
  code: string;
  nameEs: string;
  nameEn: string;
  kind: ExpenseKind;
  notes?: string | null;
  isGlobal?: boolean;
}

export interface ExpenseCategoryCreate {
  code: string;
  nameEs: string;
  nameEn: string;
  kind: ExpenseKind;
  notes?: string;
}

export interface IncomeCategory {
  id: number;
  accountId: number | null;
  code: string;
  nameEs: string;
  nameEn: string;
  kind: IncomeKind;
  notes?: string | null;
  isGlobal?: boolean;
}

export interface IncomeCategoryCreate {
  code: string;
  nameEs: string;
  nameEn: string;
  kind: IncomeKind;
  notes?: string;
}
