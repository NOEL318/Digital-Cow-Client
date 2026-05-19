/**
 * Este archivo define los esquemas de validacion zod para los formularios del modulo team.
 */
import { z } from 'zod';

// Este esquema zod valida los datos de invite.
export const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'WORKER', 'VIEWER'])
});
export type InviteValues = z.infer<typeof inviteSchema>;
