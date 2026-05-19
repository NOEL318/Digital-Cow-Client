/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo production/weighings.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de weighing.
export const weighingCreateSchema = z.object({
  animalId: z.number().int().positive(),
  weighedAt: z.string().min(1),
  weightKg: z.number().positive(),
  method: z.enum(['SCALE', 'TAPE', 'VISUAL_ESTIMATE']).optional(),
  bodyConditionScore: z.number().min(1).max(5).optional(),
  notes: z.string().optional()
});

export type WeighingCreateInput = z.infer<typeof weighingCreateSchema>;
