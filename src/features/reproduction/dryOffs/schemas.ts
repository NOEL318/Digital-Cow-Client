/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo reproduction/dryOffs.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de dryOff.
export const dryOffCreateSchema = z.object({
  animalId: z.number().int().positive(),
  driedOffAt: z.string().min(1),
  lactationDays: z.number().int().nonnegative().optional(),
  notes: z.string().optional()
});

export type DryOffCreateInput = z.infer<typeof dryOffCreateSchema>;
