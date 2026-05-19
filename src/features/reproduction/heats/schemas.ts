/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo reproduction/heats.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de heat.
export const heatCreateSchema = z.object({
  animalId: z.number().int().positive(),
  detectedAt: z.string().min(1),
  detectionMethod: z.enum(['VISUAL', 'PEDOMETER', 'HEAT_PATCH', 'CAMERA', 'OTHER']).optional(),
  intensity: z.enum(['WEAK', 'MODERATE', 'STRONG']).optional(),
  notes: z.string().optional()
});

export type HeatCreateInput = z.infer<typeof heatCreateSchema>;
