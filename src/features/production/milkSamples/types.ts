export interface MilkSample {
  id: number;
  animalId: number;
  sampledAt: string;
  sccCellsPerMl?: number | null;
  fatPct?: number | null;
  proteinPct?: number | null;
  lactosePct?: number | null;
  notes?: string | null;
}

export interface MilkSampleCreate {
  animalId: number;
  sampledAt: string;
  sccCellsPerMl?: number;
  fatPct?: number;
  proteinPct?: number;
  lactosePct?: number;
  notes?: string;
}
