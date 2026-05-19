/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo reproduction/weanings.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de weaning.
export const weaningCreateSchema = z.object({
  animalId: z.number().int().positive(),
  weanedAt: z.string().min(1),
  weightKg: z.number().nonnegative().optional(),
  notes: z.string().optional()
});

export type WeaningCreateInput = z.infer<typeof weaningCreateSchema>;
