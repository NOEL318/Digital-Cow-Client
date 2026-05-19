/**
 * Este archivo define los tipos typescript del modulo finance/milkSales compartidos por la api, los formularios y los componentes.
 */
export interface MilkSale {
  id: number;
  saleDate: string;
  totalLiters: number;
  pricePerLiter: number;
  totalPrice: number;
  currency: string;
  buyer?: string | null;
  bulkTankDeliveryId?: number | null;
  ranchId?: number | null;
  notes?: string | null;
  createdByUserId?: number | null;
  createdAt?: string;
}

export interface MilkSaleCreate {
  saleDate: string;
  totalLiters: number;
  pricePerLiter: number;
  totalPrice: number;
  currency?: string;
  buyer?: string;
  bulkTankDeliveryId?: number;
  ranchId?: number;
  notes?: string;
}
