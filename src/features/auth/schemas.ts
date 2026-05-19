/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo auth.
 */
import { z } from 'zod';

// Este esquema zod valida los datos de login.
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
export type LoginValues = z.infer<typeof loginSchema>;

// Este esquema zod valida los datos de register.
export const registerSchema = z.object({
  accountName: z.string().min(1).max(120),
  fullName: z.string().min(1).max(160),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  locale: z.enum(['es', 'en'])
});
export type RegisterValues = z.infer<typeof registerSchema>;
