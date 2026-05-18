import { z } from 'zod';

export const calvingCreateSchema = z.object({
  animalId: z.number().int().positive(),
  calvedAt: z.string().min(1),
  ease: z.enum(['FREE', 'EASY', 'ASSISTED', 'DIFFICULT', 'SURGERY']).optional(),
  outcome: z.enum(['LIVE', 'STILLBORN', 'TWIN_LIVE', 'TWIN_MIXED', 'TWIN_STILLBORN']).optional(),
  calfSex: z.enum(['FEMALE', 'MALE']).optional(),
  calfBirthWeightKg: z.number().nonnegative().optional(),
  pregnancyCheckId: z.number().int().positive().optional(),
  notes: z.string().optional(),
  createCalfAnimal: z.boolean().optional(),
  calfInternalTag: z.string().max(60).optional(),
  calfRanchId: z.number().int().positive().optional(),
  calfLotId: z.number().int().positive().optional(),
  calfBreedId: z.number().int().positive().optional(),
  calfPurpose: z.enum(['BEEF', 'DAIRY', 'DUAL']).optional()
}).superRefine((d, ctx) => {
  if (d.createCalfAnimal) {
    if (!d.calfInternalTag) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['calfInternalTag'], message: 'required' });
    if (!d.calfRanchId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['calfRanchId'], message: 'required' });
    if (!d.calfBreedId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['calfBreedId'], message: 'required' });
    if (!d.calfPurpose) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['calfPurpose'], message: 'required' });
    if (!d.calfSex) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['calfSex'], message: 'required' });
  }
});

export type CalvingCreateInput = z.infer<typeof calvingCreateSchema>;
