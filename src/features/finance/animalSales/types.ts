export interface AnimalSale {
  id: number;
  animalId: number;
  soldAt: string;
  liveWeightKg?: number | null;
  pricePerKg?: number | null;
  totalPrice: number;
  currency: string;
  buyer?: string | null;
  notes?: string | null;
  createdByUserId?: number | null;
  createdAt?: string;
}

export interface AnimalSaleCreate {
  animalId: number;
  soldAt: string;
  liveWeightKg?: number;
  pricePerKg?: number;
  totalPrice: number;
  currency?: string;
  buyer?: string;
  notes?: string;
}
