import type { UserRole } from '@/features/auth/types';
export type UserStatus = 'ACTIVE' | 'INVITED' | 'DISABLED';

export interface TeamUser { id: number; email: string; fullName: string; role: UserRole; status: UserStatus; }
export interface Invitation { id: number; email: string; role: UserRole; expiresAt: string; acceptedAt: string | null; }
