/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo finance/milkSales.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de milkSale.
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
