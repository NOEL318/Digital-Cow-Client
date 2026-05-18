export interface PestControl {
  id: number;
  ranchId?: number | null;
  lotId?: number | null;
  pestId: number;
  pestCode?: string;
  pestNameEs?: string;
  pestNameEn?: string;
  productUsed: string;
  dose?: string | null;
  appliedAt: string;
  nextApplicationAt?: string | null;
  cost?: number | null;
  notes?: string | null;
}

export interface PestControlCreate {
  ranchId?: number;
  lotId?: number;
  pestId: number;
  productUsed: string;
  dose?: string;
  appliedAt: string;
  nextApplicationAt?: string;
  cost?: number;
  notes?: string;
}
