import { z } from 'zod';

export const heatCreateSchema = z.object({
  animalId: z.number().int().positive(),
  detectedAt: z.string().min(1),
  detectionMethod: z.enum(['VISUAL', 'PEDOMETER', 'HEAT_PATCH', 'CAMERA', 'OTHER']).optional(),
  intensity: z.enum(['WEAK', 'MODERATE', 'STRONG']).optional(),
  notes: z.string().optional()
});

export type HeatCreateInput = z.infer<typeof heatCreateSchema>;
