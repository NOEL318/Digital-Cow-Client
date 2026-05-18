import { z } from 'zod';

export const bullCreateSchema = z.object({
  internalCode: z.string().min(1).max(60),
  name: z.string().min(1).max(160),
  breedId: z.number().int().positive().optional(),
  source: z.enum(['OWN', 'EXTERNAL']),
  animalId: z.number().int().positive().optional(),
  registryNumber: z.string().max(80).optional(),
  notes: z.string().optional()
});

export type BullCreateInput = z.infer<typeof bullCreateSchema>;
