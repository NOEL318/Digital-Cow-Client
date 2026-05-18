import { z } from 'zod';

export const expenseCategoryCreateSchema = z.object({
  code: z.string().min(1).max(60),
  nameEs: z.string().min(1).max(160),
  nameEn: z.string().min(1).max(160),
  kind: z.enum(['FEED', 'HEALTH', 'LABOR', 'INFRASTRUCTURE', 'TRANSPORT', 'REPRODUCTION', 'OTHER']),
  notes: z.string().max(400).optional()
});

export type ExpenseCategoryCreateInput = z.infer<typeof expenseCategoryCreateSchema>;

export const incomeCategoryCreateSchema = z.object({
  code: z.string().min(1).max(60),
  nameEs: z.string().min(1).max(160),
  nameEn: z.string().min(1).max(160),
  kind: z.enum(['ANIMAL_SALE', 'MILK_SALE', 'BYPRODUCT', 'SERVICE', 'OTHER']),
  notes: z.string().max(400).optional()
});

export type IncomeCategoryCreateInput = z.infer<typeof incomeCategoryCreateSchema>;
