/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo production/bulkTank.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de bulkTankDelivery.
export const bulkTankDeliveryCreateSchema = z.object({
  ranchId: z.number().int().positive(),
  deliveryDate: z.string().min(1),
  totalLiters: z.number().positive(),
  buyer: z.string().max(160).optional(),
  notes: z.string().optional()
});

export type BulkTankDeliveryCreateInput = z.infer<typeof bulkTankDeliveryCreateSchema>;
