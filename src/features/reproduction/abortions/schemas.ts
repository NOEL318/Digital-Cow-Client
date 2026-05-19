/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo reproduction/abortions.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de abortion.
export const abortionCreateSchema = z.object({
  animalId: z.number().int().positive(),
  abortedAt: z.string().min(1),
  estimatedGestationDays: z.number().int().nonnegative().optional(),
  cause: z.string().max(300).optional(),
  pregnancyCheckId: z.number().int().positive().optional(),
  notes: z.string().optional()
});

export type AbortionCreateInput = z.infer<typeof abortionCreateSchema>;
