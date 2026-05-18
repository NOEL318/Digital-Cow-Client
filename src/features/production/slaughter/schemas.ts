import { z } from 'zod';

export const slaughterResultCreateSchema = z.object({
  animalId: z.number().int().positive(),
  slaughteredAt: z.string().min(1),
  liveWeightKg: z.number().positive().optional(),
  carcassWeightKg: z.number().positive().optional(),
  yieldPct: z.number().min(0).max(100).optional(),
  grade: z.string().max(40).optional(),
  buyer: z.string().max(160).optional(),
  notes: z.string().optional()
});

export type SlaughterResultCreateInput = z.infer<typeof slaughterResultCreateSchema>;
