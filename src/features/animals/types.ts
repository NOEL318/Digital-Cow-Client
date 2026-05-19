/**
 * Este archivo define los tipos typescript del modulo animals compartidos por la api, los formularios y los componentes.
 */
export type Sex = 'FEMALE' | 'MALE';
export type Purpose = 'BEEF' | 'DAIRY' | 'DUAL';
export type AnimalStatus = 'ACTIVE' | 'SOLD' | 'DEAD' | 'MISSING' | 'TRANSFERRED';

export interface AnimalListItem {
  id: number;
  internalTag: string;
  officialTag?: string | null;
  name?: string | null;
  breedId: number;
  sex: Sex;
  status: AnimalStatus;
  lotId?: number | null;
  coverPhotoId?: number | null;
  coverPhotoUrl?: string | null;
}

export interface AnimalResponse extends AnimalListItem {
  ranchId: number;
  rfid?: string | null;
  birthDate?: string | null;
  birthDateEstimated: boolean;
  purpose: Purpose;
  notes?: string | null;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page<T> { content: T[]; totalElements: number; totalPages: number; number: number; size: number; }
