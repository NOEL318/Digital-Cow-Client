import { z } from 'zod';

export const bulkTankDeliveryCreateSchema = z.object({
  ranchId: z.number().int().positive(),
  deliveryDate: z.string().min(1),
  totalLiters: z.number().positive(),
  buyer: z.string().max(160).optional(),
  notes: z.string().optional()
});

export type BulkTankDeliveryCreateInput = z.infer<typeof bulkTankDeliveryCreateSchema>;
