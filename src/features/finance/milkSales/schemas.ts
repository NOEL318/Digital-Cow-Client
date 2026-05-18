import { z } from 'zod';

export const milkSaleCreateSchema = z.object({
  saleDate: z.string().min(1),
  totalLiters: z.number().positive(),
  pricePerLiter: z.number().positive(),
  totalPrice: z.number().nonnegative(),
  currency: z.string().length(3).optional(),
  buyer: z.string().max(160).optional(),
  bulkTankDeliveryId: z.number().int().positive().optional(),
  ranchId: z.number().int().positive().optional(),
  notes: z.string().optional()
});

export type MilkSaleCreateInput = z.infer<typeof milkSaleCreateSchema>;
