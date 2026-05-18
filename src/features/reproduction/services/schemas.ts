import { z } from 'zod';

export const serviceEventCreateSchema = z.object({
  animalId: z.number().int().positive(),
  serviceType: z.enum(['AI', 'NATURAL', 'EMBRYO_TRANSFER']),
  serviceDate: z.string().min(1),
  bullId: z.number().int().positive().optional(),
  semenStrawId: z.number().int().positive().optional(),
  technicianName: z.string().max(160).optional(),
  heatId: z.number().int().positive().optional(),
  cost: z.number().nonnegative().optional(),
  notes: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.serviceType === 'AI' && !data.semenStrawId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['semenStrawId'], message: 'required' });
  }
  if ((data.serviceType === 'AI' || data.serviceType === 'NATURAL') && !data.bullId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['bullId'], message: 'required' });
  }
});

export type ServiceEventCreateInput = z.infer<typeof serviceEventCreateSchema>;
