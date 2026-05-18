import { z } from 'zod';

export const incomeCreateSchema = z.object({
  incomeCategoryId: z.number().int().positive(),
  receivedAt: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.string().length(3).optional(),
  ranchId: z.number().int().positive().optional(),
  lotId: z.number().int().positive().optional(),
  animalId: z.number().int().positive().optional(),
  description: z.string().max(400).optional(),
  payer: z.string().max(160).optional(),
  invoiceNumber: z.string().max(80).optional()
});

export type IncomeCreateInput = z.infer<typeof incomeCreateSchema>;
