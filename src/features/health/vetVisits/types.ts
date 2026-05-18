export interface VetVisit {
  id: number;
  ranchId: number;
  visitedAt: string;
  vetName: string;
  vetContact?: string | null;
  reason: string;
  totalCost?: number | null;
  notes?: string | null;
}

export interface VetVisitCreate {
  ranchId: number;
  visitedAt: string;
  vetName: string;
  vetContact?: string;
  reason: string;
  totalCost?: number;
  notes?: string;
}
