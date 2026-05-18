import { z } from 'zod';

const purposeEnum = z.enum(['BEEF', 'DAIRY', 'DUAL', 'ANY']);
const sexEnum = z.enum(['FEMALE', 'MALE', 'ANY']);

export const healthPlanCreateSchema = z.object({
  name: z.string().min(1).max(160),
  description: z.string().max(500).optional(),
  appliesToPurpose: purposeEnum,
  appliesToSex: sexEnum
});

export type HealthPlanCreateInput = z.infer<typeof healthPlanCreateSchema>;

export const healthPlanStepCreateSchema = z.object({
  stepOrder: z.number().int().positive(),
  name: z.string().min(1).max(160),
  vaccineId: z.number().int().positive().optional(),
  ageMonthsMin: z.number().int().nonnegative().optional(),
  recurrenceMonths: z.number().int().positive().optional(),
  notes: z.string().max(400).optional()
});

export type HealthPlanStepCreateInput = z.infer<typeof healthPlanStepCreateSchema>;
