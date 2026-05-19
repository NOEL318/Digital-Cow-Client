/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo finance/animalSales.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de animalSale.
export const animalSaleCreateSchema = z.object({
  animalId: z.number().int().positive(),
  soldAt: z.string().min(1),
  liveWeightKg: z.number().positive().optional(),
  pricePerKg: z.number().positive().optional(),
  totalPrice: z.number().nonnegative(),
  currency: z.string().length(3).optional(),
  buyer: z.string().max(160).optional(),
  notes: z.string().optional()
});

export type AnimalSaleCreateInput = z.infer<typeof animalSaleCreateSchema>;
