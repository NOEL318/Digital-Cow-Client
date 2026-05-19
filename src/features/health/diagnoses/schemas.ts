/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo health/diagnoses.
 */
import { z } from 'zod';

const severityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
const statusEnum = z.enum(['ACTIVE', 'RECOVERED', 'CHRONIC', 'DECEASED']);

// Este esquema valida los datos para crear un registro de diagnosis.
export const diagnosisCreateSchema = z.object({
  animalId: z.number().int().positive(),
  diseaseId: z.number().int().positive(),
  diagnosedAt: z.string().min(1),
  severity: severityEnum.optional(),
  symptoms: z.string().max(500).optional(),
  status: statusEnum.optional(),
  vetVisitId: z.number().int().positive().optional(),
  notes: z.string().optional()
});

export type DiagnosisCreateInput = z.infer<typeof diagnosisCreateSchema>;
