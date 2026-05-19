/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo feeding/plans.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de feedingPlan.
export const feedingPlanCreateSchema = z.object({
  name: z.string().min(1).max(160),
  category: z.enum(['DAIRY_LACTATION', 'DAIRY_DRY', 'BEEF_GROWING', 'BEEF_FINISHING', 'CALF', 'OTHER']),
  description: z.string().max(500).optional()
});
export type FeedingPlanCreateInput = z.infer<typeof feedingPlanCreateSchema>;

// Este esquema valida los datos para crear un registro de feedingPlanItem.
export const feedingPlanItemCreateSchema = z.object({
  feedItemId: z.number().int().positive(),
  kgPerHeadDay: z.number().positive(),
  notes: z.string().max(200).optional()
});
export type FeedingPlanItemCreateInput = z.infer<typeof feedingPlanItemCreateSchema>;
