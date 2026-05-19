/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo animals.
 */
import { z } from 'zod';

// Este esquema zod valida los datos de animal.
export const animalSchema = z.object({
  ranchId: z.coerce.number().int().positive(),
  lotId: z.coerce.number().int().positive().optional().nullable(),
  internalTag: z.string().min(1).max(40),
  officialTag: z.string().max(60).optional().nullable(),
  rfid: z.string().max(40).optional().nullable(),
  name: z.string().max(80).optional().nullable(),
  sex: z.enum(['FEMALE', 'MALE']),
  birthDate: z.string().optional().nullable(),
  birthDateEstimated: z.boolean().default(false),
  breedId: z.coerce.number().int().positive(),
  purpose: z.enum(['BEEF', 'DAIRY', 'DUAL']),
  status: z.enum(['ACTIVE', 'SOLD', 'DEAD', 'MISSING', 'TRANSFERRED']).default('ACTIVE'),
  notes: z.string().optional().nullable()
});
export type AnimalValues = z.infer<typeof animalSchema>;
