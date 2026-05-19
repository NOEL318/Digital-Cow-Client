/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo feeding/records.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de feedingRecord.
export const feedingRecordCreateSchema = z.object({
  lotId: z.number().int().positive(),
  feedItemId: z.number().int().positive(),
  consumedAt: z.string().min(1),
  totalKg: z.number().positive(),
  cost: z.number().min(0).optional(),
  notes: z.string().max(300).optional()
});

export type FeedingRecordCreateInput = z.infer<typeof feedingRecordCreateSchema>;
