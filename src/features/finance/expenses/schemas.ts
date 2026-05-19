/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo finance/expenses.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de expense.
export const expenseCreateSchema = z.object({
  expenseCategoryId: z.number().int().positive(),
  incurredAt: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.string().length(3).optional(),
  ranchId: z.number().int().positive().optional(),
  lotId: z.number().int().positive().optional(),
  animalId: z.number().int().positive().optional(),
  description: z.string().max(400).optional(),
  vendor: z.string().max(160).optional(),
  invoiceNumber: z.string().max(80).optional()
});

export type ExpenseCreateInput = z.infer<typeof expenseCreateSchema>;
