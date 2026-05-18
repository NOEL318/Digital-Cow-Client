import { z } from 'zod';

export const semenStrawCreateSchema = z.object({
  bullId: z.number().int().positive(),
  provider: z.string().max(160).optional(),
  batchNumber: z.string().max(80).optional(),
  totalQuantity: z.number().int().nonnegative(),
  availableQuantity: z.number().int().nonnegative(),
  receivedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  costPerStraw: z.number().nonnegative().optional(),
  storageLocation: z.string().max(120).optional(),
  notes: z.string().optional()
});

export type SemenStrawCreateInput = z.infer<typeof semenStrawCreateSchema>;
