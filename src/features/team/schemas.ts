import { z } from 'zod';

export const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'WORKER', 'VIEWER'])
});
export type InviteValues = z.infer<typeof inviteSchema>;
