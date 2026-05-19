/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo production/milkSamples.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de milkSample.
export const milkSampleCreateSchema = z.object({
  animalId: z.number().int().positive(),
  sampledAt: z.string().min(1),
  sccCellsPerMl: z.number().int().nonnegative().optional(),
  fatPct: z.number().min(0).max(99).optional(),
  proteinPct: z.number().min(0).max(99).optional(),
  lactosePct: z.number().min(0).max(99).optional(),
  notes: z.string().optional()
});

export type MilkSampleCreateInput = z.infer<typeof milkSampleCreateSchema>;
