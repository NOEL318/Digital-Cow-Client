import { z } from 'zod';

export const weaningCreateSchema = z.object({
  animalId: z.number().int().positive(),
  weanedAt: z.string().min(1),
  weightKg: z.number().nonnegative().optional(),
  notes: z.string().optional()
});

export type WeaningCreateInput = z.infer<typeof weaningCreateSchema>;
