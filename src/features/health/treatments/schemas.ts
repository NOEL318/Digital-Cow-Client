/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo health/treatments.
 */
import { z } from 'zod';

const routeEnum = z.enum(['IM', 'SC', 'IV', 'ORAL', 'TOPICAL', 'INTRAMAMMARY']);

// Este esquema valida los datos para crear un registro de treatment.
export const treatmentCreateSchema = z.object({
  animalId: z.number().int().positive(),
  diagnosisId: z.number().int().positive().optional(),
  medicationId: z.number().int().positive(),
  startedAt: z.string().min(1),
  endedAt: z.string().optional(),
  dose: z.string().max(120).optional(),
  dosesCount: z.number().int().positive().optional(),
  route: routeEnum.optional(),
  cost: z.number().nonnegative().optional(),
  prescribedBy: z.string().max(160).optional(),
  vetVisitId: z.number().int().positive().optional(),
  notes: z.string().optional()
});

export type TreatmentCreateInput = z.infer<typeof treatmentCreateSchema>;
