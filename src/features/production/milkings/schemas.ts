/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo production/milkings.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de milking.
export const milkingCreateSchema = z.object({
  animalId: z.number().int().positive(),
  milkingDate: z.string().min(1),
  session: z.enum(['TOTAL', 'AM', 'PM']),
  liters: z.number().positive(),
  notes: z.string().optional()
});

export type MilkingCreateInput = z.infer<typeof milkingCreateSchema>;
