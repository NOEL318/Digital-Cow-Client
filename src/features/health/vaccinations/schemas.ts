import { z } from 'zod';

const routeEnum = z.enum(['IM', 'SC', 'ORAL', 'INTRANASAL', 'TOPICAL']);

export const vaccinationCreateSchema = z.object({
  animalId: z.number().int().positive(),
  vaccineId: z.number().int().positive(),
  batchNumber: z.string().max(80).optional(),
  appliedAt: z.string().min(1),
  doseMl: z.number().nonnegative().optional(),
  route: routeEnum.optional(),
  cost: z.number().nonnegative().optional(),
  vetVisitId: z.number().int().positive().optional(),
  notes: z.string().optional()
});

export type VaccinationCreateInput = z.infer<typeof vaccinationCreateSchema>;

export const vaccinationBulkCreateSchema = z.object({
  lotId: z.number().int().positive(),
  vaccineId: z.number().int().positive(),
  batchNumber: z.string().max(80).optional(),
  appliedAt: z.string().min(1),
  doseMl: z.number().nonnegative().optional(),
  route: routeEnum.optional(),
  cost: z.number().nonnegative().optional(),
  vetVisitId: z.number().int().positive().optional(),
  notes: z.string().optional()
});

export type VaccinationBulkCreateInput = z.infer<typeof vaccinationBulkCreateSchema>;
