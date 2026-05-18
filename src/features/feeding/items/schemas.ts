import { z } from 'zod';

export const feedItemCreateSchema = z.object({
  code: z.string().min(1).max(60),
  nameEs: z.string().min(1).max(160),
  nameEn: z.string().min(1).max(160),
  category: z.enum(['FORAGE', 'SILAGE', 'CONCENTRATE', 'MINERAL', 'BYPRODUCT', 'OTHER']),
  dryMatterPct: z.number().min(0).max(100).optional(),
  proteinPct: z.number().min(0).max(100).optional(),
  energyMcalKg: z.number().min(0).optional(),
  unitCost: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  notes: z.string().max(400).optional()
});

export type FeedItemCreateInput = z.infer<typeof feedItemCreateSchema>;
