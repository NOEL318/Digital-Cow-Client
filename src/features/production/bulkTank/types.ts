/**
 * Este archivo define los tipos typescript del modulo production/bulkTank compartidos por la api, los formularios y los componentes.
 */
export interface BulkTankDelivery {
  id: number;
  ranchId: number;
  deliveryDate: string;
  totalLiters: number;
  buyer?: string | null;
  notes?: string | null;
  createdByUserId?: number | null;
}

export interface BulkTankDeliveryCreate {
  ranchId: number;
  deliveryDate: string;
  totalLiters: number;
  buyer?: string;
  notes?: string;
}
