import { z } from 'zod';

export const pregnancyCheckCreateSchema = z.object({
  animalId: z.number().int().positive(),
  serviceId: z.number().int().positive().optional(),
  checkedAt: z.string().min(1),
  method: z.enum(['PALPATION', 'ULTRASOUND', 'BLOOD_TEST', 'MILK_TEST']).optional(),
  result: z.enum(['POSITIVE', 'NEGATIVE', 'DOUBTFUL']),
  estimatedGestationDays: z.number().int().min(1).max(300).optional(),
  vetVisitId: z.number().int().positive().optional(),
  notes: z.string().optional()
});

export type PregnancyCheckCreateInput = z.infer<typeof pregnancyCheckCreateSchema>;
