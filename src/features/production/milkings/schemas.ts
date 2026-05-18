import { z } from 'zod';

export const milkingCreateSchema = z.object({
  animalId: z.number().int().positive(),
  milkingDate: z.string().min(1),
  session: z.enum(['TOTAL', 'AM', 'PM']),
  liters: z.number().positive(),
  notes: z.string().optional()
});

export type MilkingCreateInput = z.infer<typeof milkingCreateSchema>;
