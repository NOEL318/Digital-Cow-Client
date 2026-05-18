import { z } from 'zod';

export const feedingRecordCreateSchema = z.object({
  lotId: z.number().int().positive(),
  feedItemId: z.number().int().positive(),
  consumedAt: z.string().min(1),
  totalKg: z.number().positive(),
  cost: z.number().min(0).optional(),
  notes: z.string().max(300).optional()
});

export type FeedingRecordCreateInput = z.infer<typeof feedingRecordCreateSchema>;
