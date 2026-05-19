/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo finance/categories.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de expenseCategory.
export const expenseCategoryCreateSchema = z.object({
  code: z.string().min(1).max(60),
  nameEs: z.string().min(1).max(160),
  nameEn: z.string().min(1).max(160),
  kind: z.enum(['FEED', 'HEALTH', 'LABOR', 'INFRASTRUCTURE', 'TRANSPORT', 'REPRODUCTION', 'OTHER']),
  notes: z.string().max(400).optional()
});

export type ExpenseCategoryCreateInput = z.infer<typeof expenseCategoryCreateSchema>;

// Este esquema valida los datos para crear un registro de incomeCategory.
export const incomeCategoryCreateSchema = z.object({
  code: z.string().min(1).max(60),
  nameEs: z.string().min(1).max(160),
  nameEn: z.string().min(1).max(160),
  kind: z.enum(['ANIMAL_SALE', 'MILK_SALE', 'BYPRODUCT', 'SERVICE', 'OTHER']),
  notes: z.string().max(400).optional()
});

export type IncomeCategoryCreateInput = z.infer<typeof incomeCategoryCreateSchema>;
