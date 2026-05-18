import { z } from 'zod';

export const milkSampleCreateSchema = z.object({
  animalId: z.number().int().positive(),
  sampledAt: z.string().min(1),
  sccCellsPerMl: z.number().int().nonnegative().optional(),
  fatPct: z.number().min(0).max(99).optional(),
  proteinPct: z.number().min(0).max(99).optional(),
  lactosePct: z.number().min(0).max(99).optional(),
  notes: z.string().optional()
});

export type MilkSampleCreateInput = z.infer<typeof milkSampleCreateSchema>;
