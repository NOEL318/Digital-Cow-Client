import { z } from 'zod';

export const dryOffCreateSchema = z.object({
  animalId: z.number().int().positive(),
  driedOffAt: z.string().min(1),
  lactationDays: z.number().int().nonnegative().optional(),
  notes: z.string().optional()
});

export type DryOffCreateInput = z.infer<typeof dryOffCreateSchema>;
