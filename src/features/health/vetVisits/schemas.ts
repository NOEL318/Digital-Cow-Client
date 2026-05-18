import { z } from 'zod';

export const vetVisitCreateSchema = z.object({
  ranchId: z.number().int().positive(),
  visitedAt: z.string().min(1),
  vetName: z.string().min(1).max(160),
  vetContact: z.string().max(160).optional(),
  reason: z.string().min(1).max(300),
  totalCost: z.number().nonnegative().optional(),
  notes: z.string().optional()
});

export type VetVisitCreateInput = z.infer<typeof vetVisitCreateSchema>;
