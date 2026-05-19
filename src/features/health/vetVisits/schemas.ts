/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo health/vetVisits.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de vetVisit.
export const vetVisitCreateSchema = z.object({
  ranchId: z.number().int().positive(),
  visitedAt: z.string().min(1),
  vetName: z.string().min(1).max(160),
  vetContact: z.string().max(160).optional(),
  reason: z.string().min(1).max(300),
  totalCost: z.number().nonnegative().optional(),
  notes: z.string().optional()
});

export type VetVisitCreateInput = z.infer<typeof vetVisitCreateSchema>;
