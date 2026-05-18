import { z } from 'zod';

export const weighingCreateSchema = z.object({
  animalId: z.number().int().positive(),
  weighedAt: z.string().min(1),
  weightKg: z.number().positive(),
  method: z.enum(['SCALE', 'TAPE', 'VISUAL_ESTIMATE']).optional(),
  bodyConditionScore: z.number().min(1).max(5).optional(),
  notes: z.string().optional()
});

export type WeighingCreateInput = z.infer<typeof weighingCreateSchema>;
