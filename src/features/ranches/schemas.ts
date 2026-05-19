/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo ranches.
 */
import { z } from 'zod';

// Este esquema zod valida los datos de ranch.
export const ranchSchema = z.object({
  name: z.string().min(1).max(120),
  location: z.string().max(200).optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  areaHectares: z.coerce.number().optional().nullable(),
  notes: z.string().optional().nullable()
});
export type RanchValues = z.infer<typeof ranchSchema>;

// Este esquema zod valida los datos de lot.
export const lotSchema = z.object({
  name: z.string().min(1).max(120),
  areaHectares: z.coerce.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  polygon: z.string().optional().nullable(),
  centerLat: z.coerce.number().min(-90).max(90).optional().nullable(),
  centerLng: z.coerce.number().min(-180).max(180).optional().nullable()
});
export type LotValues = z.infer<typeof lotSchema>;
