import { z } from 'zod';

export const abortionCreateSchema = z.object({
  animalId: z.number().int().positive(),
  abortedAt: z.string().min(1),
  estimatedGestationDays: z.number().int().nonnegative().optional(),
  cause: z.string().max(300).optional(),
  pregnancyCheckId: z.number().int().positive().optional(),
  notes: z.string().optional()
});

export type AbortionCreateInput = z.infer<typeof abortionCreateSchema>;
