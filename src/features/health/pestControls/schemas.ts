/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo health/pestControls.
 */
import { z } from 'zod';

// Este esquema valida los datos para crear un registro de pestControl.
export const pestControlCreateSchema = z
  .object({
    ranchId: z.number().int().positive().optional(),
    lotId: z.number().int().positive().optional(),
    pestId: z.number().int().positive(),
    productUsed: z.string().min(1).max(200),
    dose: z.string().max(120).optional(),
    appliedAt: z.string().min(1),
    nextApplicationAt: z.string().optional(),
    cost: z.number().nonnegative().optional(),
    notes: z.string().optional()
  })
  .refine((v) => v.ranchId !== undefined || v.lotId !== undefined, {
    message: 'ranchId or lotId required',
    path: ['ranchId']
  });

export type PestControlCreateInput = z.infer<typeof pestControlCreateSchema>;
