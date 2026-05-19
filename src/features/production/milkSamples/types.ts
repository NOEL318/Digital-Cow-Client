/**
 * Este archivo define los tipos typescript del modulo production/milkSamples compartidos por la api, los formularios y los componentes.
 */
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
