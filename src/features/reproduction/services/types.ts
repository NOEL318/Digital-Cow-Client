/**
 * Este archivo define los tipos typescript del modulo reproduction/services compartidos por la api, los formularios y los componentes.
 */
export type ServiceType = 'AI' | 'NATURAL' | 'EMBRYO_TRANSFER';

export interface ServiceEvent {
  id: number;
  animalId: number;
  serviceType: ServiceType;
  serviceDate: string;
  bullId?: number | null;
  semenStrawId?: number | null;
  technicianName?: string | null;
  heatId?: number | null;
  cost?: number | null;
  notes?: string | null;
  createdByUserId?: number | null;
}

export interface ServiceEventCreate {
  animalId: number;
  serviceType: ServiceType;
  serviceDate: string;
  bullId?: number;
  semenStrawId?: number;
  technicianName?: string;
  heatId?: number;
  cost?: number;
  notes?: string;
}
